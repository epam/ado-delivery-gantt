import { WorkRestClient } from 'azure-devops-extension-api/Work';
import { WebApiTeam } from 'azure-devops-extension-api/Core';
import {
  WorkItemTrackingRestClient,
  WorkItemLink,
} from 'azure-devops-extension-api/WorkItemTracking';

import { getClient } from 'azure-devops-extension-api';


const clients = {
  get workClient() {
    return getClient(WorkRestClient);
  },
  get workItemsClient() {
    return getClient(WorkItemTrackingRestClient);
  }
}

const queries = {
  taskHierarchy(areas: string[], workItems?: string[]) {
    return `
        SELECT
            [System.Id],
            [System.Title],
            [System.State],
            [Source].[System.IterationPath],
            [Target].[System.WorkItemType]
        FROM workitemLinks
        WHERE
            (
                [Source].[System.AreaPath] IN (${areas})
                AND [Source].[System.TeamProject] = @project
                AND [Source].[System.WorkItemType] ${workItems && workItems.length > 0 ? `IN (${workItems})` : `<> ''`}
                AND [Source].[System.State] <> ''
            )
            AND ([System.Links.LinkType] = 'System.LinkTypes.Hierarchy-Forward')
            AND (
                [Target].[System.TeamProject] = @project
                AND [Target].[System.WorkItemType] ${workItems && workItems.length > 0 ? `IN (${workItems})` : `<> ''`}
            )
        MODE (Recursive)
        `;
  },
  taskHierarchyByTeamIteration(areas: string[], projectName: string, teamName: string, workItems?: string[]) {
    return `
        SELECT
            [System.Id],
            [System.Title],
            [System.State],
            [Source].[System.IterationPath],
            [Target].[System.WorkItemType]
        FROM workitemLinks
        WHERE
            (
                [Source].[System.AreaPath] IN (${areas})
                AND [Source].[System.TeamProject] = @project
                AND [Source].[System.WorkItemType] ${workItems && workItems.length > 0 ? `IN (${workItems})` : `<> ''`}
                AND [Source].[System.State] <> ''
            )
            AND ([System.Links.LinkType] = 'System.LinkTypes.Hierarchy-Forward')
            AND (
                [Target].[System.IterationPath] = @currentIteration('[${projectName}]\\${teamName}')
                AND [Target].[System.TeamProject] = @project
                AND [Target].[System.WorkItemType] ${workItems && workItems.length > 0 ? `in (${workItems})` : `<> ''`}
            )
        MODE (Recursive)
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

export const fetchIterationDefinition = async (team: WebApiTeam): Promise<{ id: string, start: Date, end: Date }> => {
  const { projectName, projectId, id, name } = team;

  return clients.workClient.getTeamIterations({
    project: projectName,
    projectId,
    team: name,
    teamId: id,
  }, "current").then((iterations = []) => {
    const currentDate = new Date();
    const start = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const end = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      14
    );

    return {
      id,
      start: iterations[0]?.attributes?.startDate || start,
      end: iterations[iterations.length - 1]?.attributes?.finishDate || end
    }
  });
}

export const fetchTeamWorkItems = async (team: WebApiTeam, workItems?: string[]): Promise<{ id: string, ids: number[], connections: { [key: string]: WorkItemLink[]; } }> => {
  const { projectName, projectId, id, name } = team;

  return clients.workClient.getTeamFieldValues({
    project: projectName,
    projectId,
    team: name,
    teamId: id,
  }).then(({ values }) => {
    const areas = values.map(({ value }) => `'${value}'`);
    const _types = workItems?.map( value => `'${value}'`);
    return clients.workItemsClient
      .queryByWiql(
        {
          query: queries.taskHierarchy(areas, _types),
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
          } else {
            const { lastAccessedKey: key, connections } = acc;
            return { ...acc, connections: { ...connections, [key]: [...connections[key], next] } };
          }
        }, { connections: {} } as { lastAccessedKey: string, connections: { [key: string]: WorkItemLink[]; } });

        console.log(" connections ", connections);

        return { id, ids: workItems.map(({ target: { id } }) => id), connections };
      });
  });
};