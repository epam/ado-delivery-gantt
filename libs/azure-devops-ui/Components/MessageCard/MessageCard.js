import "../../CommonImports";
import "../../Core/core.css";
import "./MessageCard.css";
import * as React from "react";
import { CustomCard } from '../../Card';
import { MessageBar } from '../../MessageBar';
import { css } from '../../Util';
export var MessageCard = function (props) {
    var buttonProps = props.buttonProps, children = props.children, className = props.className, severity = props.severity, iconProps = props.iconProps, messageBarClassName = props.messageBarClassName, onDismiss = props.onDismiss;
    return (React.createElement(CustomCard, { className: css(className, "bolt-messagecard") },
        React.createElement(MessageBar, { buttonProps: buttonProps, children: children, className: messageBarClassName, iconProps: iconProps, onDismiss: onDismiss, severity: severity })));
};
MessageCard.displayName = "MessageCard";
