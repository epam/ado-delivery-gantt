import * as React from 'react';
import { useState, useEffect } from 'react';
import * as SDK from 'azure-devops-extension-sdk';

import { Gantt, Task, ViewMode } from 'gantt-task-react';
import {
	CommonServiceIds,
	getClient,
	IProjectPageService,
} from 'azure-devops-extension-api';
import { CoreRestClient } from 'azure-devops-extension-api/Core';
import {
	WorkItemTrackingRestClient,
	WorkItemExpand,
	WorkItemErrorPolicy,
	WorkItem,
	IWorkItemFormNavigationService,
	WorkItemTrackingServiceIds,
	WorkItemLink,
} from 'azure-devops-extension-api/WorkItemTracking';
import { getProgressMap } from "../service/ProgressCalculationService";
import { ViewSwitcher } from './ViewSwitcher';
import { Spinner, SpinnerSize } from "azure-devops-ui/Spinner";
import { fetchTeamWorkItems, fetchIterationDefinition } from '../service/WiqlService';

const VSTS_SCHEDULING_START_DATE = 'Microsoft.VSTS.Scheduling.StartDate';
const VSTS_SCHEDULING_TARGET_DATE = 'Microsoft.VSTS.Scheduling.TargetDate';
const WORK_ITEM_TYPE = 'System.WorkItemType';
const ITEM_TITLE = 'System.Title';
const PROJECT = 'project';
const EPIC = 'Epic';
const FEATURE = 'Feature';
const USER_STORY = 'User Story';
const TASK_ITEM = 'Task';
const TASK = 'task';

export const GanttChartTab = () => {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [view, setView] = useState<ViewMode>(ViewMode.Day);
	const [isChecked, setIsChecked] = useState(true);
	const [chartLoad, setChartLoad] = useState(true);

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

			if (project) {
				const { name: projectName } = project;
				const projects: Task[] = [];
				const coreClient = getClient(CoreRestClient);
				const workItemsClient = getClient(WorkItemTrackingRestClient);
				const teams = await coreClient.getTeams(projectName);

				const teamWorkItems = await Promise.all(teams.map(fetchTeamWorkItems));
				const teamIterations = new Map((await Promise.all(teams.map(fetchIterationDefinition))).map(({ id, ...rest }) => [id, rest]));
				const projectItems = await Promise.all(teamWorkItems.map(({ id, ids, connections }) => ids.length > 0 ? workItemsClient.getWorkItemsBatch({
					$expand: WorkItemExpand.All,
					asOf: new Date(),
					errorPolicy: WorkItemErrorPolicy.Omit,
					fields: [],
					ids
				}).then((items) => ({ id, items: Array.isArray(items) ? items : [], connections }))
					: Promise.resolve({ id, items: [], connections: {} })));

				const map = projectItems.reduce((acc, { id, items }) => {
					acc.set(id + EPIC, items.filter((item) => item.fields[WORK_ITEM_TYPE] === EPIC));
					acc.set(id + USER_STORY, items.filter((item) => item.fields[WORK_ITEM_TYPE] === USER_STORY));
					acc.set(id + FEATURE, items.filter((item) => item.fields[WORK_ITEM_TYPE] === FEATURE));
					acc.set(id + TASK_ITEM, items.filter((item) => item.fields[WORK_ITEM_TYPE] === TASK_ITEM));
					return acc;
				}, new Map<String, WorkItem[]>());

				const progressMap = getProgressMap(teams, map);

				type TeamDictionaryValue = { connections: { [key: string]: WorkItemLink[]; }, map: Map<string, WorkItem> };

				const teamDictionary = new Map<string, TeamDictionaryValue>(projectItems.map(({ id, items, connections }) => [id, { connections, map: new Map(items.map(item => [`${item.id}`, item])) }]));

				teams.forEach(team => {
					const teamId = team.id;
					const iteration = teamIterations.get(teamId);
					const { start, end } = iteration as { start: Date, end: Date };

					projects.push({
						//displayOrder: latestOrder,
						start,
						end,
						name: team.name,
						// project: team.id,
						id: teamId,
						progress: 0,
						type: PROJECT,
						hideChildren: true,
					});

					const { connections, map } = teamDictionary.get(teamId) as TeamDictionaryValue;

					Object.keys(connections)
						.filter(itemId => map.get(itemId)?.fields[WORK_ITEM_TYPE] === EPIC)
						.map(itemId => connections[itemId])
						.reduce((acc, next) => [...acc, ...next], [])
						.forEach(item => {
							const { target: { id } } = item;
							const workItem = map.get(`${id}`) as WorkItem;
							const progress = progressMap.get(team.id + workItem.id);
							const hasChild = workItem?.relations?.some(({ attributes = {} }) => attributes.name === 'Child');

							projects.push({
								//displayOrder: latestOrder,
								start: workItem.fields[VSTS_SCHEDULING_START_DATE] || start,
								end: workItem.fields[VSTS_SCHEDULING_TARGET_DATE] || end,
								name: workItem.fields[ITEM_TITLE],
								id: workItem.id + '',
								progress: progress?.timelineProgress || 0,
								styles: {
									backgroundColor: progress?.status,
									// backgroundSelectedColor: "string";
									// progressColor: "string";
									// progressSelectedColor: "string";
								},
								type: hasChild && PROJECT || TASK,
								project: `${item?.source?.id || teamId}`,
								hideChildren: true,
								// isDisabled:
								dependencies: [`${item?.source?.id || teamId}`]
							});
						});

					const othersId = `${teamId}_others`;

					projects.push({
						//displayOrder: latestOrder,
						start,
						end,
						name: 'Others',
						project: team.id,
						id: othersId,
						progress: 0,
						type: PROJECT,
						hideChildren: true,
					});

					Object.keys(connections)
						.filter(itemId => map.get(itemId)?.fields[WORK_ITEM_TYPE] !== EPIC)
						.map(itemId => connections[itemId])
						.reduce((acc, next) => [...acc, ...next], [])
						.forEach(item => {
							const { target: { id } } = item;
							const workItem = map.get(`${id}`) as WorkItem;
							const progress = progressMap.get(team.id + workItem.id);
							const hasChild = workItem?.relations?.some(({ attributes = {} }) => attributes.name === 'Child');

							projects.push({
								//displayOrder: latestOrder,
								start: workItem.fields[VSTS_SCHEDULING_START_DATE] || start,
								end: workItem.fields[VSTS_SCHEDULING_TARGET_DATE] || end,
								name: workItem.fields[ITEM_TITLE],
								id: workItem.id + '',
								progress: progress?.timelineProgress || 0,
								styles: {
									backgroundColor: progress?.status,
									// backgroundSelectedColor: "string";
									// progressColor: "string";
									// progressSelectedColor: "string";
								},
								type: hasChild && PROJECT || TASK,
								project: `${item?.source?.id || othersId}`,
								hideChildren: true,
								// isDisabled:
								dependencies: [`${item?.source?.id || othersId}`]
							});
						});
				});

				console.log("Tasks ----", projects);
				setTasks(projects);
				setChartLoad(false);
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


	return (
		<div>
			<ViewSwitcher
				onViewModeChange={(viewMode: ViewMode) => setView(viewMode)}
				onViewListChange={setIsChecked}
				isChecked={isChecked}
			/>
			<div className="flex-column" style={{ marginTop: 10 }}>

				{!chartLoad ? (
					<Gantt
						tasks={tasks}
						viewMode={view}
						columnWidth={columnWidth}
						listCellWidth={isChecked ? '200px' : ''}
						onExpanderClick={handleExpanderClick}
						onSelect={handleSelectClick}
					/>
				) : (
					<div style={{ marginTop: 50 }}>
						<Spinner size={SpinnerSize.large} label="Loading..." />
					</div>
				)}
			</div>
		</div>
	);
};
