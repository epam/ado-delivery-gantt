import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Button.css";
import "./ExpandableButton.css";
import * as React from "react";
import { FocusGroupContext } from '../../FocusGroup';
import { FocusZoneContext } from '../../FocusZone';
import { Icon, IconSize } from '../../Icon';
import { Tooltip } from '../../TooltipEx';
import { childCount, css, getSafeId, KeyCode } from '../../Util';
import { getTabIndex } from '../../Utilities/Focus';
var Button = /** @class */ (function (_super) {
    __extends(Button, _super);
    function Button() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.buttonElement = React.createRef();
        _this.onClick = function (event) {
            if (!_this.props.disabled) {
                var onClick = _this.props.onClick;
                // @NOTE: Safari doesnt set focus to buttons when they are clicked, we need this
                //  to help manage the focus state for callouts.
                _this.focus();
                if (onClick) {
                    onClick(event);
                }
            }
            else {
                event.preventDefault();
            }
        };
        _this.onFocus = function (event) {
            if (_this.props.onFocus) {
                _this.props.onFocus(event);
            }
            if (_this.props.id) {
                // @NOTE: Due to test issues using React.16.3.2 we MUST validate the onFocus method.
                _this.context.onFocus && _this.context.onFocus(_this.props.id);
            }
        };
        _this.onKeyDown = function (event) {
            if (!event.defaultPrevented && !_this.props.disabled) {
                if (event.which === KeyCode.enter || event.which === KeyCode.space) {
                    if (_this.props.onClick) {
                        _this.props.onClick(event);
                    }
                    if (!_this.props.href) {
                        event.preventDefault();
                    }
                }
                else if (_this.props.onKeyDown) {
                    _this.props.onKeyDown(event);
                }
            }
        };
        _this.onMouseDown = function (event) {
            if (!event.defaultPrevented) {
                if (_this.props.disabled) {
                    event.preventDefault();
                }
            }
            var onMouseDown = _this.props.onMouseDown;
            if (onMouseDown) {
                onMouseDown(event);
            }
        };
        _this.onMouseLeave = function (event) {
            if (!_this.props.disabled) {
                var onMouseLeave = _this.props.onMouseLeave;
                if (onMouseLeave) {
                    onMouseLeave(event);
                }
            }
        };
        _this.onMouseOver = function (event) {
            if (!_this.props.disabled) {
                var onMouseOver = _this.props.onMouseOver;
                if (onMouseOver) {
                    onMouseOver(event);
                }
            }
        };
        return _this;
    }
    Button.prototype.render = function () {
        var _this = this;
        if (false) {
            if (this.props.danger && this.props.primary) {
                console.warn("primary and danger props are both set to true on Button, only one should be set to true at a time.");
            }
        }
        // Determine if the button is an iconOnly button.
        var iconOnly = this.props.iconProps && !this.props.text && childCount(this.props.children) === 0;
        var tooltipProps = this.props.tooltipProps !== undefined
            ? this.props.tooltipProps
            : iconOnly && this.props.ariaLabel
                ? { text: this.props.ariaLabel }
                : undefined;
        return (React.createElement(FocusZoneContext.Consumer, null, function (zoneContext) {
            var ButtonType = _this.props.href ? "a" : "button";
            // @TODO (line-height): remove the body-m from the text once the line-height is applied globally.
            var role = _this.props.role || (_this.props.href ? "link" : "button");
            var button = (
            // @ts-ignore TypeScript no longer works with dynamic intrinsic component types.
            React.createElement(ButtonType, { autoFocus: !_this.props.href ? _this.props.autoFocus : undefined, "aria-controls": getSafeId(_this.props.ariaControls), "aria-describedby": getSafeId(_this.props.ariaDescribedBy), "aria-disabled": _this.props.disabled || _this.props.ariaDisabled, "aria-expanded": _this.props.ariaExpanded, "aria-haspopup": _this.props.ariaHasPopup, "aria-hidden": _this.props.ariaHidden, "aria-label": _this.props.ariaLabel, "aria-labelledby": _this.props.ariaLabelledBy, "aria-setsize": _this.props.ariaSetSize, "aria-posinset": _this.props.ariaPosInSet, "aria-selected": _this.props.ariaSelected, "aria-checked": _this.props.ariaChecked, "aria-pressed": _this.props.ariaPressed, "aria-roledescription": _this.props.ariaRoleDescription, className: css(_this.props.className, "bolt-button", _this.props.href && "bolt-link-button", _this.props.iconProps && "bolt-icon-button", _this.props.danger && "danger", _this.props.disabled ? "disabled" : "enabled", _this.props.primary && "primary", _this.props.subtle && "subtle", iconOnly && "icon-only", "bolt-focus-treatment"), "data-focuszone": !_this.props.disabled && !_this.props.excludeFocusZone
                    ? css(_this.props.focusZoneId, zoneContext.focuszoneId)
                    : undefined, "data-index": _this.props.dataIndex, "data-is-focusable": !_this.props.excludeFocusZone, href: !_this.props.disabled ? _this.props.href : undefined, id: getSafeId(_this.props.id), onBlur: _this.props.onBlur, onClick: _this.onClick, onMouseLeave: _this.onMouseLeave, onMouseOver: _this.onMouseOver, onKeyDown: _this.onKeyDown, onMouseDown: _this.onMouseDown, onFocus: _this.onFocus, rel: _this.props.rel, role: role, style: _this.props.style, tabIndex: getTabIndex(_this.props, _this.context), target: _this.props.target, type: _this.props.type ? _this.props.type : !_this.props.href ? "button" : undefined, ref: _this.buttonElement },
                _this.props.iconProps &&
                    Icon(__assign(__assign({ size: IconSize.medium }, _this.props.iconProps), { className: css(_this.props.iconProps.className, "left-icon") })),
                _this.props.text && React.createElement("span", { className: "bolt-button-text body-m" }, _this.props.text),
                _this.props.children));
            if (tooltipProps) {
                button = (React.createElement(Tooltip, __assign({ addAriaDescribedBy: true }, tooltipProps), button));
            }
            return button;
        }));
    };
    Button.prototype.focus = function () {
        if (this.buttonElement.current) {
            this.buttonElement.current.focus();
        }
    };
    Button.contextType = FocusGroupContext;
    return Button;
}(React.Component));
export { Button };
