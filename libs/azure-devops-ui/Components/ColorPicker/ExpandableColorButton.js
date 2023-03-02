import "../../CommonImports";
import "../../Core/core.css";
import "./ColorPicker.css";
import * as React from "react";
import { ObservableValue, useObservable } from '../../Core/Observable';
import { ExpandableButton } from '../../Button';
import { IconSize } from '../../Icon';
import { ListSelection } from '../../List';
import { Observer } from '../../Observer';
import { css } from '../../Util';
import { ColorDropdownCallout } from "./ColorDropdown";
import { addColorClass, colorItems } from "./Utils";
export function ExpandableColorButton(_a) {
    var ariaLabel = _a.ariaLabel, className = _a.className, color = _a.color, onColorSelected = _a.onColorSelected;
    var selection = React.useRef(new ListSelection());
    var currentColor = useObservable("#000000")[0];
    // Update our internal value and selection whenever the color prop changes
    React.useEffect(function () {
        currentColor.value = color;
        var idx = colorItems.findIndex(function (ci) { return "#" + ci.id === color; });
        selection.current.select(idx >= 0 ? idx : 0);
    }, [color]);
    var colorClassName = addColorClass(color);
    var onSelect = function (evt, item) {
        currentColor.value = "#" + item.id;
        onColorSelected("#" + item.id);
    };
    return (React.createElement("div", { className: "flex-column justify-center color-callout" },
        React.createElement(ExpandableButton, { ariaLabel: ariaLabel, className: css(className, colorClassName, "color-dropdown color-callout"), renderCallout: function (dropdown, dropdownId, anchorElement, anchorOffset, anchorOrigin, anchorPoint, dropdownOrigin) {
                return (React.createElement(ColorDropdownCallout, { id: dropdownId, focusOnMount: true, anchorElement: anchorElement, anchorOffset: anchorOffset, anchorOrigin: anchorOrigin, anchorPoint: anchorPoint, dropdownOrigin: dropdownOrigin, blurDismiss: true, lightDismiss: true, onDismiss: dropdown.collapse, items: colorItems, filterText: new ObservableValue(""), onSelect: onSelect, selection: selection.current }));
            }, iconProps: { iconName: "FontColor", size: IconSize.medium }, hideDropdownIcon: true }),
        React.createElement(Observer, { color: currentColor }, function (observerProps) { return (React.createElement("div", { className: "style-rule-font-color-bar", style: {
                backgroundColor: observerProps.color
            } })); })));
}
