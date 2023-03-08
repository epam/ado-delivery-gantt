import * as React from "react";
import { useEffect, useState } from "react";
import { Dropdown, DropdownExpandableButton } from "azure-devops-ui/Dropdown";
import { IListBoxItem } from "azure-devops-ui/ListBox";
import { ObservableArray, ObservableValue } from "azure-devops-ui/Core/Observable";
import { DropdownSelection } from "azure-devops-ui/Utilities/DropdownSelection";
import { Observer } from "azure-devops-ui/Observer";
import { WebApiTeam } from "azure-devops-extension-api/Core/Core";
import { IProjectInfo } from "azure-devops-extension-api";
/* --- */
import { getClient } from "azure-devops-extension-api";
import { WorkItemTrackingRestClient, WorkItemTypeReference } from "azure-devops-extension-api/WorkItemTracking";
import { DropdownMultiSelection } from "azure-devops-ui/Utilities/DropdownSelection";
import { localeIgnoreCaseComparer } from "azure-devops-ui/Core/Util/String";
import { TeamSettingsIteration } from "azure-devops-extension-api/Work";
import { fetchIterationDefinition } from "../service/WiqlService";


export interface FilterProps<T> {
    project: IProjectInfo,
    team?: WebApiTeam,
    item?: T,
    itemsFn?: (project: IProjectInfo) => Promise<T[]>;
    onChange: (project: IProjectInfo, item: T | T[]) => void;
};
type Filter<T = any> = React.FC<FilterProps<T>>

const multiSelection = new DropdownMultiSelection();
const workItemTypes = new ObservableArray<IListBoxItem<{}>>();
const selectedItems = new Set();

export const MultiFilterHub: Filter = ({
    project,
    onChange,
}) => {

    useEffect(() => {
        const loadWorkItemTypes = async (): Promise<void> => {
            if (project) {
                const client = getClient(WorkItemTrackingRestClient);
                const _types = await client.getWorkItemTypeCategories(project.name);
                const _hidden = _types.filter(t => t.referenceName == "Microsoft.HiddenCategory")
                    .reduce((acc, { workItemTypes = [] }) => [...acc, ...workItemTypes], [] as WorkItemTypeReference[])
                    .map(t => t.name);
                const _typesNames = _types
                    .filter(t => t.referenceName != "Microsoft.HiddenCategory")
                    .map(t => t.defaultWorkItemType.name)
                    .filter(t => _hidden.indexOf(t) < 0);
                workItemTypes.push(..._typesNames
                    .sort(localeIgnoreCaseComparer)
                    .map(item => ({ id: item, data: item, text: item })));

                multiSelection.select(0, _typesNames.length, true, true);
            }
        }

        loadWorkItemTypes()
            .catch(console.error);
    }, [project]);

    return (

        <Observer selection={multiSelection}>
            {() => (
                <Dropdown
                    className="scale-dropdown"
                    actions={[
                        {
                            className: "bolt-dropdown-action-right-button",
                            disabled: multiSelection.selectedCount === 0,
                            iconProps: { iconName: "Clear" },
                            text: "Clear",
                            onClick: () => {
                                multiSelection.clear();
                                selectedItems.clear();
                            }
                        }
                    ]}
                    items={workItemTypes}
                    minCalloutWidth={300}
                    showFilterBox={true}
                    onCollapse={() => { onChange!(project, [...selectedItems]); }}
                    renderExpandable={props => <DropdownExpandableButton style={{ width: 140 }} {...props} />}
                    onSelect={(_, { id }) => { !selectedItems.has(id) && selectedItems.add(id) || selectedItems.delete(id); }}
                    selection={multiSelection}
                />)}
        </Observer>
    );
};

const selection = new DropdownSelection();
const items = new ObservableArray<IListBoxItem<any>>();

export const FilterHub: Filter = ({
    project,
    item,
    itemsFn,
    onChange,
}) => {

    const selectedItem = new ObservableValue<any>(item);

    useEffect(() => {
        (async () => {
            if (project) {
                const arr = await itemsFn!(project);
                const itemsOptions: Array<IListBoxItem<any>> = arr.map(it => ({ id: it.id, text: it.name, data: it } as IListBoxItem<any>));
                items.push(...itemsOptions);
            }
        })();
    }, [project]);


    const onSelect = (event: React.SyntheticEvent<HTMLElement>, item: IListBoxItem<WebApiTeam>) => {
        const _item = items.value.find(e => e.id === item.data?.id);
        console.log("onSelect---", _item?.data!);
        onChange!(project, _item?.data!);
    };

    return (
        <Observer selectedItem={selectedItem}>
            {() => (
                <Dropdown
                    ariaLabel={"Button Dropdown " + selectedItem.value.name + " selected"}
                    className="scale-dropdown"
                    placeholder={selectedItem.value.name}
                    items={items}
                    selection={selection}
                    showFilterBox={true}
                    minCalloutWidth={140}
                    renderExpandable={props => <DropdownExpandableButton style={{ width: 140 }} {...props} />}
                    onSelect={onSelect} />

            )}
        </Observer>
    );
};

const iterationFilterHubSelection = new DropdownSelection();
const iterationsOptions = new ObservableArray<IListBoxItem<any>>();
let iterationNames: TeamSettingsIteration[] = [];

export const IterationFilterHub: Filter = ({
    project,
    team,
    onChange
}) => {

    const selectedItem = new ObservableValue<TeamSettingsIteration | any>({});

    useEffect(() => {
        const fetchTeamIteration = async () => {
            if (team) {
                const { iterations, currentIteration } = await fetchIterationDefinition(team!)
                    .then(definition => {
                        return {
                            iterations: definition.iterations,
                            currentIteration: definition.currentIteration
                        }
                    });
                iterationNames = addShiftsToIterations(iterations, currentIteration);

                const itemsOptions: Array<IListBoxItem<string>> = iterationNames.map(it => ({ id: it.id, text: it.name, data: it.path } as IListBoxItem<string>));
                iterationsOptions.removeAll();
                iterationsOptions.push(...itemsOptions);
                
                const index = itemsOptions.findIndex(it => it.text === currentIteration)
                selectedItem.value = currentIteration;
                iterationFilterHubSelection.clear();
                iterationFilterHubSelection.select(index);
            }
        };

        fetchTeamIteration()
            .catch(console.error);
    }, [team, project]);

    const addShiftsToIterations = (iterations: TeamSettingsIteration[], currentIterationName?: string) => {
        const currentIteration = iterations.filter(it => it.name === currentIterationName).pop();
        if (currentIteration) {
            const i = iterations.indexOf(currentIteration)
            return iterations.map((e, j) => {
                return { ...e, path: String(j - i) };
            });
        }
        return iterations;
    }

    const onSelect = (event: React.SyntheticEvent<HTMLElement>, item: IListBoxItem<string>) => {
        const _item = iterationNames.find(e => e.id === item.id);
        console.log("onSelect [Iteration]: ", _item?.name);
        onChange!(project, _item!);
    };

    return (
        <Observer selectedItem={selectedItem}>
            {() => (
                <Dropdown<string>
                    ariaLabel={"Button Dropdown " + selectedItem.value?.name + " selected"}
                    className="scale-dropdown"
                    placeholder={selectedItem.value?.name}
                    items={iterationsOptions}
                    selection={iterationFilterHubSelection}
                    showFilterBox={true}
                    minCalloutWidth={140}
                    renderExpandable={props => <DropdownExpandableButton style={{ width: 140 }} {...props} />}
                    onSelect={onSelect} />
            )}
        </Observer>
    );
}
