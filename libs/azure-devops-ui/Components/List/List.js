import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./List.css";
import "./ListDropIndicator.css";
import * as React from "react";
import * as Utils_Accessibility from '../../Core/Util/Accessibility';
import { ObservableArray, ObservableLike } from '../../Core/Observable';
import { format } from '../../Core/Util/String';
import { FocusWithin } from '../../FocusWithin';
import { FocusZone, FocusZoneContext, FocusZoneDirection } from '../../FocusZone';
import { Icon } from '../../Icon';
import { Intersection, IntersectionContext } from '../../Intersection';
import { getDefaultLinkProps, Link } from '../../Link';
import { Observer, UncheckedObserver } from '../../Observer';
import * as Resources from '../../Resources.Widgets';
import { Tooltip } from '../../TooltipEx';
import { css, eventTargetContainsNode, getSafeId, KeyCode } from '../../Util';
import { EventDispatch } from '../../Utilities/Dispatch';
import { getDragInProgress } from '../../Utilities/DragDrop';
import { getTabIndex } from '../../Utilities/Focus';
/**
 * The List component is used to render a collection of items with a series of rows.
 */
var List = /** @class */ (function (_super) {
    __extends(List, _super);
    function List(props) {
        var _this = _super.call(this, props) || this;
        // Track the table element used to render the rows.
        _this.bodyElement = React.createRef();
        _this.listElement = React.createRef();
        // Manage data about pages, including their spacers.
        _this.spacerElements = {};
        _this.scrollToIndex = -1;
        _this.scrollToOptions = undefined;
        // Focus/Selection management members.
        _this.selectOnFocus = true;
        _this.focusIndex = -1;
        _this.pivotIndex = -1;
        _this.onVirtualizeKeyDown = function (e) {
            if (_this.state.virtualize && e.ctrlKey && e.altKey && e.key === "v") {
                var rowCount = _this.props.itemProvider.length;
                _this.setState({ virtualize: false, lastMaterialized: rowCount - 1, lastRendered: rowCount - 1, firstMaterialized: 0, firstRendered: 0 });
                Utils_Accessibility.announce(Resources.VirtualizationDisabled);
            }
        };
        _this.onBlur = function () {
            _this.focusIndex = -1;
        };
        _this.onClick = function (event) {
            _this.onDispatch(event);
            if (!event.defaultPrevented && !(event.altKey && _this.props.selectableText)) {
                if (_this.listElement.current) {
                    var _a = cellFromEvent(event), cellElement = _a.cellElement, rowIndex = _a.rowIndex;
                    if (!cellElement || !eventTargetContainsNode(event, ["A"], cellElement)) {
                        var item = ObservableLike.getValue(_this.state.rows[rowIndex]);
                        if (rowIndex >= 0 && item) {
                            var listRow = { data: item, index: rowIndex };
                            // Even for singleClickActivation we fire the selection before activation.
                            if (_this.props.selectRowOnClick) {
                                _this.processSelectionEvent(event, listRow);
                            }
                            // For singleClickActivation we want the activation as well.
                            if (_this.props.singleClickActivation) {
                                _this.rowActivated(event, listRow);
                            }
                        }
                    }
                }
            }
        };
        _this.onDispatch = function (event) {
            _this.state.eventDispatch.dispatchEvent(event);
        };
        _this.onDoubleClick = function (event) {
            _this.onDispatch(event);
            if (!event.defaultPrevented && !_this.props.singleClickActivation) {
                var rowIndex = cellFromEvent(event).rowIndex;
                var item = ObservableLike.getValue(_this.state.rows[rowIndex]);
                if (rowIndex >= 0 && item) {
                    _this.rowActivated(event, { data: item, index: rowIndex });
                }
            }
        };
        _this.onFocusBody = function (event) {
            // The first time the list gets focus we need to select initial row if we are performing
            // selection of focus.
            if (_this.selectOnFocus) {
                var selection = _this.props.selection;
                if (!selection || selection.selectOnFocus) {
                    var rowIndex = _this.focusIndex;
                    if (rowIndex >= 0) {
                        var item = ObservableLike.getValue(_this.state.rows[rowIndex]);
                        if (item) {
                            _this.processSelectionEvent(event, { data: item, index: rowIndex });
                        }
                    }
                }
                _this.selectOnFocus = false;
            }
        };
        _this.onFocusItem = function (rowIndex, event) {
            var focusIndex = _this.focusIndex;
            if (focusIndex !== rowIndex) {
                // We need to re-render the previously focused row and newly focused row so we will
                // clear the cached values.
                if (focusIndex >= 0) {
                    delete _this.state.renderedRows[focusIndex];
                }
                else {
                    // If there was a tabble row that was not the focusIndex row we need to update this
                    // row as well to get it re-rendered without the tabIndex.
                    delete _this.state.renderedRows[_this.getInitialTabbableRow()];
                }
                delete _this.state.renderedRows[rowIndex];
                _this.focusIndex = rowIndex;
                var item = ObservableLike.getValue(_this.state.rows[rowIndex]);
                if (item) {
                    _this.rowFocused(event, { data: item, index: rowIndex });
                }
            }
        };
        _this.onKeyDown = function (event) {
            _this.onDispatch(event);
            if (!event.defaultPrevented) {
                var nodeName = event.target.nodeName;
                if (nodeName === "INPUT" || nodeName === "TEXTAREA") {
                    // Don't handle keyboard events when target is an input
                    return;
                }
                var focusIndex_1 = _this.focusIndex;
                var item = ObservableLike.getValue(_this.state.rows[focusIndex_1]);
                if (item) {
                    if (event.which === KeyCode.enter) {
                        if (focusIndex_1 >= 0 && !eventTargetContainsNode(event, ["A"])) {
                            _this.rowActivated(event, { data: item, index: focusIndex_1 });
                        }
                    }
                    else if (event.which === KeyCode.space) {
                        _this.processSelectionEvent(event, { data: item, index: focusIndex_1 });
                        event.preventDefault();
                    }
                    else if (event.which === KeyCode.upArrow || event.which === KeyCode.downArrow) {
                        var selection = _this.props.selection;
                        if (!selection || (selection.selectOnFocus && (event.shiftKey || !event.ctrlKey))) {
                            event.persist();
                            // Need to wait for the keyboard event to be processed by the focuszone.
                            window.setTimeout(function () {
                                if (_this.focusIndex != focusIndex_1) {
                                    var data = ObservableLike.getValue(_this.state.rows[_this.focusIndex]);
                                    if (data) {
                                        _this.processSelectionEvent(event, { data: data, index: _this.focusIndex });
                                    }
                                }
                            }, 0);
                        }
                    }
                    else if (event.which === KeyCode.pageDown) {
                        var stats = _this.getStats();
                        _this.focusRow(Math.min(focusIndex_1 + (stats.lastRendered - stats.firstRendered), _this.state.rowCount - 1), 1);
                        event.preventDefault();
                    }
                    else if (event.which === KeyCode.pageUp) {
                        var stats = _this.getStats();
                        _this.focusRow(Math.max(focusIndex_1 - (stats.lastRendered - stats.firstRendered), 0), -1);
                        event.preventDefault();
                    }
                    else if (event.which === KeyCode.home) {
                        _this.focusRow(0, 1);
                        event.preventDefault();
                    }
                    else if (event.which === KeyCode.end) {
                        _this.focusRow(_this.state.rowCount - 1, -1);
                        event.preventDefault();
                    }
                }
            }
        };
        _this.onIntersect = function (entries) {
            // If virtualization is disabled, we will not attempt to adjust the viewport.
            if (!_this.state.virtualize) {
                return;
            }
            var scrollTop = _this.context.root.scrollTop;
            var _a = _this.state, firstRendered = _a.firstRendered, firstMaterialized = _a.firstMaterialized, lastRendered = _a.lastRendered, lastMaterialized = _a.lastMaterialized, rowCount = _a.rowCount, rowProportion = _a.rowProportion;
            var rowHeight = _this.state.rowHeight;
            // console.log({ phase: "onIntersect - Start", firstMaterialized, lastMaterialized, rowHeight });
            // Don't process an intersection while scroll event is pending.
            if (scrollTop !== _this.state.scrollTop && entries.length) {
                // console.log("Don't process an intersection while scroll event is pending.");
                return;
            }
            // Ignore events if we dont have a our basic elements resolved (this should never happen).
            if (!_this.listElement.current || !_this.bodyElement.current) {
                // console.log("Elements not available at this point.");
                return;
            }
            // We are going to enumerate all the children, if the row is in the viewport
            // we will determine if it should be paged out.
            var rowElements = _this.bodyElement.current.children;
            // If a rowHeight was specified we will compute one based on the average rowHeight in the
            // first page rendered.
            if (rowHeight === 0) {
                if (rowElements.length > 0) {
                    var totalHeight = 0;
                    var childCount = 0;
                    // Loop through all children and average the rowHeight's.
                    for (var childIndex = 0; childIndex < rowElements.length; childIndex++) {
                        var childHeight = _this.bodyElement.current.children[childIndex].getBoundingClientRect().height;
                        if (childHeight > 0) {
                            totalHeight += childHeight;
                            childCount++;
                        }
                    }
                    // Make sure we have at least one child row that has size.
                    if (childCount > 0) {
                        rowHeight = totalHeight / childCount;
                    }
                }
                if (rowHeight === 0) {
                    return;
                }
                // If we have a pending scrollIntoView we will schedule it now that we have the rowHeight
                if (_this.scrollToIndex !== -1) {
                    _this.setState({
                        firstMaterialized: Math.max(0, _this.scrollToIndex - _this.state.pageSize),
                        lastMaterialized: _this.scrollToIndex + Math.min(_this.props.initialPageCount * _this.state.pageSize, rowCount - 1),
                        rowHeight: rowHeight
                    });
                    return;
                }
                // console.log({ phase: "onIntersect - Compute RowHeight", rowHeight });
            }
            // Determine the location of the intersection within the page. This is the element
            // we are scrolling within.
            var intersectionRect = _this.context.root.getBoundingClientRect();
            // Track the first and last row elements for adjusting the range.
            var firstMaterializedElement;
            var lastMaterializedElement;
            var firstMaterializedUpdated = firstMaterialized;
            var lastMaterializedUpdated = lastMaterialized;
            var firstRenderedUpdated = lastMaterializedUpdated;
            var lastRenderedUpdated = firstMaterializedUpdated;
            // Go through the viewport pages and determine if any are out of range and should be
            // paged out. Range is defined as more than 1 page of estimated rows away from the
            // nearest edge. If you dont allow for 1 page of estimated rows it may thrash pages
            // in and out of materialization.
            for (var childIndex = 0; childIndex < rowElements.length; childIndex++) {
                // Determine if this child is in the viewport, ignore rows that are not.
                var rowElement = rowElements[childIndex];
                var rowIndex = getAttributeAsNumber(rowElement, "data-row-index");
                var rowRect = rowElement.getBoundingClientRect();
                if (rowIndex >= firstMaterialized && rowIndex <= lastMaterialized) {
                    // Make sure to leave some extra room above and below the visible rectangle to handle
                    // variable height rows. This helps prevent jittering when paging rows out.
                    if (rowRect.bottom < intersectionRect.top - _this.state.pageSize * (rowProportion * rowHeight)) {
                        firstMaterializedUpdated++;
                    }
                    else if (rowRect.top > intersectionRect.bottom + _this.state.pageSize * (rowProportion * rowHeight)) {
                        lastMaterializedUpdated--;
                    }
                    // We will save the first and last rows for later computations.
                    if (rowIndex === firstMaterialized) {
                        firstMaterializedElement = rowElement;
                    }
                    if (rowIndex === lastMaterialized) {
                        lastMaterializedElement = rowElement;
                    }
                }
                // If the row is within the intersection rect, update the first and last rendered rows. These might be the focused items
                if (rowIndex > -1 && rowRect.top < intersectionRect.bottom && rowRect.bottom > intersectionRect.top) {
                    lastRenderedUpdated = Math.max(lastRenderedUpdated, rowIndex);
                    firstRenderedUpdated = Math.min(firstRenderedUpdated, rowIndex);
                }
            }
            // When we are scaling the size of the list, we want to keep a pageSize worth of elements materiaized but not rendered.
            // This allows users to scroll a few items. If they quickly scroll past the last materialized element or drag the scroll wheel, we recalculate where we should be
            // instead of paging in rows.
            if (rowProportion < 1) {
                if (firstMaterializedUpdated > lastMaterializedUpdated ||
                    firstRenderedUpdated === firstMaterializedUpdated ||
                    lastRenderedUpdated === lastMaterializedUpdated) {
                    if (lastRenderedUpdated >= rowCount - 1) {
                        firstMaterializedUpdated = Math.ceil(lastMaterializedUpdated - (intersectionRect.height / rowHeight + _this.state.pageSize));
                    }
                    else {
                        var offsetTop = scrollTop - (_this.listElement.current.offsetTop - _this.context.root.offsetTop);
                        firstMaterializedUpdated = Math.max(0, Math.min(rowCount - 1, Math.floor(offsetTop / (rowProportion * rowHeight))) - _this.state.pageSize);
                        lastMaterializedUpdated = Math.min(rowCount - 1, firstMaterializedUpdated + Math.ceil(intersectionRect.height / (rowProportion * rowHeight) + _this.state.pageSize - 1));
                        lastRenderedUpdated = -1;
                        firstRenderedUpdated = -1;
                    }
                }
                else {
                    firstMaterializedUpdated = Math.min(firstMaterializedUpdated, firstRenderedUpdated - _this.state.pageSize);
                    //-1 helps to avoid jittering when paging rows out
                    lastMaterializedUpdated = Math.max(lastMaterializedUpdated, lastRenderedUpdated + _this.state.pageSize - 1);
                    lastRenderedUpdated = -1;
                    firstRenderedUpdated = -1;
                }
            }
            // If the row range is inverted (top above bottom) then all rows have been hidden and we should
            // recompute the viewport based on the scrollTop of our intersection and intersection height.
            else if (firstMaterializedUpdated > lastMaterializedUpdated) {
                var offsetTop = scrollTop - (_this.listElement.current.offsetTop - _this.context.root.offsetTop);
                firstMaterializedUpdated = Math.max(0, Math.min(rowCount - 1, Math.floor(offsetTop / rowHeight)) - _this.state.pageSize);
                lastMaterializedUpdated = Math.min(rowCount - 1, firstMaterializedUpdated + Math.ceil(intersectionRect.height / rowHeight + _this.state.pageSize - 1));
                lastRenderedUpdated = -1;
                firstRenderedUpdated = -1;
            }
            else {
                // If the firstPage didn't move down, we may need more pages above.
                if (firstMaterializedUpdated === firstMaterialized && firstMaterializedElement) {
                    var rowRect = firstMaterializedElement.getBoundingClientRect();
                    var availableSpace = rowRect.top - intersectionRect.top;
                    if (availableSpace > 0) {
                        firstMaterializedUpdated -= Math.ceil(availableSpace / rowHeight);
                    }
                }
                // If the lastPage didn't move up, we may need more pages below.
                if (lastMaterializedUpdated === lastMaterialized && lastMaterializedElement) {
                    var rowRect = lastMaterializedElement.getBoundingClientRect();
                    var availableSpace = intersectionRect.bottom - rowRect.bottom;
                    if (availableSpace > 0) {
                        lastMaterializedUpdated += Math.ceil(availableSpace / rowHeight);
                    }
                }
            }
            // Make sure our page boundary stays in the available page range.
            firstMaterializedUpdated = Math.max(firstMaterializedUpdated, 0);
            lastMaterializedUpdated = Math.min(lastMaterializedUpdated, rowCount - 1);
            // console.log({ phase: "onIntersect - End", firstMaterializedUpdated, lastMaterializedUpdated, rowHeight });
            // Update our state if and only if something has changed.
            if (firstMaterializedUpdated !== firstMaterialized ||
                firstRenderedUpdated !== firstRendered ||
                lastMaterializedUpdated !== lastMaterialized ||
                lastRenderedUpdated !== lastRendered ||
                rowHeight !== _this.state.rowHeight ||
                scrollTop !== _this.state.scrollTop) {
                //
                // @TODO: We need to unload data for pages that are no longer rendererd.
                // This means not in the viewport or within any other rendered range.
                //
                // console.log({ phase: "onIntersect - stateChange", firstMaterializedUpdated, firstRenderedUpdated, lastRenderedUpdated, lastMaterializedUpdated, scrollTop });
                _this.setState({
                    firstMaterialized: firstMaterializedUpdated,
                    firstRendered: firstRenderedUpdated,
                    lastMaterialized: lastMaterializedUpdated,
                    lastRendered: lastRenderedUpdated,
                    rowHeight: rowHeight,
                    scrollTop: scrollTop
                });
            }
        };
        _this.onPointerDownBody = function (event) {
            // If the table body gets a mousedown, we will never need to fire the selection event when
            // the list gets focus since the mouse event will cause the selection.
            _this.selectOnFocus = false;
        };
        _this.getInitialTabbableRow = function () {
            var _a = _this.props, defaultTabbableRow = _a.defaultTabbableRow, itemProvider = _a.itemProvider, selection = _a.selection;
            if (defaultTabbableRow) {
                return defaultTabbableRow;
            }
            if (selection) {
                for (var i = 0; i < itemProvider.length; i++) {
                    if (selection.selectable(i)) {
                        return i;
                    }
                }
            }
            return 0;
        };
        _this.getHeight = function (rowIndex) {
            var height = 0;
            var rowHeights = _this.props.rowHeights || [];
            for (var i = 0; i < rowIndex && i < rowHeights.length; i++) {
                height += rowHeights[i];
            }
            return height;
        };
        var rowCount = props.itemProvider.length;
        var pageSize = props.pageSize;
        _this.state = {
            columnCount: 1,
            eventDispatch: props.eventDispatch || new EventDispatch(),
            firstMaterialized: 0,
            firstRendered: 0,
            itemProvider: props.itemProvider,
            lastMaterialized: _this.props.virtualize ? Math.min(props.initialPageCount * pageSize, rowCount - 1) : rowCount - 1,
            lastRendered: _this.props.virtualize ? Math.min(props.initialPageCount * pageSize, rowCount - 1) : rowCount - 1,
            overlays: new ObservableArray(),
            pageSize: pageSize,
            renderedRows: {},
            rowCount: rowCount,
            rowHeight: props.rowHeight || 0,
            rowProportion: props.rowHeight && props.maxHeight ? Math.min(1, props.maxHeight / (props.rowHeight * rowCount)) : 1,
            rows: {},
            scrollTop: 0,
            virtualize: !!props.virtualize
        };
        // Initialize the supplied behaviors.
        if (props.behaviors) {
            for (var _i = 0, _a = props.behaviors; _i < _a.length; _i++) {
                var behavior = _a[_i];
                if (behavior.initialize) {
                    behavior.initialize(props, _this, _this.state.eventDispatch);
                }
            }
        }
        return _this;
    }
    List.getDerivedStateFromProps = function (props, state) {
        var rowCount = props.itemProvider.length;
        var firstMaterialized = state.firstMaterialized;
        var lastMaterialized = state.lastMaterialized;
        if (rowCount !== state.rowCount) {
            firstMaterialized = Math.max(0, Math.min(state.firstMaterialized, rowCount));
            lastMaterialized = state.virtualize
                ? Math.max(firstMaterialized, Math.min(state.lastMaterialized +
                    (state.lastMaterialized === state.rowCount - 1 || state.lastMaterialized === state.rowCount ? props.pageSize : 0), rowCount - 1))
                : rowCount - 1;
        }
        // Ensure out pages and providers are appropriately computed.
        var updatedState = {
            firstMaterialized: firstMaterialized,
            itemProvider: props.itemProvider,
            lastMaterialized: lastMaterialized,
            pageSize: props.pageSize,
            rowCount: rowCount,
            rowProportion: Math.min(1, (props.maxHeight || 100000) / (state.rowHeight * (rowCount - (lastMaterialized - firstMaterialized))))
        };
        // If there are changes to the props that affect the cached data, we need it clear it.
        if (props.itemProvider !== state.itemProvider || props.columnCount !== state.columnCount) {
            updatedState.columnCount = props.columnCount;
            updatedState.renderedRows = {};
            updatedState.rows = {};
        }
        // console.log(updatedState);
        return updatedState;
    };
    List.prototype.render = function () {
        var _this = this;
        var _a = this.props, ariaRowOffset = _a.ariaRowOffset, className = _a.className, focuszoneProps = _a.focuszoneProps, id = _a.id, maxWidth = _a.maxWidth, minWidth = _a.minWidth, width = _a.width;
        var _b = this.state, firstMaterialized = _b.firstMaterialized, lastMaterialized = _b.lastMaterialized, rowCount = _b.rowCount, rowProportion = _b.rowProportion;
        var focusIndex = this.focusIndex;
        var role = this.props.role ? this.props.role : this.props.selection ? "listbox" : "list";
        var useAriaCounts = role === "table" || role === "grid" || role === "treegrid";
        var rows = [];
        // Number of pages each spacer takes up. There are potentially two spacers above
        // or below the view port. They surround the focus range when the focus range is
        // not within the viewport.
        var topSpacer1 = 0;
        var topSpacer2 = firstMaterialized;
        var bottomSpacer2 = Math.max(0, rowCount - lastMaterialized - 1);
        var bottomSpacer1 = 0;
        var firstFocusRow = Number.MAX_SAFE_INTEGER;
        var lastFocusRow = 0;
        // Compute the range of focus pages, these will be either before or after the pages
        // in the viewport. We need to ensure we have one row before and one row after the
        // focus row to support arrowing up and down.
        if (focusIndex !== -1) {
            firstFocusRow = Math.max(0, focusIndex - 3);
            lastFocusRow = Math.min(rowCount, focusIndex + 3);
            // Make sure we dont draw any of the pages that are in the viewport.
            if (firstFocusRow < firstMaterialized) {
                lastFocusRow = Math.min(lastFocusRow, firstMaterialized - 1);
                topSpacer1 = firstFocusRow;
                topSpacer2 = firstMaterialized - lastFocusRow - 1;
            }
            else if (lastFocusRow > lastMaterialized) {
                firstFocusRow = Math.max(firstFocusRow, lastMaterialized + 1);
                bottomSpacer2 = firstFocusRow - lastMaterialized - 1;
                bottomSpacer1 = Math.max(0, rowCount - lastFocusRow - 1);
            }
        }
        if (rowProportion < 1) {
            // Ensure that the spacers leave room for 1 pageSize above the viewport
            topSpacer2 += Math.min(this.state.pageSize, firstMaterialized);
        }
        // console.log({ phase: "render", firstMaterialized, lastMaterialized, topSpacer1, topSpacer2, bottomSpacer2, bottomSpacer1 });
        rows.push(this.renderSpacer("st1", topSpacer1));
        // If the focus pages are before the viewport render them up to
        // the first page but not including the first page.
        if (firstFocusRow < firstMaterialized) {
            for (var rowIndex = firstFocusRow; rowIndex <= lastFocusRow; rowIndex++) {
                rows.push(this.renderRow(rowIndex));
            }
        }
        rows.push(this.renderSpacer("st2", topSpacer2));
        // Go through each of the rendered pages and generate the child component.
        for (var rowIndex = firstMaterialized; rowIndex <= lastMaterialized; rowIndex++) {
            rows.push(this.renderRow(rowIndex));
        }
        rows.push(this.renderSpacer("sb2", bottomSpacer2, true));
        // If the focus pages are after the last page in the viewport render
        // them but not including the last page.
        if (lastFocusRow > lastMaterialized) {
            for (var rowIndex = firstFocusRow; rowIndex <= lastFocusRow; rowIndex++) {
                rows.push(this.renderRow(rowIndex));
            }
        }
        rows.push(this.renderSpacer("sb1", bottomSpacer1, true));
        return (React.createElement(UncheckedObserver, { itemProvider: {
                // Supply an IObservableExpression to elevate the provider change to a state
                // update for the entire component instead of just the observer.
                filter: function (change, action) {
                    // Notify the selection about the change to the items.
                    if (_this.props.selection) {
                        _this.props.selection.onItemsChanged(change, action);
                    }
                    // @NOTE: For now we will just wipe out the entire cache, we can do an optimized
                    // update to the cache based on the rows that changed.
                    var updatedState = {
                        renderedRows: {},
                        rows: {}
                    };
                    // If the focused row was removed, we will clear the focus index.
                    if (change.removedItems && _this.focusIndex >= change.index && change.index + change.removedItems.length >= _this.focusIndex) {
                        _this.focusIndex = -1;
                    }
                    // If there is a well defined rowcount we will update it and the maxPage.
                    if (_this.state.rowCount !== -1) {
                        var countChange = (change.addedItems ? change.addedItems.length : 0) - (change.removedItems ? change.removedItems.length : 0);
                        if (countChange) {
                            updatedState.rowCount = _this.state.rowCount + countChange;
                            updatedState.firstMaterialized = Math.max(0, Math.min(_this.state.firstMaterialized, updatedState.rowCount - 1));
                            updatedState.lastMaterialized = _this.state.virtualize
                                ? Math.max(updatedState.firstMaterialized, Math.min(_this.state.lastMaterialized +
                                    (change.index >= _this.state.firstMaterialized && change.index <= _this.state.lastMaterialized + 1
                                        ? Math.min(_this.state.pageSize, countChange)
                                        : 0), updatedState.rowCount - 1))
                                : updatedState.rowCount - 1;
                        }
                    }
                    // console.log(updatedState);
                    _this.setState(updatedState);
                    return false;
                },
                observableValue: this.props.itemProvider
            } },
            React.createElement(FocusWithin, { onBlur: this.onBlur }, function (focusStatus) {
                // @TODO: Once we get the line-height: 20px in the body the body-m should be removed from the list.
                var list = (React.createElement("table", { "aria-colcount": useAriaCounts ? (_this.props.ariaColumnCount ? _this.props.ariaColumnCount : _this.props.columnCount) : undefined, "aria-label": _this.props.virtualize ? format(Resources.VirtualizedListLabelFormat, _this.props.ariaLabel) : _this.props.ariaLabel, "aria-rowcount": useAriaCounts ? _this.state.itemProvider.length + ariaRowOffset : undefined, className: css(className, "bolt-list body-m relative", _this.props.showScroll ? undefined : "scroll-hidden"), id: getSafeId(id), onBlur: focusStatus.onBlur, onClick: _this.onClick, onContextMenu: _this.onDispatch, onDoubleClick: _this.onDoubleClick, onDragEnd: _this.onDispatch, onDragEnter: _this.onDispatch, onDragExit: _this.onDispatch, onDragOver: _this.onDispatch, onDragStart: _this.onDispatch, onDrop: _this.onDispatch, onFocus: focusStatus.onFocus, onKeyDown: _this.onKeyDown, onKeyUp: _this.onDispatch, onPointerDown: _this.onDispatch, ref: _this.listElement, role: role, style: { maxWidth: maxWidth, minWidth: minWidth, width: width }, tabIndex: 0 },
                    _this.props.renderHeader && _this.props.renderHeader(),
                    React.createElement("tbody", { className: "relative", onFocus: _this.onFocusBody, onPointerDown: _this.onPointerDownBody, ref: _this.bodyElement, role: role === "listbox" || role === "list" || role === "menu" ? "presentation" : undefined },
                        _this.renderOverlay(_this.listElement),
                        rows)));
                if (focuszoneProps) {
                    list = (React.createElement(FocusZone, __assign({}, focuszoneProps, { skipHiddenCheck: true }), list));
                }
                return list;
            })));
    };
    List.prototype.componentDidMount = function () {
        this.context.register(this.onIntersect);
        if (this.props.virtualize) {
            document.addEventListener("keydown", this.onVirtualizeKeyDown);
        }
    };
    List.prototype.componentDidUpdate = function () {
        var _a = this, scrollToIndex = _a.scrollToIndex, onScrollComplete = _a.onScrollComplete;
        if (scrollToIndex !== -1 && this.state.rowHeight) {
            var parentElement = this.bodyElement.current;
            var _b = this.state, firstMaterialized = _b.firstMaterialized, lastMaterialized = _b.lastMaterialized;
            // If the row is materialized, we will ensure it is in the viewport.
            if (scrollToIndex >= firstMaterialized && scrollToIndex <= lastMaterialized && parentElement) {
                for (var currentIndex = 0; currentIndex < parentElement.children.length; currentIndex++) {
                    var childElement = parentElement.children[currentIndex];
                    var cellDetails = cellFromElement(childElement);
                    if (cellDetails.rowIndex === scrollToIndex) {
                        childElement.scrollIntoView(this.scrollToOptions);
                        break;
                    }
                }
            }
            // Reset the scroll state before we notify the complete function, it may start a new scroll operation.
            this.onScrollComplete = undefined;
            this.scrollToIndex = -1;
            this.scrollToOptions = undefined;
            // Notify any pending scrollComplete method that scrolling has completed.
            if (onScrollComplete) {
                onScrollComplete(scrollToIndex);
            }
        }
    };
    List.prototype.componentWillUnmount = function () {
        this.context.unregister(this.onIntersect);
        if (this.props.virtualize) {
            document.removeEventListener("keydown", this.onVirtualizeKeyDown);
        }
    };
    List.prototype.addOverlay = function (id, rowIndex, render, zIndex, columnIndex) {
        if (zIndex === void 0) { zIndex = 0; }
        var overlays = this.state.overlays;
        var overlayIndex = overlays.value.findIndex(function (overlay) { return overlay.id === id; });
        var rowOverlay = { render: render, id: id, rowIndex: rowIndex, zIndex: zIndex + 1, columnIndex: columnIndex };
        // Update the overlay if it exists for that id, otherwise add it
        if (overlayIndex >= 0) {
            overlays.change(overlayIndex, rowOverlay);
        }
        else {
            overlays.push(rowOverlay);
        }
    };
    List.prototype.removeOverlay = function (id) {
        var overlays = this.state.overlays;
        var overlayIndex = overlays.value.findIndex(function (overlay) { return overlay.id === id; });
        // Remove the overlay if it exists.
        if (overlayIndex >= 0) {
            overlays.splice(overlayIndex, 1);
        }
    };
    List.prototype.getFocusIndex = function () {
        return this.focusIndex;
    };
    List.prototype.getStats = function () {
        return {
            firstMaterialized: this.state.firstMaterialized,
            firstRendered: this.state.firstRendered,
            lastMaterialized: this.state.lastMaterialized,
            lastRendered: this.state.lastRendered
        };
    };
    List.prototype.scrollIntoView = function (rowIndex, options, onScrollComplete) {
        var _a = this.state, firstMaterialized = _a.firstMaterialized, lastMaterialized = _a.lastMaterialized, pageSize = _a.pageSize, rowCount = _a.rowCount, rowHeight = _a.rowHeight, rowProportion = _a.rowProportion;
        if (rowIndex >= 0 && rowIndex < this.state.rowCount) {
            var parentElement = this.bodyElement.current;
            // If the row is materialized, we will ensure it is in the viewport.
            if (rowIndex >= firstMaterialized && rowIndex <= lastMaterialized && parentElement) {
                for (var currentIndex = 0; currentIndex < parentElement.children.length; currentIndex++) {
                    var childElement = parentElement.children[currentIndex];
                    var cellDetails = cellFromElement(childElement);
                    if (cellDetails.rowIndex === rowIndex) {
                        childElement.scrollIntoView(options);
                        break;
                    }
                }
                // If the caller wants to know when the scroll has completed, notify them.
                if (onScrollComplete) {
                    onScrollComplete(rowIndex);
                }
            }
            else {
                // We only notify the last caller for now, if someone was waiting and another
                // scroll request was made we will send -1 as the rowIndex scrolled into view.
                if (this.onScrollComplete) {
                    this.onScrollComplete(-1);
                }
                // Set the scrollToOptions that will be applied after the next update.
                this.onScrollComplete = onScrollComplete;
                this.scrollToIndex = rowIndex;
                this.scrollToOptions = options;
                // We need to add some padding when we grow proportionally, since the spacers do not fill up enough room if
                // the list starts in the middle of the scrollable region
                var padding = rowProportion < 1 ? pageSize : 0;
                // If we havent computed the rowHeight at this point we need to wait until
                // we know how big rows are to get the row in the right location.
                if (rowHeight) {
                    this.setState({
                        firstMaterialized: Math.max(0, rowIndex - padding),
                        lastMaterialized: Math.min(rowCount - 1, rowIndex + padding)
                    });
                }
            }
        }
    };
    List.prototype.focusRow = function (rowIndex, direction) {
        var _this = this;
        if (direction === void 0) { direction = 1; }
        return new Promise(function (resolve) {
            _this.scrollIntoView(rowIndex, { block: "center" }, function (completedIndex) {
                if (completedIndex === rowIndex && _this.bodyElement.current) {
                    var rowElement = _this.bodyElement.current.querySelector("[data-row-index='" + completedIndex + "']");
                    if (rowElement) {
                        // We need to ensure the requested row is focusable, if not we will move in the
                        // requested direction to find the first focusable row.
                        if (!rowElement.getAttribute("tabindex")) {
                            var newIndex = Math.min(_this.state.rowCount - 1, Math.max(0, completedIndex + direction));
                            if (newIndex !== completedIndex) {
                                _this.focusRow(newIndex, direction);
                            }
                            else if (newIndex !== _this.focusIndex) {
                                _this.focusRow(newIndex, -direction);
                            }
                        }
                        else {
                            rowElement.focus();
                        }
                    }
                }
                resolve();
            });
        });
    };
    List.prototype.processSelectionEvent = function (event, listRow) {
        var _a = this.props, selection = _a.selection, enforceSingleSelect = _a.enforceSingleSelect;
        if (!selection || selection.selectable(listRow.index)) {
            if (selection) {
                var index = listRow.index;
                var multiSelect = enforceSingleSelect ? false : selection.multiSelect;
                // Determine the type of change being made to the selection based on key states.
                if (this.pivotIndex >= 0 && event.shiftKey && multiSelect) {
                    selection.select(Math.min(this.pivotIndex, index), Math.abs(this.pivotIndex - index) + 1, event.ctrlKey || event.metaKey, multiSelect);
                }
                else {
                    var isSpaceBarStroke = event.which === KeyCode.space;
                    if ((event.ctrlKey || event.metaKey || selection.alwaysMerge || isSpaceBarStroke) && multiSelect) {
                        selection.toggle(index, true, multiSelect);
                    }
                    else {
                        selection.select(index, 1, false, multiSelect);
                    }
                }
                // Save the last selectionIndex that we selected, this will allow
                // us to perform range based selection.
                if (!event.shiftKey) {
                    this.pivotIndex = index;
                }
            }
            this.rowSelected(event, listRow);
        }
    };
    List.prototype.renderLoadingRow = function (rowIndex, details) {
        return (React.createElement(ListItem, { className: "bolt-list-row-loading", details: details, index: rowIndex },
            React.createElement("div", { className: "shimmer shimmer-line", style: { width: Math.random() * 80 + 20 + "%" } }, "\u00A0")));
    };
    List.prototype.renderOverlay = function (listElementRef) {
        var _this = this;
        var _a = this.state, firstMaterialized = _a.firstMaterialized, lastMaterialized = _a.lastMaterialized, overlays = _a.overlays;
        return (React.createElement(Observer, { overlays: overlays }, function (props) {
            var bodyElement = _this.bodyElement.current;
            if (props.overlays.length > 0 && bodyElement) {
                return (React.createElement("div", { className: "bolt-list-overlay-container absolute" }, props.overlays.map(function (overlay) {
                    var _a;
                    // Make sure the row is in the rendered range of rows before starting.
                    // Explicitly include column headers at row -1
                    if (overlay.rowIndex !== -1 && (overlay.rowIndex < firstMaterialized || overlay.rowIndex > lastMaterialized) && !getDragInProgress()) {
                        return null;
                    }
                    // Find the row for the given rowIndex
                    var defaultRowElement = listElementRef.current &&
                        listElementRef.current.querySelector("[data-row-index='" + overlay.rowIndex + "']");
                    var rowElement = _this.props.overlay
                        ? defaultRowElement === null || defaultRowElement === void 0 ? void 0 : defaultRowElement.querySelector(_this.props.overlay) : defaultRowElement;
                    // Special case for column overlay
                    var columnElement = (_a = listElementRef.current) === null || _a === void 0 ? void 0 : _a.querySelector("[data-column-index='" + overlay.columnIndex + "']");
                    // We cant render the overlay if the row is paged out since we can't determine
                    // the location of the row.
                    if (rowElement) {
                        return !columnElement ? (React.createElement("div", { className: "bolt-list-overlay flex-row absolute", id: getSafeId(overlay.id), key: overlay.id, style: {
                                height: rowElement.offsetHeight,
                                top: rowElement.getBoundingClientRect().top - bodyElement.getBoundingClientRect().top,
                                zIndex: overlay.zIndex * 10
                            } }, overlay.render({ rowElement: rowElement }))) : (React.createElement("div", { className: "bolt-list-overlay flex-row absolute", id: getSafeId(overlay.id), key: overlay.id, style: {
                                height: rowElement.offsetHeight,
                                width: columnElement.offsetWidth,
                                top: rowElement.getBoundingClientRect().top - bodyElement.getBoundingClientRect().top,
                                left: columnElement.getBoundingClientRect().left - bodyElement.getBoundingClientRect().left,
                                zIndex: overlay.zIndex * 10
                            } }, overlay.render({ rowElement: columnElement })));
                    }
                    return null;
                })));
            }
            return null;
        }));
    };
    List.prototype.renderRow = function (rowIndex) {
        var _this = this;
        var itemProvider = this.props.itemProvider;
        var _a = this.state, renderedRows = _a.renderedRows, rows = _a.rows;
        var renderedRow = renderedRows[rowIndex];
        if (!renderedRow) {
            var item_1 = rows[rowIndex];
            if (!item_1) {
                if (itemProvider.getItem) {
                    item_1 = itemProvider.getItem(rowIndex);
                }
                else {
                    item_1 = itemProvider.value[rowIndex];
                }
            }
            // @TODO: If there are no more rows, we need to handle an itemProvider with -1 length.
            if (!item_1) {
                return null;
            }
            // Save the current item in the item cache.
            rows[rowIndex] = item_1;
            var selection = this.props.selection;
            var selectionObservable = void 0;
            if (selection) {
                selectionObservable = {
                    observableValue: selection,
                    filter: function (selectedRanges) {
                        for (var _i = 0, selectedRanges_1 = selectedRanges; _i < selectedRanges_1.length; _i++) {
                            var selectionRange = selectedRanges_1[_i];
                            if (rowIndex >= selectionRange.beginIndex && rowIndex <= selectionRange.endIndex) {
                                return true;
                            }
                        }
                        return false;
                    }
                };
            }
            // console.log("render row - " + rowIndex);
            // Render the row, save it in the cache, and add it to the current page.
            renderedRow = (React.createElement(UncheckedObserver, { item: item_1, key: rowIndex, selection: selectionObservable }, function (props) {
                var _a = _this.props, selectableText = _a.selectableText, renderRow = _a.renderRow, renderLoadingRow = _a.renderLoadingRow;
                var focusIndex = _this.focusIndex;
                var tabbableIndex = focusIndex >= 0 ? focusIndex : _this.getInitialTabbableRow();
                var rowItem = ObservableLike.getValue(item_1);
                var itemDetails = {
                    selectableText: selectableText,
                    ariaBusy: !props.item,
                    ariaRowOffset: _this.props.ariaRowOffset + 1,
                    data: rowItem,
                    eventDispatch: _this.state.eventDispatch,
                    excludeTabStop: _this.props.excludeTabStop || tabbableIndex !== rowIndex,
                    listProps: _this.props,
                    onFocusItem: _this.onFocusItem,
                    singleClickActivation: _this.props.onActivate && _this.props.singleClickActivation
                };
                if (props.item) {
                    return renderRow(rowIndex, props.item, itemDetails);
                }
                else if (renderLoadingRow) {
                    return renderLoadingRow(rowIndex, itemDetails);
                }
                else {
                    return _this.renderLoadingRow(rowIndex, itemDetails);
                }
            }));
            // Save the row in our cache.
            this.state.renderedRows[rowIndex] = renderedRow;
        }
        return renderedRow;
    };
    List.prototype.renderSpacer = function (key, rowCount, estimateRowHeight) {
        var _this = this;
        var _a;
        var height = !estimateRowHeight && ((_a = this.props.rowHeights) === null || _a === void 0 ? void 0 : _a.length)
            ? this.getHeight(rowCount)
            : rowCount * this.state.rowHeight * this.state.rowProportion;
        return (React.createElement("tr", { "aria-hidden": "true", className: "bolt-list-row-spacer invisible", key: key, ref: function (spacerElement) {
                var existingElement = _this.spacerElements[key];
                if (spacerElement) {
                    if (existingElement !== spacerElement) {
                        if (existingElement) {
                            _this.context.unobserve(spacerElement);
                        }
                        _this.context.observe(spacerElement);
                        _this.spacerElements[key] = spacerElement;
                    }
                }
                else if (existingElement) {
                    _this.context.unobserve(existingElement);
                    delete _this.spacerElements[key];
                }
            }, role: "presentation" },
            React.createElement("td", { className: "bolt-list-cell-spacer invisible", colSpan: this.props.columnCount, style: { height: height + "px" } })));
    };
    List.prototype.rowActivated = function (event, listRow) {
        this.state.eventDispatch.dispatchEvent(event, listRow, "activate");
        if (this.props.onActivate) {
            this.props.onActivate(event, listRow);
        }
    };
    List.prototype.rowSelected = function (event, listRow) {
        this.state.eventDispatch.dispatchEvent(event, listRow, "select");
        if (this.props.onSelect) {
            this.props.onSelect(event, listRow);
        }
    };
    List.prototype.rowFocused = function (event, listRow) {
        this.state.eventDispatch.dispatchEvent(event, listRow, "focus");
        if (this.props.onFocus) {
            this.props.onFocus(event, listRow);
        }
    };
    List.contextType = IntersectionContext;
    List.defaultProps = {
        ariaRowOffset: 0,
        columnCount: 1,
        focuszoneProps: { direction: FocusZoneDirection.Vertical },
        initialPageCount: 3,
        maxHeight: 100000,
        pageSize: 10,
        singleClickActivation: false,
        selectRowOnClick: true,
        virtualize: true
    };
    return List;
}(React.Component));
export { List };
var ScrollableList = /** @class */ (function (_super) {
    __extends(ScrollableList, _super);
    function ScrollableList() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.list = React.createRef();
        _this.scrollableElement = React.createRef();
        return _this;
    }
    ScrollableList.prototype.render = function () {
        return (React.createElement(Intersection, { rootMargin: window.innerHeight / 2 },
            React.createElement("div", { ref: this.scrollableElement, onScroll: this.props.onScroll, className: css(this.props.outerClassName, "flex-grow", "scroll-auto") },
                React.createElement(List, __assign({}, this.props, { ref: this.list })))));
    };
    ScrollableList.prototype.addOverlay = function (id, rowIndex, render, zIndex, columnIndex) {
        if (zIndex === void 0) { zIndex = 0; }
        if (this.list.current) {
            return this.list.current.addOverlay(id, rowIndex, render, zIndex, columnIndex);
        }
    };
    ScrollableList.prototype.getStats = function () {
        if (this.list.current) {
            return this.list.current.getStats();
        }
        return {
            firstMaterialized: -1,
            firstRendered: -1,
            lastMaterialized: -1,
            lastRendered: -1
        };
    };
    ScrollableList.prototype.removeOverlay = function (id) {
        if (this.list.current) {
            return this.list.current.removeOverlay(id);
        }
    };
    ScrollableList.prototype.focusRow = function (rowIndex, direction) {
        if (direction === void 0) { direction = 1; }
        if (this.list.current) {
            return this.list.current.focusRow(rowIndex, direction);
        }
        else {
            return Promise.resolve();
        }
    };
    ScrollableList.prototype.getFocusIndex = function () {
        if (this.list.current) {
            return this.list.current.getFocusIndex();
        }
        return -1;
    };
    ScrollableList.prototype.scrollIntoView = function (rowIndex, scrollToOptions) {
        if (this.list.current) {
            return this.list.current.scrollIntoView(rowIndex, scrollToOptions);
        }
    };
    ScrollableList.prototype.scrollTo = function (scrollTop) {
        if (this.scrollableElement.current) {
            this.scrollableElement.current.scrollTop = scrollTop;
        }
    };
    return ScrollableList;
}(React.Component));
export { ScrollableList };
var SimpleList = /** @class */ (function (_super) {
    __extends(SimpleList, _super);
    function SimpleList() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.list = React.createRef();
        _this.renderListItem = function (rowIndex, listCell, details) {
            return renderListItem(rowIndex, details, renderListCell(listCell));
        };
        return _this;
    }
    SimpleList.prototype.render = function () {
        var listProps = {
            selectableText: this.props.selectableText,
            className: this.props.className,
            columnCount: 1,
            eventDispatch: this.props.eventDispatch,
            focuszoneProps: this.props.focuszoneProps,
            id: this.props.id,
            initialPageCount: this.props.initialPageCount,
            itemProvider: this.props.itemProvider,
            maxHeight: this.props.maxHeight,
            onActivate: this.props.onActivate,
            onFocus: this.props.onFocus,
            onSelect: this.props.onSelect,
            pageSize: this.props.pageSize,
            renderRow: this.renderListItem,
            selection: this.props.selection,
            width: this.props.width,
            virtualize: this.props.virtualize
        };
        if (this.props.scrollable) {
            return React.createElement(ScrollableList, __assign({}, listProps, { ref: this.list }));
        }
        else {
            return React.createElement(List, __assign({}, listProps, { ref: this.list }));
        }
    };
    SimpleList.prototype.addOverlay = function (id, rowIndex, render, zIndex) {
        if (zIndex === void 0) { zIndex = 0; }
        if (this.list.current) {
            return this.list.current.addOverlay(id, rowIndex, render, zIndex);
        }
    };
    SimpleList.prototype.removeOverlay = function (id) {
        if (this.list.current) {
            return this.list.current.removeOverlay(id);
        }
    };
    SimpleList.prototype.focusRow = function (rowIndex, direction) {
        if (direction === void 0) { direction = 1; }
        if (this.list.current) {
            return this.list.current.focusRow(rowIndex, direction);
        }
        else {
            return Promise.resolve();
        }
    };
    SimpleList.prototype.getFocusIndex = function () {
        if (this.list.current) {
            return this.list.current.getFocusIndex();
        }
        return -1;
    };
    SimpleList.prototype.getStats = function () {
        if (this.list.current) {
            return this.list.current.getStats();
        }
        return {
            firstMaterialized: -1,
            firstRendered: -1,
            lastMaterialized: -1,
            lastRendered: -1
        };
    };
    SimpleList.prototype.scrollIntoView = function (rowIndex, scrollToOptions) {
        if (this.list.current) {
            return this.list.current.scrollIntoView(rowIndex, scrollToOptions);
        }
    };
    return SimpleList;
}(React.Component));
export { SimpleList };
export function renderListItem(rowIndex, details, children) {
    return (React.createElement(ListItem, { details: details, index: rowIndex }, children));
}
export function ListItem(props) {
    var onFocus = function (event) {
        props.details.onFocusItem(props.index, event);
    };
    var children = props.children, details = props.details, index = props.index, linkProps = props.linkProps, itemId = props.itemId, tabIndex = props.tabIndex;
    var selectableText = details.selectableText, ariaBusy = details.ariaBusy, ariaDescribedBy = details.ariaDescribedBy, ariaLabel = details.ariaLabel, ariaPosInSet = details.ariaPosInSet, ariaSetSize = details.ariaSetSize, excludeFocusZone = details.excludeFocusZone;
    var _a = details.listProps, selection = _a.selection, singleClickActivation = _a.singleClickActivation;
    return (React.createElement(FocusWithin, { onFocus: onFocus }, function (focusStatus) { return (React.createElement(FocusZoneContext.Consumer, null, function (rowContext) {
        var rowProps = {
            "aria-busy": ariaBusy,
            "aria-describedby": ariaDescribedBy,
            "aria-label": ariaLabel,
            "aria-posinset": ariaPosInSet === undefined ? index + 1 : ariaPosInSet === null ? undefined : ariaPosInSet,
            "aria-selected": selection && selection.selected(index),
            "aria-setsize": ariaSetSize === undefined
                ? props.details.listProps.itemProvider.length
                : ariaSetSize === null
                    ? undefined
                    : ariaSetSize,
            className: css(props.className, "bolt-list-row", index === 0 && "first-row", linkProps && "bolt-link", selection && selection.selected(index) && "selected", focusStatus.hasFocus && "focused", singleClickActivation && "single-click-activation", selectableText && "selectable-text"),
            "data-focuszone": excludeFocusZone || (selection && !selection.selectable(index)) ? undefined : rowContext.focuszoneId,
            "data-row-index": index,
            "data-itemid": itemId,
            tabIndex: tabIndex !== null && tabIndex !== void 0 ? tabIndex : getTabIndex(details),
            onBlur: focusStatus.onBlur,
            onFocus: focusStatus.onFocus,
            role: selection ? "option" : "listitem"
        };
        return (React.createElement(FocusZone, { direction: FocusZoneDirection.Horizontal }, linkProps ? (React.createElement("a", __assign({}, getDefaultLinkProps(linkProps), rowProps),
            React.createElement("div", { className: "bolt-list-cell", "data-column-index": 0 },
                React.createElement("div", { className: "bolt-list-cell-content flex-row" }, children)))) : (React.createElement("tr", __assign({}, rowProps),
            React.createElement("td", { className: "bolt-list-cell", "data-column-index": 0 },
                React.createElement("div", { className: "bolt-list-cell-content flex-row" }, children))))));
    })); }));
}
export function renderListCell(listCell, showOverflowTooltip) {
    if (showOverflowTooltip === void 0) { showOverflowTooltip = true; }
    var textClassName = undefined;
    var textContent = (React.createElement("span", { className: "text-ellipsis body-m" }, typeof listCell === "string" || typeof listCell === "number" ? listCell : listCell.textNode ? listCell.textNode : listCell.text));
    if (showOverflowTooltip) {
        textContent = React.createElement(Tooltip, { overflowOnly: true }, textContent);
    }
    var content = textContent;
    var classNames = css("bolt-list-cell-child flex-row flex-center");
    if (typeof listCell !== "string" && typeof listCell !== "number") {
        textClassName = listCell.textClassName;
        if (listCell.iconProps) {
            content = (React.createElement(React.Fragment, null,
                Icon(__assign(__assign({}, listCell.iconProps), { className: css("icon-margin", listCell.iconProps.className) })),
                textContent));
        }
        if (listCell.href) {
            return (React.createElement(Link, { className: css(textClassName, classNames, "scroll-hidden"), href: listCell.href, rel: listCell.hrefRel, target: listCell.hrefTarget, excludeTabStop: true, subtle: true }, content));
        }
    }
    return React.createElement("span", { className: css(textClassName, classNames, "bolt-list-cell-text") }, content);
}
function getAttributeAsNumber(element, attributeName) {
    var attributeValue = element.getAttribute(attributeName);
    if (attributeValue) {
        return parseInt(attributeValue, 10);
    }
    return -1;
}
export function cellFromElement(element) {
    var attributeValue;
    var cellIndex = -1;
    var rowIndex = -1;
    var cellElement = null;
    while (element) {
        attributeValue = getAttributeAsNumber(element, "data-column-index");
        if (attributeValue !== -1) {
            cellIndex = attributeValue;
            cellElement = element;
        }
        attributeValue = getAttributeAsNumber(element, "data-row-index");
        if (attributeValue !== -1) {
            rowIndex = attributeValue;
            break;
        }
        // We have hit the root of the details list, dont look above this.
        if (element.classList.contains("bolt-list")) {
            element = null;
            break;
        }
        element = element.parentElement;
    }
    return {
        cellElement: cellElement,
        cellIndex: cellIndex,
        rowElement: element,
        rowIndex: rowIndex
    };
}
export function cellFromEvent(event) {
    return cellFromElement(event.target);
}
