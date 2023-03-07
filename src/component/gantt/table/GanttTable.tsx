import * as React from "react";
import { useMemo } from "react";
import { Task } from 'gantt-task-react';
import { ProgressInterface } from "service/ProgressCalculationService";
import { toLocaleDateStringFactory } from "./common";

type GanttTableProps = {
  rowHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  locale: string;
  tasks: Task[];
  selectedTaskId: string;
  setSelectedTask: (taskId: string) => void;
  onExpanderClick: (task: Task) => void;
};

export type GanttTable = React.FC<GanttTableProps>;

export interface GanttTableBuilder {
  build: { (map: Map<string, ProgressInterface>): GanttTable }
}

const ganttTableBuilder: GanttTableBuilder = {
  build(map: Map<string, ProgressInterface>): GanttTable {
    return ({
      rowHeight,
      rowWidth,
      tasks,
      fontFamily,
      fontSize,
      locale,
      onExpanderClick,
    }) => {
      const toLocaleDateString = useMemo(
        () => toLocaleDateStringFactory(locale),
        [locale]
      );
      const _rowWidth = parseInt(rowWidth);

      return map && (
        <div
          className={"taskListWrapper"}
          style={{
            fontFamily: fontFamily,
            fontSize: fontSize
          }}
        >
          {tasks.map(t => {
            const status = map.get(t.id);

            let expanderSymbol = "";
            if (t.hideChildren === false) {
              expanderSymbol = "▼";
            } else if (t.hideChildren === true) {
              expanderSymbol = "▶";
            }

            return (
              <div
                className={"taskListTableRow"}
                style={{ height: rowHeight }}
                key={`${t.id}row`}
              >
                <div
                  className={"taskListCell"}
                  style={{
                    minWidth: isNaN(_rowWidth) ? rowWidth : 2 * _rowWidth,
                    maxWidth: isNaN(_rowWidth) ? rowWidth : 2 * _rowWidth,
                  }}
                  title={t.name}
                >
                  <div className={"taskListNameWrapper"}>
                    <div
                      className={
                        expanderSymbol
                          ? "taskListExpander"
                          : "taskListEmptyExpander"
                      }
                      onClick={() => onExpanderClick(t)}
                    >
                      {expanderSymbol}
                    </div>
                    <div>{t.name}</div>
                  </div>
                </div>
                <div
                  className={"ganttTable_HeaderSeparator"}
                  style={{
                    height: rowHeight * 0.5,
                    marginTop: rowHeight * 0.2,
                  }}
                />
                <div
                  className={"taskListCell"}
                  style={{
                    minWidth: isNaN(_rowWidth) ? rowWidth : 0.75 * _rowWidth,
                    maxWidth: isNaN(_rowWidth) ? rowWidth : 0.75 * _rowWidth,
                    textAlign: "center"
                  }}
                >
                  &nbsp;{status ? status.status?.name || "" : ""}
                </div>
                <div
                  className={"ganttTable_HeaderSeparator"}
                  style={{
                    height: rowHeight * 0.5,
                    marginTop: rowHeight * 0.2,
                  }}
                />
                <div
                  className={"taskListCell"}
                  style={{
                    minWidth: isNaN(_rowWidth) ? rowWidth : 0.75 * _rowWidth,
                    maxWidth: isNaN(_rowWidth) ? rowWidth : 0.75 * _rowWidth,
                    textAlign: "center"
                  }}
                >
                  &nbsp;{status ? `${t.progress} %` : ""}
                </div>
                <div
                  className={"ganttTable_HeaderSeparator"}
                  style={{
                    height: rowHeight * 0.5,
                    marginTop: rowHeight * 0.2,
                  }}
                />
                <div
                  className={"taskListCell"}
                  style={{
                    minWidth: isNaN(_rowWidth) ? rowWidth : 2 * _rowWidth,
                    maxWidth: isNaN(_rowWidth) ? rowWidth : 2 * _rowWidth,
                  }}
                >
                  &nbsp;{toLocaleDateString(t.start)} - {toLocaleDateString(t.end)}
                </div>
              </div>
            );
          })}
        </div>
      );
    };
  }
};

export {
  ganttTableBuilder,
}