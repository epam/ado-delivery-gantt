import {
    Gantt,
    Task,
    EventOption,
    StylingOption,
    ViewMode,
    DisplayOption
  } from "gantt-task-react";
import React = require("gantt-task-react");
import "gantt-task-react/dist/index.css";
  
  let tasks: Task[] = [
    {
      start: new Date(2020, 1, 1, 7, 0, 0),
      end: new Date(2020, 1, 1, 10, 30, 0),
      name: "Idea",
      id: "Task 0",
      type: "task",
      progress: 0,
      isDisabled: false,
      styles: { progressColor: "#ffbb54", progressSelectedColor: "#ff9e0d" }
    }
  ];
  
  const GanttChart = () => {
    return <Gantt tasks={tasks} viewMode={ViewMode.Day} />;
  };
  
  export default GanttChart;