import * as React from "react";
import * as SDK from "azure-devops-extension-sdk";

import { Button } from "azure-devops-ui/Button";
import { ObservableArray, ObservableValue, IReadonlyObservableValue } from "azure-devops-ui/Core/Observable";
import { localeIgnoreCaseComparer } from "azure-devops-ui/Core/Util/String";
import { Dropdown } from "azure-devops-ui/Dropdown";
import { ListSelection } from "azure-devops-ui/List";
import { IListBoxItem } from "azure-devops-ui/ListBox";
import { TextField } from "azure-devops-ui/TextField";

import { CommonServiceIds, IProjectPageService, getClient } from "azure-devops-extension-api";
import { IWorkItemFormNavigationService, WorkItemTrackingRestClient, WorkItemTrackingServiceIds } from "azure-devops-extension-api/WorkItemTracking";
import { useEffect, useState } from "react";

export const WorkItemTab = () => {

    const workItemIdValue: ObservableValue<string | undefined> = new ObservableValue("1" as string | undefined);
    const workItemTypeValue = new ObservableValue("Bug");
    const selection = new ListSelection();
    const workItemTypes = new ObservableArray<IListBoxItem<string>>();

    const [iframeUrl, setIframeUrl] = useState(window.location.href);

    useEffect(() => {
        const loadWorkItemTypes = async (): Promise<void> => {
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

            workItemTypes.push(...workItemTypeNames.map(t => { return { id: t, data: t, text: t } }));
            selection.select(0);
        }

        loadWorkItemTypes()
            .catch(console.error);
    }, []);

    const onOpenExistingWorkItemClick = async () => {
        const navSvc = await SDK.getService<IWorkItemFormNavigationService>(WorkItemTrackingServiceIds.WorkItemFormNavigationService);
        navSvc.openWorkItem(parseInt(workItemIdValue.value as string));
    };

    const onOpenNewWorkItemClick = async () => {
        const navSvc = await SDK.getService<IWorkItemFormNavigationService>(WorkItemTrackingServiceIds.WorkItemFormNavigationService);
        navSvc.openNewWorkItem(workItemTypeValue.value, {
            Title: "Opened a work item from the Work Item Nav Service",
            Tags: "extension;wit-service",
            priority: 1,
            "System.AssignedTo": SDK.getUser().name,
        });
    };


    return (
        <div className="page-content">
            <div className="sample-form-section flex-row flex-center">
                <TextField className="sample-work-item-id-input" label="Existing work item id" value={workItemIdValue} onChange={(ev, newValue) => { workItemIdValue.value = newValue; }} />
                <Button className="sample-work-item-button" text="Open..." onClick={() => onOpenExistingWorkItemClick()} />
            </div>
            <div className="sample-form-section flex-row flex-center">
                <div className="flex-column">
                    <label htmlFor="work-item-type-picker">New work item type:</label>
                    <Dropdown<string>
                        className="sample-work-item-type-picker"
                        items={workItemTypes}
                        onSelect={(event, item) => { workItemTypeValue.value = item.data! }}
                        selection={selection}
                    />
                </div>
                <Button className="sample-work-item-button" text="New..." onClick={() => onOpenNewWorkItemClick()} />
            </div>
        </div>

    );

}