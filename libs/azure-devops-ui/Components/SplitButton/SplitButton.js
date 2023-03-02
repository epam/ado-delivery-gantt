import { __assign } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./SplitButton.css";
import * as React from "react";
import { Button } from '../../Button';
import { Expandable } from '../../Expandable';
import { FocusZone, FocusZoneContext, FocusZoneDirection } from '../../FocusZone';
import { IconSize } from '../../Icon';
import { ContextualMenu } from '../../Menu';
import * as Resources from '../../Resources.Widgets';
import { css } from '../../Util';
import { Location } from '../../Utilities/Position';
export function SplitButton(props) {
    var anchor = React.useRef();
    var expandableRef = props.expandableRef || React.useRef();
    var buttonRef = props.buttonRef, buttonProps = props.buttonProps, className = props.className, disabled = props.disabled, menuButtonProps = props.menuButtonProps, primary = props.primary, subtle = props.subtle;
    var renderCallout = function () {
        var contextualMenuProps = typeof props.menuButtonProps.contextualMenuProps === "function"
            ? props.menuButtonProps.contextualMenuProps()
            : props.menuButtonProps.contextualMenuProps;
        return (React.createElement(ContextualMenu, { anchorElement: anchor.current, anchorOrigin: { horizontal: Location.end, vertical: Location.end }, menuOrigin: { horizontal: Location.end, vertical: Location.start }, menuProps: contextualMenuProps.menuProps, onActivate: function (menuItem, event) {
                if (contextualMenuProps.onActivate) {
                    contextualMenuProps.onActivate(menuItem, event);
                }
                expandableRef.current && expandableRef.current.collapse();
            }, onDismiss: function () { return expandableRef.current && expandableRef.current.collapse(); } }));
    };
    return (React.createElement(FocusZoneContext.Consumer, null, function (zoneContext) {
        var button = (React.createElement("div", { className: css(className, "bolt-split-button flex-stretch inline-flex-row"), ref: anchor },
            React.createElement(Button, __assign({}, buttonProps, { className: css("bolt-split-button-main", buttonProps.className), disabled: disabled || buttonProps.disabled, focusZoneId: zoneContext.direction === FocusZoneDirection.Vertical ? zoneContext.focuszoneId : undefined, primary: primary, subtle: subtle, ref: buttonRef })),
            React.createElement("div", { className: css("bolt-split-button-divider flex-noshrink", primary && "primary", disabled && "disabled") }),
            React.createElement(Expandable, { disabled: disabled, onCollapse: menuButtonProps.onCollapse, onExpand: menuButtonProps.onExpand, ref: expandableRef, renderCallout: props.renderCallout || renderCallout }, function (expandableProps) {
                return (React.createElement("div", { className: "inline-flex-row", onMouseDown: expandableProps.onMouseDown, onKeyDown: expandableProps.onKeyDown },
                    React.createElement(Button, __assign({ ariaExpanded: expandableProps.expanded, ariaLabel: Resources.MoreActions, iconProps: {
                            iconName: "ChevronDownMed",
                            size: IconSize.small
                        }, text: undefined }, menuButtonProps, { className: css("bolt-split-button-option flex-self-stretch body-s", menuButtonProps.className, expandableProps.expanded && "active"), disabled: disabled, onClick: expandableProps.onClick, primary: primary, subtle: subtle }))));
            })));
        if (zoneContext.direction !== FocusZoneDirection.Horizontal) {
            button = React.createElement(FocusZone, { direction: FocusZoneDirection.Horizontal }, button);
        }
        return button;
    }));
}
