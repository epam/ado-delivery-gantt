import { TeamSettingsIteration, WorkRestClient } from 'azure-devops-extension-api/Work';
import { TeamContext, WebApiTeam } from 'azure-devops-extension-api/Core';
import {
  WorkItemTrackingRestClient,
  WorkItemLink,
} from 'azure-devops-extension-api/WorkItemTracking';

import { IVssRestClientOptions, getClient } from 'azure-devops-extension-api';
import { FilterInterface } from 'component/gantt/GanttView';

const clients = {
  workClient(clientOptions?: IVssRestClientOptions) {
    return getClient(WorkRestClient, clientOptions);
  },
  workItemsClient(clientOptions?: IVssRestClientOptions) {
    return getClient(WorkItemTrackingRestClient, clientOptions);
  }
}

const queries = {
  taskHierarchy(areas: string[], workItems?: string[], shift?: number) {
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
                AND [Source].[System.WorkItemType] ${workItems && workItems.length > 0 ? `in (${workItems})` : `<> ''`}
            )
            AND (
              [System.Links.LinkType] = 'System.LinkTypes.Hierarchy-Forward'
            )
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

export const fetchIterationDefinition = async (team: WebApiTeam, clientOptions?: IVssRestClientOptions): Promise<TeamIteration> => {
  const { projectName, projectId, id, name } = team;
  const iterationName = await clients.workItemsClient(clientOptions).queryByWiql(
    {
      query: queries.currentIterationName()
    },
    projectId,
    id
  ).then(async value => {
    const response = await clients.workItemsClient(clientOptions).getWorkItem(value?.workItems?.[0].id, projectName, ["System.IterationPath"]);
    const path: string = response?.fields?.["System.IterationPath"];

    return path?.substring(path.lastIndexOf("\\") + 1);
  }).handle('', 'No iteration assigned to the team');

  const teamContext = { project: projectName, projectId, team: name, teamId: id } as TeamContext;
  const currentDate = new Date();
   // Assigned default currentIteration when project miss configuration, to get gannt chart loaded 
  return clients.workClient(clientOptions).getTeamIterations(teamContext, "current")
    .then((iterations = []) => {
      const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const end = new Date(currentDate.getFullYear(), currentDate.getMonth(), 14);

      return {
        teamId: id,
        iterations,
        currentIteration: iterationName ? iterations[0]?.name || "@CurrentIteration" : "@CurrentIteration",
        start: iterations[0]?.attributes?.startDate || start,
        end: iterations[iterations.length - 1]?.attributes?.finishDate || end
      } as TeamIteration
    }).handle({
      teamId: id,
      iterations: [
        {
          id: "b8cea431-dd4f-4efa-868a-3a9a8fe0fa02",
          name: "Iteration 1",
          path: "RXR\\Iteration 1",
          attributes: {
            startDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
            finishDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 14),
            timeFrame: 1
          },
          url: "",
          _links: {}
        }],
      currentIteration: "@CurrentIteration",
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 14),
    } as TeamIteration, 'Error, when getTeamIterations method called');
}

export const fetchTeamWorkItems = async (team: WebApiTeam, filter?: FilterInterface, clientOptions?: IVssRestClientOptions): Promise<{ id: string, ids: number[], connections: { [key: string]: WorkItemLink[]; } }> => {
  const { projectName, projectId, id, name } = team;

  return clients.workClient(clientOptions).getTeamFieldValues({
    project: projectName,
    projectId,
    team: name,
    teamId: id,
  }).then(({ values }) => {
    const areas = values.map(({ value }) => `'${value}'`);
    const _types = filter?.workTypes?.map(({ name }) => `'${name}'`);
    return clients.workItemsClient(clientOptions)
      .queryByWiql(
        {
          query: queries.taskHierarchy(areas, _types, filter?.shift)
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
