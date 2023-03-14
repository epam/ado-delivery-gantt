import * as React from "react";
import { useMemo } from "react";
import { Task } from 'gantt-task-react';
import { Status, Statuses, StatusSize } from "azure-devops-ui/Status";
import { ItemStatus, ProgressInterface } from "../../../service/ProgressCalculationService";
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

      function StatusCircle({status}: {status: ItemStatus}) {
        const statusPropsArray = [
          { statusValue: ItemStatus.DONE, statusProps: { ...Statuses.Success } },
          { statusValue: ItemStatus.NOT_STARTED, statusProps: { ...Statuses.Queued } },
          { statusValue: ItemStatus.ON_TRACK, statusProps: { ...Statuses.Running } },
          { statusValue: ItemStatus.AT_RISK, statusProps: { ...Statuses.Warning } },
          { statusValue: ItemStatus.OFF_TRACK, statusProps: { ...Statuses.Failed } },
        ];

        const { statusProps } = statusPropsArray.find(
          (statusObj) => statusObj.statusValue === status
        ) || { statusProps: { ...Statuses.Waiting } };

        return (
          <Status
            {...statusProps}
            size={StatusSize.s}
            className="status flex-self-center"
          />
        );
      }

      const getStatusCircle = (progress: ProgressInterface) => progress.status ? <StatusCircle status={progress.status.name} /> : "";

      return map && (
        <div
          className="taskListWrapper"
          style={{
            fontFamily,
            fontSize
          }}
        >
          {tasks.map(t => {
            const status = map.get(t.id);

            let expanderSymbol = "";
            if(!t.dependencies?.find(dependency => dependency === "add-expanderSymbol")){
              expanderSymbol = t.hideChildren ? "▶" : "▼";
            }

            return (
              <div
                className="taskListTableRow"
                style={{ height: rowHeight }}
                key={`${t.id}row`}
              >
                <div
                  className="taskListCell"
                  style={{
                    minWidth: isNaN(_rowWidth) ? rowWidth : 2 * _rowWidth,
                    maxWidth: isNaN(_rowWidth) ? rowWidth : 2 * _rowWidth,
                  }}
                  title={t.name}
                >
                  <div className="taskListNameWrapper">
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
                  className="ganttTable_HeaderSeparator"
                  style={{
                    height: rowHeight * 0.5,
                    marginTop: rowHeight * 0.2,
                  }}
                />
                <div
                  className="taskListCell"
                  style={{
                    minWidth: isNaN(_rowWidth) ? rowWidth : 1 * _rowWidth,
                    maxWidth: isNaN(_rowWidth) ? rowWidth : 1 * _rowWidth,
                    textAlign: "center"
                  }}
                >
                  &nbsp;
                  {status ? getStatusCircle(status) : ""}
                  &nbsp;
                  {status ? status.status?.name || "" : ""}
                  &nbsp;
                </div>
                <div
                  className="ganttTable_HeaderSeparator"
                  style={{
                    height: rowHeight * 0.5,
                    marginTop: rowHeight * 0.2,
                  }}
                />
                <div
                  className="taskListCell"
                  style={{
                    minWidth: isNaN(_rowWidth) ? rowWidth : 0.75 * _rowWidth,
                    maxWidth: isNaN(_rowWidth) ? rowWidth : 0.75 * _rowWidth,
                    textAlign: "center"
                  }}
                >
                  &nbsp;{status ? `${t.progress} %` : ""}
                </div>
                <div
                  className="ganttTable_HeaderSeparator"
                  style={{
                    height: rowHeight * 0.5,
                    marginTop: rowHeight * 0.2,
                  }}
                />
                <div
                  className="taskListCell"
                  style={{
                    minWidth: isNaN(_rowWidth) ? rowWidth : 2 * _rowWidth,
                    maxWidth: isNaN(_rowWidth) ? rowWidth : 2 * _rowWidth,
                    textAlign: "center"
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