import * as React from 'react';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import { useState, useEffect } from 'react';
import { ViewSwitcher } from './ViewSwitcher';
import * as SDK from 'azure-devops-extension-sdk';
import {
  CommonServiceIds,
  getClient,
  IProjectPageService,
} from 'azure-devops-extension-api';
import { WorkRestClient } from 'azure-devops-extension-api/Work';
import { CoreRestClient } from 'azure-devops-extension-api/Core';
import {
  WorkItemTrackingRestClient,
  WorkItemExpand,
  WorkItemErrorPolicy,
  WorkItem,
} from 'azure-devops-extension-api/WorkItemTracking';
import {
  IWorkItemFormNavigationService,
  WorkItemTrackingServiceIds,
} from 'azure-devops-extension-api/WorkItemTracking';

const VSTS_SCHEDULING_START_DATE = 'Microsoft.VSTS.Scheduling.StartDate';
const VSTS_SCHEDULING_TARGET_DATE = 'Microsoft.VSTS.Scheduling.TargetDate';
const VSTS_CLOSE_DATE = 'Microsoft.VSTS.Common.ClosedDate';
const CREATE_DATE = 'System.CreatedDate';
const WORK_ITEM_TYPE = 'System.WorkItemType';
const ITEM_TITLE = 'System.Title';
const ITEM_ID = 'System.Id';
const PROJECT = 'project';
const EPIC = 'Epic';
const FEATURE = 'Feature';
const USER_STORY = 'User Story';
const TASK_ITEM = 'Task';
const TASK = 'task';

export const GanttChartTab = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [view, setView] = useState<ViewMode>(ViewMode.Week);
  const [isChecked, setIsChecked] = useState(true);
  let taskIds: WorkItem[] = [];

  let columnWidth = 60;
  if (view === ViewMode.Month) {
    columnWidth = 300;
  } else if (view === ViewMode.Week) {
    columnWidth = 250;
  }

  useEffect(() => {
    (async () => {
      await SDK.ready();
      const projectService = await SDK.getService<IProjectPageService>(
        CommonServiceIds.ProjectPageService
      );
      const project = await projectService.getProject();
      const coreClient = getClient(CoreRestClient);
      const workClient = getClient(WorkRestClient);

      const workItemsClient = getClient(WorkItemTrackingRestClient);

      if (project) {
        const projectName = project.name;
        const currentDate = new Date();
        const projects: Task[] = [];

        const teams = await coreClient.getTeams(projectName);

        const teamWorkItems = await Promise.all(
          teams.map(({ projectId, id, name }) => {
            return workClient
              .getTeamFieldValues({
                project: projectName,
                projectId,
                team: name,
                teamId: id,
              })
              .then(({ values }) => {
                const areas = values.map(({ value }) => `'${value}'`);
                return workItemsClient
                  .queryByWiql(
                    {
                      query: `SELECT * FROM workitems WHERE [System.AreaPath] IN (${areas}) ORDER BY [System.ChangedDate] DESC`,
                    },
                    projectId,
                    id
                  )
                  .then(({ workItems = [] }) => ({
                    id,
                    ids: workItems.map(({ id }) => id),
                  }));
              });
          })
        );

        const items = await Promise.all(
          teamWorkItems.map(({ id, ids }) =>
            workItemsClient
              .getWorkItemsBatch({
                $expand: WorkItemExpand.All,
                asOf: new Date(),
                errorPolicy: WorkItemErrorPolicy.Omit,
                fields: [],
                ids,
              })
              .then((items) => ({
                id,
                items: Array.isArray(items) ? items : [],
              }))
          )
        );

        console.log(items);

        teams.forEach((team) => {
          projects.push({
            start: new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              1
            ),
            end: new Date(
              currentDate.getFullYear() + 1,
              currentDate.getMonth(),
              1
            ),
            name: team.name,
            id: team.id,
            progress: 0,
            type: PROJECT,
            hideChildren: true,
          });

          items.forEach((item) =>
            item.items.forEach((wItem) => {
              if (item.id === team.id) {
                const startEpicDate = wItem.fields[VSTS_SCHEDULING_START_DATE];
                const endEpicDate = wItem.fields[VSTS_SCHEDULING_TARGET_DATE];
                if (
                  wItem.fields[WORK_ITEM_TYPE] == EPIC &&
                  startEpicDate &&
                  endEpicDate
                ) {
                 const forward = wItem?.relations.find((forward) => forward.rel === 'System.LinkTypes.Hierarchy-Forward');
                  projects.push({
                    start: startEpicDate,
                    end: endEpicDate,
                    name: wItem.fields[ITEM_TITLE],
                    id: wItem.fields[ITEM_ID],
                    progress: 25,
                    type: forward ? PROJECT : TASK,
                    project: item.id,
                    dependencies: [team.id],
                    hideChildren: true,
                  });

                  wItem.relations.filter((relation) => relation.rel === 'System.LinkTypes.Hierarchy-Forward').forEach((wFeature) => {
                    const id = getUrlId(wFeature.url);
                  //  if (id && id !== Number(item.id)) {
                      const feature = item.items.find((it1) => it1.id === id && it1.fields[WORK_ITEM_TYPE] === FEATURE);
                      const startFeatureDate = feature && feature.fields[VSTS_SCHEDULING_START_DATE]
                            ? feature.fields[VSTS_SCHEDULING_START_DATE]
                            : startEpicDate;
                          const endFeatureDate = feature && feature.fields[VSTS_SCHEDULING_TARGET_DATE]
                            ? feature.fields[VSTS_SCHEDULING_TARGET_DATE]
                            : endEpicDate;
                      if (
                        feature
                      ) {
                        const forward = feature.relations.find((forward) => forward.rel === 'System.LinkTypes.Hierarchy-Forward');
                        projects.push({
                          start: startFeatureDate,
                          end: endFeatureDate,
                          name: feature.fields[ITEM_TITLE],
                          id: feature.fields[ITEM_ID],
                          progress: 0,
                          type: forward ? PROJECT : TASK,
                          project: wItem.fields[ITEM_ID],
                          dependencies: [wItem.fields[ITEM_ID]],
                          hideChildren: true,
                        });

                        feature.relations.filter((relation) => relation.rel === 'System.LinkTypes.Hierarchy-Forward').forEach((wStory) => {
                          const sId = getUrlId(wStory.url);
                          const storyItem = item.items.find((it2) => it2.id === sId && it2.fields[WORK_ITEM_TYPE] == USER_STORY);
                          const startStoryDate = storyItem && storyItem.fields[CREATE_DATE]
                            ? storyItem.fields[CREATE_DATE]
                            : feature.fields[VSTS_SCHEDULING_START_DATE];
                          const endStoryDate = storyItem && storyItem.fields[VSTS_CLOSE_DATE]
                            ? storyItem.fields[VSTS_CLOSE_DATE]
                            : feature.fields[VSTS_SCHEDULING_TARGET_DATE];
                          if (storyItem) {
                            //if (sId && sId !== feature.id) {
                              const forward = storyItem.relations.find((forward) => forward.rel === 'System.LinkTypes.Hierarchy-Forward');
                              projects.push({
                                start: startStoryDate,
                                end: endStoryDate,
                                name: storyItem.fields[ITEM_TITLE],
                                id: storyItem.fields[ITEM_ID],
                                progress: 0,
                                type: forward ? PROJECT : TASK,
                                project: feature.fields[ITEM_ID],
                                dependencies: [feature.fields[ITEM_ID]],
                                hideChildren: true,
                              });
                          //  }
                            storyItem.relations.filter((relation) => relation.rel === 'System.LinkTypes.Hierarchy-Forward').forEach((wTask) => {
                              const tId = getUrlId(wTask.url);
                              const taskItem = item.items.find((it3) => it3.id === tId && it3.fields[WORK_ITEM_TYPE] == TASK_ITEM);
                              const startTaskDate = taskItem && taskItem.fields[CREATE_DATE]
                                ? taskItem.fields[CREATE_DATE]
                                : startStoryDate;
                              const endTaskDate = taskItem && taskItem.fields[VSTS_CLOSE_DATE]
                                ? taskItem.fields[VSTS_CLOSE_DATE]
                                : endStoryDate;
                              if (taskItem) {
                              //if (tId && Number(tId) !== storyItem.id) {
                                projects.push({
                                  start: startTaskDate,
                                  end: endTaskDate,
                                  name: taskItem.fields[ITEM_TITLE],
                                  id: taskItem.fields[ITEM_ID],
                                  progress: 0,
                                  type: TASK,
                                  project: storyItem.fields[ITEM_ID],
                                  dependencies: [storyItem.fields[ITEM_ID]],
                                  hideChildren: true,
                                });
                              //}
                            }
                          });
                          }
                        });
                      }
                   // }
                  });
                }
              }
            })
          );
        });
        setTasks(projects);
      }
    })();
  }, []);

  const handleExpanderClick = (task: Task): void => {
    setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
    console.log('On expander click Id:' + task.id);
  };

  const handleSelectClick = async (
    task: Task,
    isSelected: boolean
  ): Promise<void> => {
    let navSvc = await SDK.getService<IWorkItemFormNavigationService>(
      WorkItemTrackingServiceIds.WorkItemFormNavigationService
    );

    const taskId = task.id;
    if (isSelected && Number(taskId)) {
      navSvc.openWorkItem(parseInt(taskId));
    }
  };

  const getUrlId = (url: string): Number | undefined => {
    const id = url.split(/[/ ]+/).pop();
    if (id) {
      return Number(id);
    }
  };

  return (
    <div>
      <ViewSwitcher
        onViewModeChange={(viewMode: ViewMode) => setView(viewMode)}
        onViewListChange={setIsChecked}
        isChecked={isChecked}
      />
      {tasks.length && (
        <Gantt
          tasks={tasks}
          view={view}
          columnWidth={columnWidth}
          listCellWidth={isChecked ? '200px' : ''}
          onExpanderClick={handleExpanderClick}
          onSelect={handleSelectClick}
        />
      )}
    </div>
  );
};
