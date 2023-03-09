import "./gantt.scss";

import * as React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import * as SDK from 'azure-devops-extension-sdk';

import { Gantt, Task, ViewMode } from 'gantt-task-react';
import {
	CommonServiceIds,
	getClient,
	IProjectInfo,
	IProjectPageService,
} from 'azure-devops-extension-api';
import { CoreRestClient, WebApiTeam } from 'azure-devops-extension-api/Core';
import {
	WorkItemTrackingRestClient,
	WorkItemExpand,
	WorkItemErrorPolicy,
	WorkItem,
	IWorkItemFormNavigationService,
	WorkItemTrackingServiceIds,
	WorkItemLink,
} from 'azure-devops-extension-api/WorkItemTracking';
import { ProgressInterface, getProgressMap } from "../../service/ProgressCalculationService";
import { ViewSwitcher } from './ViewSwitcher';
import { TeamFilterHub, IterationFilterHub, MultiFilterHub } from '../FilterHub';
import { GanttHeader, ganttTableBuilder, ganttTooltipContentBuilder } from './table';
import { Spinner, SpinnerSize } from "azure-devops-ui/Spinner";
import { fetchTeamWorkItems, fetchIterationDefinition } from '../../service/WiqlService';
import { TeamSettingsIteration } from 'azure-devops-extension-api/Work';

export interface FilterInterface {
	teams?: WebApiTeam[] | undefined;
	workTypes?: string[],
	tags?: string[],
	shift?: number;
}

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
const DEFAULT_CURRENT_PERIOD_COLOR = '#F3EFEF'

const columnWidthByViewMode: { [key: string]: number } = {
	[ViewMode.QuarterDay]: 30,
	[ViewMode.Day]: 60,
	[ViewMode.Week]: 250,
	[ViewMode.Month]: 300,
	[ViewMode.Year]: 400,
};

export const GanttChartTab = () => {
	const allTeam = { id: "all", name: "All" } as WebApiTeam;
	const [project, setProject] = useState<IProjectInfo>();
	const [tasks, setTasks] = useState<Task[]>([]);
	const [view, setView] = useState<ViewMode>(ViewMode.Day);
	const [teams, setTeams] = useState<WebApiTeam[]>([allTeam]);
	const [progressMap, setProgressMap] = useState<Map<string, ProgressInterface>>(new Map<string, ProgressInterface>());
	const [isChecked, setIsChecked] = useState(true);
	const [chartLoad, setChartLoad] = useState(true);
	const [teamSelected, setTeamSelected] = useState(false);
	const [filterContext, setFilterContext] = useState({} as FilterInterface);
	const [currentPeriodColor] = useState(DEFAULT_CURRENT_PERIOD_COLOR);

	const wrapperRef = useRef<HTMLDivElement>(null);

	const onCurrentPosition = useCallback(() => {
		if (wrapperRef.current) {
			const currentPosition = wrapperRef.current.querySelector(".today > rect");
			const horizontalView = currentPosition?.closest("div[dir]");
			const horizontalScroll = currentPosition?.closest("div[tabindex]")?.nextSibling as HTMLElement;

			const current_x = +(currentPosition?.getAttribute("x") || 0);
			const current_width = +(currentPosition?.getAttribute("width") || 0);
			const horizontal_scroll_width = Math.max(horizontalScroll?.clientWidth || 0, horizontalScroll?.offsetWidth || 0);

			const offset = current_x - Math.ceil((horizontal_scroll_width - current_width) / 2);

			horizontalView?.scrollTo(offset, 0);
			horizontalScroll?.scrollTo(offset, 0);
			horizontalScroll?.dispatchEvent(new CustomEvent("scroll"));
		}
	}, [wrapperRef]);


	useEffect(() => {
		(async () => {
			await SDK.ready();
			const projectService = await SDK.getService<IProjectPageService>(
				CommonServiceIds.ProjectPageService
			);
			const project = await projectService.getProject();
			if (project) {
				setProject(project);
				await reloadTasks(project);
			}
		})();
	}, []);

	const handleExpanderClick = (task: Task): void => {
		setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
	};

	const handleSelectClick = async (
		task: Task,
		isSelected: boolean
	): Promise<void> => {
		let navSvc = await SDK.getService<IWorkItemFormNavigationService>(
			WorkItemTrackingServiceIds.WorkItemFormNavigationService
		);

		const taskId = task.id.split("_").pop();
		if (isSelected && Number(taskId)) {
			navSvc.openWorkItem(parseInt(taskId!));
		}
	};

	const fetchTeams = async (project: IProjectInfo, filter?: FilterInterface): Promise<WebApiTeam[]> => {
		const { name: projectName } = project;
		const coreClient = getClient(CoreRestClient);
		return coreClient.getTeams(projectName)
			.then(teams => teams.filter(({id}) => filter?.teams?.some(it => it.id === id) ?? true));
	}

	const reloadTasks = async (project: IProjectInfo, filter?: FilterInterface) => {
		const ganttTasks: Task[] = [];

		const workItemsClient = getClient(WorkItemTrackingRestClient);
		const teams = await fetchTeams(project, filter);
		console.log("teams", teams);
		const teamWorkItems = await Promise.all(teams.map(it => fetchTeamWorkItems(it, filter)));
		const teamIterations = new Map((await Promise.all(teams.map(fetchIterationDefinition))).map(({ teamId, ...rest }) => [teamId, rest]));
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

			ganttTasks.push({
				//displayOrder: latestOrder,
				start,
				end,
				name: team.name,
				// project: team.id,
				id: teamId,
				styles: { backgroundColor: "white", backgroundSelectedColor: "white", progressColor: "white", progressSelectedColor: "white" },
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
					const progress = progressMap.get(`${teamId}_${workItem.id}`);
					const hasChild = workItem?.relations?.some(({ attributes = {} }) => attributes.name === 'Child');
					const parentId = item?.source?.id ? `${teamId}_${item?.source?.id}` : `${teamId}`
					ganttTasks.push({
						//displayOrder: latestOrder,
						start: workItem.fields[VSTS_SCHEDULING_START_DATE] || start,
						end: workItem.fields[VSTS_SCHEDULING_TARGET_DATE] || end,
						name: workItem.fields[ITEM_TITLE],
						id: `${teamId}_${workItem.id}`,
						progress: progress?.subtaskProgress || 0,
						styles: {
							backgroundColor: progress?.status?.backgroundColor,
							backgroundSelectedColor: progress?.status?.backgroundSelectedColor,
							progressColor: progress?.status?.progressColor,
							progressSelectedColor: progress?.status?.progressSelectedColor
						},
						type: hasChild && PROJECT || TASK,
						project: parentId,
						hideChildren: true,
						// isDisabled:
						dependencies: [parentId]
					});
				});

			const othersId = `${teamId}_others`;

			ganttTasks.push({
				//displayOrder: latestOrder,
				start,
				end,
				name: 'Others',
				project: team.id,
				id: othersId,
				styles: { backgroundColor: "white", backgroundSelectedColor: "white", progressColor: "white", progressSelectedColor: "white" },
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
					const progress = progressMap.get(`${teamId}_${workItem.id}`);
					const hasChild = workItem?.relations?.some(({ attributes = {} }) => attributes.name === 'Child');
					const parentId = item?.source?.id ? `${teamId}_${item?.source?.id}` : `${teamId}_others`

					ganttTasks.push({
						//displayOrder: latestOrder,
						start: workItem.fields[VSTS_SCHEDULING_START_DATE] || start,
						end: workItem.fields[VSTS_SCHEDULING_TARGET_DATE] || end,
						name: workItem.fields[ITEM_TITLE],
						id: `${teamId}_${workItem.id}`,
						progress: progress?.subtaskProgress || 0,
						styles: {
							backgroundColor: progress?.status?.backgroundColor,
							backgroundSelectedColor: progress?.status?.backgroundSelectedColor,
							progressColor: progress?.status?.progressColor,
							progressSelectedColor: progress?.status?.progressSelectedColor
						},
						type: hasChild && PROJECT || TASK,
						project: parentId,
						hideChildren: true,
						// isDisabled:
						dependencies: [parentId]
					});
				});
		});

		setTasks(ganttTasks);
		setProgressMap(progressMap);
		setChartLoad(false);
	};

	const onFilterContextChange = (project: IProjectInfo, context: FilterInterface): void => {
		setChartLoad(true);
		reloadTasks(project, context)
			.then(() => setFilterContext(context));
	};


	const onTeamChange = (project: IProjectInfo, teams: WebApiTeam[]): void => {
		const _teamFilter = teams && teams.length > 0 ? { teams: teams } : { teams: undefined, shift: undefined };
		setTeams(teams);
		setTeamSelected(teams && teams.length === 1);
		onFilterContextChange(project, { ...filterContext, ..._teamFilter });
	};

	const onWorkTypes = (project: IProjectInfo, items: string[]): void => {
		const _workTypesFilter = { workTypes: items };
		onFilterContextChange(project, { ...filterContext, ..._workTypesFilter });
	};

	const onIterationChange = (project: IProjectInfo, iteration: TeamSettingsIteration) => {
		onFilterContextChange(project, { ...filterContext, shift: Number(iteration?.path) });
	};

	return (
		<div>
			<div className="ViewContainer">
				<div className="flex-row">
					{teamSelected && (
						<IterationFilterHub
							project={project!}
							team={teams[0]}
							onChange={onIterationChange}
						/>
					)}
					<TeamFilterHub
						project={project!}
						item={allTeam}
						itemsFn={(project) => fetchTeams(project).then(items => [...items])}
						onChange={onTeamChange}
					/>
					<MultiFilterHub project={project!} onChange={onWorkTypes} />
					<ViewSwitcher
						onViewModeChange={setView}
						onViewListChange={setIsChecked}
						onCurrentPosition={onCurrentPosition}
						isChartLoad={chartLoad}
						isChecked={isChecked}
						viewMode={view}
					/>
				</div>
			</div>
			<div className="flex-column Wrapper" style={{ marginTop: 10 }} ref={wrapperRef}>
				{!chartLoad ? (
					<Gantt
						TaskListHeader={GanttHeader}
						TaskListTable={ganttTableBuilder.build(progressMap)}
						TooltipContent={ganttTooltipContentBuilder.build(progressMap)}
						tasks={tasks}
						viewMode={view}
						columnWidth={columnWidthByViewMode[view || ViewMode.Day]}
						listCellWidth={isChecked ? '100px' : ''}
						onExpanderClick={handleExpanderClick}
						onSelect={handleSelectClick}
						todayColor={currentPeriodColor}
						barFill={50}
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
