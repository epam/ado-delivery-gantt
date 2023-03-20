import * as React from 'react';
import { FilterBar } from "azure-devops-ui/FilterBar";
import { KeywordFilterBarItem } from "azure-devops-ui/TextFilterBarItem";
import { FILTER_APPLIED_EVENT, Filter, IFilterState } from 'azure-devops-ui/Utilities/Filter';
import { DropdownFilterBarItem } from 'azure-devops-ui/Dropdown';
import { DropdownMultiSelection, DropdownSelection } from 'azure-devops-ui/Utilities/DropdownSelection';
import { useEffect, useState } from 'react';
import { IListBoxItem } from 'azure-devops-ui/ListBox';
import { ObservableArray } from 'azure-devops-ui/Core/Observable';
import { fetchIterationDefinition } from '../../../service/WiqlService';
import { TeamSettingsIteration } from 'azure-devops-extension-api/Work';
import { BacklogItem, TeamItem } from 'service/helper';


export interface FilterBarProps {
  ganttId: String,
  team?: TeamItem,
  teamsFn: () => TeamItem[];
  workItemTypes: () => BacklogItem[];
  onChange?: (filterState: IFilterState) => void;
}

export enum FilterType {
  TEAMS = "teams",
  TYPES = "types",
  ITERATIONS = "iterations"
}

// temporary filter data cache
const filterCache = new Map<string, Promise<any>>();

const computeFilterByKey = (fn: (...args: any) => Promise<any>, ...args: any): Promise<any> => {
  const key = `${fn}${args}`;
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

// iterations
const iterationsSelection = new DropdownSelection();
const iterationItemOptions = new ObservableArray<IListBoxItem<string>>();

export const GanttFilterBar: React.FC<FilterBarProps> = ({
  ganttId,
  team,
  teamsFn,
  workItemTypes,
  onChange
}) => {

  const [teamSelected, setTeamSelected] = useState(team);

  useEffect(() => {
    const loadTeamsTypeOptions = async () => {
      const teams = teamsFn();
      const itemsOptions: Array<IListBoxItem<TeamItem>> = teams.map(it => ({ id: it.id, text: it.name, data: it } as IListBoxItem<TeamItem>));
      return itemsOptions;
    };

    loadTeamsTypeOptions()
      .then((teamOptions = []) => {
        if (teamOptions.length > 0) {
          teamItemOptions.push(...teamOptions);
          teamsSelection.select(0, teamItemOptions.length, true, true);
        }
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
      const { iterations, currentIteration } = await computeFilterByKey(fetchIterationDefinition, team!)
        .then(definition => {
          return {
            iterations: definition.iterations,
            currentIteration: definition.currentIteration
          }
        });
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
      return iterations.map((e, j) => {
        return { ...e, path: String(j - i) };
      });
    }
    return iterations;
  };

  useEffect(() => {
    const loadWorkItemTypes = async (): Promise<void> => {
      typeItemOptions.push(...workItemTypes()
        .sort(({ rank: r1 = 0 }, { rank: r2 = 0 }) => r2 - r1)
        .map(item => ({ id: item.name, data: item, text: item.name })));
      typesSelection.select(0, typeItemOptions.length, true, true);
    }
    loadWorkItemTypes().catch(console.error);
    console.log("---- loadWorkItemTypes -----", ganttId);
    return () => { typeItemOptions.removeAll() };
  }, [ganttId]);

  return (
    <FilterBar filter={filter}>
      <KeywordFilterBarItem filterItemKey="Placeholder" />

      {teamSelected &&
        (<DropdownFilterBarItem
          filterItemKey={FilterType.ITERATIONS}
          filter={filter}
          items={iterationItemOptions}
          selection={iterationsSelection}
          onCollapse={() => onChange?.(filter.getState())}
          placeholder="Iterations"
        />)}

      <DropdownFilterBarItem
        filterItemKey={FilterType.TEAMS}
        filter={filter}
        items={teamItemOptions}
        selection={teamsSelection}
        onCollapse={() => onChange?.(filter.getState())}
        placeholder="Teams"
      />

      <DropdownFilterBarItem
        filterItemKey={FilterType.TYPES}
        filter={filter}
        items={typeItemOptions}
        selection={typesSelection}
        onCollapse={() => onChange?.(filter.getState())}
        placeholder="Types"
      />

    </FilterBar>
  );
}
