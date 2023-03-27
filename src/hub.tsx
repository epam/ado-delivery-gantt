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
import { AddGanttPanel, BoardPage, GanttPage, ITableItem } from "./component"
import { ExtensionManagementUtil, GanttHubDocument } from "./service/helper";
import { ProgressInterface } from "service/ProgressCalculationService";
import { DaemonCommandType, DaemonConfiguration, DaemonEventCallback, DaemonEventHandler, DaemonEventType, ProgressMapReadyPayload, daemonCommandBuilder } from "./daemon";
import { HubContext, daemonController, RootHubContext } from "./context";

interface IHubState {
  ganttId?: string;
  panelExpanded: boolean;
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
  const [hubState, setHubState] = useState<IHubState>({ backButtonEnabled: false, panelExpanded: false, fullScreenMode: false });

  const { ganttId, panelExpanded, backButtonEnabled, headerDescription, useLargeTitle } = hubState;
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
        .build())

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
      .callback(contextLoaded)
      .build());

    daemonController.registerHandler(DaemonEventHandler.builder<ProgressMapReadyPayload>()
      .eventType(DaemonEventType.PROGRESS_MAP_READY)
      .callback(progressMapReady)
      .build());
    
    return () => {
      daemonController.unregisterHandler(DaemonEventType.AGGREGATE_READY, contextLoaded);
      daemonController.unregisterHandler(DaemonEventType.PROGRESS_MAP_READY, progressMapReady);
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

  const getCommandBarItems = (): IHeaderCommandBarItem[] => {
    const { fullScreenMode } = hubState;
    return [
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
    setHubState(current => ({ ...current, panelExpanded: !isChecked }))
  }, [panelExpanded]);

  return (
    <RootHubContext.Provider value={{ workItemTypes, progressMap, project, daemonController }}>
      <Page className="sample-hub flex-grow">

        <Header title="Delivery Gantt"
          commandBarItems={getCommandBarItems()}
          description={headerDescription}
          backButtonProps={backButtonEnabled ? { onClick: () => setHubState(current => ({ ...current, backButtonEnabled: false })) } : undefined}
          titleSize={useLargeTitle ? TitleSize.Large : TitleSize.Medium} />

        {panelExpanded && (
          <AddGanttPanel isChecked={panelExpanded} onDismiss={onPanelDismiss} />
        )}

        {!backButtonEnabled ?
          <BoardPage isChecked={backButtonEnabled} onRowSelect={onRowSelect} items={items} />
          : <GanttPage ganttId={ganttId!} />
        }

      </Page>
    </RootHubContext.Provider>
  );
}

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<Hub />);
