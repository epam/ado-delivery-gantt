import * as React from "react";
import { useMemo } from "react";
import { Task } from 'gantt-task-react';
import { ProgressInterface } from "service/ProgressCalculationService";
import { toLocaleDateStringFactory } from "./common";

type StandardTooltipContentProps = {
  task: Task;
  fontSize: string;
  locale: string;
  fontFamily: string;
};

export type GanttTooltipContent = React.FC<StandardTooltipContentProps>;

export interface GanttTooltipContentBuilder {
  build: { (map: Map<string, ProgressInterface>): GanttTooltipContent }
}

export const ganttTooltipContentBuilder: GanttTooltipContentBuilder = {
  build(map: Map<string, ProgressInterface>): GanttTooltipContent {
    return ({
      task,
      fontSize,
      locale,
      fontFamily
    }) => {
      const toLocaleDateString = useMemo(
        () => toLocaleDateStringFactory(locale),
        [locale]
      );
      const context = map.get(task.id);
      const taskId = task.id.split("_").pop();

      return (
                <div className="tooltipDefaultContainer" style={{ fontSize, fontFamily }}>
                    <span style={{ fontSize }}>{context ? taskId || "" : ""} {task.name}</span>
                    <b>&nbsp;{context ? `${toLocaleDateString(task.start)} - ${toLocaleDateString(task.end)}` : ""}</b>
                    <span>&nbsp;{context ? context.state || "" : ""}</span>
                    <b style={{ fontSize }}>&nbsp;{context ? `${task.progress} %` : ""}</b>
                </div>
      );
    }
  }
};
