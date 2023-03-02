import { __assign } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Dropdown.css";
import * as React from "react";
import { ObservableLike } from '../../Core/Observable';
import { Button } from '../../Button';
import { FocusWithin } from '../../FocusWithin';
import { FocusZone, FocusZoneContext, FocusZoneDirection } from '../../FocusZone';
import { Observer } from '../../Observer';
import { css } from '../../Util';
import { DropdownCallout } from "./DropdownCallout";
export function WithPivots(props) {
    var renderCallout = function (calloutProps) {
        return (React.createElement(DropdownCallout, __assign({}, calloutProps, props.calloutProps, { onFilterTextChanged: function (e, value) {
                calloutProps.onFilterTextChanged && calloutProps.onFilterTextChanged(e, value);
                props.calloutProps && props.calloutProps.onFilterTextChanged && props.calloutProps.onFilterTextChanged(e, value);
            }, renderBeforeContent: function () { return renderPivots(props); } })));
    };
    return (React.createElement(Observer, { selectedPivot: props.selectedPivot }, function () {
        var selectedPivot = getSelectedPivot(props);
        return (React.createElement(Observer, { userFilteredItems: selectedPivot.userFilteredItems }, function () {
            var newProps = {
                actions: selectedPivot.actions,
                filterByText: selectedPivot.filterByText,
                userFilteredItems: selectedPivot.userFilteredItems || selectedPivot.items,
                filteredNoResultsText: selectedPivot.filteredNoResultsText,
                filterPlaceholderText: selectedPivot.filterPlaceholderText,
                noItemsText: selectedPivot.noItemsText,
                renderCallout: renderCallout,
                showFilterBox: selectedPivot.showFilterBox
            };
            return props.children(newProps);
        }));
    }));
}
function onPivotClick(pivot, props) {
    if (props.onPivotClicked) {
        props.onPivotClicked(pivot);
    }
}
function getSelectedPivot(props) {
    var selectedPivot;
    if (props.selectedPivot) {
        var selectedPivotId_1 = ObservableLike.getValue(props.selectedPivot);
        selectedPivot = props.pivots.find(function (pivot) { return pivot.id === selectedPivotId_1; });
    }
    return selectedPivot || props.pivots[0];
}
function renderPivots(props) {
    if (props.pivots.length < 2) {
        return null;
    }
    return (React.createElement(FocusZoneContext.Consumer, null, function (verticalContext) { return (React.createElement(FocusZone, { direction: FocusZoneDirection.Horizontal },
        React.createElement("div", { role: "tablist" },
            React.createElement(FocusWithin, null, function (focusStatus) {
                return props.pivots.map(function (pivot, index) {
                    var selected = props.selectedPivot !== undefined && pivot.id === ObservableLike.getValue(props.selectedPivot);
                    return (React.createElement(Button, { ariaSelected: selected, ariaSetSize: props.pivots.length, ariaPosInSet: index + 1, className: "bolt-dropdown-pivot", key: pivot.id, subtle: true, onBlur: focusStatus.onBlur, onClick: function () { return onPivotClick(pivot, props); }, onFocus: focusStatus.onFocus, role: "tab", focusZoneId: index === 0 && !focusStatus.hasFocus ? verticalContext.focuszoneId : undefined },
                        React.createElement("span", { className: css(props.selectedPivot &&
                                pivot.id === ObservableLike.getValue(props.selectedPivot) &&
                                "bolt-dropdown-pivot-selected") }, pivot.name || pivot.id)));
                });
            })))); }));
}
