import "./component.scss";
import * as React from "react";

import { GanttChartTab } from "./gantt";

export const LayoutTab = () => {
    return (
        <div className="page-content page-content-top flex-column rhythm-vertical-16">
            <GanttChartTab />
        </div>
    );
}