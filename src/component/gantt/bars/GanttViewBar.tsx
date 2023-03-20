import * as React from "react";
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

export interface ViewBarProps {
  isChecked: boolean;
  isCheckedViewLinks: boolean,
  viewMode: ViewMode;
  isChartLoad: boolean;
  isShowFilterTab: boolean;
  onViewListChange: (isChecked: boolean) => void;
  onViewLinksChange: (isCheckedLinksView: boolean) => void;
  onViewModeChange: (viewMode: ViewMode) => void;
  onCurrentPosition: () => void;
  onFilterTabShow: () => void;
}

const selection = new DropdownSelection();

export const GanttViewBar: React.FC<ViewBarProps> = ({
  onViewModeChange,
  onViewListChange,
  onViewLinksChange,
  onCurrentPosition,
  onFilterTabShow,
  isChecked,
  isCheckedViewLinks,
  viewMode,
  isChartLoad,
  isShowFilterTab
}) => {

  const selectedItem = new ObservableValue<ViewMode>(viewMode);

  const onSelect = (event: React.SyntheticEvent<HTMLElement>, item: IListBoxItem<ViewMode>) => {
    onViewModeChange(scaleOptions.find(e => e.data === item.data)?.data!);
  };

  const scaleUp = (view: ViewMode) => {
    const index = scaleOptions.map(e => e.data).indexOf(view);
    const newIndex = index <= 0 ? 0 : index - 1;
    selection.select(newIndex);
    onViewModeChange(scaleOptions[newIndex].data!);
  };

  const scaleDown = (view: ViewMode) => {
    const index = scaleOptions.map(e => e.data).indexOf(view);
    const newIndex = index + 1 >= scaleOptions.length ? scaleOptions.length - 1 : index + 1;
    selection.select(newIndex);
    onViewModeChange(scaleOptions[newIndex].data!);
  };

  return (
    <div className="flex-row">
      <Observer selectedItem={selectedItem}>
        {({ selectedItem }) => (
          <div className="flex-row">
            <Dropdown
              ariaLabel={`Button Dropdown ${selectedItem} selected`}
              className="scale-dropdown"
              placeholder={selectedItem}
              items={scaleOptions}
              selection={selection}
              minCalloutWidth={140}
              renderExpandable={props => <DropdownExpandableButton style={{ width: 140 }} {...props} />}
              onSelect={onSelect} />
            <Button
              ariaLabel="Scale Up"
              iconProps={{ iconName: "Add" }}
              disabled={selectedItem === scaleOptions[0].data}
              onClick={() => scaleUp(selectedItem)}
            />
            <Button
              ariaLabel="Scale Down"
              iconProps={{ iconName: "Remove" }}
              disabled={selectedItem === scaleOptions[scaleOptions.length - 1].data}
              onClick={() => scaleDown(selectedItem)}
            />
            <Button
              ariaLabel="Today"
              text="Today"
              disabled={isChartLoad}
              onClick={onCurrentPosition}
            />
            <Button
              ariaLabel="Filter"
              iconProps={{ iconName: isShowFilterTab ? "FilterSolid" : "Filter" }}
              onClick={onFilterTabShow}
            />
          </div>

        )}
      </Observer>

      <Checkbox
        onChange={() => onViewListChange(!isChecked)}
        checked={isChecked}
        label="Show Tree"
      />
      <Checkbox
        onChange={() => onViewLinksChange(!isCheckedViewLinks)}
        checked={isCheckedViewLinks}
        label="Show Links"
      />
    </div>
  );
};
