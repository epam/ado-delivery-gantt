import "../../CommonImports";
import "../../Core/core.css";
import "./Panel.css";
import * as React from "react";
import { PanelCloseButtonSize } from '../../Components/Panel/Panel.Props';
import * as Resources from '../../Resources.Layer';
import { Header, TitleSize } from '../../Header';
import { css } from '../../Util';
var closeButtonId = 1;
export var PanelHeader = function (props) {
    var backButtonProps = props.backButtonProps, description = props.description, onDismiss = props.onDismiss, closeButtonSize = props.closeButtonSize, showCloseButton = props.showCloseButton, showSeparator = props.showSeparator, _a = props.titleProps, titleProps = _a === void 0 ? {} : _a;
    if (props.children) {
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: css(props.className, "bolt-panel-header flex-noshrink flex-column scroll-hidden") }, props.children),
            showSeparator && React.createElement("div", { className: "bolt-panel-separator flex-noshrink" })));
    }
    var commandBarItems = [];
    if (showCloseButton !== false) {
        commandBarItems.push({
            ariaLabel: Resources.Close,
            iconProps: { iconName: closeButtonSize === PanelCloseButtonSize.small ? "Cancel" : "Clear" },
            id: "close-button-" + closeButtonId++,
            role: "button",
            onActivate: onDismiss,
            subtle: true
        });
    }
    return (React.createElement(Header, { backButtonProps: backButtonProps, className: css(props.className, "bolt-panel-header"), commandBarItems: commandBarItems, description: description, separator: showSeparator, title: titleProps.text, titleClassName: titleProps.className, titleId: titleProps.id, titleSize: titleProps.size === undefined ? TitleSize.Large : titleProps.size, titleIconProps: titleProps.iconProps }));
};
