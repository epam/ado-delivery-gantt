import "./hub.scss";
import "azure-devops-ui/Core/override.css";

import * as React from "react";
import { createRoot } from "react-dom/client";

import * as SDK from "azure-devops-extension-sdk";
import { CommonServiceIds, IHostPageLayoutService, ILocationService, IProjectPageService } from "azure-devops-extension-api";

import { Header, TitleSize } from "azure-devops-ui/Header";

import { Page } from "azure-devops-ui/Page";
import { IHeaderCommandBarItem } from "azure-devops-ui/HeaderCommandBar";
import { useEffect, useState } from "react";
import { ProgressInterface } from "service/ProgressCalculationService";
import { GanttDetailsPanel, BoardPage, GanttPage, ITableItem } from "./component"
import { ExtensionManagementUtil, GanttHubDocument } from "./service/helper";
import { DaemonCommandType, DaemonConfiguration, DaemonEventCallback, DaemonEventHandler, DaemonEventType, ProgressMapReadyPayload, daemonCommandBuilder } from "./worker/api";
import { HubContext, daemonController, RootHubContext } from "./context";

interface IHubState {
  ganttId?: string;
  panelExpanded: boolean;
  itemToEdit?: GanttHubDocument;
  backButtonEnabled: boolean;
  fullScreenMode: boolean;
  headerDescription?: string;
  useLargeTitle?: boolean;
  useCompactPivots?: boolean;
}

export function Hub() {

  const [items, setItems] = useState<GanttHubDocument[]>([]);
  const [context, setContext] = useState<HubContext>({
    workItemTypes: new Map<string, string>(),
    progressMap: new Map<string, ProgressInterface>()
  } as HubContext);
  const [hubState, setHubState] = useState<IHubState>({ backButtonEnabled: false, panelExpanded: false, itemToEdit: undefined, fullScreenMode: false });

  const { ganttId, panelExpanded, itemToEdit, backButtonEnabled, headerDescription, useLargeTitle } = hubState;
  const { workItemTypes, progressMap, project } = context;

  useEffect(() => {
    const accessTokenReady: DaemonEventCallback<void> = () => {
      SDK.getAccessToken().then(accessToken => {
        daemonController.fireCommand(daemonCommandBuilder()
          .type(DaemonCommandType.REFRESH_ACCESS_TOKEN)
          .payload(accessToken)
          .build())
      });
    };

    daemonController.registerHandler(DaemonEventHandler.builder<void>()
      .eventType(DaemonEventType.ACCESS_TOKEN_REQUESTED)
      .callback(accessTokenReady)
      .build());

    const load = async () => {
      await SDK.init();

      const locationService = await SDK.getService<ILocationService>(CommonServiceIds.LocationService);
      const projectService = await SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService);
      const project = await projectService.getProject();
      const { id, name, serviceVersion } = SDK.getHost();
      const serviceHost = await locationService.getServiceLocation(id);
      daemonController.init({ id, name, serviceVersion, serviceHost } as DaemonConfiguration);

      daemonController.fireCommand(daemonCommandBuilder()
        .type(DaemonCommandType.AGGREGATE_EXECUTE)
        .source(Hub.name)
        .cancelable(true)
        .next(daemonCommandBuilder()
          .type(DaemonCommandType.NO_OP)
          .payload({ project })
          .next(daemonCommandBuilder()
            .type(DaemonCommandType.LOAD_ASSETS)
            .next(daemonCommandBuilder()
              .type(DaemonCommandType.BUILD_PROGRESS_MAP)
              .build())
            .build())
          .build())
        .build());

      initializeFullScreenState();
    };

    load().catch(console.error);

    return () => {
      daemonController.close();
    };
  }, []);

  useEffect(() => {
    const contextLoaded: DaemonEventCallback<HubContext> = (event) => {
      const context = event.payload!;
      setContext(context);
    };

    const progressMapReady: DaemonEventCallback<ProgressMapReadyPayload> = (event) => {
      const { progressMap } = event.payload!
      setContext({ ...context, progressMap });
    };

    daemonController.registerHandler(DaemonEventHandler.builder<HubContext>()
      .eventType(DaemonEventType.AGGREGATE_READY)
      .componentName(Hub.name)
      .callback(contextLoaded)
      .build());

    daemonController.registerHandler(DaemonEventHandler.builder<ProgressMapReadyPayload>()
      .eventType(DaemonEventType.PROGRESS_MAP_READY)
      .callback(progressMapReady)
      .build());

    return () => {
      daemonController.unregisterHandler(DaemonEventType.PROGRESS_MAP_READY);
      daemonController.unregisterHandler(DaemonEventType.AGGREGATE_READY + Hub.name);
    }
  }, [context]);

  useEffect(() => {
    (async () => {
      if (!backButtonEnabled && !panelExpanded) {
        const items = await ExtensionManagementUtil.getItems().handle([], "Failed to fetch gannt items");
        setItems(items);
      }
    })();
  }, [panelExpanded, backButtonEnabled])

  const onPanelClick = async () => {
    setHubState(current => ({ ...current, panelExpanded: true }));
  }

  const getCommandBarItems = (ids: Set<string> = new Set()): IHeaderCommandBarItem[] => {
    const { fullScreenMode } = hubState;
    const buttons = [
      {
        id: "gantt",
        text: "Gantt",
        onActivate: () => { onPanelClick() },
        iconProps: {
          iconName: 'Add'
        },
        isPrimary: true,
        tooltipProps: {
          text: "Open a panel with custom extension content"
        }
      },
      {
        id: "fullScreen",
        ariaLabel: fullScreenMode ? "Exit full screen mode" : "Enter full screen mode",
        iconProps: {
          iconName: fullScreenMode ? "BackToWindow" : "FullScreen"
        },
        onActivate: () => { onToggleFullScreenMode() }
      }
    ];
    return buttons.filter(it => !ids.has(it.id));
  };

  const initializeFullScreenState = async () => {
    const layoutService = await SDK.getService<IHostPageLayoutService>(CommonServiceIds.HostPageLayoutService);
    const fullScreenMode = await layoutService.getFullScreenMode().handle(false, 'Full screen cant be loaded');
    if (fullScreenMode !== hubState.fullScreenMode) {
      setHubState(current => ({ ...current, fullScreenMode }));
    }
  }

  const onToggleFullScreenMode = async () => {
    const fullScreenMode = !hubState.fullScreenMode!;
    setHubState(current => ({ ...current, fullScreenMode }));

    const layoutService = await SDK.getService<IHostPageLayoutService>(CommonServiceIds.HostPageLayoutService);
    layoutService.setFullScreenMode(fullScreenMode);
  }

  const onRowSelect = React.useCallback((data: ITableItem, isChecked: boolean) => {
    setItems([]);
    setHubState(current => ({ ...current, ganttId: data.id, backButtonEnabled: !isChecked }))
  }, [backButtonEnabled]);

  const onPanelDismiss = React.useCallback((isChecked: boolean) => {
    setHubState(current => ({ ...current, panelExpanded: !isChecked, itemToEdit: undefined }))
  }, [panelExpanded]);

  const showEditPanel = React.useCallback((itemToEdit: GanttHubDocument) => {
    setHubState(current => ({ ...current, panelExpanded: true, itemToEdit }))
  }, [itemToEdit]);

  const backButtonHandler = () => {
    daemonController.fireCommand(daemonCommandBuilder().type(DaemonCommandType.CANCEL).build());
    setHubState(current => ({ ...current, backButtonEnabled: false }));
  }

  return (
    <RootHubContext.Provider value={{ workItemTypes, progressMap, project, daemonController }}>
      <Page className="sample-hub flex-grow">

        <Header title="Delivery Gantt"
          commandBarItems={!backButtonEnabled ? getCommandBarItems() : getCommandBarItems(new Set(["gantt"]))}
          description={headerDescription}
          backButtonProps={backButtonEnabled ? { onClick: backButtonHandler } : undefined}
          titleSize={useLargeTitle ? TitleSize.Large : TitleSize.Medium} />

        {panelExpanded &&
          <GanttDetailsPanel itemToEdit={itemToEdit} isChecked={panelExpanded} onDismiss={onPanelDismiss} />
        }

        {!backButtonEnabled ?
          <BoardPage onRowEdit={showEditPanel} isChecked={backButtonEnabled} onRowSelect={onRowSelect} items={items} />
          : <GanttPage ganttId={ganttId!} />
        }

      </Page>
    </RootHubContext.Provider>
  );
}

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<Hub />);
