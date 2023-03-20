import "./component.scss";

import * as React from 'react';

import { Card } from "azure-devops-ui/Card";
import { ObservableValue } from "azure-devops-ui/Core/Observable";
import { Observer } from "azure-devops-ui/Observer";
import {
  ITableColumn,
  Table,
  renderSimpleCell,
  ColumnSorting,
  SortOrder,
  sortItems,
  ISimpleTableCell,
  ColumnMore,
  SimpleTableCell,
} from "azure-devops-ui/Table";

import { ArrayItemProvider } from "azure-devops-ui/Utilities/Provider";

import { ISimpleListCell } from "azure-devops-ui/List";
import { Status, Statuses, StatusSize } from "azure-devops-ui/Status";
import { css } from "azure-devops-ui/Util";
import { Icon, IconSize } from "azure-devops-ui/Icon";

import { VssPersona } from "azure-devops-ui/VssPersona";

import { GanttHubDocument } from "../service/helper";

export interface ITableItem extends ISimpleTableCell {
  id: string,
  name: ISimpleListCell,
  created_by: string;
  last_modified_by: string;
  description: string;
  last_modified: ISimpleListCell;
  created: ISimpleListCell;
}

const renderStatus = (className?: string) => {
  return (
    <Status
      {...Statuses.Success}
      ariaLabel="Success"
      className={css(className, "bolt-table-status-icon")}
      size={StatusSize.s}
    />
  );
};

const renderPlan = (className?: string) => {
  return (
    <Icon
      iconName="PlanView"
      size={IconSize.small}
    />
  );
};

const renderDate = (className?: string) => {
  return (
    <Icon
      iconName="DateTime2"
      size={IconSize.small}
    />
  );
};
const renderPersonaColumn = (
  rowIndex: number,
  columnIndex: number,
  tableColumn: ITableColumn<ITableItem>,
  tableItem: ITableItem
): JSX.Element => {
  return (
    <SimpleTableCell
      key={"col-" + columnIndex}
      columnIndex={columnIndex}
      tableColumn={tableColumn}
      children={
        <VssPersona
          // identityDetailsProvider={tableItem.created_by}
          displayName={tableItem.created_by}
          size={"small"}
        />
      }
    />
  );
}

const columns: ITableColumn<ITableItem>[] = [
  {
    id: "name",
    name: "Name",
    readonly: true,
    renderCell: renderSimpleCell,
    sortProps: {
      ariaLabelAscending: "Sorted A to Z",
      ariaLabelDescending: "Sorted Z to A",
    },
    width: new ObservableValue(-30),
  },
  {
    id: "created_by",
    name: "Created by",
    readonly: true,
    renderCell: renderPersonaColumn,
    sortProps: {
      ariaLabelAscending: "Sorted A to Z",
      ariaLabelDescending: "Sorted Z to A",
    },
    width: new ObservableValue(-30),
  },
  {
    id: "last_modified_by",
    name: "Last Modified by",
    readonly: true,
    renderCell: renderPersonaColumn,
    sortProps: {
      ariaLabelAscending: "Sorted A to Z",
      ariaLabelDescending: "Sorted Z to A",
    },
    width: new ObservableValue(-30),
  },
  {
    id: "description",
    name: "description",
    readonly: true,
    renderCell: renderSimpleCell,
    width: new ObservableValue(-30),
  },
  {
    id: "last_modified",
    maxWidth: 300,
    name: "Last Modified",
    readonly: true,
    renderCell: renderSimpleCell,
    width: new ObservableValue(-30),
  },
  {
    id: "created",
    maxWidth: 300,
    name: "Created",
    readonly: true,
    renderCell: renderSimpleCell,
    width: new ObservableValue(-30),
  },
  new ColumnMore(() => {
    return {
      id: "sub-menu",
      items: [
        { id: "edit", text: "edit" },
        { id: "delete", text: "delete" },
      ],
    };
  }),
];

const sortFunctions = [
  // Sort on Name column
  (item1: ITableItem, item2: ITableItem): number => {
    return item1.name.text!.localeCompare(item2.name.text!);
  },

  // Sort on created_by column
  (item1: ITableItem, item2: ITableItem): number => {
    return item1.created_by!.localeCompare(item2.created_by!);
  },

  // Sort on last_modified_by column
  (item1: ITableItem, item2: ITableItem): number => {
    return item1.last_modified_by!.localeCompare(item2.last_modified_by!);
  },
  null,
];

export interface BoardPageProps {
  isChecked: boolean;
  items: GanttHubDocument[];
  onRowSelect: (data: ITableItem, isChecked: boolean) => void;
}

export const BoardPage: React.FC<BoardPageProps> = ({
  isChecked,
  items,
  onRowSelect
}) => {
  const tableData = items.map(it => ({
    id: it.id,
    name: { iconProps: { render: renderPlan }, text: it.name },
    created_by: it.createdBy,
    last_modified_by: it.lastModifiedBy,
    description: it.description,
    last_modified: { iconProps: { render: renderDate }, text: it.lastModifiedDate.toISOString() },
    created: { iconProps: { render: renderDate }, text: it.createdDate.toISOString() },
  } as ITableItem));
  const itemProvider = new ObservableValue<ArrayItemProvider<ITableItem>>(
    new ArrayItemProvider(tableData)
  );

  const sortingBehavior = new ColumnSorting<ITableItem>((columnIndex: number, proposedSortOrder: SortOrder) => {
    itemProvider.value =
      new ArrayItemProvider(
        sortItems(
          columnIndex,
          proposedSortOrder,
          sortFunctions,
          columns,
          tableData
        )
      );
  });

  return (
    <div className="page-content page-content-top flex-column rhythm-vertical-16">
      <Card
        className="flex-grow bolt-table-card"
        contentProps={{ contentPadding: false }}
        titleProps={{ text: "Gantt Boards" }}
      >
        <Observer
          itemProvider={itemProvider}
          sortingBehavior={sortingBehavior}>
          {
            (observableProps: { itemProvider: ArrayItemProvider<ITableItem>, sortingBehavior: ColumnSorting<ITableItem> }) => (
              <Table<ITableItem>
                ariaLabel="Gantt Boards"
                behaviors={[observableProps.sortingBehavior]}
                className="table-example"
                columns={columns}
                containerClassName="h-scroll-auto"
                itemProvider={observableProps.itemProvider}
                showLines={true}
                onSelect={(_event, data) => onRowSelect(data.data, isChecked)}
              // onActivate={(_event, row) => console.log("Activated Row - " + row.index)}
              />
            )}
        </Observer>
      </Card>
    </div>
  );
};

