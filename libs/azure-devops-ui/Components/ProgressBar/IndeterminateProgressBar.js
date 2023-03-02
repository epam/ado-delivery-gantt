import { __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./ProgressBar.css";
import * as React from "react";
import { ObservableLike } from '../../Core/Observable';
import { TimerManagement } from '../../Core/TimerManagement';
import { Observer } from '../../Observer';
import { css } from '../../Util';
var IndeterminateProgressBar = /** @class */ (function (_super) {
    __extends(IndeterminateProgressBar, _super);
    function IndeterminateProgressBar(props) {
        var _this = _super.call(this, props) || this;
        _this.timerManagement = new TimerManagement();
        _this.transitionDurations = 350;
        // Creates a randomize function that takes in a number and spits out a number +/- the percent passed into the function
        _this.randomize25 = function (amount) { return 0.25 * (Math.random() * amount * 2 + (1 - amount)); };
        _this.randomize75 = function (amount) { return 0.75 * (Math.random() * amount * 2 + (1 - amount)); };
        // We never want to hit 100%
        _this.asymptoticApproach = function (x) { return 1 - 1 / Math.sqrt(x + 1); };
        _this.done = function () {
            _this.state.progress !== Infinity && _this.setState({ progress: Infinity });
        };
        _this.increment = function () {
            _this.state.progress !== Infinity && _this.setState({ progress: _this.state.progress + _this.randomize25(1) });
        };
        _this.reset = function () {
            _this.state.progress !== 0 && _this.setState({ progress: 0 });
        };
        _this.shouldRun = function () {
            // If we have a value start the progress.
            return _this.props.loading != undefined;
        };
        _this.updateProgress = function (restart) {
            if (restart) {
                _this.reset();
            }
            else {
                _this.done();
            }
        };
        _this.state = { progress: 0 };
        return _this;
    }
    Object.defineProperty(IndeterminateProgressBar.prototype, "transitionDuration", {
        get: function () {
            return this.state.progress ? this.transitionDurations : 0;
        },
        enumerable: false,
        configurable: true
    });
    IndeterminateProgressBar.prototype.render = function () {
        var _this = this;
        return (React.createElement(Observer, { loading: { observableValue: this.props.loading, filter: this.updateProgress } }, function () {
            return (React.createElement("span", { className: css(_this.props.className, "bolt-progress-bar-container flex-row flex-noshrink flex-grow scroll-hidden") },
                React.createElement("span", { className: css(_this.props.progressBarClassName, "bolt-progress-bar-bar", _this.state.progress === Infinity && "complete"), style: {
                        transform: "scaleX(" + _this.asymptoticApproach(_this.state.progress) + ")"
                    } })));
        }));
    };
    IndeterminateProgressBar.prototype.componentDidMount = function () {
        if (this.shouldRun()) {
            this.scheduleUpdate(this.increment, 0, false);
        }
    };
    IndeterminateProgressBar.prototype.componentDidUpdate = function (prevProps) {
        var _this = this;
        if (this.shouldRun()) {
            if (this.state.progress == Infinity) {
                if (this.props.loadingAnimationComplete) {
                    this.timerManagement.setTimeout(function () {
                        _this.props.loadingAnimationComplete && _this.props.loadingAnimationComplete();
                    }, this.transitionDuration);
                }
            }
            else {
                this.scheduleUpdate(this.increment, this.transitionDuration, false);
            }
        }
        // Reset progress if the loading is undefined, otherwise complete the progress bar if loading is false.
        if (this.props.loading === undefined) {
            this.reset();
        }
        else if ((prevProps.loading === undefined || ObservableLike.getValue(prevProps.loading)) && !ObservableLike.getValue(this.props.loading)) {
            this.done();
        }
    };
    IndeterminateProgressBar.prototype.componentWillUnmount = function () {
        this.timerManagement.dispose();
    };
    IndeterminateProgressBar.prototype.scheduleUpdate = function (updateFn, delay, required) {
        this.timerManagement.setTimeout(function () {
            updateFn();
        }, delay);
    };
    return IndeterminateProgressBar;
}(React.PureComponent));
export { IndeterminateProgressBar };
