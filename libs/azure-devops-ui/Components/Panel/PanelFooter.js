import { __assign } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Panel.css";
import * as React from "react";
import { Button } from '../../Button';
import { ButtonGroup } from '../../ButtonGroup';
import { SurfaceContext } from '../../Surface';
import { css } from '../../Util';
export var PanelFooter = function (props) {
    var buttonProps = props.buttonProps, className = props.className, showSeparator = props.showSeparator;
    var footerContent = null;
    if (buttonProps) {
        footerContent = (React.createElement(ButtonGroup, { className: "bolt-panel-footer-buttons flex-grow" }, buttonProps.map(function (buttonProps, index) { return (React.createElement(Button, __assign({ key: buttonProps.id || index }, buttonProps))); })));
    }
    else {
        footerContent = props.children;
    }
    return (React.createElement(SurfaceContext.Consumer, null, function (surfaceContext) { return (React.createElement(React.Fragment, null,
        showSeparator && React.createElement("div", { className: "bolt-panel-separator flex-noshrink" }),
        React.createElement("div", { className: css(className, "bolt-panel-footer flex-center", surfaceContext.horizontalClassName) }, footerContent))); }));
};
