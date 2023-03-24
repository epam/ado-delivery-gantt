import "./component.scss";

import * as React from 'react';
import { useState, useEffect } from 'react';
import * as SDK from 'azure-devops-extension-sdk';
import { Spinner, SpinnerSize } from "azure-devops-ui/Spinner";
import {
  CommonServiceIds,
  getClient,
  IProjectPageService,
} from 'azure-devops-extension-api';

import { GanttView } from "./gantt";
import { WorkItemTrackingRestClient } from "azure-devops-extension-api/WorkItemTracking";
import { AdoApiUtil, Context, ExtensionManagementUtil, IconUtil } from "../service/helper";
import { ProgressInterface, getProgressMap } from "../service/ProgressCalculationService";
import { Card } from "azure-devops-ui/Card";

export interface GanttPagerops {
  ganttId: string
}

export const GanttPage: React.FC<GanttPagerops> = ({
  ganttId
}) => {

  const [context, setContext] = useState<Context>({ project: undefined } as Context);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [resetProgressMap, setResetProgressMap] = useState<boolean>(false);
  const [progressMap, setProgressMap] = useState<Map<string, ProgressInterface>>(new Map<string, ProgressInterface>());
  const [pageLoad, setPageLoad] = useState(true);

  useEffect(() => {
    (async () => {
      await SDK.ready();
      const projectService = await SDK.getService<IProjectPageService>(
        CommonServiceIds.ProjectPageService
      );
      const project = await projectService.getProject();

      if (project) {
        const workItemTrackingRestClient = getClient(WorkItemTrackingRestClient);
        const workItemTypes = await workItemTrackingRestClient.getWorkItemTypes(project.name);

        const { name, description, options } = await ExtensionManagementUtil.getItem(ganttId);
        const iconsData = await Promise.all(
          workItemTypes
            .filter(it => options.backlog.map(it => it.name).indexOf(it.name) >= 0)
            .map(
              ({ name, icon: { url } }) => IconUtil.retrieveIcon(url).then((it) => ({ name, src: it })))
        );

        const workItemTypesMap = new Map(iconsData.map(({ name, src }) => [name, src]));
        const teams = await AdoApiUtil.fetchTeams(project);
        const teamDictionary = await AdoApiUtil.collectTeamDictionary(teams);

        const progressMap = getProgressMap(teams, teamDictionary, workItemTypesMap);
        setTitle(name);
        setDescription(description);
        setProgressMap(progressMap);
        setContext({ ganttId, project, workItemTypes: workItemTypesMap, options });
        setPageLoad(false);
      }
    })();
  }, [ganttId, resetProgressMap])

  const reloadProgressMap = (id: string) => {
    // id for reset only related tree!
    setResetProgressMap(!resetProgressMap);
  }

  return (
    <div className="page-content page-content-top rhythm-vertical-16">
      {!pageLoad ? (<Card
        className="bolt-table-card"
        contentProps={{ contentPadding: false, className: "gantt-card-content" }}
        titleProps={{ text: title }}
        headerDescriptionProps={{ text: description }}
      >
        <div className="page-content">
          <GanttView
            context={context!}
            progressMap={progressMap}
            reloadProgressMap={reloadProgressMap}
          />
        </div>
      </Card>)
        : (
          <div style={{ marginTop: 50 }}>
            <Spinner size={SpinnerSize.large} label="Loading..." />
          </div>
        )}
    </div>
  );
}
