import * as React from "react";
import "gantt-task-react/dist/index.css";
import { ViewMode } from "gantt-task-react";
import { Button } from "azure-devops-ui/Button";
import { Checkbox } from "azure-devops-ui/Checkbox";
import { Dropdown, DropdownExpandableButton } from "azure-devops-ui/Dropdown";
import { IListBoxItem } from "azure-devops-ui/ListBox";
import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { DropdownSelection } from "azure-devops-ui/Utilities/DropdownSelection";
import { Observer } from "azure-devops-ui/Observer";

const scaleOptions: Array<IListBoxItem<ViewMode>> = [
    { id: ViewMode.QuarterDay, text: ViewMode.QuarterDay, data: ViewMode.QuarterDay },
    { id: ViewMode.Day, text: ViewMode.Day, data: ViewMode.Day },
    { id: ViewMode.Week, text: ViewMode.Week, data: ViewMode.Week },
    { id: ViewMode.Month, text: ViewMode.Month, data: ViewMode.Month },
    { id: ViewMode.Year, text: ViewMode.Year, data: ViewMode.Year }
];

export interface ViewSwitcherProps {
    isChecked: boolean;
    viewMode: ViewMode;
    onViewListChange: (isChecked: boolean) => void;
    onViewModeChange: (viewMode: ViewMode) => void;
};

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({
    onViewModeChange,
    onViewListChange,
    isChecked,
    viewMode
}) => {

    const selectedItem = new ObservableValue<ViewMode>(viewMode);
    const selection = new DropdownSelection();

    const onSelect = (event: React.SyntheticEvent<HTMLElement>, item: IListBoxItem<ViewMode>) => {
        onViewModeChange(scaleOptions.find(e => e.data === item.data)?.data!);
    };

    const scaleUp = (view: ViewMode) => {
        const index = scaleOptions.map(e => e.data).indexOf(view);
        const newIndex = index + 1 >= scaleOptions.length ? scaleOptions.length - 1 : index + 1;
        console.log(newIndex);
        onViewModeChange(scaleOptions[newIndex].data!);
    };

    const scaleDown = (view: ViewMode) => {
        const index = scaleOptions.map(e => e.data).indexOf(view);
        const newIndex = index <= 0 ? 0 : index - 1;
        console.log(newIndex);
        onViewModeChange(scaleOptions[newIndex].data!);
    };


    return (
        <div className="ViewContainer">
            <Observer selectedItem={selectedItem}>
                {() => (
                    <div className="flex-row">
                        <Dropdown
                            ariaLabel={"Button Dropdown " + selectedItem.value + " selected"}
                            className="scale-dropdown"
                            placeholder={selectedItem.value}
                            items={scaleOptions}
                            selection={selection}
                            minCalloutWidth={140}
                            renderExpandable={props => <DropdownExpandableButton style={{width: 140}} {...props} />}
                            onSelect={onSelect} />
                        <div className="flex-wrap">
                            <Button
                                ariaLabel="Scale Up"
                                iconProps={{ iconName: "Add" }}
                                disabled={selectedItem.value === scaleOptions[scaleOptions.length - 1].data}
                                onClick={() => scaleUp(selectedItem.value)}
                            />
                            <Button
                                ariaLabel="Scale Down"
                                iconProps={{ iconName: "Remove" }}
                                disabled={selectedItem.value === scaleOptions[0].data}
                                onClick={() => scaleDown(selectedItem.value)}
                            />
                        </div>
                    </div>
                )}
            </Observer>

            <Checkbox
                onChange={() => onViewListChange(!isChecked)}
                checked={isChecked}
                label="Show Tree"
            />
        </div>
    );
};
