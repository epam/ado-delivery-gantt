import { __extends } from "tslib";
import "../../../CommonImports";
import "../../../Core/core.css";
import * as React from "react";
import * as DateUtil from '../../../Utilities/Date';
import { Time } from "../Time/Time";
var Ago = /** @class */ (function (_super) {
    __extends(Ago, _super);
    function Ago(props) {
        var _this = _super.call(this, props) || this;
        _this.getTimeString = function () {
            return DateUtil.ago(_this.props.date, _this.props.format, new Date(), _this.props.locale);
        };
        /**
         * Returns time in milliseconds for next refresh.
         *
         * @return A number indicating time to refresh in milliseconds
         */
        _this.getNextInterval = function () {
            return Ago.agoNextInterval(_this.props.date, _this.props.format);
        };
        _this.state = {
            tooltipProps: {}
        };
        return _this;
    }
    Ago.getDerivedStateFromProps = function (props) {
        var tooltipProps = props.tooltipProps === undefined
            ? {
                renderContent: function () {
                    return DateUtil.tooltipString(props.date);
                }
            }
            : props.tooltipProps;
        return { tooltipProps: tooltipProps };
    };
    Ago.prototype.render = function () {
        return (React.createElement(Time, { ariaLabel: this.props.ariaLabel ? this.props.ariaLabel : DateUtil.tooltipString(this.props.date), className: this.props.className, dateTime: this.props.date, getNextInterval: this.getNextInterval, getTimeString: this.getTimeString, tabIndex: this.props.tabIndex, tooltipProps: this.state.tooltipProps }));
    };
    /**
     * Returns time in milliseconds for next refresh.
     *
     * @return A number indicating time to refresh in milliseconds
     */
    Ago.agoNextInterval = function (date, format, now) {
        if (!now) {
            now = new Date();
        }
        if (!format) {
            format = DateUtil.AgoFormat.Compact;
        }
        // Getting the difference in seconds between now and the specified date
        var diff = now.getTime() - date.getTime();
        var interval;
        if (diff < 2 * DateUtil.minute) {
            interval = 2 * DateUtil.minute - diff;
        }
        else if (diff < 59 * DateUtil.minute && format === DateUtil.AgoFormat.Compact) {
            interval = DateUtil.minute - (diff % DateUtil.minute);
        }
        else if (now.toDateString() === date.toDateString() && format === DateUtil.AgoFormat.Compact) {
            interval = DateUtil.hour - (diff % DateUtil.hour);
        }
        else if ((format === DateUtil.AgoFormat.Extended && now.toDateString() === date.toDateString()) ||
            (diff < DateUtil.week && now.getDay() !== date.getDay())) {
            var tomorrow = new Date(now);
            tomorrow.setDate(now.getDate() + 1);
            tomorrow.setHours(0, 0, 0);
            interval = tomorrow.getTime() - now.getTime();
        }
        else if (now.getFullYear() === date.getFullYear()) {
            var nextYear = new Date(now.getFullYear() + 1, 0, 1);
            interval = nextYear.getTime() - now.getTime();
        }
        if (!interval || interval > DateUtil.week) {
            interval = -1;
        }
        return interval;
    };
    return Ago;
}(React.Component));
export { Ago };
