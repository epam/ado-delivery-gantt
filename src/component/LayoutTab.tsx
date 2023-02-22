import * as React from "react";

import * as SDK from "azure-devops-extension-sdk";
import { Card } from "azure-devops-ui/Card";

import { CommonServiceIds, IProjectPageService } from "azure-devops-extension-api";
import { WorkRestClient } from "azure-devops-extension-api/Work";
import { CoreRestClient } from "azure-devops-extension-api/Core";
import { WorkItemTrackingRestClient, WorkItemExpand, WorkItemErrorPolicy } from "azure-devops-extension-api/WorkItemTracking";

import { getClient } from "./ClientWrapper";


export interface IOverviewTabState {
    userName?: string;
    projectName?: string;
    iframeUrl?: string;
    extensionData?: string;
    extensionContext?: SDK.IExtensionContext;
    host?: SDK.IHostContext;
}

export class LayoutTab extends React.Component<{}, IOverviewTabState> {

    constructor(props: {}) {
        super(props);

        this.state = {
            iframeUrl: window.location.href
        };
    }

    public componentDidMount() {
        this.initializeState();
    }

    private async initializeState(): Promise<void> {
        await SDK.ready();

        const userName = SDK.getUser().displayName;
        this.setState({
            userName,
            extensionContext: SDK.getExtensionContext(),
            host: SDK.getHost()
        });

        const projectService = await SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService);
        const project = await projectService.getProject();
        if (project) {
            this.setState({ projectName: project.name });
        }

        this.fetch();
    }

    private async fetch(): Promise<void> {
        const projectName: string = this.state.projectName as string;
        const coreClient = getClient(CoreRestClient);
        const workClient = getClient(WorkRestClient);
        const workItemsClient = getClient(WorkItemTrackingRestClient);
        const teams = await coreClient.getTeams(projectName);

        console.log("----", teams);
        const teamWorkItems = await Promise.all(teams.map(({ projectId, id, name }) => {
            return workClient.getTeamFieldValues({
                project: projectName,
                projectId,
                team: name,
                teamId: id
            }).then(({ values }) => {
                const areas = values.map(({ value }) => `'${value}'`);
                return workItemsClient.queryByWiql(
                    {
                        query: `SELECT * FROM workitems WHERE [System.AreaPath] IN (${areas}) ORDER BY [System.ChangedDate] DESC`
                    },
                    projectId,
                    id
                ).then(({ workItems = [] }) => ({ id, ids: workItems.map(({ id }) => id) }));
            })
        }));

        const items = await Promise.all(teamWorkItems.map(({ id, ids }) => workItemsClient.getWorkItemsBatch({
            $expand: WorkItemExpand.Fields,
            asOf: new Date(),
            errorPolicy: WorkItemErrorPolicy.Omit,
            fields: [],
            ids
        }).then((items) => ({ id, items: Array.isArray(items) ? items : [] } /* apply gantt chart model transfomation */))));

        console.log("----", items);
    }

    public render(): JSX.Element {

        const { userName, projectName, host, iframeUrl, extensionContext } = this.state;

        return (
            <div className="page-content page-content-top flex-column rhythm-vertical-16">
                <div>Hello, {userName}!</div>
                {
                    projectName &&
                    <div>Project: {projectName}</div>
                }
                <div>iframe URL: {iframeUrl}</div>
                {
                    extensionContext &&
                    <div>
                        <div>Extension id: {extensionContext.id}</div>
                        <div>Extension version: {extensionContext.version}</div>
                    </div>
                }
                {
                    host &&
                    <div>
                        <div>Host id: {host.id}</div>
                        <div>Host name: {host.name}</div>
                        <div>Host service version: {host.serviceVersion}</div>
                    </div>
                }
                <Card className="flex-grow bolt-table-card" contentProps={{ contentPadding: false }}>
                    {/* todo: draw gantt chart */}
                </Card>
            </div>
        );
    }
}