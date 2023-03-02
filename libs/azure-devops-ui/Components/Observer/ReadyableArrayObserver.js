import { __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import { Observer } from "./Observer";
var ReadyableArrayObserver = /** @class */ (function (_super) {
    __extends(ReadyableArrayObserver, _super);
    function ReadyableArrayObserver() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.loaded = false;
        _this.handleLoaded = function () {
            if (_this.props.data.ready.value && !_this.loaded) {
                _this.props.onReady && _this.props.onReady();
                _this.loaded = true;
            }
        };
        return _this;
    }
    ReadyableArrayObserver.prototype.render = function () {
        var _a = this.props, dataComponent = _a.dataComponent, loadingComponent = _a.loadingComponent, zeroDataComponent = _a.zeroDataComponent;
        return (React.createElement(Observer, { data: this.props.data, onUpdate: this.handleLoaded, ready: this.props.data.ready }, function (props) {
            if (!props.ready) {
                return loadingComponent ? loadingComponent() : null;
            }
            if (props.data.length) {
                return dataComponent(props.data);
            }
            return zeroDataComponent ? zeroDataComponent() : null;
        }));
    };
    ReadyableArrayObserver.prototype.componentDidUpdate = function (prevProps) {
        if (prevProps.data !== this.props.data) {
            this.loaded = false;
            this.handleLoaded();
        }
    };
    ReadyableArrayObserver.prototype.componentDidMount = function () {
        this.handleLoaded();
    };
    return ReadyableArrayObserver;
}(React.Component));
export { ReadyableArrayObserver };
