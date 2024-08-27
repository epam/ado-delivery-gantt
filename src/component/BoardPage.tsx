import "./component.scss";

import * as React from 'react';
import { useState, useEffect } from 'react';

import { Card } from "azure-devops-ui/Card";
import { Dialog } from "azure-devops-ui/Dialog";
import { IReadonlyObservableValue, ObservableArray, ObservableValue } from "azure-devops-ui/Core/Observable";
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
import { Spinner, SpinnerSize } from "azure-devops-ui/Spinner";

import { ISimpleListCell } from "azure-devops-ui/List";
import { Icon, IconSize } from "azure-devops-ui/Icon";

import { VssPersona } from "azure-devops-ui/VssPersona";

import { ExtensionManagementUtil, GanttHubDocument } from "../service/helper";

export interface ITableItem extends ISimpleTableCell {
  id: string,
  name: ISimpleListCell,
  created_by: string;
  last_modified_by: string;
  description: string;
  last_modified: ISimpleListCell;
  created: ISimpleListCell;
}

const renderPlan = (className?: string) => (
  <Icon
    iconName="PlanView"
    size={IconSize.small}
  />
);

const renderDate = (className?: string) => (
  <Icon
    iconName="DateTime2"
    size={IconSize.small}
  />
);
const renderPersonaColumn = (
  rowIndex: number,
  columnIndex: number,
  tableColumn: ITableColumn<ITableItem>,
  tableItem: ITableItem
): JSX.Element => (
  <SimpleTableCell
    key={`col-${columnIndex}`}
    columnIndex={columnIndex}
    tableColumn={tableColumn}
    children={
      <VssPersona
        // identityDetailsProvider={tableItem.created_by}
        displayName={tableItem.created_by}
        size="small"
      />
    }
  />
)

const sortFunctions = [
  // Sort on Name column
  (left: ITableItem, right: ITableItem): number => left.name.text!.localeCompare(right.name.text!),

  // Sort on created_by column
  (left: ITableItem, right: ITableItem): number => left.created_by!.localeCompare(right.created_by!),

  // Sort on last_modified_by column
  (left: ITableItem, right: ITableItem): number => left.last_modified_by!.localeCompare(right.last_modified_by!),
];

export interface BoardPageProps {
  isChecked: boolean;
  items: GanttHubDocument[];
  onRowSelect: (data: ITableItem, isChecked: boolean) => void;
  onRowEdit: (editPanelItemId: GanttHubDocument) => void;
}

export const BoardPage: React.FC<BoardPageProps> = ({
  isChecked,
  items,
  onRowSelect,
  onRowEdit
}) => {

  const [itemToDelete, setItemToDelete] = useState<ITableItem>();
  const [tableData, setTableData] = useState<ITableItem[]>([]);
  const itemProvider = new ObservableArray<ITableItem | IReadonlyObservableValue<ITableItem | undefined>>(tableData);


  useEffect(() => {
    (() => {
      const data = items.map(it => ({
        id: it.id,
        name: { iconProps: { render: renderPlan }, text: it.name },
        created_by: it.createdBy,
        last_modified_by: it.lastModifiedBy,
        description: it.description,
        last_modified: { iconProps: { render: renderDate }, text: new Date( it.lastModifiedDate ).toISOString() },
        created: { iconProps: { render: renderDate }, text: new Date( it.createdDate ).toISOString() },
      } as ITableItem));

      itemProvider.splice(0, itemProvider.length, ...data);
      setTableData(data);
    })();
  }, [items])

  const onSize = (event: MouseEvent | KeyboardEvent, index: number, width: number) => {
    (columns[index].width as ObservableValue<number>).value = width;
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
      onSize,
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
      onSize,
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
      onSize,
      width: new ObservableValue(-30),
    },
    {
      id: "description",
      name: "description",
      readonly: true,
      renderCell: renderSimpleCell,
      onSize,
      width: new ObservableValue(-30),
    },
    {
      id: "last_modified",
      maxWidth: 300,
      name: "Last Modified",
      readonly: true,
      renderCell: renderSimpleCell,
      onSize,
      width: new ObservableValue(-30),
    },
    {
      id: "created",
      maxWidth: 300,
      name: "Created",
      readonly: true,
      renderCell: renderSimpleCell,
      onSize,
      width: new ObservableValue(-30),
    },
    new ColumnMore((item) => ({
      id: "sub-menu",
      items: [
        { id: "edit", text: "Edit", onActivate: () => openEditItem(item) },
        { id: "delete", text: "Delete", onActivate: () => { onDeleteItem(item) } },
      ],
    })),
  ];

  const openEditItem = (item: ITableItem) => {
    const selectedItem = items.find(it => it.id === item.id);
    selectedItem && onRowEdit(selectedItem);
  }

  const onDeleteItem = (item: ITableItem) => {
    setItemToDelete(item);
  }

  const onDelelete = async () => {
    const { id } = itemToDelete!;
    await ExtensionManagementUtil.deleteItem(id);//.handle(viod(), "Enable to delete item", true);

    const index = tableData.map(it => it.id).indexOf(id);
    tableData.splice(index, 1);
    itemProvider.splice(0, itemProvider.length, ...tableData);

    setItemToDelete(undefined);
  }

  const onDismiss = (): void => {
    setItemToDelete(undefined);
  }

  const sortingBehavior = new ColumnSorting<ITableItem>(
    (index: number, order: SortOrder, event: React.KeyboardEvent<HTMLElement> | React.MouseEvent<HTMLElement>) => {
      itemProvider.splice(
        0,
        itemProvider.length,
        ...sortItems<ITableItem>(
          index,
          order,
          sortFunctions,
          columns,
          tableData
        )
      )
    });

  return (
    <div className="page-content page-content-top flex-column rhythm-vertical-16">
      {
        tableData.length ? (<Card
          className="flex-grow bolt-table-card"
          contentProps={{ contentPadding: false, className: "gantt-card-content" }}
          titleProps={{ text: "Gantt Boards" }}
        >
          <Table<ITableItem>
            ariaLabel="Gantt Boards"
            behaviors={[sortingBehavior]}
            className="table-example"
            columns={columns}
            containerClassName="h-scroll-auto"
            itemProvider={(itemProvider)}
            showLines
            onSelect={(_event, data) => onRowSelect(data.data, isChecked)}
          />
          {itemToDelete && <Dialog
            titleProps={{ text: "Confirm" }}
            footerButtonProps={[
              {
                text: "Cancel",
                onClick: onDismiss
              },
              {
                text: "Delete",
                onClick: onDelelete,
                primary: true
              }
            ]}
            onDismiss={onDismiss}
          >
            Are you sure you want to delete the {itemToDelete.name.text} ?
          </Dialog>
          }
        </Card>)
          : (
            <div style={{ marginTop: 50 }}>
              <Spinner size={SpinnerSize.large} label="Loading..." />
            </div>
          )
      }
    </div>
  );
};

