import "./gantt.scss";
import "gantt-task-react/dist/index.css";

import * as React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import * as SDK from 'azure-devops-extension-sdk';

import { Gantt, Task, ViewMode } from 'gantt-task-react';
import { WebApiTeam } from 'azure-devops-extension-api/Core';
import {
  WorkItem,
  IWorkItemFormNavigationService,
  WorkItemTrackingServiceIds,
} from 'azure-devops-extension-api/WorkItemTracking';
import { Spinner, SpinnerSize } from "azure-devops-ui/Spinner";
import { ProgressInterface, TeamDictionaryValue } from "../../service/ProgressCalculationService";
import { GanttHeader, ganttTableBuilder, ganttTooltipContentBuilder } from './table';
import { fetchIterationDefinition, TeamIteration } from '../../service/WiqlService';
import { TeamSettingsIteration } from 'azure-devops-extension-api/Work';
import { GanttFilterBar, GanttViewBar, FilterType } from "./bars";
import { IFilterState } from "azure-devops-ui/Utilities/Filter";
import { AdoApiUtil, BacklogItem, Context, TeamItem } from "../../service/helper";

export interface FilterInterface {
  teams?: TeamItem[];
  workTypes?: BacklogItem[],
  tags?: string[],
  shift?: number;
  states: Set<string>;
}

export interface GanttChartTabProps {
  context: Context;
  progressMap: Map<string, ProgressInterface>;
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

export const GanttView: React.FC<GanttChartTabProps> = ({
  context,
  progressMap
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [view, setView] = useState<ViewMode>(ViewMode.Day);
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
      const { project, workItemTypes, options } = context;
      if (project && workItemTypes) {
        filterContext.current = { ...filterContext.current, teams: options.teams, workTypes: options.backlog, } as FilterInterface;
        const [{ name: rootCategory }] = options.backlog.sort(({ rank: r1 = 0 }, { rank: r2 = 0 }) => r2 - r1);
        const teams = await AdoApiUtil.fetchTeams(project, filterContext.current);
        const teamDictionary = await AdoApiUtil.collectTeamDictionary(teams, filterContext.current);
        const teamIterations = await Promise.all(teams.map(fetchIterationDefinition));

        loadTasks(rootCategory, teams, teamDictionary, new Map(teamIterations.map(({ teamId, ...rest }) => [teamId, { ...rest, teamId }])));
      }
    })();
  }, [progressMap, context]);

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
    const barYPosition = bar?.getBoundingClientRect().y;
    const barBottomPosition = String(bar ? bar.getBoundingClientRect().bottom : 0);
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
    const { project, options } = context;
    const teams = await AdoApiUtil.fetchTeams(project!, filterContext);
    const teamDictionary = await AdoApiUtil.collectTeamDictionary(teams, filterContext);
    const teamIterations = await Promise.all(teams.map(fetchIterationDefinition));
    [...progressMap.values()].forEach(it => delete it.deep);
    const [{ name: rootCategory }] = options.backlog
      .filter(it => filterContext.workTypes?.map(it => it.name).indexOf(it.name) || -1 >= 0)
      .sort(({ rank: r1 = 0 }, { rank: r2 = 0 }) => r2 - r1);
    loadTasks(rootCategory, teams, teamDictionary, new Map(teamIterations.map(({ teamId, ...rest }) => [teamId, { ...rest, teamId }])));
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
    if (popupClosed) {
      setChartLoad(true);
      reloadTasks(filterContext.current)
      setpopupClosed(false);
    }
  }, [popupClosed])

  const loadTasks = (rootCategory: string, teams: WebApiTeam[], teamDictionary: Map<string, TeamDictionaryValue>, teamIterations: Map<string, TeamIteration>) => {
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

  const onFilterContextChange = (context: FilterInterface): void => {
    setChartLoad(true);
    reloadTasks(context);
  };

  const onTeamChange = (teams: TeamItem[], isDefaultState: boolean): void => {
    const _teamFilter = teams && teams.length > 0 ? { teams: teams, shift: undefined } : { teams: undefined, shift: undefined };
    const { states } = filterContext.current;
    !isDefaultState && states.add("team") || states.delete("team");
    filterContext.current = { ...filterContext.current, ..._teamFilter, states };
  };

  const onWorkTypes = (items: BacklogItem[], isDefaultState: boolean): void => {
    const _workTypesFilter = { workTypes: items };
    const { states } = filterContext.current;
    !isDefaultState && states.add("work_type") || states.delete("work_type");
    filterContext.current = { ...filterContext.current, ..._workTypesFilter, states } as FilterInterface;
  };

  const onIterationChange = (iteration: TeamSettingsIteration, isDefaultState: boolean) => {
    filterContext.current = { ...filterContext.current, shift: Number(iteration?.path) };
  };

  const onFilterBarChange = (filterState: IFilterState): void => {
    const teams = filterState[FilterType.TEAMS]?.value as TeamItem[];
    onTeamChange(teams, false);

    const types = filterState[FilterType.TYPES]?.value as BacklogItem[];
    onWorkTypes(types, false);

    const iterations = filterState[FilterType.ITERATIONS]?.value as string[];
    if (iterations && teams?.length === 1) {
      onIterationChange({ path: iterations?.[0] } as TeamSettingsIteration, false);
    }
    onFilterContextChange(filterContext.current);
  };

  return (
    <div>
      <div className="ViewContainer flex-column">
        <div className="flex-row">
          <GanttViewBar
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
              <GanttFilterBar
                ganttId={context?.ganttId!}
                team={filterContext.current.teams?.[0]}
                teamsFn={() => context.options.teams}
                workItemTypes={() => context.options.backlog}
                onChange={onFilterBarChange}
              />
            </div> : ""
        }
      </div>
      {!chartLoad ? (
        <div className="flex-column Wrapper" style={{ marginTop: 10 }} ref={wrapperRef}>
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
        </div>
      ) : (
        <div style={{ marginTop: 50 }}>
          <Spinner size={SpinnerSize.large} label="Loading..." />
        </div>
      )}
    </div>
  );
};
