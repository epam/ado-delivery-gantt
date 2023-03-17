import "./gantt.scss";
import "gantt-task-react/dist/index.css";

import * as React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import * as SDK from 'azure-devops-extension-sdk';

import { Gantt, Task, ViewMode } from 'gantt-task-react';
import {
  getClient,
  IProjectInfo,
} from 'azure-devops-extension-api';
import { CoreRestClient, WebApiTeam } from 'azure-devops-extension-api/Core';
import {
  WorkItemTrackingRestClient,
  WorkItemExpand,
  WorkItemErrorPolicy,
  WorkItem,
  IWorkItemFormNavigationService,
  WorkItemTrackingServiceIds,
} from 'azure-devops-extension-api/WorkItemTracking';
import { Spinner, SpinnerSize } from "azure-devops-ui/Spinner";
import { ProgressInterface, TeamDictionaryValue, getProgressMap } from "../../service/ProgressCalculationService";
import { ViewSwitcher } from './ViewSwitcher';
import { GanttHeader, ganttTableBuilder, ganttTooltipContentBuilder } from './table';
import { fetchTeamWorkItems, fetchIterationDefinition, TeamIteration } from '../../service/WiqlService';
import { TeamSettingsIteration } from 'azure-devops-extension-api/Work';
import { FilterBarSection, FilterType } from "../FilterBarSection";
import { IFilterState } from "azure-devops-ui/Utilities/Filter";

export interface FilterInterface {
  teams?: WebApiTeam[] | undefined;
  workTypes?: string[],
  tags?: string[],
  shift?: number;
  states: Set<string>;
}

export interface GanttChartTabProps {
  context: Context
}

const VSTS_SCHEDULING_START_DATE = 'Microsoft.VSTS.Scheduling.StartDate';
const VSTS_SCHEDULING_TARGET_DATE = 'Microsoft.VSTS.Scheduling.TargetDate';
const WORK_ITEM_TYPE = 'System.WorkItemType';
const ITEM_TITLE = 'System.Title';
const PROJECT = 'project';
const DEFAULT_CURRENT_PERIOD_COLOR = '#F3EFEF'

const columnWidthByViewMode: { [key: string]: number } = {
  [ViewMode.QuarterDay]: 30,
  [ViewMode.Day]: 60,
  [ViewMode.Week]: 250,
  [ViewMode.Month]: 300,
  [ViewMode.Year]: 400,
};

let visiblePageWidth: number;

type Context = { project?: IProjectInfo, rootCategory: string, workItemTypes: Map<string, string> };

export const GanttChartTab: React.FC<GanttChartTabProps> = ({
  context,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [view, setView] = useState<ViewMode>(ViewMode.Day);
  const [progressMap, setProgressMap] = useState<Map<string, ProgressInterface>>(new Map<string, ProgressInterface>());
  const [isChecked, setIsChecked] = useState(true);
  const [isCheckedViewLinks, setIsCheckedViewLinks] = useState(false);
  const [chartLoad, setChartLoad] = useState(true);
  const filterContext = useRef({ states: new Set() } as FilterInterface);
  const [currentPeriodColor] = useState(DEFAULT_CURRENT_PERIOD_COLOR);
  const [popupClosed, setpopupClosed] = useState(false);
  const [tasksUnfolded] = useState<Map<string, Task>>(new Map<string, Task>)

  const [showFilterTab, setShowFilterTab] = useState(false);

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

  const onFilterTabShow = useCallback(() => {
    setShowFilterTab(!showFilterTab);
  }, [showFilterTab]);

  useEffect(() => {
    (async () => {
      await SDK.ready();
      const { project, rootCategory, workItemTypes } = context;
      if (project && rootCategory && workItemTypes) {
        const teams = await fetchTeams(project);
        const teamDictionary = await collectTeamDictionary(teams);
        const teamIterations = await Promise.all(teams.map(fetchIterationDefinition));

        const progressMap = buildProgressMap(teams, teamDictionary, workItemTypes);
        setProgressMap(progressMap);

        loadTasks(rootCategory, progressMap, teams, teamDictionary, new Map(teamIterations.map(({ teamId, ...rest }) => [teamId, { ...rest, teamId }])));
      }
    })();
  }, [context]);

  useEffect(() => {
    document.addEventListener('scroll', handleCalendarScroll, true);
    onViewLinksChange(isCheckedViewLinks);
    return () => {
      document.removeEventListener('scroll', handleCalendarScroll, true);
    };
  }, [[view]])

  const calculateVisiblePageWidth = () => {
    const ganttTable = document.querySelector(".ganttTable") as HTMLElement;
    const pageContent = document.querySelector(".page-content") as HTMLElement;
    const pageContentWidth = pageContent.getBoundingClientRect().width;
    if (ganttTable) {
      const ganttTableWidth = ganttTable.getBoundingClientRect().width;
      visiblePageWidth = pageContentWidth - ganttTableWidth;
    } else {
      visiblePageWidth = pageContentWidth;
    }
  }

  const handleCalendarScroll = () => {
    const calendarTop = document.querySelectorAll(".calendarTop");
    const bar = document.querySelector(".bolt-tabbar") as HTMLElement;
    const viewContainer = document.querySelector(".ViewContainer") as HTMLElement;
    const barYPosition = bar.getBoundingClientRect().y;
    const barBottomPosition = String(bar.getBoundingClientRect().bottom);
    const calendarParent = document.querySelector(".calendar")?.parentElement;
    const defaultPadding = 30

    barYPosition == 0 ? (
      viewContainer.style.top = `${barBottomPosition}px`, viewContainer.style.position = "sticky") : (
      viewContainer.style.top = "", viewContainer.style.position = "");

    if (calendarParent && viewContainer && view === ViewMode.Day) {
      calculateVisiblePageWidth();
      let previousLinePosition = 0;
      calendarParent!.style.position = "relative";
      viewContainer.style.marginLeft = "auto"
      viewContainer!.style.zIndex = "1"
      const xParentCalendar = calendarParent.getBoundingClientRect().x;
      // TODO should be calculated with display resizing
      const currentPosition = isChecked ? Number(visiblePageWidth + visiblePageWidth / 2 - 100 - xParentCalendar) : Number(visiblePageWidth / 2 - xParentCalendar);

      calendarTop.forEach((it1) => {
        const lineChildren = it1.children[0];
        const textChildren = it1.children[1];
        const currentLine = Number(lineChildren.getAttribute("x1"));

        if (currentPosition > currentLine) {
          textChildren.setAttribute("x", String(currentLine - defaultPadding));
        }
        if (currentPosition < previousLinePosition) {
          textChildren.setAttribute("x", String(previousLinePosition));
        }
        if (currentPosition > previousLinePosition && currentPosition < currentLine - defaultPadding) {
          textChildren.setAttribute("x", String(currentPosition));
        }
        previousLinePosition = currentLine + defaultPadding;
      })
    }
  }

  const reloadTasks = async (filterContext: FilterInterface) => {
    const { states, shift } = filterContext;
    const { project, rootCategory, workItemTypes } = context;

    const teams = await fetchTeams(project!, filterContext);
    const teamDictionary = await collectTeamDictionary(teams, filterContext);
    const teamIterations = await Promise.all(teams.map(fetchIterationDefinition));

    const _progressMap = states.size === 0 && !shift ? buildProgressMap(teams, teamDictionary, workItemTypes) : progressMap;
    setProgressMap(_progressMap);

    loadTasks(rootCategory, progressMap, teams, teamDictionary, new Map(teamIterations.map(({ teamId, ...rest }) => [teamId, { ...rest, teamId }])));
  }

  const onViewLinksChange = (value: boolean) => {
    setIsCheckedViewLinks(value);
    if (wrapperRef.current) {
      const arrows = wrapperRef.current.querySelector(".arrows")
      value ? arrows?.removeAttribute("display") : arrows?.setAttribute("display", "none");
    }
  };

  const handleExpanderClick = (task: Task): void => {
    if (!tasksUnfolded.delete(task.id)) {
      tasksUnfolded.set(task.id, task)
    }
    setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
  };

  const handleSelectClick = async (
    task: Task,
    isSelected: boolean
  ): Promise<void> => {
    const navSvc = await SDK.getService<IWorkItemFormNavigationService>(
      WorkItemTrackingServiceIds.WorkItemFormNavigationService
    );

    const taskId = task.id.split("_").pop();
    if (isSelected && Number(taskId)) {
      await navSvc.openWorkItem(parseInt(taskId!));
      setpopupClosed(true)
    }
  };

  useEffect(() => {
    setChartLoad(true);
    reloadTasks(filterContext.current)
    setpopupClosed(false);
  }, [popupClosed])

  const fetchTeams = async (project: IProjectInfo, filter?: FilterInterface): Promise<WebApiTeam[]> => {
    const { name: projectName } = project;
    const coreClient = getClient(CoreRestClient);
    return coreClient.getTeams(projectName)
      .then(teams => teams.filter(({ id }) => filter?.teams?.some(it => it.id === id) ?? true));
  }

  const buildProgressMap = (teams: WebApiTeam[], teamDictionary: Map<string, TeamDictionaryValue>, workItemTypes: Map<string, string>) => getProgressMap(teams, teamDictionary, workItemTypes)

  const collectTeamDictionary = async (teams: WebApiTeam[], filter?: FilterInterface): Promise<Map<string, TeamDictionaryValue>> => {
    const workItemsClient = getClient(WorkItemTrackingRestClient);

    const teamWorkItems = await Promise.all(teams.map(it => fetchTeamWorkItems(it, filter)));

    const projectItems: Map<string, TeamDictionaryValue>[] = await Promise.all(teamWorkItems.map(({ id, ids, connections }) => ids.length > 0 ? workItemsClient.getWorkItemsBatch({
      $expand: WorkItemExpand.All,
      asOf: new Date(),
      errorPolicy: WorkItemErrorPolicy.Omit,
      fields: [],
      ids
    }).then((items = []) => new Map<string, TeamDictionaryValue>([[id, { connections, map: new Map(items.map(item => [`${item.id}`, item])) }]]))
      : Promise.resolve(new Map<string, TeamDictionaryValue>([[id, { connections: {}, map: new Map() }]]))));

    return projectItems.reduce((acc, next) => new Map([...acc, ...next]), new Map());
  };

  const loadTasks = (rootCategory: string, progressMap: Map<string, ProgressInterface>, teams: WebApiTeam[], teamDictionary: Map<string, TeamDictionaryValue>, teamIterations: Map<string, TeamIteration>) => {
    const ganttTasks: Task[] = [];
    teams.forEach(team => {
      const teamId = team.id;
      const iteration = teamIterations.get(teamId);
      const { start, end } = iteration as { start: Date, end: Date };

      ganttTasks.push({
        start,
        end,
        name: team.name,
        id: teamId,
        styles: { backgroundColor: "white", backgroundSelectedColor: "white", progressColor: "white", progressSelectedColor: "white" },
        progress: 0,
        type: PROJECT,
        hideChildren: !tasksUnfolded.has(teamId),
      });

      const { connections, map } = teamDictionary.get(teamId) as TeamDictionaryValue;

      const rootCategoryChildItems = Object.keys(connections)
        .filter(itemId => {
          const itemType = map.get(itemId)?.fields[WORK_ITEM_TYPE];
          return itemType === rootCategory || rootCategory.startsWith(itemType);
        })
        .map(itemId => connections[itemId])
        .reduce((acc, next) => new Set([...acc, ...next.map(({ target: { id } }) => id)]), new Set());

      Object.keys(connections)
        .filter(itemId => {
          const itemType = map.get(itemId)?.fields[WORK_ITEM_TYPE];
          return itemType === rootCategory || rootCategory.startsWith(itemType);
        })
        .map(itemId => connections[itemId])
        .reduce((acc, next) => [...acc, ...next], [])
        .forEach(item => {
          const { target: { id } } = item;
          const workItem = map.get(`${id}`) as WorkItem;
          const progress = progressMap.get(`${teamId}_${workItem.id}`);
          const hasChild = workItem?.relations?.some(({ attributes = {} }) => attributes.name === 'Child');
          const parentId = item?.source?.id ? `${teamId}_${item?.source?.id}` : `${teamId}`;
          const itemId = `${teamId}_${workItem.id}`

          ganttTasks.push({
            start: workItem.fields[VSTS_SCHEDULING_START_DATE] || start,
            end: workItem.fields[VSTS_SCHEDULING_TARGET_DATE] || end,
            name: workItem.fields[ITEM_TITLE],
            id: itemId,
            progress: progress?.subtaskProgress || 0,
            styles: {
              backgroundColor: progress?.status?.backgroundColor,
              backgroundSelectedColor: progress?.status?.backgroundSelectedColor,
              progressColor: progress?.status?.progressColor,
              progressSelectedColor: progress?.status?.progressSelectedColor
            },
            type: PROJECT,
            project: parentId,
            hideChildren: !tasksUnfolded.has(itemId),
            dependencies: hasChild ? [parentId] : [parentId, "add-expanderSymbol"],
          });
        });

      const othersId = `${teamId}_others`;

      ganttTasks.push({
        start,
        end,
        name: 'Others',
        project: team.id,
        id: othersId,
        styles: { backgroundColor: "white", backgroundSelectedColor: "white", progressColor: "white", progressSelectedColor: "white" },
        progress: 0,
        type: PROJECT,
        hideChildren: !tasksUnfolded.has(othersId),
      });

      Object.keys(connections)
        .map(itemId => connections[itemId])
        .reduce((acc, next) => [...acc, ...next], [])
        .filter(({ target: { id } }) => !rootCategoryChildItems.has(id))
        .forEach(item => {
          const { target: { id } } = item;
          const workItem = map.get(`${id}`) as WorkItem;
          const progress = progressMap.get(`${teamId}_${workItem.id}`);
          const hasChild = workItem?.relations?.some(({ attributes = {} }) => attributes.name === 'Child');
          const parentId = item?.source?.id ? `${teamId}_${item?.source?.id}` : `${teamId}_others`;
          const itemId = `${teamId}_${workItem.id}`

          ganttTasks.push({
            start: workItem.fields[VSTS_SCHEDULING_START_DATE] || start,
            end: workItem.fields[VSTS_SCHEDULING_TARGET_DATE] || end,
            name: workItem.fields[ITEM_TITLE],
            id: itemId,
            progress: progress?.subtaskProgress || 0,
            styles: {
              backgroundColor: progress?.status?.backgroundColor,
              backgroundSelectedColor: progress?.status?.backgroundSelectedColor,
              progressColor: progress?.status?.progressColor,
              progressSelectedColor: progress?.status?.progressSelectedColor
            },
            type: PROJECT,
            project: parentId,
            hideChildren: !tasksUnfolded.has(itemId),
            dependencies: hasChild ? [parentId] : [parentId, "add-expanderSymbol"],
          });
        });
    });

    setTasks(ganttTasks);
    setChartLoad(false);
  };

  const onFilterContextChange = (project: IProjectInfo, context: FilterInterface): void => {
    setChartLoad(true);
    reloadTasks(context);
  };

  const onTeamChange = (project: IProjectInfo, teams: WebApiTeam[], isDefaultState: boolean): void => {
    const _teamFilter = teams && teams.length > 0 ? { teams: teams, shift: undefined } : { teams: undefined, shift: undefined };
    const { states } = filterContext.current;
    !isDefaultState && states.add("team") || states.delete("team");
    filterContext.current = { ...filterContext.current, ..._teamFilter, states };
  };

  const onWorkTypes = (project: IProjectInfo, items: string[], isDefaultState: boolean): void => {
    const _workTypesFilter = { workTypes: items };
    const { states } = filterContext.current;
    !isDefaultState && states.add("work_type") || states.delete("work_type");
    filterContext.current = { ...filterContext.current, ..._workTypesFilter, states } as FilterInterface;
  };

  const onIterationChange = (project: IProjectInfo, iteration: TeamSettingsIteration, isDefaultState: boolean) => {
    filterContext.current = { ...filterContext.current, shift: Number(iteration?.path) };
  };

  const onFilterBarChange = (project: IProjectInfo, filterState: IFilterState): void => {
    const teams = filterState[FilterType.TEAMS]?.value as WebApiTeam[];
    onTeamChange(project, teams, false);

    const types = filterState[FilterType.TYPES]?.value as string[];
    onWorkTypes(project, types, false);

    const iterations = filterState[FilterType.ITERATIONS]?.value as string[];
    if (iterations && teams?.length === 1) {
      onIterationChange(project, { path: iterations?.[0] } as TeamSettingsIteration, false);
    }
    onFilterContextChange(project, filterContext.current);
  };

  return (
    <div>
      <div className="ViewContainer flex-column">
        <div className="flex-row">
          <ViewSwitcher
            onViewModeChange={setView}
            onViewListChange={setIsChecked}
            onViewLinksChange={onViewLinksChange}
            onCurrentPosition={onCurrentPosition}
            onFilterTabShow={onFilterTabShow}
            isChartLoad={chartLoad}
            isChecked={isChecked}
            isCheckedViewLinks={isCheckedViewLinks}
            viewMode={view}
            isShowFilterTab={showFilterTab}
          />
        </div>
        {
          (showFilterTab) ?
            <div className="flex-row">
              <FilterBarSection
                project={context?.project!}
                team={filterContext.current.teams?.[0]}
                itemsFn={(project) => fetchTeams(project).then(items => [...items])}
                onChange={onFilterBarChange}
              />
            </div> : ""
        }
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
            arrowColor={isCheckedViewLinks ? 'black' : ''}
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
