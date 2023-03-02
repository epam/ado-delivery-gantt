import "./component.scss";
import * as React from "react";

import * as SDK from "azure-devops-extension-sdk";

import { CommonServiceIds, IProjectPageService } from "azure-devops-extension-api";
import { GanttChartTab } from "./GanttChartTab";
import { useEffect, useState } from "react";

interface IOverviewTabState {
    userName?: string;
    projectName?: string;
    iframeUrl?: string;
    extensionData?: string;
    extensionContext?: SDK.IExtensionContext;
    host?: SDK.IHostContext;
}

export const LayoutTab = () => {

    const [tabState, setTabState] = useState<IOverviewTabState>({});

    useEffect(() => {

        const fetchData = async () => {
            await SDK.ready();

            const userName = SDK.getUser().displayName;
            setTabState({
                userName: userName,
                extensionContext: SDK.getExtensionContext(),
                host: SDK.getHost()
            })

            const projectService = await SDK.getService<IProjectPageService>(CommonServiceIds.ProjectPageService);
            const project = await projectService.getProject();
            if (project) {
                setTabState(current => {
                    return { ...current, projectName: project.name };
                });
            }
        };

        fetchData()
            .catch(console.error);

    }, []);

    const { projectName, iframeUrl, userName, extensionContext, host } = tabState;

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
            <GanttChartTab />
        </div>
    );

}