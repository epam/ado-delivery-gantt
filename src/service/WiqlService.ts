import { TeamSettingsIteration, WorkRestClient } from 'azure-devops-extension-api/Work';
import { TeamContext, WebApiTeam } from 'azure-devops-extension-api/Core';
import {
  WorkItemTrackingRestClient,
  WorkItemLink,
} from 'azure-devops-extension-api/WorkItemTracking';

import { getClient } from 'azure-devops-extension-api';
import { FilterInterface } from 'component/gantt/GanttView';
import { handleError } from './helper';


const clients = {
  get workClient() {
    return getClient(WorkRestClient);
  },
  get workItemsClient() {
    return getClient(WorkItemTrackingRestClient);
  }
}

const queries = {
  taskHierarchy(areas: string[], workItems?: string[], tags?: string[], shift?: number) {
    return `
        SELECT
            [System.Id],
            [System.Title],
            [System.State],
            [System.IterationPath],
            [System.WorkItemType],
            [System.Tags]
        FROM workitemLinks
        WHERE
            (
                [Source].[System.AreaPath] IN (${areas})
                AND [Source].[System.TeamProject] = @project
                ${shift ? `AND [Source].[System.IterationPath] = @CurrentIteration ${shift >= 0 ? ` + ${shift}` : ` - ${shift}`} ` : ``}
                AND [Source].[System.State] <> ''
                ${tags?.map((tag) => `AND [Source].[System.Tags] CONTAINS '${tag}'`).join(' ') ?? ''}
                AND [Source].[System.WorkItemType] ${workItems && workItems.length > 0 ? `in (${workItems})` : `<> ''`}
            )
            AND ([System.Links.LinkType] = 'System.LinkTypes.Hierarchy-Forward')
            AND (
                [Target].[System.TeamProject] = @project
                AND [Target].[System.WorkItemType] ${workItems && workItems.length > 0 ? `in (${workItems})` : `<> ''`}
            )
        MODE (Recursive)
        `;
  },
  currentIterationName() {
    return `
        SELECT
          [System.Id],
          [System.Title],
          [System.State],
          [System.IterationPath]
        FROM WorkItems
        WHERE
            (
              [System.TeamProject] = @project
              AND [System.IterationPath] = @CurrentIteration
            )
    `;
  },
  get iterationDefinition() {
    return `
      SELECT
        [Microsoft.VSTS.Scheduling.StartDate],
        [Microsoft.VSTS.Scheduling.FinishDate]
        FROM WorkItems WHERE [System.TeamProject] = @project
        ORDER BY [System.Id]
        `;
  }
};

export type TeamIteration = { teamId: string, currentIteration?: string, iterations: TeamSettingsIteration[], start: Date, end: Date };

export const fetchIterationDefinition = async (team: WebApiTeam): Promise<TeamIteration> => {
  const { projectName, projectId, id, name } = team;
  const iterationName = await clients.workItemsClient.queryByWiql(
    {
      query: queries.currentIterationName()
    },
    projectId,
    id
  ).then(async value => {
    const response = await clients.workItemsClient.getWorkItem(value?.workItems?.[0].id, projectName, ["System.IterationPath"]);
    const path: string = response?.fields?.["System.IterationPath"];

    return path?.substring(path.lastIndexOf("\\") + 1);
  }).handle('', 'No iteration assigned to the team');

  if (iterationName === undefined || iterationName.length == 0) {
    return Promise.resolve({} as TeamIteration);
  }

  const teamContext = { project: projectName, projectId, team: name, teamId: id } as TeamContext;

  return clients.workClient.getTeamIterations(teamContext, "current")
    .then((iterations = []) => {
      const currentDate = new Date();
      const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const end = new Date(currentDate.getFullYear(), currentDate.getMonth(), 14);

      return {
        teamId: id,
        iterations,
        currentIteration: iterationName,
        start: iterations[0]?.attributes?.startDate || start,
        end: iterations[iterations.length - 1]?.attributes?.finishDate || end
      } as TeamIteration
    }).handle({} as TeamIteration, 'Error, when getTeamIterations method called');
}

export const fetchTeamWorkItems = async (team: WebApiTeam, filter?: FilterInterface): Promise<{ id: string, ids: number[], connections: { [key: string]: WorkItemLink[]; } }> => {
  const { projectName, projectId, id, name } = team;

  return clients.workClient.getTeamFieldValues({
    project: projectName,
    projectId,
    team: name,
    teamId: id,
  }).then(({ values }) => {
    const areas = values.map(({ value }) => `'${value}'`);
    const _types = filter?.workTypes?.map(({ name }) => `'${name}'`);
    return clients.workItemsClient
      .queryByWiql(
        {
          query: queries.taskHierarchy(areas, _types, filter?.tags, filter?.shift)
        },
        projectId,
        id
      )
      .then(({ workItemRelations = [] }) => {
        const workItems = workItemRelations.filter(({ target }) => typeof target.id === "number");
        const rootItems = new Set(workItems.filter(({ source }) => !source).map(({ target: { id } }) => id));

        const { connections } = workItems.reduce((acc, next) => {
          const { target: { id } } = next;
          if (rootItems.has(id)) {
            const key = `${id}`;
            const { connections } = acc;
            return { ...acc, connections: { ...connections, [key]: [next] }, lastAccessedKey: key };
          }
          const { lastAccessedKey: key, connections } = acc;
          return { ...acc, connections: { ...connections, [key]: [...connections[key], next] } };

        }, { connections: {} } as { lastAccessedKey: string, connections: { [key: string]: WorkItemLink[]; } });

        return { id, ids: workItems.map(({ target: { id } }) => id), connections };
      });
  }).handle({ id: "", ids: [], connections: {} }, 'Error, when getTeamFieldValues method called');
};
