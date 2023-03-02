import { __assign } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./MessageBar.css";
import * as React from "react";
import { ScreenBreakpoints, ScreenContext, ScreenSize } from '../../Core/Util/Screen';
import { format } from '../../Core/Util/String';
import { Breakpoint } from '../../Breakpoint';
import { Button } from '../../Button';
import { FocusZone, FocusZoneDirection } from '../../FocusZone';
import { Icon } from '../../Icon';
import * as Resources from '../../Resources.MessageBar';
import { css } from '../../Util';
import { MessageBarSeverity } from "./MessageBar.Props";
export var MessageBar = function (props) {
    var buttonProps = props.buttonProps, className = props.className, messageClassName = props.messageClassName, iconProps = props.iconProps, onDismiss = props.onDismiss, _a = props.severity, severity = _a === void 0 ? MessageBarSeverity.Info : _a;
    var severityProps = MessageBarSeverityInternal[severity];
    var severityClassName = severityProps.className;
    var renderIconProps = iconProps || severityProps.defaultIconProps;
    var screenSize = React.useContext(ScreenContext);
    var _b = React.useState(screenSize.size.value === ScreenSize.xsmall), mobile = _b[0], setMobile = _b[1];
    var dismissButtonLabel = format(Resources.DismissButtonLabel, getSeverityString(severity));
    return (React.createElement("div", { className: css(className, "bolt-messagebar", severityClassName, mobile && "mobile") },
        React.createElement(Breakpoint, { breakpoints: [1, ScreenBreakpoints.small], onBreakpoint: function (index) { return setMobile(index === 0); } }),
        React.createElement(FocusZone, { direction: FocusZoneDirection.Horizontal },
            React.createElement("div", { className: css("bolt-messagebar-content flex-grow", mobile && screenSize.size.value === ScreenSize.xsmall ? "flex-column" : "flex-row") },
                React.createElement("div", { className: css("flex-row", messageClassName) },
                    React.createElement("div", { className: "bolt-messagebar-icons flex-row" },
                        React.createElement(Icon, __assign({}, renderIconProps, { className: css(renderIconProps.className, "bolt-messagebar-icon medium") }))),
                    React.createElement("div", { className: "bolt-messagebar-message flex-row flex-wrap flex-grow flex-shrink flex-center body-m word-break", role: severity === MessageBarSeverity.Error || severity === MessageBarSeverity.Warning ? "alert" : undefined }, props.children),
                    onDismiss && mobile && (React.createElement(Button, { ariaLabel: dismissButtonLabel, className: "bolt-messagebar-close-button relative flex-self-start", iconProps: { iconName: "Cancel" }, key: "closeButton", onClick: onDismiss, subtle: true }))),
                ((onDismiss && !mobile) || (buttonProps && buttonProps.length > 0)) && (React.createElement("div", { className: "bolt-messagebar-buttons flex-noshrink flex-row flex-center flex-self-stretch" },
                    buttonProps && buttonProps.map(function (value, index) { return React.createElement(Button, __assign({ key: index }, value)); }),
                    onDismiss && !mobile && (React.createElement(Button, { ariaLabel: dismissButtonLabel, className: "bolt-messagebar-close-button", iconProps: { iconName: "Cancel" }, key: "closeButton", onClick: onDismiss, subtle: true }))))))));
};
function getSeverityString(severity) {
    switch (severity) {
        case MessageBarSeverity.Info:
            return Resources.Info;
        case MessageBarSeverity.Error:
            return Resources.Error;
        case MessageBarSeverity.Success:
            return Resources.Success;
        case MessageBarSeverity.Warning:
            return Resources.Warning;
    }
    return "";
}
// Set the function component's name so that Enzyme can recognize it
MessageBar.displayName = "MessageBar";
/**
 * Internal backing struct maps MessageBarSeverity to the necessary data
 */
var MessageBarSeverityInternal = {
    Info: {
        className: "severity-info",
        defaultIconProps: {
            iconName: "Info"
        }
    },
    Success: {
        className: "severity-success",
        defaultIconProps: { iconName: "Completed" }
    },
    Warning: {
        className: "severity-warning",
        defaultIconProps: { iconName: "Warning" }
    },
    Error: {
        className: "severity-error",
        defaultIconProps: { iconName: "ErrorBadge" }
    }
};
