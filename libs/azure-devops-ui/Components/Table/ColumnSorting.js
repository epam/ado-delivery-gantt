import { announce } from '../../Core/Util/Accessibility';
import { cellFromEvent } from '../../List';
import * as Resources from '../../Resources.Widgets';
import { KeyCode, setFocusVisible } from '../../Util';
import { SortOrder } from "./Table.Props";
/**
 * The ColumnSorting class is a behavior that can be used with the Table
 * component to provide column sorting. To use the ColumnSorting, create an
 * instance passing the sorting delegate to the constructor. Then supply
 * the created behavior to the table.
 */
var ColumnSorting = /** @class */ (function () {
    function ColumnSorting(onSort) {
        var _this = this;
        this.initialize = function (props, table, eventDispatch) {
            _this.props = props;
            _this.eventDispatch = eventDispatch;
            eventDispatch.addEventListener("click", _this.onClick);
            eventDispatch.addEventListener("keydown", _this.onKeyDown);
        };
        this.componentDidMount = function (props) {
            _this.props = props;
        };
        this.componentDidUpdate = function (props) {
            _this.props = props;
        };
        this.componentWillUnmount = function () {
            if (_this.eventDispatch) {
                _this.eventDispatch.removeEventListener("click", _this.onClick);
                _this.eventDispatch.removeEventListener("keydown", _this.onKeyDown);
            }
        };
        this.onClick = function (event) {
            if (!event.defaultPrevented) {
                _this.processSortEvent(event, true);
            }
        };
        this.onKeyDown = function (event) {
            if (!event.defaultPrevented) {
                if (event.which === KeyCode.enter || event.which === KeyCode.space) {
                    _this.processSortEvent(event);
                }
            }
        };
        this.onSort = onSort;
    }
    ColumnSorting.prototype.processSortEvent = function (event, click) {
        var _a, _b;
        var clickedCell = cellFromEvent(event);
        // Check if we clicked on an actionable area; walk up to see if we clicked within one
        var testHtmlElement = event.target;
        var actionableClick = click ? false : testHtmlElement.classList.contains("bolt-table-header-cell-actionable");
        if (testHtmlElement.classList.contains("bolt-table-header-sizer")) {
            var headerElement = testHtmlElement.closest(".bolt-table-header-cell-actionable");
            if (headerElement) {
                headerElement.focus();
                setFocusVisible(true);
            }
        }
        while (!actionableClick && testHtmlElement !== clickedCell.cellElement) {
            if (testHtmlElement.parentElement) {
                testHtmlElement = testHtmlElement.parentElement;
            }
            else {
                break;
            }
            actionableClick = testHtmlElement.classList.contains("bolt-table-header-cell-actionable");
        }
        if (clickedCell.rowIndex === -1 && actionableClick) {
            var column = this.props.columns[clickedCell.cellIndex];
            // If the column is currently sorted ascending then we need to invert the sort.
            if (column && column.sortProps) {
                this.onSort(clickedCell.cellIndex, column.sortProps.sortOrder === SortOrder.ascending ? SortOrder.descending : SortOrder.ascending, event);
                var sortOrderAnnounce = column.sortProps.sortOrder === SortOrder.ascending
                    ? (_a = column.sortProps.ariaLabelAscending) !== null && _a !== void 0 ? _a : Resources.ColumnSortedAscendingAnnouncement : (_b = column.sortProps.ariaLabelDescending) !== null && _b !== void 0 ? _b : Resources.ColumnSortedDescendingAnnouncement;
                announce(sortOrderAnnounce, true);
                event.preventDefault();
            }
        }
    };
    return ColumnSorting;
}());
export { ColumnSorting };
/**
 * sortItems is a helper method that works with the ColumnSorting and a Table
 * component to make it eaiser to maintain the props of the table. This function
 * will update the column definitions and return the sorted data. The caller
 * needs to update the props to the table appropriately after calling this
 * method.
 *
 * @param columnIndex The column that should be sorted.
 * @param sortOrder The order the data should be sorted.
 * @param sortFunctions An array of sort functions. Each sortable column should
 *  have a function supplied. If there are non-sortable columns, null should be
 *  supplied for their index.
 * @param columns The column definitions for the table.
 * @param items The array of items that should be sorted. Note: This is done in
 *  place so the input array will be updated.
 *
 * @return The resulting sorted array of items.
 */
export function sortItems(columnIndex, sortOrder, sortFunctions, columns, items) {
    var sortFunction = sortFunctions[columnIndex];
    // If we are sorting descending, invert the sorting function.
    if (sortFunction && sortOrder === SortOrder.descending) {
        sortFunction = function (item1, item2) {
            return -sortFunctions[columnIndex](item1, item2);
        };
    }
    // Update the sortOrder for each of the columns.
    for (var index = 0; index < columns.length; index++) {
        var column = columns[index];
        if (column.sortProps) {
            column.sortProps.sortOrder = index === columnIndex ? sortOrder : undefined;
        }
    }
    if (sortFunction) {
        return items.sort(sortFunction);
    }
    else {
        return items;
    }
}
