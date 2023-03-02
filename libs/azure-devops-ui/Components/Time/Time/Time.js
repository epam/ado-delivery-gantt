import { __assign, __extends } from "tslib";
import "../../../CommonImports";
import "../../../Core/core.css";
import * as React from "react";
import { Tooltip } from '../../../TooltipEx';
import { css } from '../../../Util';
var Time = /** @class */ (function (_super) {
    __extends(Time, _super);
    function Time(props) {
        var _this = _super.call(this, props) || this;
        _this.timerId = 0;
        _this.state = {
            output: ""
        };
        return _this;
    }
    Time.getDerivedStateFromProps = function (props) {
        return { output: props.getTimeString() };
    };
    Time.prototype.render = function () {
        var props = {
            "aria-hidden": this.props.ariaHidden,
            className: css(this.props.className, "bolt-time-item white-space-nowrap")
        };
        var TagName = "span";
        if (this.props.dateTime) {
            TagName = "time";
            props.dateTime = this.props.dateTime.toISOString();
        }
        var ariaLabel = this.props.ariaLabel ? this.state.output + " " + (this.props.ariaLabel || "") : undefined;
        var content = (React.createElement("span", { className: "text-ellipsis", "aria-label": ariaLabel, tabIndex: this.props.tabIndex },
            React.createElement(TagName, __assign({}, props), this.state.output)));
        if (this.props.tooltipProps) {
            content = React.createElement(Tooltip, __assign({}, this.props.tooltipProps), content);
        }
        return content;
    };
    Time.prototype.componentDidUpdate = function (prevProps) {
        this.cancelNextRefresh();
        this.setNextRefresh();
    };
    Time.prototype.componentDidMount = function () {
        this.setNextRefresh();
    };
    Time.prototype.componentWillUnmount = function () {
        this.cancelNextRefresh();
    };
    Time.prototype.cancelNextRefresh = function () {
        if (this.timerId) {
            window.clearTimeout(this.timerId);
            this.timerId = 0;
        }
    };
    Time.prototype.setNextRefresh = function () {
        var _this = this;
        var t = this.props.getNextInterval();
        if (t !== -1) {
            this.timerId = window.setTimeout(function () {
                _this.setState({
                    output: _this.props.getTimeString()
                });
            }, t);
        }
    };
    return Time;
}(React.Component));
export { Time };
