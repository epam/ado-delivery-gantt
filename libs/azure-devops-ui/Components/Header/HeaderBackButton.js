import { __assign } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Header.css";
import * as React from "react";
import { ScreenSize } from '../../Core/Util/Screen';
import { Button } from '../../Button';
import { IconSize } from '../../Icon';
import * as Resources from '../../Resources.Page';
import { css } from '../../Util';
import { ScreenSizeObserver } from '../../Utilities/ScreenSize';
export function HeaderBackButton(props) {
    var buttonProps = props.buttonProps;
    return (React.createElement(ScreenSizeObserver, null, function (screenSizeProps) {
        var smallScreen = screenSizeProps.screenSize === ScreenSize.xsmall;
        return (React.createElement(Button, __assign({ ariaLabel: Resources.Back, iconProps: {
                iconName: "Back",
                size: smallScreen ? IconSize.small : undefined
            }, subtle: true }, buttonProps, { text: smallScreen ? (buttonProps.text ? buttonProps.text : Resources.Back) : undefined, className: css(buttonProps.className, "bolt-header-back-button justify-end") })));
    }));
}
