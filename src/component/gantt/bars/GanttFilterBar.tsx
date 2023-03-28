import * as React from 'react';
import { FilterBar } from "azure-devops-ui/FilterBar";
import { KeywordFilterBarItem } from "azure-devops-ui/TextFilterBarItem";
import { FILTER_APPLIED_EVENT, Filter, IFilterState } from 'azure-devops-ui/Utilities/Filter';
import { DropdownFilterBarItem } from 'azure-devops-ui/Dropdown';
import { DropdownMultiSelection, DropdownSelection } from 'azure-devops-ui/Utilities/DropdownSelection';
import { useEffect, useRef, useState } from 'react';
import { IListBoxItem } from 'azure-devops-ui/ListBox';
import { ObservableArray } from 'azure-devops-ui/Core/Observable';
import { TeamSettingsIteration } from 'azure-devops-extension-api/Work';
import { BacklogItem, TeamItem } from '../../../service/helper';
import { fetchIterationDefinition } from '../../../service/WiqlService';


export interface FilterBarProps {
  tags?: string[],
  ganttId: string,
  team?: TeamItem,
  teamsFn: () => TeamItem[];
  workItemTypes: () => BacklogItem[];
  onChange?: (filterState: IFilterState) => void;
}

export enum FilterType {
  TEAMS = "teams",
  TYPES = "types",
  ITERATIONS = "iterations",
  TAGS = "tags"
}

// temporary filter data cache
const filterCache = new Map<string, Promise<any>>();

const computeFilterByKey = (key: string, fn: (...args: any) => Promise<any>, ...args: any): Promise<any> => {
  if (filterCache.has(key)) {
    return filterCache.get(key)!;
  }
  filterCache.set(key, fn(...args));
  return filterCache.get(key)!;
}

const filter = new Filter();
// teams
const teamsSelection = new DropdownMultiSelection();
const teamItemOptions = new ObservableArray<IListBoxItem<TeamItem>>();

// types
const typesSelection = new DropdownMultiSelection();
const typeItemOptions = new ObservableArray<IListBoxItem<BacklogItem>>();

// tags
const tagSelection = new DropdownMultiSelection();
const tagItemOptions = new ObservableArray<IListBoxItem<string>>();

// iterations
const iterationsSelection = new DropdownSelection();
const iterationItemOptions = new ObservableArray<IListBoxItem<string>>();

export const GanttFilterBar: React.FC<FilterBarProps> = ({
  tags,
  ganttId,
  team,
  teamsFn,
  workItemTypes,
  onChange
}) => {

  const [teamSelected, setTeamSelected] = useState(team);

  const filterState = useRef(filter.getState());

  useEffect(() => {
    if (tags && tagItemOptions.length === 0) {
      const tagOptions = tags.map(tag => ({ id: tag, text: tag, data: tag } as IListBoxItem<string>));
      filter.setDefaultState({ ...filter.getDefaultState(), [FilterType.TAGS]: { value: [] } });
      tagItemOptions.removeAll();
      tagItemOptions.push(...tagOptions);
    }
  }, [tags]);

  useEffect(() => {
    const loadTeamsTypeOptions = async () => {
      const teams = teamsFn();
      filter.setDefaultState({ ...filter.getDefaultState(), [FilterType.TEAMS]: { value: teams } });
      const itemsOptions: Array<IListBoxItem<TeamItem>> = teams.map(it => ({ id: it.id, text: it.name, data: it } as IListBoxItem<TeamItem>));
      return itemsOptions;
    };

    loadTeamsTypeOptions()
      .then((teamOptions = []) => {
        if (teamOptions.length > 0) {
          teamItemOptions.push(...teamOptions);
        }
        filterState.current = filter.getState();
      })
      .catch(console.error);

    filter.subscribe(() => {
      const state = filter.getState();
      const teams = state[FilterType.TEAMS]?.value as TeamItem[];
      setTeamSelected(teams?.length === 1 ? teams?.[0] : undefined);
    }, FILTER_APPLIED_EVENT);
    return () => { teamItemOptions.removeAll() };
  }, [ganttId]);

  useEffect(() => {
    fetchTeamIteration(teamSelected);
  }, [teamSelected]);

  const fetchTeamIteration = async (team?: TeamItem) => {
    if (teamSelected) {
      const { iterations, currentIteration } = await computeFilterByKey(team!.id, fetchIterationDefinition, team!)
        .then(definition => ({
          iterations: definition.iterations,
          currentIteration: definition.currentIteration
        }));
      const iterationNames = addShiftsToIterations(iterations, currentIteration);

      const itemsOptions: Array<IListBoxItem<string>> = iterationNames.map(it => ({ id: it.id, text: it.name, data: it.path } as IListBoxItem<string>));
      iterationItemOptions.removeAll();
      iterationItemOptions.push(...itemsOptions);

      const index = itemsOptions.findIndex(it => it.text === currentIteration)
      iterationsSelection.clear();
      iterationsSelection.select(index);
    }
  };

  const addShiftsToIterations = (iterations: TeamSettingsIteration[], currentIterationName?: string) => {
    const currentIteration = iterations.filter(it => it.name === currentIterationName).pop();
    if (currentIteration) {
      const i = iterations.indexOf(currentIteration)
      return iterations.map((e, j) => ({ ...e, path: String(j - i) }));
    }
    return iterations;
  };

  useEffect(() => {
    const loadWorkItemTypes = async (): Promise<void> => {
      const items = workItemTypes();
      typeItemOptions.push(...items
        .sort(({ rank: r1 = 0 }, { rank: r2 = 0 }) => r2 - r1)
        .map(item => ({ id: item.name, data: item, text: item.name })));
      filter.setDefaultState({ ...filter.getDefaultState(), [FilterType.TYPES]: { value: items } });
      filterState.current = filter.getState();
    }
    loadWorkItemTypes().catch(console.error);
    return () => { typeItemOptions.removeAll() };
  }, [ganttId]);

  const onFilterStateChanged = () => {
    if (filter.getState()[FilterType.TYPES] !== filterState.current[FilterType.TYPES]
      || filter.getState()[FilterType.TEAMS] !== filterState.current[FilterType.TEAMS]
      || filter.getState()[FilterType.ITERATIONS] !== filterState.current[FilterType.ITERATIONS]
      || filter.getState()[FilterType.TAGS] !== filterState.current[FilterType.TAGS]) {

      const _state = Object.keys(FilterType)
        .map(it => it.toLowerCase())
        .map(it => ({ key: it, value: filter.getState()[it]?.value || filter.getDefaultState()[it]?.value }))
        .filter((value) => value)
        .map(({ key, value }) => ({ [key]: { value } }))
        .reduce((acc, next) => ({ ...acc, ...next }), {})

      filterState.current = filter.getState();
      onChange?.(_state);
    }
  };

  return (
    <FilterBar filter={filter}>
      <KeywordFilterBarItem filterItemKey="Placeholder" />

      {teamSelected &&
        (<DropdownFilterBarItem
          filterItemKey={FilterType.ITERATIONS}
          filter={filter}
          items={iterationItemOptions}
          selection={iterationsSelection}
          onCollapse={onFilterStateChanged}
          placeholder="Iterations"
        />)}

      <DropdownFilterBarItem
        filterItemKey={FilterType.TEAMS}
        filter={filter}
        items={teamItemOptions}
        selection={teamsSelection}
        onCollapse={onFilterStateChanged}
        placeholder="Teams"
      />

      <DropdownFilterBarItem
        filterItemKey={FilterType.TYPES}
        filter={filter}
        items={typeItemOptions}
        selection={typesSelection}
        onCollapse={onFilterStateChanged}
        placeholder="Types"
      />

      <DropdownFilterBarItem
        filterItemKey={FilterType.TAGS}
        filter={filter}
        items={tagItemOptions}
        selection={tagSelection}
        onCollapse={onFilterStateChanged}
        placeholder="Tags"
      />

    </FilterBar>
  );
}
