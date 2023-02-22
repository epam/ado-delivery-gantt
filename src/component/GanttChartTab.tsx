import { Gantt, Task, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import * as React from "react";
import { initTasks } from "./helpers";
import { useState } from "react";
import { ViewSwitcher } from "./ViewSwitcher";


export const GanttChartTab = () => {
    const [tasks, setTasks] = useState<Task[]>(initTasks());
    const [view, setView] = useState<ViewMode>(ViewMode.Week);
    const [isChecked, setIsChecked] = useState(true);

    let columnWidth = 60;
    if (view === ViewMode.Month) {
        columnWidth = 300;
    } else if (view === ViewMode.Week) {
        columnWidth = 250;
    }

    const handleExpanderClick = (task: Task): void => {
        setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
        console.log("On expander click Id:" + task.id);
    };

    const handleSelectClick = (task: Task, isSelected: boolean): void => {
        console.log("clicked on task with id " + task.id)
    };

    return (
        <div>
            <ViewSwitcher
                onViewModeChange={(viewMode: ViewMode) => setView(viewMode)}
                onViewListChange={setIsChecked}
                isChecked={isChecked}
            />
            <Gantt tasks={tasks}
                view={view}
                columnWidth = {columnWidth}
                listCellWidth={isChecked ? "155px" : ""}
                onExpanderClick={handleExpanderClick}
                onSelect={handleSelectClick} />
        </div>
    );
}