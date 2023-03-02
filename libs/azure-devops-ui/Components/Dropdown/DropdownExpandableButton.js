import { __assign, __rest } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Dropdown.css";
import * as React from "react";
import { ExpandableButton } from '../../Button';
export function DropdownExpandableButton(props) {
    var expandableRef = props.expandableRef, items = props.items, placeholder = props.placeholder, renderSelectedItems = props.renderSelectedItems, selection = props.selection, tooltipProps = props.tooltipProps, rest = __rest(props, ["expandableRef", "items", "placeholder", "renderSelectedItems", "selection", "tooltipProps"]);
    var text = placeholder;
    if (selection.selectedCount > 0) {
        text = renderSelectedItems(selection, items);
    }
    return (React.createElement(ExpandableButton, __assign({ ref: expandableRef }, rest, { tooltipProps: __assign({ overflowOnly: true, overflowDetected: overflowDetected }, props.tooltipProps) }),
        React.createElement("div", { className: "bolt-dropdown-expandable-button-label justify-start flex-grow text-ellipsis" },
            props.children,
            text)));
}
function overflowDetected(anchorElement) {
    var overflowElement = anchorElement.querySelector(".bolt-dropdown-expandable-button-label");
    if (overflowElement) {
        return overflowElement.scrollWidth > Math.ceil(overflowElement.offsetWidth);
    }
    return false;
}
