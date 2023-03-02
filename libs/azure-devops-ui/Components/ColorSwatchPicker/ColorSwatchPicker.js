import "../../CommonImports";
import "../../Core/core.css";
import "./ColorSwatchPicker.css";
import * as React from "react";
import { ColorPip } from "../ColorPip/ColorPip";
import { FocusZone, FocusZoneDirection } from '../../FocusZone';
import { css } from '../../Util';
import { Observer } from '../../Observer';
export var ColorSwatchPicker = function (props) {
    var colors = props.colors, className = props.className, onPipClick = props.onPipClick, selectedIndex = props.selectedIndex;
    return (React.createElement(FocusZone, { activateOnEnter: true, direction: FocusZoneDirection.Horizontal },
        React.createElement("div", { className: css("bolt-colorswatchpicker flex-row", className) },
            React.createElement(Observer, { selectedIndex: selectedIndex }, function (props) {
                return colors.map(function (value, index) {
                    return (React.createElement(ColorPip, { key: index, color: value, isSelected: props.selectedIndex === index, onClick: function (event, color) { return onPipClick(event, color, index); } }));
                });
            }))));
};
