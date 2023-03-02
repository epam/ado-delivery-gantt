import { __assign, __rest } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Dropdown.css";
import * as React from "react";
import { ExpandableTextField } from '../../ExpandableTextField';
import * as Resources from '../../Resources.Dropdown';
import { TextFieldFocusTreatmentBehavior } from '../../TextField';
import { css } from '../../Util';
export function DropdownExpandableTextField(props) {
    var _a;
    var editable = props.editable, expandableRef = props.expandableRef, items = props.items, inputClassName = props.inputClassName, renderSelectedItems = props.renderSelectedItems, selection = props.selection, _b = props.showPrefix, showPrefix = _b === void 0 ? true : _b, rest = __rest(props, ["editable", "expandableRef", "items", "inputClassName", "renderSelectedItems", "selection", "showPrefix"]);
    var prefixIconProps;
    var text;
    if (!editable) {
        text = props.placeholder;
        if (selection.selectedCount > 0) {
            text = renderSelectedItems(selection, items);
        }
    }
    // If only a single item is selected and the item has an icon we will show it as a prefix icon.
    if (showPrefix && selection.selectedCount === 1) {
        prefixIconProps = (_a = items[selection.value[0].beginIndex]) === null || _a === void 0 ? void 0 : _a.iconProps;
    }
    return (React.createElement(ExpandableTextField, __assign({ ariaHasPopup: "menu", ariaRoleDescription: !editable ? Resources.DropdownExpandableRoleDescription : undefined, autoComplete: editable, ariaAutoComplete: editable ? "list" : undefined, focusTreatment: editable ? TextFieldFocusTreatmentBehavior.all : TextFieldFocusTreatmentBehavior.keyboardOnly, inputType: !editable ? "button" : undefined, editable: editable, ref: expandableRef, value: text }, rest, { className: css(props.className, "bolt-dropdown-expandable-text-field", rest.disabled && "disabled"), inputClassName: css(inputClassName, "bolt-dropdown-expandable-textfield-input text-ellipsis"), onClick: function (event) { return expandableRef.current && expandableRef.current.expand(); }, prefixIconProps: props.prefixIconProps || prefixIconProps, tooltipProps: __assign({ text: text, overflowOnly: true, overflowDetected: overflowDetected }, props.tooltipProps), required: props.required })));
}
function overflowDetected(anchorElement) {
    var _a = anchorElement.style, wordBreak = _a.wordBreak, whiteSpace = _a.whiteSpace;
    var height = anchorElement.clientHeight;
    anchorElement.style.wordBreak = "break-all";
    anchorElement.style.whiteSpace = "normal";
    var heightChanged = height < anchorElement.clientHeight;
    anchorElement.style.wordBreak = wordBreak;
    anchorElement.style.whiteSpace = whiteSpace;
    return heightChanged;
}
