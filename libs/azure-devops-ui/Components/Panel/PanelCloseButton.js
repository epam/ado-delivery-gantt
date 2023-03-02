import "../../CommonImports";
import "../../Core/core.css";
import "./Panel.css";
import * as React from "react";
import { Button } from '../../Button';
import * as Resources from '../../Resources.Layer';
import { css } from '../../Util';
import { PanelCloseButtonSize } from '../../Components/Panel/Panel.Props';
export var PanelCloseButton = function (props) {
    return (React.createElement(Button, { className: css(props.className, "close-button"), ariaLabel: Resources.Close, iconProps: { iconName: props.size === PanelCloseButtonSize.small ? "Cancel" : "Clear" }, onClick: props.onDismiss, subtle: true, tooltipProps: {
            showOnFocus: true,
            text: Resources.Close
        } }));
};
