import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Pill.css";
import * as React from "react";
import { format } from '../../Core/Util/String';
import { Button } from '../../Button';
import { FocusZoneContext } from '../../FocusZone';
import { Icon, IconSize } from '../../Icon';
import * as Resources from '../../Resources.Widgets';
import { css, getSafeId, KeyCode } from '../../Util';
import { darken, getColorString, isDark } from '../../Utilities/Color';
import { getTabIndex } from '../../Utilities/Focus';
import { PillSize, PillVariant } from "./Pill.Props";
var Pill = /** @class */ (function (_super) {
    __extends(Pill, _super);
    function Pill(props) {
        var _this = _super.call(this, props) || this;
        _this.getChildText = function () {
            var text = "";
            React.Children.map(_this.props.children, function (child) {
                if (typeof child === "string") {
                    text += child;
                }
            });
            return text;
        };
        _this.onKeyDown = function (event) {
            var keyCode = event.which;
            if (keyCode === KeyCode.enter) {
                _this.props.onClick && _this.props.onClick();
            }
        };
        _this.onMouseEnter = function (event) {
            _this.props.onMouseEnter && _this.props.onMouseEnter(event);
            _this.setState({
                isHoveringPrimaryElement: true
            });
        };
        /**
         * onMouseLeaveButton fires first; if it leaves the container too
         * onMouseLeave will setState again, which will prevent weird behavior
         */
        _this.onMouseLeave = function (event) {
            _this.props.onMouseLeave && _this.props.onMouseLeave(event);
            _this.setState({
                isHoveringPrimaryElement: false
            });
        };
        _this.onMouseLeaveButton = function () {
            _this.setState({
                isHoveringPrimaryElement: true
            });
        };
        _this.onMouseOverButton = function () {
            _this.setState({
                isHoveringPrimaryElement: false
            });
        };
        _this.state = {
            isHoveringPrimaryElement: false
        };
        return _this;
    }
    Pill.getColorStyle = function (color, isHoveringPrimaryElement, onClick) {
        if (!color) {
            return undefined;
        }
        var renderColor = onClick && isHoveringPrimaryElement ? darken(color, 0.06) : color;
        return { backgroundColor: getColorString(renderColor) };
    };
    Pill.getSizeClass = function (size) {
        switch (size) {
            case PillSize.compact:
                return "compact";
            case PillSize.large:
                return "large";
            case PillSize.regular:
            default:
                return "regular";
        }
    };
    Pill.getVariantClass = function (variant, color) {
        switch (variant) {
            case PillVariant.outlined:
                return "outlined";
            case PillVariant.colored:
                if (color) {
                    return css("colored", isDark(color) ? "dark" : "light");
                }
                else {
                    return "standard";
                }
            case PillVariant.themedStandard:
                return "themed-standard";
            case PillVariant.standard:
            default:
                return "standard";
        }
    };
    Pill.getDerivedStateFromProps = function (props, state) {
        if (false) {
            var color = props.color, iconProps = props.iconProps, onRenderFilledVisual = props.onRenderFilledVisual, _a = props.size, size = _a === void 0 ? PillSize.regular : _a, variant = props.variant;
            // Checking for unsupported compact fields and warning if there are any
            if (size === PillSize.compact) {
                var unsupportedFields = [];
                onRenderFilledVisual && unsupportedFields.push("onRenderFilledVisual");
                if (unsupportedFields.length > 0) {
                    console.warn("Pill Size is Compact, but the following fields were provided: " + unsupportedFields.join(", ") + " - these will be ignored. Consider changing Pill Size to Regular or Large if you need to support these items");
                }
            }
            else {
                if (onRenderFilledVisual && iconProps) {
                    console.warn("onRenderFilledVisual and iconProps have both been supplied; using onRenderFilledVisual");
                }
            }
            if (variant === PillVariant.colored && !color) {
                console.warn("Pill Variant is set to Colored, but not color was provided - Pill will render as Standard");
            }
            else if (color && variant !== PillVariant.colored) {
                console.warn("Color was provided, but Pill Variant is not set to Colored - Pill will render as whatever variant was provided");
            }
        }
        return state;
    };
    Pill.prototype.render = function () {
        var _this = this;
        var _a = this.props, ariaHidden = _a.ariaHidden, contentClassName = _a.contentClassName, className = _a.className, color = _a.color, _b = _a.containsCount, containsCount = _b === void 0 ? false : _b, iconProps = _a.iconProps, id = _a.id, onClick = _a.onClick, onBlur = _a.onBlur, onFocus = _a.onFocus, onRemoveClick = _a.onRemoveClick, onRenderFilledVisual = _a.onRenderFilledVisual, _c = _a.size, size = _c === void 0 ? PillSize.regular : _c, _d = _a.variant, variant = _d === void 0 ? PillVariant.standard : _d;
        var isHoveringPrimaryElement = this.state.isHoveringPrimaryElement;
        var ariaLabel = this.props.ariaLabel || this.getChildText();
        return (React.createElement(FocusZoneContext.Consumer, null, function (zoneContext) { return (React.createElement("div", { className: css(className, "bolt-pill flex-row flex-center", Pill.getVariantClass(variant, color), Pill.getSizeClass(size), containsCount && "count", isHoveringPrimaryElement && "hover", onClick && "clickable", onRenderFilledVisual && "has-filled-visual", iconProps && !onRenderFilledVisual && "has-icon", onRemoveClick && "has-remove-button"), id: getSafeId(id), onClick: onClick, onBlur: onBlur, onMouseEnter: _this.onMouseEnter, onMouseLeave: _this.onMouseLeave, style: Pill.getColorStyle(color, isHoveringPrimaryElement, onClick) },
            onRenderFilledVisual && React.createElement("div", { className: "bolt-pill-filled-visual flex-noshrink" }, onRenderFilledVisual()),
            iconProps && !onRenderFilledVisual && React.createElement(Icon, __assign({}, iconProps, { className: css(iconProps.className, "bolt-pill-icon") })),
            React.createElement("div", { "aria-label": ariaLabel, "aria-hidden": ariaHidden, className: css(contentClassName, "bolt-pill-content text-ellipsis"), "data-focuszone": !_this.props.excludeFocusZone ? zoneContext.focuszoneId : undefined, onFocus: onFocus, onKeyDown: _this.onKeyDown, role: onClick ? "button" : "presentation", tabIndex: onClick || onFocus ? getTabIndex(_this.props) : undefined }, _this.props.children),
            onRemoveClick && (React.createElement(Button, { ariaLabel: format(Resources.RemovePillLabel, ariaLabel), className: "bolt-pill-button", iconProps: { iconName: "Cancel", size: IconSize.inherit }, onClick: onRemoveClick, onMouseLeave: _this.onMouseLeaveButton, onMouseOver: _this.onMouseOverButton, subtle: true, tooltipProps: { text: format(Resources.RemovePillLabel, ariaLabel) } })))); }));
    };
    return Pill;
}(React.Component));
export { Pill };
