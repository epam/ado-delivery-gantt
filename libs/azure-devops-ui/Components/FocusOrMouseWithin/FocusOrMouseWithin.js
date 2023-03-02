import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import { FocusWithin } from '../../FocusWithin';
import { MouseWithin } from '../../MouseWithin';
var FocusOrMouseWithin = /** @class */ (function (_super) {
    __extends(FocusOrMouseWithin, _super);
    function FocusOrMouseWithin() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mouseWithinRef = React.createRef();
        _this.focusWithinRef = React.createRef();
        _this.hasFocus = function () {
            return !!_this.focusWithinRef.current && _this.focusWithinRef.current.hasFocus();
        };
        _this.hasMouse = function () {
            return !!_this.mouseWithinRef.current && _this.mouseWithinRef.current.hasMouse();
        };
        return _this;
    }
    FocusOrMouseWithin.prototype.render = function () {
        var _this = this;
        var _a = this.props, onMouseEnter = _a.onMouseEnter, onMouseLeave = _a.onMouseLeave, onFocus = _a.onFocus, onBlur = _a.onBlur;
        var children;
        return (React.createElement(MouseWithin, { ref: this.mouseWithinRef, onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave }, function (mouseWithinStatus) {
            if (typeof _this.props.children === "function") {
                children = function (props) {
                    return _this.props.children(__assign(__assign({}, props), mouseWithinStatus));
                };
            }
            else {
                var child = React.Children.only(_this.props.children);
                children = React.cloneElement(child, __assign(__assign({}, child.props), mouseWithinStatus), child.props.children);
            }
            return (React.createElement(FocusWithin, { onFocus: onFocus, onBlur: onBlur, ref: _this.focusWithinRef }, children));
        }));
    };
    return FocusOrMouseWithin;
}(React.Component));
export { FocusOrMouseWithin };
