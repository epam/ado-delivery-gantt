import * as React from "react";
import "gantt-task-react/dist/index.css";
import { ViewMode } from "gantt-task-react";
import { Button } from "azure-devops-ui/Button";
type ViewSwitcherProps = {
    isChecked: boolean;
    onViewListChange: (isChecked: boolean) => void;
    onViewModeChange: (viewMode: ViewMode) => void;
};
export const ViewSwitcher = (props: ViewSwitcherProps) => {
    return (
        <div className="ViewContainer">
            <Button onClick={() => props.onViewModeChange(ViewMode.Day)}>Day</Button>
            <Button onClick={() => props.onViewModeChange(ViewMode.Week)}>Week</Button>
            <Button onClick={() => props.onViewModeChange(ViewMode.Month)}>Month</Button>
        </div>
    );
};
