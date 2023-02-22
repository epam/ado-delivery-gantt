import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";

import "./component.scss";

import { Button } from "azure-devops-ui/Button";
import { ObservableArray, ObservableValue , IReadonlyObservableValue} from "azure-devops-ui/Core/Observable";
import { localeIgnoreCaseComparer } from "azure-devops-ui/Core/Util/String";
import { Dropdown } from "azure-devops-ui/Dropdown";
import { ListSelection } from "azure-devops-ui/List";
import { IListBoxItem } from "azure-devops-ui/ListBox";
import { TextField } from "azure-devops-ui/TextField";

import { CommonServiceIds, IProjectPageService } from "azure-devops-extension-api";
import { IWorkItemFormNavigationService, WorkItemTrackingRestClient, WorkItemTrackingServiceIds } from "azure-devops-extension-api/WorkItemTracking";
import { getClient } from "./ClientWrapper";

export class WorkItemTab extends React.Component<{}, {}> {

    private workItemIdValue: ObservableValue<string | undefined> = new ObservableValue("1" as string | undefined);
    private workItemTypeValue = new ObservableValue("Bug");
    private selection = new ListSelection();
    private workItemTypes = new ObservableArray<IListBoxItem<string>>();

    constructor(props: {}) {
        super(props);

        this.state = {
            iframeUrl: window.location.href
        };
    }

    public componentDidMount() {
        this.loadWorkItemTypes();
    }

    public render(): JSX.Element {
        return (
            <div className="page-content">
                <div className="sample-form-section flex-row flex-center">
                    <TextField className="sample-work-item-id-input" label="Existing work item id" value={this.workItemIdValue} onChange={(ev, newValue) => { this.workItemIdValue.value = newValue; }} />
                    <Button className="sample-work-item-button" text="Open..." onClick={() => this.onOpenExistingWorkItemClick()} />
                </div>
                <div className="sample-form-section flex-row flex-center">
                    <div className="flex-column">
                        <label htmlFor="work-item-type-picker">New work item type:</label>
                        <Dropdown<string>
                            className="sample-work-item-type-picker"
                            items={this.workItemTypes}
                            onSelect={(event, item) => { this.workItemTypeValue.value = item.data! }}
                            selection={this.selection}
                        />
                    </div>
                    <Button className="sample-work-item-button" text="New..." onClick={() => this.onOpenNewWorkItemClick()} />
                </div>
            </div>

        );
    }

    private async loadWorkItemTypes(): Promise<void> {
        await SDK.ready();

        const projectService = await SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService);
        const project = await projectService.getProject();

        let workItemTypeNames: string[];

        if (!project) {
            workItemTypeNames = ["Issue"];
        }
        else {
            const client = getClient(WorkItemTrackingRestClient);
            const types = await client.getWorkItemTypes(project.name);
            workItemTypeNames = types.map(t => t.name);
            workItemTypeNames.sort((a, b) => localeIgnoreCaseComparer(a, b));
        }

        this.workItemTypes.push(...workItemTypeNames.map(t => { return { id: t, data: t, text: t } }));
        this.selection.select(0);
    }

    private async onOpenExistingWorkItemClick() {
        const navSvc = await SDK.getService<IWorkItemFormNavigationService>(WorkItemTrackingServiceIds.WorkItemFormNavigationService);
        navSvc.openWorkItem(parseInt(this.workItemIdValue.value as string));
    };

    private async onOpenNewWorkItemClick() {
        const navSvc = await SDK.getService<IWorkItemFormNavigationService>(WorkItemTrackingServiceIds.WorkItemFormNavigationService);
        navSvc.openNewWorkItem(this.workItemTypeValue.value, {
            Title: "Opened a work item from the Work Item Nav Service",
            Tags: "extension;wit-service",
            priority: 1,
            "System.AssignedTo": SDK.getUser().name,
        });
    };
}