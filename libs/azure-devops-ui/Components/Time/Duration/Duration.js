import { __extends } from "tslib";
import "../../../CommonImports";
import "../../../Core/core.css";
import * as React from "react";
import * as DateUtil from '../../../Utilities/Date';
import { Time } from "../Time/Time";
import * as Resources from '../../../Resources.Widgets';
import { format } from '../../../Core/Util/String';
var Duration = /** @class */ (function (_super) {
    __extends(Duration, _super);
    function Duration(props) {
        var _this = _super.call(this, props) || this;
        _this.getTimeString = function () {
            return DateUtil.duration(_this.props.startDate, _this.props.endDate);
        };
        /**
         * Returns time in milliseconds for next refresh.
         *
         * @return A number indicating time to refresh in milliseconds
         */
        _this.getNextInterval = function () {
            return Duration.durationNextInterval(_this.props.startDate, _this.props.endDate);
        };
        _this.state = {
            tooltipProps: {}
        };
        return _this;
    }
    Duration.getDerivedStateFromProps = function (props) {
        var tooltipProps = props.tooltipProps === undefined
            ? {
                renderContent: function () {
                    return format(Resources.Started, DateUtil.tooltipString(props.startDate));
                }
            }
            : props.tooltipProps;
        return { tooltipProps: tooltipProps };
    };
    Duration.prototype.render = function () {
        return (React.createElement(Time, { ariaHidden: this.props.ariaHidden, ariaLabel: this.props.ariaLabel ? this.props.ariaLabel : DateUtil.tooltipString(this.props.startDate), className: this.props.className, getNextInterval: this.getNextInterval, getTimeString: this.getTimeString, tabIndex: this.props.tabIndex, tooltipProps: this.state.tooltipProps }));
    };
    /**
     * Returns time in milliseconds for next refresh.
     *
     * @return A number indicating time to refresh in milliseconds
     */
    Duration.durationNextInterval = function (startDate, endDate, now) {
        if (!endDate) {
            if (!now) {
                endDate = new Date();
            }
            else {
                endDate = now;
            }
            // Getting the difference in seconds between now and the specified date
            var diff = endDate.getTime() - startDate.getTime();
            var interval = DateUtil.minute;
            if (diff < DateUtil.day) {
                interval = DateUtil.second;
            }
            else {
                interval = DateUtil.minute - (diff % DateUtil.minute);
            }
            return interval;
        }
        else {
            return -1;
        }
    };
    return Duration;
}(React.Component));
export { Duration };
