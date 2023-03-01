import * as React from "react";
import "gantt-task-react/dist/index.css";
import { ViewMode } from "gantt-task-react";
import { Button } from "azure-devops-ui/Button";
import { Checkbox } from "azure-devops-ui/Checkbox";

export interface ViewSwitcherProps {
    isChecked: boolean;
    onViewListChange: (isChecked: boolean) => void;
    onViewModeChange: (viewMode: ViewMode) => void;
};

export const ViewSwitcher = (props: ViewSwitcherProps) => {

    const { isChecked, onViewListChange, onViewModeChange } = props;

    return (
        <div className="ViewContainer">
            <Button onClick={() => onViewModeChange(ViewMode.Day)}>Day</Button>
            <Button onClick={() => onViewModeChange(ViewMode.Week)}>Week</Button>
            <Button onClick={() => onViewModeChange(ViewMode.Month)}>Month</Button>

            <Checkbox
                onChange={() => onViewListChange(!isChecked)}
                checked={isChecked}
                label="Show Task List"
            />
        </div>
    );
};
