import "./hub.scss";
import "azure-devops-ui/Core/override.css";

import * as React from "react";
import { createRoot } from "react-dom/client";

import * as SDK from "azure-devops-extension-sdk";
import { CommonServiceIds, IHostPageLayoutService } from "azure-devops-extension-api";

import { Header, TitleSize } from "azure-devops-ui/Header";

import { Page } from "azure-devops-ui/Page";
import { IHeaderCommandBarItem } from "azure-devops-ui/HeaderCommandBar";
import { useEffect, useState } from "react";
import { BoardPage, GanttPage, ITableItem, AddGanttPanel } from "./component"
import { ExtensionManagementUtil, GanttHubDocument, handleError } from "./service/helper";

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
  const [hubState, setHubState] = useState<IHubState>({ backButtonEnabled: false, panelExpanded: false, fullScreenMode: false });

  const { ganttId, panelExpanded, backButtonEnabled, headerDescription, useLargeTitle } = hubState;

  useEffect(() => {
    const load = async () => {
      await SDK.init();
      initializeFullScreenState();
    };

    load().catch(console.error);
  }, []);

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
    setHubState(current => ({ ...current, ganttId: data.id, backButtonEnabled: !isChecked }))
  }, [backButtonEnabled]);

  const onPanelDismiss = React.useCallback((isChecked: boolean) => {
    setHubState(current => ({ ...current, panelExpanded: !isChecked }))
  }, [panelExpanded]);

  return (
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
  );
}

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<Hub />);
