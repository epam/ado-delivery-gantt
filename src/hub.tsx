import "azure-devops-ui/Core/override.css";
import "./hub.scss";

import * as React from "react";
import * as ReactDOM from "react-dom";

import * as SDK from "azure-devops-extension-sdk";
import { CommonServiceIds, IHostPageLayoutService } from "azure-devops-extension-api";

import { Header, TitleSize } from "azure-devops-ui/Header";
import { Page } from "azure-devops-ui/Page";
import { IHeaderCommandBarItem } from "azure-devops-ui/HeaderCommandBar";
import { Tab, TabBar, TabSize } from "azure-devops-ui/Tabs";
import {LayoutTab, StatesTab, WorkItemTab} from "./component"
import { GanttChartTab } from "./component/GanttChartTab";

interface IHubState {
  selectedTabId: string;
  fullScreenMode: boolean;
  headerDescription?: string;
  useLargeTitle?: boolean;
  useCompactPivots?: boolean;
}

class Hub extends React.Component<{}, IHubState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      selectedTabId: "layout",
      fullScreenMode: false
    };
  }

  public componentDidMount() {
    SDK.init();
    this.initializeFullScreenState();
  }

  public render(): JSX.Element {

    const { selectedTabId, headerDescription, useCompactPivots, useLargeTitle } = this.state;

    return (
      <Page className="sample-hub flex-grow">

        <Header title="Sample Hub"
          commandBarItems={this.getCommandBarItems()}
          description={headerDescription}
          titleSize={useLargeTitle ? TitleSize.Large : TitleSize.Medium} />


        <TabBar
          onSelectedTabChanged={this.onSelectedTabChanged}
          selectedTabId={selectedTabId}
          tabSize={useCompactPivots ? TabSize.Compact : TabSize.Tall}>

          <Tab name="Layout" id="layout" />
          <Tab name="States" id="states" />
          <Tab name="WorkItem" id="work-item" />
          <Tab name="GanttChart" id="gantt-chart" />
        </TabBar>

        {this.getPageContent()}
      </Page>
    );
  }


  private onSelectedTabChanged = (newTabId: string) => {
    this.setState({
      selectedTabId: newTabId
    })
  }

  private getPageContent() {
    const { selectedTabId } = this.state;
    if (selectedTabId === "layout") {
      return <LayoutTab />;
    }
    else if (selectedTabId === "states") {
      return <StatesTab />;
    }
    else if (selectedTabId === "work-item") {
      return <WorkItemTab />;
    }
    else if (selectedTabId === "gantt-chart") {
      return <GanttChartTab />
    }
  }

  private getCommandBarItems(): IHeaderCommandBarItem[] {
    return [
      {
        id: "fullScreen",
        ariaLabel: this.state.fullScreenMode ? "Exit full screen mode" : "Enter full screen mode",
        iconProps: {
          iconName: this.state.fullScreenMode ? "BackToWindow" : "FullScreen"
        },
        onActivate: () => { this.onToggleFullScreenMode() }
      },
      {
        id: "customDialog",
        text: "Custom Dialog",
        onActivate: () => { this.onCustomPromptClick() },
        tooltipProps: {
          text: "Open a dialog with custom extension content"
        }
      }
    ];
  }

  private async onMessagePromptClick(): Promise<void> {
    const dialogService = await SDK.getService<IHostPageLayoutService>(CommonServiceIds.HostPageLayoutService);
    dialogService.openMessageDialog("Use large title?", {
      showCancel: true,
      title: "Message dialog",
      onClose: (result) => {
        this.setState({ useLargeTitle: result });
      }
    });
  }

  private async onCustomPromptClick(): Promise<void> {
    const dialogService = await SDK.getService<IHostPageLayoutService>(CommonServiceIds.HostPageLayoutService);
    dialogService.openCustomDialog<boolean | undefined>(SDK.getExtensionContext().id + ".panel-content", {
      title: "Custom dialog",
      configuration: {
        message: "Use compact pivots?",
        initialValue: this.state.useCompactPivots
      },
      onClose: (result) => {
        if (result !== undefined) {
          this.setState({ useCompactPivots: result });
        }
      }
    });
  }

  private async onPanelClick(): Promise<void> {
    const panelService = await SDK.getService<IHostPageLayoutService>(CommonServiceIds.HostPageLayoutService);
    panelService.openPanel<boolean | undefined>(SDK.getExtensionContext().id + ".panel-content", {
      title: "My Panel",
      description: "Description of my panel",
      configuration: {
        message: "Show header description?",
        initialValue: !!this.state.headerDescription
      },
      onClose: (result) => {
        if (result !== undefined) {
          this.setState({ headerDescription: result ? "This is a header description" : undefined });
        }
      }
    });
  }

  private async initializeFullScreenState() {
    const layoutService = await SDK.getService<IHostPageLayoutService>(CommonServiceIds.HostPageLayoutService);
    const fullScreenMode = await layoutService.getFullScreenMode();
    if (fullScreenMode !== this.state.fullScreenMode) {
      this.setState({ fullScreenMode });
    }
  }

  private async onToggleFullScreenMode(): Promise<void> {
    const fullScreenMode = !this.state.fullScreenMode;
    this.setState({ fullScreenMode });

    const layoutService = await SDK.getService<IHostPageLayoutService>(CommonServiceIds.HostPageLayoutService);
    layoutService.setFullScreenMode(fullScreenMode);
  }

}

ReactDOM.render(<Hub />, document.getElementById("root"));
