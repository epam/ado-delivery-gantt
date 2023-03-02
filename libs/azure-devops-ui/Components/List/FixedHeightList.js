import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./List.css";
import "./ListDropIndicator.css";
import * as React from "react";
import { ObservableLike, ObservableValue } from '../../Core/Observable';
import { FocusWithin } from '../../FocusWithin';
import { FocusZone, FocusZoneContext, FocusZoneDirection } from '../../FocusZone';
import { IntersectionContext } from '../../Intersection';
import { Observer, UncheckedObserver } from '../../Observer';
import { css, eventTargetContainsNode, getSafeId, KeyCode } from '../../Util';
import { EventDispatch } from '../../Utilities/Dispatch';
/**
 * The FixedHeightList component is used to render a collection of items with a series of rows.
 */
var FixedHeightList = /** @class */ (function (_super) {
    __extends(FixedHeightList, _super);
    function FixedHeightList(props) {
        var _this = _super.call(this, props) || this;
        // Manage data about pages, including their spacers.
        _this.intersectionElements = {};
        // Track the table element used to render the rows.
        _this.bodyElement = React.createRef();
        _this.listElement = React.createRef();
        _this.scrollToIndex = -1;
        _this.scrollToOptions = undefined;
        // Focus/Selection management members.
        _this.selectOnFocus = true;
        _this.focusIndex = new ObservableValue(-1);
        _this.pivotIndex = -1;
        _this.onBlur = function () {
            _this.focusIndex.value = -1;
        };
        _this.onClick = function (event) {
            _this.onDispatch(event);
            if (!event.defaultPrevented) {
                if (_this.listElement.current) {
                    var _a = rowFromEvent(event), cellElement = _a.cellElement, rowIndex = _a.rowIndex;
                    if (!cellElement) {
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
                var rowIndex = rowFromEvent(event).rowIndex;
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
                    var rowIndex = _this.focusIndex.value;
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
            if (focusIndex.value !== rowIndex) {
                _this.focusRow(rowIndex, 2);
                // We need to re-render the previously focused row and newly focused row so we will
                // clear the cached values.
                if (focusIndex.value >= 0) {
                    delete _this.state.renderedRows[focusIndex.value];
                }
                else if (_this.props.defaultTabbableRow !== undefined) {
                    // If there was a tabble row that was not the focusIndex.value row we need to update this
                    // row as well to get it re-rendered without the tabIndex.
                    delete _this.state.renderedRows[_this.props.defaultTabbableRow];
                }
                delete _this.state.renderedRows[rowIndex];
                _this.focusIndex.value = rowIndex;
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
                var item_1 = ObservableLike.getValue(_this.state.rows[focusIndex_1.value]);
                if (item_1) {
                    if (event.which === KeyCode.enter) {
                        if (focusIndex_1.value >= 0 && !eventTargetContainsNode(event, ["A"])) {
                            _this.rowActivated(event, { data: item_1, index: focusIndex_1.value });
                        }
                    }
                    else if (event.which === KeyCode.space) {
                        _this.processSelectionEvent(event, { data: item_1, index: focusIndex_1.value });
                        event.preventDefault();
                    }
                    else if (event.which === KeyCode.upArrow || event.which === KeyCode.downArrow) {
                        var selection = _this.props.selection;
                        if (!selection || (selection.selectOnFocus && (event.shiftKey || !event.ctrlKey))) {
                            event.persist();
                            // Need to wait for the keyboard event to be processed by the focuszone.
                            window.setTimeout(function () {
                                if (_this.focusIndex.value != focusIndex_1.value) {
                                    _this.processSelectionEvent(event, { data: item_1, index: _this.focusIndex.value });
                                }
                            }, 0);
                        }
                    }
                    else if (event.which === KeyCode.pageDown) {
                        _this.focusRow(Math.min(focusIndex_1.value + _this.props.pageSize, _this.state.rowCount - 1), 1);
                        event.preventDefault();
                    }
                    else if (event.which === KeyCode.pageUp) {
                        _this.focusRow(Math.max(focusIndex_1.value - _this.props.pageSize, 0), -1);
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
            var scrollTop = _this.context.root.scrollTop;
            var rowCount = _this.state.rowCount;
            var _a = _this.state, firstMaterialized = _a.firstMaterialized, lastMaterialized = _a.lastMaterialized;
            var _b = _this.state, rowHeight = _b.rowHeight, rowProportion = _b.rowProportion;
            // Don't process an intersection while scroll event is pending.
            if (scrollTop !== _this.state.scrollTop && entries.length) {
                return;
            }
            // Ignore events if we dont have a our basic elements resolved (this should never happen).
            if (!_this.listElement.current || !_this.bodyElement.current) {
                return;
            }
            // Determine the location of the intersection within the page. This is the element
            // we are scrolling within.
            var intersectionRect = _this.context.root.getBoundingClientRect();
            var scrollTopRect = Math.max(0, scrollTop + _this.context.root.offsetTop - _this.listElement.current.offsetTop);
            // Track the first and last row elements for adjusting the range.
            var firstMaterializedUpdated = Math.max(0, Math.min(rowCount - 1, Math.floor(scrollTopRect / (rowHeight * rowProportion))));
            var lastMaterializedUpdated = Math.min(rowCount - 1, firstMaterializedUpdated + Math.ceil(intersectionRect.height / rowHeight));
            if (scrollTopRect + (lastMaterializedUpdated - firstMaterializedUpdated) * rowHeight > _this.state.maxHeight) {
                lastMaterializedUpdated = rowCount - 1;
                firstMaterializedUpdated = Math.max(0, lastMaterializedUpdated - Math.ceil(intersectionRect.height / rowHeight));
            }
            // Update our state if and only if something has changed.
            if (firstMaterializedUpdated !== firstMaterialized ||
                lastMaterializedUpdated !== lastMaterialized ||
                rowHeight !== _this.state.rowHeight ||
                scrollTop !== _this.state.scrollTop ||
                scrollTopRect !== _this.state.scrollTopRect) {
                //
                // @TODO: We need to unload data for pages that are no longer rendererd.
                // This means not in the viewport or within any other rendered range.
                //
                _this.setState({
                    firstMaterialized: firstMaterializedUpdated,
                    lastMaterialized: lastMaterializedUpdated,
                    rowHeight: rowHeight,
                    scrollTop: scrollTop,
                    scrollTopRect: scrollTopRect
                });
            }
        };
        _this.onMouseDownBody = function (event) {
            // If the table body gets a mousedown, we will never need to fire the selection event when
            // the list gets focus since the mouse event will cause the selection.
            _this.selectOnFocus = false;
        };
        var rowCount = props.itemProvider.length;
        _this.state = {
            eventDispatch: props.eventDispatch || new EventDispatch(),
            firstMaterialized: 0,
            itemProvider: props.itemProvider,
            lastMaterialized: 0,
            maxHeight: _this.props.maxHeight || 1000000,
            focusRows: {},
            renderedRows: {},
            rowCount: rowCount,
            rowHeight: props.rowHeight || 0,
            rowProportion: props.rowHeight && props.maxHeight ? Math.min(1, props.maxHeight / (props.rowHeight * rowCount)) : 1,
            rows: {},
            scrollTop: 0,
            scrollTopRect: 0
        };
        return _this;
    }
    FixedHeightList.getDerivedStateFromProps = function (props, state) {
        var rowCount = props.itemProvider.length;
        var firstMaterialized = state.firstMaterialized;
        var lastMaterialized = state.lastMaterialized;
        if (rowCount !== state.rowCount) {
            firstMaterialized = Math.max(0, Math.min(state.firstMaterialized, rowCount));
            lastMaterialized = Math.max(firstMaterialized, Math.min(state.lastMaterialized + (state.lastMaterialized === state.rowCount - 1 ? props.pageSize : 0), rowCount - 1));
        }
        // Ensure out pages and providers are appropriately computed.
        var updatedState = {
            firstMaterialized: firstMaterialized,
            itemProvider: props.itemProvider,
            lastMaterialized: lastMaterialized,
            rowCount: rowCount,
            rowProportion: Math.min(1, state.maxHeight / (state.rowHeight * rowCount))
        };
        // If there are changes to the props that affect the cached data, we need it clear it.
        if (props.itemProvider !== state.itemProvider) {
            updatedState.renderedRows = {};
            updatedState.rows = {};
        }
        return updatedState;
    };
    FixedHeightList.prototype.getListRole = function () {
        return this.props.role ? this.props.role : this.props.selection ? "listbox" : "list";
    };
    FixedHeightList.prototype.getItemRole = function () {
        switch (this.getListRole()) {
            case "tree":
            case "group":
                return "treeitem";
            case "list":
                return "listitem";
            case "listbox":
                return "option";
            case "radiogroup":
                return "radio";
            default:
                return null;
        }
    };
    FixedHeightList.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, focuszoneProps = _a.focuszoneProps, id = _a.id, width = _a.width;
        var _b = this.state, firstMaterialized = _b.firstMaterialized, lastMaterialized = _b.lastMaterialized, maxHeight = _b.maxHeight, rowCount = _b.rowCount, rowHeight = _b.rowHeight;
        var role = this.getListRole();
        var rows = [];
        var firstFocusRow = Math.max(0, this.focusIndex.value - 3);
        var lastFocusRow = Math.min(rowCount, this.focusIndex.value + 3);
        rows.push(this.renderIntersectionBounds(true));
        // Add focus rows around rendered rows.
        if (this.focusIndex.value !== -1 && firstFocusRow < firstMaterialized) {
            for (var rowIndex = firstFocusRow; rowIndex <= Math.min(lastFocusRow, firstMaterialized - 1); rowIndex++) {
                rows.push(this.renderRow(rowIndex, false));
            }
        }
        for (var rowIndex = firstMaterialized; rowIndex <= lastMaterialized; rowIndex++) {
            rows.push(this.renderRow(rowIndex, true));
        }
        if (this.focusIndex.value !== -1 && lastFocusRow > lastMaterialized && lastMaterialized > 0) {
            for (var rowIndex = Math.max(firstFocusRow, lastMaterialized + 1); rowIndex <= lastFocusRow; rowIndex++) {
                rows.push(this.renderRow(rowIndex, false));
            }
        }
        rows.push(this.renderIntersectionBounds(false));
        var height = Math.min(maxHeight, rowHeight * this.state.rowCount);
        var list = (React.createElement("div", { "aria-label": this.props.ariaLabel, className: css(className, "bolt-fixed-height-list relative"), id: getSafeId(id), onBlur: this.onBlur, onClick: this.onClick, onDoubleClick: this.onDoubleClick, onDragEnd: this.onDispatch, onDragEnter: this.onDispatch, onDragExit: this.onDispatch, onDragOver: this.onDispatch, onDragStart: this.onDispatch, onDrop: this.onDispatch, onKeyUp: this.onDispatch, onMouseDown: this.onDispatch, onTouchStart: this.onDispatch, ref: this.listElement, role: role, style: { width: width, height: height } },
            React.createElement("div", { className: "relative", onFocus: this.onFocusBody, onKeyDown: this.onKeyDown, onMouseDown: this.onMouseDownBody, ref: this.bodyElement, style: { width: width, height: height } }, rows)));
        list = (React.createElement(FocusZone, __assign({ direction: FocusZoneDirection.Vertical, skipHiddenCheck: true }, focuszoneProps), list));
        return (React.createElement(Observer, { itemProvider: {
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
                        focusRows: {},
                        rows: {}
                    };
                    // If their is a well defined rowcount we will update it and the maxPage.
                    if (_this.state.rowCount !== -1) {
                        var countChange = (change.addedItems ? change.addedItems.length : 0) - (change.removedItems ? change.removedItems.length : 0);
                        if (countChange) {
                            updatedState.rowCount = _this.state.rowCount + countChange;
                            updatedState.firstMaterialized = Math.max(0, Math.min(_this.state.firstMaterialized, updatedState.rowCount - 1));
                            updatedState.lastMaterialized = Math.max(updatedState.firstMaterialized, Math.min(_this.state.lastMaterialized +
                                (change.index >= _this.state.firstMaterialized && change.index <= _this.state.lastMaterialized + 1
                                    ? countChange
                                    : 0), updatedState.rowCount - 1));
                        }
                    }
                    _this.setState(updatedState);
                    return false;
                },
                observableValue: this.props.itemProvider
            } }, function () { return list; }));
    };
    FixedHeightList.prototype.componentDidMount = function () {
        this.onIntersect([]);
        this.context.register(this.onIntersect);
    };
    FixedHeightList.prototype.componentDidUpdate = function (prevProps, prevState) {
        var _a = this, scrollToIndex = _a.scrollToIndex, onScrollComplete = _a.onScrollComplete;
        if (this.state.rowCount !== prevState.rowCount) {
            this.onIntersect([]);
        }
        if (scrollToIndex !== -1 && this.state.rowHeight) {
            var parentElement = this.bodyElement.current;
            var _b = this.state, firstMaterialized = _b.firstMaterialized, lastMaterialized = _b.lastMaterialized;
            // If the row is materialized, we will ensure it is in the viewport.
            if (scrollToIndex >= firstMaterialized && scrollToIndex <= lastMaterialized && parentElement) {
                for (var currentIndex = 0; currentIndex < parentElement.children.length; currentIndex++) {
                    var childElement = parentElement.children[currentIndex];
                    var cellDetails = rowFromElement(childElement);
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
    FixedHeightList.prototype.componentWillUnmount = function () {
        this.context.unregister(this.onIntersect);
    };
    FixedHeightList.prototype.getFocusIndex = function () {
        return this.focusIndex.value;
    };
    FixedHeightList.prototype.getStats = function () {
        return {
            firstMaterialized: this.state.firstMaterialized,
            lastMaterialized: this.state.lastMaterialized
        };
    };
    FixedHeightList.prototype.scrollIntoView = function (rowIndex, options, onScrollComplete) {
        var pageSize = this.props.pageSize;
        var _a = this.state, firstMaterialized = _a.firstMaterialized, lastMaterialized = _a.lastMaterialized, rowCount = _a.rowCount;
        if (rowIndex >= 0 && rowIndex < this.state.rowCount) {
            var parentElement = this.bodyElement.current;
            // If the row is materialized, we will ensure it is in the viewport.
            if (rowIndex >= firstMaterialized && rowIndex <= lastMaterialized && parentElement) {
                for (var currentIndex = 0; currentIndex < parentElement.children.length; currentIndex++) {
                    var childElement = parentElement.children[currentIndex];
                    var cellDetails = rowFromElement(childElement);
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
                // If we havent computed the rowHeight at this point we need to wait until
                // we know how big rows are to get the row in the right location.
                this.setState({
                    firstMaterialized: Math.max(0, rowIndex - Math.floor((lastMaterialized - firstMaterialized) / 2)),
                    lastMaterialized: Math.min(rowCount - 1, Math.ceil(rowIndex + (lastMaterialized - firstMaterialized) / 2))
                });
            }
        }
    };
    FixedHeightList.prototype.focusRow = function (rowIndex, direction) {
        var _this = this;
        this.scrollIntoView(rowIndex, { block: "nearest" }, function (completedIndex) {
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
                        else if (newIndex !== _this.focusIndex.value) {
                            _this.focusRow(newIndex, -direction);
                        }
                    }
                    else {
                        // Set focus to the row that scroll to
                        rowElement.focus();
                    }
                }
            }
        });
    };
    FixedHeightList.prototype.processSelectionEvent = function (event, listRow) {
        var selection = this.props.selection;
        if (!selection || selection.selectable(listRow.index)) {
            var initialState = false;
            var targetState = true;
            if (selection) {
                var index = listRow.index;
                // If a selection is available use it to track the initial state.
                initialState = selection.selected(index);
                // Determine the type of change being made to the selection based on key states.
                if (this.pivotIndex >= 0 && event.shiftKey && selection.multiSelect) {
                    selection.select(Math.min(this.pivotIndex, index), Math.abs(this.pivotIndex - index) + 1, event.ctrlKey || event.metaKey);
                }
                else {
                    if ((event.ctrlKey || event.metaKey || selection.alwaysMerge) && selection.multiSelect) {
                        selection.toggle(index, true);
                        targetState = false;
                    }
                    else {
                        selection.select(index, 1, false);
                    }
                }
                // Save the last selectionIndex that we selected, this will allow
                // us to perform range based selection.
                if (!event.shiftKey) {
                    this.pivotIndex = index;
                }
            }
            if (initialState !== targetState) {
                this.rowSelected(event, listRow);
            }
        }
    };
    FixedHeightList.prototype.renderLoadingRow = function (rowIndex, details) {
        return (React.createElement("div", { className: "bolt-list-row-loading" },
            React.createElement("div", { className: "shimmer shimmer-line", style: { width: Math.random() * 80 + 20 + "%" } }, "\u00A0")));
    };
    FixedHeightList.prototype.renderIntersectionBounds = function (top) {
        var _this = this;
        var _a = this.state, firstMaterialized = _a.firstMaterialized, lastMaterialized = _a.lastMaterialized, rowHeight = _a.rowHeight, rowProportion = _a.rowProportion;
        var key = top ? "topobserv" : "bottomobserv";
        var rowTop = 0;
        // If we run out of room move from the bottom up. This can happen with proportionally allocated rows
        if (firstMaterialized * rowHeight * rowProportion + (lastMaterialized - firstMaterialized) * rowHeight > this.state.maxHeight) {
            if (top) {
                rowTop = this.state.maxHeight;
                rowTop -= (lastMaterialized - firstMaterialized) * rowHeight * rowProportion + rowHeight;
                rowTop--;
            }
            else {
                rowTop = this.state.maxHeight - 1;
            }
        }
        else {
            if (top) {
                rowTop = firstMaterialized * rowHeight * rowProportion - 1;
            }
            else {
                rowTop = firstMaterialized * rowHeight * rowProportion + (1 + lastMaterialized - firstMaterialized) * rowHeight + 1;
            }
        }
        return (React.createElement("div", { "aria-hidden": "true", className: "bolt-list-row-spacer invisible absolute", key: key, ref: function (spacerElement) {
                var existingElement = _this.intersectionElements[key];
                if (spacerElement) {
                    if (existingElement !== spacerElement) {
                        if (existingElement) {
                            _this.context.unobserve(spacerElement);
                        }
                        _this.context.observe(spacerElement);
                        _this.intersectionElements[key] = spacerElement;
                    }
                }
                else if (existingElement) {
                    _this.context.unobserve(existingElement);
                    delete _this.intersectionElements[key];
                }
            }, role: "presentation", style: { top: rowTop + "px", height: "1px" } }));
    };
    FixedHeightList.prototype.renderRow = function (rowIndex, isVisible) {
        var _this = this;
        var itemProvider = this.props.itemProvider;
        var _a = this.state, focusRows = _a.focusRows, renderedRows = _a.renderedRows, firstMaterialized = _a.firstMaterialized, lastMaterialized = _a.lastMaterialized, rowHeight = _a.rowHeight, rowProportion = _a.rowProportion, rows = _a.rows;
        var role = this.getItemRole();
        var renderedRow = isVisible ? renderedRows[rowIndex] : focusRows[rowIndex];
        // We can't use the cache for proportioned rows since the top is different based on what the firstMaterialized value is
        if (!renderedRow || rowProportion !== 1) {
            var item_2 = rows[rowIndex];
            if (!item_2) {
                if (itemProvider.getItem) {
                    item_2 = itemProvider.getItem(rowIndex);
                }
                else {
                    item_2 = itemProvider.value[rowIndex];
                }
            }
            // @TODO: If there are no more rows, we need to handle an itemProvider with -1 length.
            if (!item_2) {
                return null;
            }
            // Save the current item in the item cache.
            rows[rowIndex] = item_2;
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
            var onFocus_1 = function (event) {
                _this.onFocusItem(rowIndex, event);
            };
            // Render the row, save it in the cache, and add it to the current page.
            renderedRow = (React.createElement(UncheckedObserver, { item: item_2, key: rowIndex, selection: selectionObservable, focusIndex: this.focusIndex }, function (props) {
                var _a, _b;
                var _c = _this.props, renderRow = _c.renderRow, renderLoadingRow = _c.renderLoadingRow;
                var _d = _this.state, rowHeight = _d.rowHeight, rowCount = _d.rowCount;
                var rowItem = ObservableLike.getValue(item_2);
                var itemDetails = {
                    ariaBusy: !props.item,
                    ariaRowOffset: 1,
                    data: rowItem,
                    eventDispatch: _this.state.eventDispatch,
                    itemProvider: _this.props.itemProvider,
                    listProps: _this.props,
                    onFocusItem: _this.onFocusItem,
                    singleClickActivation: _this.props.onActivate && _this.props.singleClickActivation
                };
                var renderedRow;
                if (props.item) {
                    renderedRow = renderRow(rowIndex, props.item, itemDetails);
                }
                else if (renderLoadingRow) {
                    renderedRow = renderLoadingRow(rowIndex, itemDetails);
                }
                else {
                    renderedRow = _this.renderLoadingRow(rowIndex, itemDetails);
                }
                var rowTop = 0;
                var rowHeightSpace = 0;
                if (rowIndex >= firstMaterialized && rowIndex <= lastMaterialized) {
                    rowHeightSpace = rowHeight;
                }
                // If we run out of room move from the bottom up. This can happen with proportionally allocated rows
                if (firstMaterialized * rowHeight * rowProportion + (lastMaterialized - firstMaterialized) * rowHeight >
                    _this.state.maxHeight) {
                    rowTop = _this.state.maxHeight;
                    rowTop -= (rowCount - lastMaterialized) * rowHeight * rowProportion;
                    rowTop -= (lastMaterialized - rowIndex) * rowHeight;
                }
                else {
                    if (rowHeightSpace === 0) {
                        rowTop = rowIndex * rowHeight * rowProportion;
                    }
                    else {
                        rowTop = firstMaterialized * rowHeight * rowProportion;
                        rowTop += (rowIndex - firstMaterialized) * rowHeight;
                    }
                }
                var rowData = itemDetails === null || itemDetails === void 0 ? void 0 : itemDetails.data;
                var hasChildItems = (_a = rowData === null || rowData === void 0 ? void 0 : rowData.underlyingItem) === null || _a === void 0 ? void 0 : _a.childItems;
                var isExpanded = (_b = rowData === null || rowData === void 0 ? void 0 : rowData.underlyingItem) === null || _b === void 0 ? void 0 : _b.expanded;
                return (React.createElement(FocusWithin, { onFocus: onFocus_1 }, function (focusStatus) {
                    return (React.createElement(FocusZoneContext.Consumer, null, function (rowContext) {
                        return (React.createElement(FocusZone, { direction: FocusZoneDirection.Horizontal },
                            React.createElement("div", { className: css("bolt-fixed-height-list-row scroll-hidden absolute", _this.focusIndex.value === rowIndex && "focused"), style: {
                                    height: rowHeightSpace + "px",
                                    top: rowTop + "px"
                                }, "data-focuszone": rowContext.focuszoneId, "data-row-index": rowIndex, tabIndex: rowIndex == 0 || hasChildItems ? 0 : -1, onBlur: focusStatus.onBlur, onFocus: focusStatus.onFocus, role: role, "aria-expanded": hasChildItems && isExpanded === undefined ? false : isExpanded, "aria-labeledby": "rowContent-" + rowIndex }, renderedRow)));
                    }));
                }));
            }));
            // Save the row in our cache.
            if (isVisible) {
                this.state.renderedRows[rowIndex] = renderedRow;
            }
            else {
                this.state.focusRows[rowIndex] = renderedRow;
            }
        }
        return renderedRow;
    };
    FixedHeightList.prototype.rowActivated = function (event, listRow) {
        this.state.eventDispatch.dispatchEvent(event, listRow, "activate");
        if (this.props.onActivate) {
            this.props.onActivate(event, listRow);
        }
    };
    FixedHeightList.prototype.rowSelected = function (event, listRow) {
        this.state.eventDispatch.dispatchEvent(event, listRow, "select");
        if (this.props.onSelect) {
            this.props.onSelect(event, listRow);
        }
    };
    FixedHeightList.prototype.rowFocused = function (event, listRow) {
        this.state.eventDispatch.dispatchEvent(event, listRow, "focus");
        if (this.props.onFocus) {
            this.props.onFocus(event, listRow);
        }
    };
    FixedHeightList.contextType = IntersectionContext;
    FixedHeightList.defaultProps = {
        defaultTabbableRow: 0,
        focuszoneProps: { direction: FocusZoneDirection.Vertical },
        maxHeight: 1000000
    };
    return FixedHeightList;
}(React.Component));
export { FixedHeightList };
function getAttributeAsNumber(element, attributeName) {
    var attributeValue = element.getAttribute(attributeName);
    if (attributeValue) {
        return parseInt(attributeValue, 10);
    }
    return -1;
}
export function rowFromElement(element) {
    var attributeValue;
    var cellIndex = -1;
    var rowIndex = -1;
    var cellElement = null;
    while (element) {
        attributeValue = getAttributeAsNumber(element, "data-row-index");
        if (attributeValue !== -1) {
            rowIndex = attributeValue;
            break;
        }
        // We have hit the root of the details list, dont look above this.
        if (element.classList.contains("bolt-fixed-height-list")) {
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
export function rowFromEvent(event) {
    return rowFromElement(event.target);
}
