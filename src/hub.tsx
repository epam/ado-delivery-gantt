import "./hub.scss";

import * as React from "react";
import { createRoot } from "react-dom/client";

import * as SDK from "azure-devops-extension-sdk";
import { CommonServiceIds, IHostPageLayoutService } from "azure-devops-extension-api";

import { Header, TitleSize } from "azure-devops-ui/Header";
import { Page } from "azure-devops-ui/Page";
import { IHeaderCommandBarItem } from "azure-devops-ui/HeaderCommandBar";
import { Tab, TabBar, TabSize } from "azure-devops-ui/Tabs";
import { LayoutTab, StatesTab, WorkItemTab } from "./component"
import { useEffect, useState } from "react";

interface IHubState {
  selectedTabId: string;
  fullScreenMode: boolean;
  headerDescription?: string;
  useLargeTitle?: boolean;
  useCompactPivots?: boolean;
}

export const Hub = () => {

  const [hubState, setHubState] = useState<IHubState>({ fullScreenMode: false, selectedTabId: 'layout' });

  useEffect(() => {
    const load = async () => {
      await SDK.init();
      initializeFullScreenState();
    };

    load()
      .catch(console.error);
  }, []);


  const getPageContent = () => {
    const { selectedTabId } = hubState;
    if (selectedTabId === "layout") {
      return <LayoutTab />;
    }
    else if (selectedTabId === "states") {
      return <StatesTab />;
    }
    else if (selectedTabId === "work-item") {
      return <WorkItemTab />;
    }
  }

  const getCommandBarItems = (): IHeaderCommandBarItem[] => {
    const { fullScreenMode } = hubState;
    return [
      {
        id: "fullScreen",
        ariaLabel: fullScreenMode ? "Exit full screen mode" : "Enter full screen mode",
        iconProps: {
          iconName: fullScreenMode ? "BackToWindow" : "FullScreen"
        },
        onActivate: () => { onToggleFullScreenMode() }
      },
      {
        id: "customDialog",
        text: "Custom Dialog",
        onActivate: () => { onCustomPromptClick() },
        tooltipProps: {
          text: "Open a dialog with custom extension content"
        }
      }
    ];
  };

  const onCustomPromptClick = async () => {
    const dialogService = await SDK.getService<IHostPageLayoutService>(CommonServiceIds.HostPageLayoutService);
    const { useCompactPivots } = hubState;
    dialogService.openCustomDialog<boolean | undefined>(SDK.getExtensionContext().id + ".panel-content", {
      title: "Custom dialog",
      configuration: {
        message: "Use compact pivots?",
        initialValue: useCompactPivots
      },
      onClose: (result) => {
        if (result !== undefined) {
          setHubState(current => {
            return { ...current, useCompactPivots: result };
          });
        }
      }
    });
  }

  const initializeFullScreenState = async () => {
    const layoutService = await SDK.getService<IHostPageLayoutService>(CommonServiceIds.HostPageLayoutService);
    const fullScreenMode = await layoutService.getFullScreenMode();
    if (fullScreenMode !== hubState.fullScreenMode) {
      setHubState(current => {
        return { ...current, fullScreenMode: fullScreenMode }
      });
    }
  }

  const onToggleFullScreenMode = async () => {
    const fullScreenMode = !hubState.fullScreenMode!;
    setHubState(current => {
      return { ...current, fullScreenMode: fullScreenMode }
    });

    const layoutService = await SDK.getService<IHostPageLayoutService>(CommonServiceIds.HostPageLayoutService);
    layoutService.setFullScreenMode(fullScreenMode);
  }

  const onSelectedTabChanged = (newTabId: string) => {
    setHubState(current => {
      return { ...current, selectedTabId: newTabId }
    });
  }


  const { selectedTabId, headerDescription, useCompactPivots, useLargeTitle } = hubState;

  return (
    <Page className="sample-hub flex-grow">

      <Header title="Sample Hub"
        commandBarItems={getCommandBarItems()}
        description={headerDescription}
        titleSize={useLargeTitle ? TitleSize.Large : TitleSize.Medium} />


      <TabBar
        onSelectedTabChanged={onSelectedTabChanged}
        selectedTabId={selectedTabId}
        tabSize={useCompactPivots ? TabSize.Compact : TabSize.Tall}>

        <Tab name="Layout" id="layout" />
        <Tab name="States" id="states" />
        <Tab name="WorkItem" id="work-item" />
        <Tab name="GanttChart" id="gantt-chart" />
      </TabBar>

      {getPageContent()}
    </Page>
  );

}

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<Hub />);
