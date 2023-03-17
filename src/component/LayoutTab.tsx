import "./component.scss";

import * as React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import * as SDK from 'azure-devops-extension-sdk';

import {
  CommonServiceIds,
  getClient,
  IProjectInfo,
  IProjectPageService,
} from 'azure-devops-extension-api';
import { CoreRestClient } from 'azure-devops-extension-api/Core';

import {
  WorkItemTrackingProcessRestClient,
} from 'azure-devops-extension-api/WorkItemTrackingProcess';
import { GanttChartTab } from "./gantt";
import { WorkItemTrackingRestClient } from "azure-devops-extension-api/WorkItemTracking";

const PROJECT_PROCESS_TEMPLATE_ID = "System.ProcessTemplateType";

const IconUtil = {
  async retrieveIcon(uri: string) {
    return await fetch(uri).then((response) =>
      response
        .arrayBuffer()
        .then((buffer) => this.arrayBufferToBase64(buffer)))
  },
  arrayBufferToBase64(buffer: any) {
    var bytes = [].slice.call(new Uint8Array(buffer))
      .reduce((acc, next) => (`${acc}${String.fromCharCode(next)}`), "");

    return `data:image/svg+xml;base64,${btoa(bytes)}`;
  }
};

export function LayoutTab() {
  type Context = { project?: IProjectInfo, rootCategory: string, workItemTypes: Map<string, string> };

  const [context, setContext] = useState<Context>({ project: undefined, rootCategory: '' } as Context);

  useEffect(() => {
    (async () => {
      await SDK.ready();
      const projectService = await SDK.getService<IProjectPageService>(
        CommonServiceIds.ProjectPageService
      );
      const project = await projectService.getProject();
      if (project) {
        const coreClient = getClient(CoreRestClient);
        const workItemTrackingRestClient = getClient(WorkItemTrackingRestClient);
        const workItemTypes = await workItemTrackingRestClient.getWorkItemTypes(project.name);

        const iconsData = await Promise.all(
          workItemTypes.map(
            ({ name, icon: { url } }) => IconUtil.retrieveIcon(url).then((it) => ({ name, src: it })))
        );

        console.log(" icons ", new Map(iconsData.map(({ name, src }) => [name, src])));

        const projectProperties = await coreClient.getProjectProperties(project.id, [PROJECT_PROCESS_TEMPLATE_ID]);
        const [{ value: processId }] = projectProperties.filter(({ name = "" }) => name == PROJECT_PROCESS_TEMPLATE_ID);
        const workItemsProcessClient = getClient(WorkItemTrackingProcessRestClient);
        const process = await workItemsProcessClient.getProcessBehaviors(processId);

        const [{ name: rootCategory }] = process.sort(({ rank: r1 = 0 }, { rank: r2 = 0 }) => r2 - r1);
        setContext({ project, rootCategory, workItemTypes: new Map(iconsData.map(({ name, src }) => [name, src])) });
      }
    })();
  }, [])

  return (
    <div className="page-content page-content-top flex-column rhythm-vertical-16">
      <GanttChartTab
        context={context!}
      />
    </div>
  );
}
