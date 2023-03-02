import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Button.css";
import "./ExpandableButton.css";
import * as React from "react";
import { Expandable } from '../../Expandable';
import { Icon, IconSize } from '../../Icon';
import { css, KeyCode } from '../../Util';
import { Location } from '../../Utilities/Position';
import { Button } from "./Button";
var buttonId = 1;
var ExpandableButton = /** @class */ (function (_super) {
    __extends(ExpandableButton, _super);
    function ExpandableButton(props) {
        var _this = _super.call(this, props) || this;
        _this.buttonElement = React.createRef();
        _this.expandable = React.createRef();
        _this.collapse = function () {
            if (_this.expandable.current) {
                _this.expandable.current.collapse();
            }
        };
        _this.expand = function () {
            if (_this.expandable.current) {
                _this.expandable.current.expand();
            }
        };
        _this.renderCallout = function () {
            return _this.props.renderCallout(_this, _this.dropdownId, _this.props.anchorElement
                ? _this.props.anchorElement
                : !_this.props.anchorPoint
                    ? _this.containerElement.current
                        ? _this.containerElement.current
                        : undefined
                    : undefined, _this.props.anchorOffset || { horizontal: 0, vertical: 0 }, _this.props.anchorOrigin || { horizontal: Location.end, vertical: Location.end }, _this.props.anchorPoint, _this.props.dropdownOrigin || { horizontal: Location.end, vertical: Location.start });
        };
        _this.dropdownId = props.dropdownId || "dropdown-" + buttonId++;
        _this.containerElement = props.containerRef || React.createRef();
        return _this;
    }
    ExpandableButton.prototype.render = function () {
        var _this = this;
        // We disable the tooltip when we are expanded. Make sure we dont remove it
        // from the component tree, this causes the button element to get regenerated
        // and focus wont return.
        return (React.createElement(Expandable, { disabled: this.props.disabled, expandKey: this.props.expandKey, onCollapse: this.props.onCollapse, onExpand: this.props.onExpand, renderCallout: this.renderCallout, ref: this.expandable }, function (expandableProps) {
            var _a, _b;
            return (React.createElement("div", { className: css(_this.props.className, "bolt-expandable-button inline-flex-row"), onMouseDown: expandableProps.onMouseDown, onKeyDown: expandableProps.onKeyDown, ref: _this.containerElement },
                React.createElement(Button, __assign({}, _this.props, { ariaControls: expandableProps.expanded ? _this.dropdownId : undefined, ariaExpanded: expandableProps.expanded, ariaHasPopup: true, ariaLabel: (_a = _this.props.ariaLabel) !== null && _a !== void 0 ? _a : (_this.props.tooltipProps && _this.props.tooltipProps.text ? (_b = _this.props.tooltipProps) === null || _b === void 0 ? void 0 : _b.text : ""), className: css(!_this.props.text && !_this.props.children && _this.props.iconProps && "icon-only", expandableProps.expanded && "active", _this.props.buttonClassName), onClick: function (e) {
                        expandableProps.onClick(e);
                        if (_this.props.onClick) {
                            _this.props.onClick(e);
                        }
                        e.preventDefault();
                    }, ref: _this.buttonElement, tooltipProps: _this.props.tooltipProps ? __assign(__assign({}, _this.props.tooltipProps), { disabled: expandableProps.expanded }) : undefined }),
                    _this.props.children,
                    !_this.props.hideDropdownIcon
                        ? Icon({
                            key: "dropdown-icon",
                            className: "icon-right font-weight-normal",
                            iconName: "ChevronDownMed",
                            size: IconSize.small
                        })
                        : undefined)));
        }));
    };
    ExpandableButton.prototype.focus = function () {
        if (this.buttonElement.current) {
            this.buttonElement.current.focus();
        }
    };
    ExpandableButton.defaultProps = {
        expandKey: [KeyCode.downArrow, KeyCode.enter]
    };
    return ExpandableButton;
}(React.Component));
export { ExpandableButton };
