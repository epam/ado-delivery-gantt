import * as React from "react";

export const GanttHeader: React.FC<{
  headerHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
}> = ({ headerHeight, fontFamily, fontSize, rowWidth }) => {
  const _rowWidth = parseInt(rowWidth);
  
  return (
    <div
      className="ganttTable"
      style={{
        fontFamily,
        fontSize,
        textAlign: "center"
      }}
    >
      <div
        className="ganttTable_Header"
        style={{
          height: headerHeight - 2,
        }}
      >
        <div
          className="ganttTable_HeaderItem"
          style={{
            minWidth: isNaN(_rowWidth) ? rowWidth : 2 * _rowWidth,
          }}
        >
          &nbsp;Name
        </div>
        <div
          className="ganttTable_HeaderSeparator"
          style={{
            height: headerHeight * 0.5,
            marginTop: headerHeight * 0.2,
          }}
        />
        <div
          className="ganttTable_HeaderItem"
          style={{
            minWidth: isNaN(_rowWidth) ? rowWidth : 1 * _rowWidth,
          }}
        >
          &nbsp;Status
        </div>
        <div
          className="ganttTable_HeaderSeparator"
          style={{
            height: headerHeight * 0.5,
            marginTop: headerHeight * 0.25,
          }}
        />
        <div
          className="ganttTable_HeaderItem"
          style={{
            minWidth: isNaN(_rowWidth) ? rowWidth : 0.75 * _rowWidth,
          }}
        >
          &nbsp;Progress
        </div>
        <div
          className="ganttTable_HeaderSeparator"
          style={{
            height: headerHeight * 0.5,
            marginTop: headerHeight * 0.25,
          }}
        />
        <div
          className="ganttTable_HeaderItem"
          style={{
            minWidth: isNaN(_rowWidth) ? rowWidth : 2 * _rowWidth,
          }}
        >
          &nbsp;Period
        </div>
      </div>
    </div>
  );
};