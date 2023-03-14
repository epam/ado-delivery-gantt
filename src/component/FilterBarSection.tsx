import * as React from 'react';
import { FilterBar } from "azure-devops-ui/FilterBar";
import { KeywordFilterBarItem } from "azure-devops-ui/TextFilterBarItem";
import { FILTER_APPLIED_EVENT, FILTER_CHANGE_EVENT, Filter, IFilterState } from 'azure-devops-ui/Utilities/Filter';
import { DropdownFilterBarItem } from 'azure-devops-ui/Dropdown';
import { DropdownMultiSelection, DropdownSelection } from 'azure-devops-ui/Utilities/DropdownSelection';
import { useEffect, useState } from 'react';
import { IProjectInfo, getClient } from 'azure-devops-extension-api';
import { WebApiTeam } from 'azure-devops-extension-api/Core';
import { IListBoxItem } from 'azure-devops-ui/ListBox';
import { ObservableArray, ObservableValue } from 'azure-devops-ui/Core/Observable';
import { ArrayItemProvider } from 'azure-devops-ui/Utilities/Provider';
import { WorkItemTrackingRestClient, WorkItemTypeReference } from 'azure-devops-extension-api/WorkItemTracking';
import { localeIgnoreCaseComparer } from 'azure-devops-ui/Core/Util/String';
import { fetchIterationDefinition } from '../service/WiqlService';
import { TeamSettingsIteration } from 'azure-devops-extension-api/Work';


export interface FilterBarProps<T> {
    project: IProjectInfo,
    team?: WebApiTeam,
    itemsFn: (project: IProjectInfo) => Promise<T[]>;
    onChange?: (project: IProjectInfo, filterState: IFilterState) => void;
}

export enum FilterType {
    TEAMS = "teams",
    TYPES = "types",
    ITERATIONS = "iterations"
}

const filter = new Filter();
// teams
const teamsSelection = new DropdownMultiSelection();
const teamItemOptions = new ObservableArray<IListBoxItem<WebApiTeam>>();

// types
const typesSelection = new DropdownMultiSelection();
const typeItemOptions = new ObservableArray<IListBoxItem<String>>();

// iterations
const iterationsSelection = new DropdownSelection();
const iterationItemOptions = new ObservableArray<IListBoxItem<string>>();

// temporary filter data cache
const filterCache = new Map<string, Promise<any>>();

const computeFilterByKey = (fn: (...args: any) => Promise<any>, ...args: any): Promise<any>  => {
    const key = `${fn}${args}`;
    if (filterCache.has(key)) {
        return filterCache.get(key)!;
    }
    filterCache.set(key, fn(...args));
    return filterCache.get(key)!;
}


export const FilterBarSection: React.FC<FilterBarProps<WebApiTeam>> = ({
    project,
    team,
    itemsFn,
    onChange
}) => {

    const [teamSelected, setTeamSelected] = useState(team);

    useEffect(() => {
        const loadTeamsTypeOptions = async () => {
            if (project) {
                const teams = await itemsFn!(project);
                const itemsOptions: Array<IListBoxItem<WebApiTeam>> = teams.map(it => ({ id: it.id, text: it.name, data: it } as IListBoxItem<WebApiTeam>));
                return itemsOptions;
            }
            return [];
        };

        computeFilterByKey(() => loadTeamsTypeOptions()
            .then((teamOptions = []) => {
                if (teamOptions.length > 0) {
                    teamItemOptions.push(...teamOptions);
                    teamsSelection.select(0, teamItemOptions.length, true, true);
                }
            })
            .catch(console.error));

        if (project) {
            filter.subscribe(() => {
                const state = filter.getState();
                const teams = state[FilterType.TEAMS]?.value as WebApiTeam[];
                setTeamSelected(teams?.length === 1 ? teams?.[0] : undefined);
            }, FILTER_APPLIED_EVENT);
        }
    }, [project]);

    useEffect(() => {
        fetchTeamIteration(teamSelected);
    }, [teamSelected]);

    const fetchTeamIteration = async (team?: WebApiTeam) => {
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
            if (project) {
                const client = getClient(WorkItemTrackingRestClient);
                const _types = await client.getWorkItemTypeCategories(project.name);
                const _types_1 = await client.getWorkItemTypes(project.name);
                const _hidden = _types
                    .filter(t => t.referenceName == "Microsoft.HiddenCategory")
                    .reduce((acc, { workItemTypes = [] }) => [...acc, ...workItemTypes], [] as WorkItemTypeReference[])
                    .map(t => t.name);

                const _typesNames = _types_1.map(t => t.name).filter(t => _hidden.indexOf(t) < 0);

                typeItemOptions.push(..._typesNames
                    .sort(localeIgnoreCaseComparer)
                    .map(item => ({ id: item, data: item, text: item })));
                typesSelection.select(0, typeItemOptions.length, true, true);
            }
        }

        computeFilterByKey(loadWorkItemTypes)
            .catch(console.error);
    }, [project]);

    return (
        <FilterBar filter={filter}>
            <KeywordFilterBarItem filterItemKey="Placeholder" />

            {teamSelected &&
                (<DropdownFilterBarItem
                    filterItemKey={FilterType.ITERATIONS}
                    filter={filter}
                    items={iterationItemOptions}
                    selection={iterationsSelection}
                    onCollapse={() => onChange?.(project, filter.getState())}
                    placeholder="Iterations"
                />)}

            <DropdownFilterBarItem
                filterItemKey={FilterType.TEAMS}
                filter={filter}
                items={teamItemOptions}
                selection={teamsSelection}
                onCollapse={() => onChange?.(project, filter.getState())}
                placeholder="Teams"
            />

            <DropdownFilterBarItem
                filterItemKey={FilterType.TYPES}
                filter={filter}
                items={typeItemOptions}
                selection={typesSelection}
                onCollapse={() => onChange?.(project, filter.getState())}
                placeholder="Types"
            />

        </FilterBar>
    );
}