import { __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./PillGroup.css";
import * as React from "react";
import { Button } from '../../Button';
import { IconSize } from '../../Icon';
import { Intersection, IntersectionContext } from '../../Intersection';
import { Pill, PillSize } from '../../Pill';
import * as Resources from '../../Resources.Widgets';
import { css } from '../../Util';
import { PillGroupOverflow } from "./PillGroup.Props";
var PillGroup = /** @class */ (function (_super) {
    __extends(PillGroup, _super);
    function PillGroup(props) {
        var _this = _super.call(this, props) || this;
        _this.observing = false;
        _this.onClick = function (event) {
            _this.setState({
                overflow: _this.state.overflow === _this.props.overflow ? PillGroupOverflow.wrap : _this.props.overflow
            });
            event === null || event === void 0 ? void 0 : event.preventDefault();
        };
        _this.observeElement = function (element) {
            if (element && _this.intersectionContext && !_this.observing) {
                _this.intersectionContext.observe(element);
                _this.observing = true;
            }
        };
        _this.onIntersect = function (entries) {
            _this.setState({
                // Only want the effect if the right side is cut off
                overflowing: Math.round(entries[0].rootBounds.right) < Math.round(entries[0].boundingClientRect.right)
            });
        };
        _this.state = { overflowing: false, overflow: _this.props.overflow };
        return _this;
    }
    PillGroup.prototype.render = function () {
        var _this = this;
        var _a = this.props, onMouseEnter = _a.onMouseEnter, onMouseLeave = _a.onMouseLeave;
        var overflow = this.state.overflow;
        var contents, extend;
        extend = (React.createElement(Pill, { size: PillSize.compact },
            React.createElement(Button, { ariaLabel: this.state.overflow === this.props.overflow ? Resources.ShowMore : Resources.ShowLess, className: "bolt-pill-button", iconProps: { iconName: "More", size: IconSize.inherit }, onClick: this.onClick, subtle: true, tooltipProps: { text: this.state.overflow === this.props.overflow ? Resources.ShowMore : Resources.ShowLess } })));
        // If we have fade enabled put the intersection observer and the overflow element in place.
        if (overflow === PillGroupOverflow.fade) {
            contents = (React.createElement(IntersectionContext.Consumer, null, function (intersectionContext) {
                _this.intersectionContext = intersectionContext;
                return (React.createElement("div", { className: "bolt-pill-overflow flex-row" },
                    React.createElement("div", { className: "bolt-pill-group-inner flex-row" },
                        _this.state.overflowing && extend,
                        _this.props.children),
                    React.createElement("div", { className: "bolt-pill-observe", ref: function (element) { return _this.observeElement(element); } })));
            }));
        }
        else {
            contents = (React.createElement("div", { className: "bolt-pill-group-inner flex-row" },
                this.state.overflowing && extend,
                this.props.children));
        }
        // Wrap the pill group in the outer shell.
        contents = (React.createElement("div", { className: css(this.props.className, "bolt-pill-group flex-row", overflow === PillGroupOverflow.wrap
                ? "overflow-wrap"
                : overflow === PillGroupOverflow.fade
                    ? this.state.overflowing && "overflow-fade"
                    : undefined), onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave }, contents));
        // If we have fade enabled wrap the PillGroup in the intersection.
        if (overflow === PillGroupOverflow.fade) {
            contents = React.createElement(Intersection, null, contents);
        }
        return contents;
    };
    PillGroup.prototype.componentDidMount = function () {
        if (this.intersectionContext) {
            this.intersectionContext.register(this.onIntersect);
        }
    };
    PillGroup.prototype.componentWillUnmount = function () {
        if (this.intersectionContext) {
            this.intersectionContext.unregister(this.onIntersect);
        }
    };
    return PillGroup;
}(React.Component));
export { PillGroup };
