import { __assign } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./ColorPicker.css";
import * as React from "react";
import { useObservable } from '../../Core/Observable';
import { Dropdown } from '../../Dropdown';
import { ListSelection } from '../../List';
import { css } from '../../Util';
import { ColorDropdownCalloutComponent } from "./ColorCallout";
import { addColorClass, colorItems } from "./Utils";
export function ColorDropdown(_a) {
    var ariaLabel = _a.ariaLabel, className = _a.className, color = _a.color, disabled = _a.disabled, onColorSelected = _a.onColorSelected;
    var selection = React.useRef(new ListSelection());
    var currentColor = useObservable("#000000")[0];
    // Update our internal value and selection whenever the color prop changes
    React.useEffect(function () {
        currentColor.value = color;
        var idx = colorItems.findIndex(function (ci) { return "#" + ci.id === color; });
        selection.current.select(idx >= 0 ? idx : 0);
    }, [color]);
    var colorClassName = addColorClass(color);
    return (React.createElement(Dropdown, { ariaLabel: ariaLabel, className: css(className, colorClassName, "color-dropdown"), dismissOnSelect: true, disabled: disabled, items: colorItems, renderCallout: ColorDropdownCallout, renderSelectedItems: function () { return ""; }, selection: selection.current, onSelect: function (evt, item) {
            onColorSelected("#" + item.id);
        } }));
}
export function ColorDropdownCallout(props) {
    return React.createElement(ColorDropdownCalloutComponent, __assign({}, props));
}
