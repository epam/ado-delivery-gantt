import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Dropdown.css";
import * as React from "react";
import { ObservableLike } from '../../Core/Observable';
import { format } from '../../Core/Util/String';
import { Button } from '../../Button';
import { Callout, ContentSize } from '../../Callout';
import { FocusZone, FocusZoneDirection, FocusZoneKeyStroke } from '../../FocusZone';
import { IconSize } from '../../Icon';
import { ListBox } from '../../ListBox';
import { Observer } from '../../Observer';
import * as Resources from '../../Resources.Dropdown';
import { TextField } from '../../TextField';
import { css, getSafeIdSelector, KeyCode, preventDefault } from '../../Util';
var ItemsForFilter = 10;
var DefaultWidth = 256;
// This should match the total horizontal padding on bolt-dropdown-filter-container
var FilterBarPadding = 16;
// This should match the width + margin of the textfield search icon
var FilterBarIconWidth = 27;
export function DropdownCallout(props) {
    return React.createElement(DropdownCalloutComponent, __assign({}, props));
}
var DropdownCalloutComponent = /** @class */ (function (_super) {
    __extends(DropdownCalloutComponent, _super);
    function DropdownCalloutComponent(props) {
        var _this = _super.call(this, props) || this;
        _this.callout = React.createRef();
        _this.calloutContent = React.createRef();
        _this.filterBox = React.createRef();
        _this.initFocusElement = React.createRef();
        _this.updateLayout = function () {
            // Allow the new items to draw before updating the layout.
            setTimeout(function () {
                if (_this.callout.current) {
                    _this.callout.current.updateLayout();
                }
            }, 0);
            return true;
        };
        _this.onMouseDown = function (event) {
            if (_this.props.ignoreMouseDown) {
                if (event.target.tagName !== "INPUT") {
                    preventDefault(event);
                }
            }
        };
        _this.listBoxDidUpdate = function () {
            _this.getScrollWidth();
        };
        _this.getScrollWidth = function () {
            window.requestAnimationFrame(function () {
                if (_this.calloutContent.current && _this.props.width >= 0) {
                    var widthChange = _this.calloutContent.current.offsetWidth - _this.props.width;
                    // A 1 pixel change in the width may change the total width by 2 pixels if there are two scroll bars.
                    // Only rerender when a scrollbar is appearing or being removed which should be > 1 pixel change.
                    if (Math.abs(widthChange) > 1) {
                        _this.setState({ scrollBarWidth: widthChange + _this.state.scrollBarWidth });
                    }
                }
            });
        };
        _this.state = { scrollBarWidth: 0 };
        return _this;
    }
    DropdownCalloutComponent.prototype.componentDidMount = function () {
        this.getScrollWidth();
    };
    DropdownCalloutComponent.prototype.focus = function () {
        if (this.filterBox.current) {
            this.filterBox.current.focus();
        }
        else if (this.initFocusElement.current) {
            this.initFocusElement.current.focus();
        }
    };
    DropdownCalloutComponent.prototype.render = function () {
        var _this = this;
        var _a = this.props, actions = _a.actions, anchorElement = _a.anchorElement, anchorOffset = _a.anchorOffset, anchorOrigin = _a.anchorOrigin, anchorPoint = _a.anchorPoint, ariaLabel = _a.ariaLabel, _b = _a.blurDismiss, blurDismiss = _b === void 0 ? true : _b, calloutContentClassName = _a.calloutContentClassName, columns = _a.columns, containerClassName = _a.containerClassName, contentLocation = _a.contentLocation, dropdownOrigin = _a.dropdownOrigin, enforceSingleSelect = _a.enforceSingleSelect, excludeFocusZone = _a.excludeFocusZone, excludeTabStop = _a.excludeTabStop, filteredItems = _a.filteredItems, filteredNoResultsText = _a.filteredNoResultsText, filteredResultsLoadingText = _a.filteredResultsLoadingText, filterPlaceholderText = _a.filterPlaceholderText, filterText = _a.filterText, focusOnMount = _a.focusOnMount, getUnselectableRanges = _a.getUnselectableRanges, id = _a.id, items = _a.items, lightDismiss = _a.lightDismiss, listBoxClassName = _a.listBoxClassName, listBoxRef = _a.listBoxRef, loading = _a.loading, onActivate = _a.onActivate, onFilterKeyDown = _a.onFilterKeyDown, onFilterTextChanged = _a.onFilterTextChanged, onSelect = _a.onSelect, onToggle = _a.onToggle, renderBeforeContent = _a.renderBeforeContent, renderItem = _a.renderItem, searching = _a.searching, selection = _a.selection, showCloseButton = _a.showCloseButton, showFilterBox = _a.showFilterBox, showItemsWhileSearching = _a.showItemsWhileSearching, showTree = _a.showTree, title = _a.title, updateFilteredItems = _a.updateFilteredItems, userFilteredItems = _a.userFilteredItems;
        var _c = this.props.width, width = _c === void 0 ? DefaultWidth : _c;
        if (width > 0) {
            width -= this.state.scrollBarWidth;
        }
        var textFieldId = "bolt-dropdown-textfield-" + id;
        var clearInput = function () {
            filterText.value = "";
            if (onFilterTextChanged) {
                onFilterTextChanged(null, "");
            }
            if (updateFilteredItems) {
                updateFilteredItems();
            }
        };
        var onDismiss = function () {
            if (_this.props.onDismiss) {
                _this.props.onDismiss();
            }
            clearInput();
        };
        return (React.createElement(Callout, { anchorElement: anchorElement, anchorOffset: anchorOffset, anchorOrigin: anchorOrigin, anchorPoint: anchorPoint, role: "presentation", blurDismiss: blurDismiss, calloutOrigin: dropdownOrigin, contentClassName: css(calloutContentClassName, "bolt-dropdown flex-column custom-scrollbar v-scroll-auto h-scroll-hidden"), contentLocation: contentLocation, contentRef: this.calloutContent, contentShadow: true, contentSize: ContentSize.Auto, escDismiss: true, id: id, lightDismiss: lightDismiss, focuszoneProps: {
                postprocessKeyStroke: function (event) {
                    // dismiss the callout on tab key instead of letting the
                    // browser handle the tab key, since with React.portals it
                    // will move to the body, instead of the next tabbable element after
                    // the dropdown.
                    if (event.which === KeyCode.tab && !event.defaultPrevented) {
                        event.preventDefault();
                        onDismiss();
                        return FocusZoneKeyStroke.IgnoreAll;
                    }
                    return FocusZoneKeyStroke.IgnoreNone;
                }
            }, onDismiss: onDismiss, ref: this.callout },
            React.createElement(FocusZone, { circularNavigation: true, defaultActiveElement: showFilterBox || (showFilterBox === undefined && items.length > ItemsForFilter)
                    ? getSafeIdSelector(textFieldId)
                    : ".bolt-dropdown-init-focus", direction: FocusZoneDirection.Vertical, focusOnMount: focusOnMount !== undefined ? focusOnMount : true, preventScrollOnFocus: window.self !== window.top },
                React.createElement("div", { className: "bolt-dropdown-container no-outline", onMouseDown: this.onMouseDown, onKeyDown: onFilterKeyDown, style: { width: width >= 0 ? width : undefined } },
                    React.createElement("div", { "aria-hidden": "true", "aria-roledescription": Resources.DropdownCalloutRoleDescription, className: "bolt-dropdown-init-focus no-outline", tabIndex: !excludeTabStop ? -1 : undefined, ref: this.initFocusElement, role: "menuitem" }),
                    React.createElement(Observer, { items: { observableValue: items, filter: this.updateLayout } }, function () {
                        var shouldShowFilterBox = showFilterBox === undefined ? items.length > ItemsForFilter : showFilterBox;
                        return shouldShowFilterBox || title || showCloseButton ? (React.createElement("div", { className: "bolt-dropdown-header-container" },
                            (title || showCloseButton) && (React.createElement("div", { className: "bolt-dropdown-header flex-row flex-center" },
                                React.createElement("div", { className: "bolt-dropdown-header-text flex-grow font-weight-semibold" }, title),
                                showCloseButton && (React.createElement(Button, { className: "bolt-dropdown-header-button", ariaLabel: Resources.Close, iconProps: { iconName: "Cancel" }, onClick: onDismiss, subtle: true })))),
                            shouldShowFilterBox && (React.createElement("div", { key: "bolt-dropdown-filter-container", className: "bolt-dropdown-filter-container" },
                                React.createElement(Observer, { filterText: filterText }, function (props) {
                                    return (React.createElement(TextField, { key: "bolt-dropdown-filter", ariaLabel: Resources.SearchAriaLabel, className: "bolt-dropdown-filter", excludeTabStop: true, inputId: textFieldId, onChange: onFilterTextChanged, placeholder: filterPlaceholderText, prefixIconProps: { iconName: "Search" }, ref: _this.filterBox, value: filterText, maxWidth: _this.props.width - FilterBarPadding - FilterBarIconWidth, suffixIconProps: props.filterText.length > 0
                                            ? {
                                                ariaLabel: Resources.ClearText,
                                                iconName: "ChromeClose",
                                                onClick: clearInput,
                                                size: IconSize.small,
                                                tooltipProps: {
                                                    text: Resources.ClearText
                                                },
                                                role: "button",
                                            }
                                            : undefined }));
                                }))))) : null;
                    }),
                    renderBeforeContent && renderBeforeContent(),
                    React.createElement(Observer, { filteredItems: filteredItems, filteredNoResultsText: filteredNoResultsText, listBoxItems: { observableValue: items, filter: updateFilteredItems }, userFilteredItems: { observableValue: userFilteredItems, filter: updateFilteredItems } }, function (props) {
                        var noItemsElement = null;
                        var noItemsText = "";
                        if (((filteredItems && filteredItems.length === 0) || items.length === 0) && !searching) {
                            noItemsText =
                                filterText.value === ""
                                    ? _this.props.noItemsText
                                    : format(props.filteredNoResultsText || Resources.NoFilterResults, filterText.value);
                            if (noItemsText) {
                                noItemsElement = React.createElement("div", { className: "bolt-dropdown-no-items" }, noItemsText);
                            }
                        }
                        return (React.createElement(React.Fragment, null,
                            noItemsElement,
                            React.createElement(ListBox, { ariaLabel: ariaLabel, className: listBoxClassName, columns: columns, containerClassName: css("bolt-dropdown-list-box-container", containerClassName), didUpdate: _this.listBoxDidUpdate, enforceSingleSelect: enforceSingleSelect, excludeFocusZone: excludeFocusZone, excludeTabStop: true, searchResultsLoadingText: filteredResultsLoadingText, focuszoneProps: null, getUnselectableRanges: getUnselectableRanges, items: filteredItems ? filteredItems.value : items, loading: loading, onActivate: onActivate, onSelect: onSelect, onToggle: onToggle, renderItem: renderItem, ref: listBoxRef, searching: searching, selection: selection, showChecksColumn: true, showItemsWhileSearching: showItemsWhileSearching, showTree: showTree })));
                    }),
                    React.createElement(Observer, { actions: actions }, function (props) {
                        var actions = _this.props.actions;
                        return actions && actions.length ? (React.createElement("div", { className: "bolt-actions-container flex-column" }, ObservableLike.getValue(actions).map(function (actionProps, index) { return (React.createElement(Button, __assign({ key: actionProps.id || index, subtle: true, excludeTabStop: true }, actionProps))); }))) : null;
                    })))));
    };
    DropdownCalloutComponent.defaultProps = {
        width: DefaultWidth,
        ignoreMouseDown: true
    };
    return DropdownCalloutComponent;
}(React.Component));
export { DropdownCalloutComponent };
