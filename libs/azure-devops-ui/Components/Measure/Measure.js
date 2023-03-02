import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import { shimRef } from '../../Util';
/**
 * Measures the child component; expects exactly one child
 * Use with caution; improper use can cause severe layout thrashing
 */
var Measure = /** @class */ (function (_super) {
    __extends(Measure, _super);
    function Measure() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.childRef = React.createRef();
        _this.lastWidth = -1;
        _this.lastHeight = -1;
        _this.onResize = function () {
            var childElement = _this.childRef.current;
            if (childElement) {
                var childRectangle = childElement.getBoundingClientRect();
                // Anti-layout-thrashing - don't pass back up
                if (_this.lastWidth != childRectangle.width || _this.lastHeight != childRectangle.height) {
                    _this.props.onMeasure && _this.props.onMeasure(childRectangle.width, childRectangle.height);
                    _this.lastWidth = childRectangle.width;
                    _this.lastHeight = childRectangle.height;
                }
            }
        };
        return _this;
    }
    Measure.prototype.render = function () {
        var child = React.Children.only(this.props.children);
        this.childRef = shimRef(child);
        return React.cloneElement(child, __assign(__assign({}, child.props), { ref: this.childRef }));
    };
    Measure.prototype.componentDidMount = function () {
        window.addEventListener("resize", this.onResize);
        this.onResize();
    };
    Measure.prototype.componentDidUpdate = function () {
        this.onResize();
    };
    Measure.prototype.componentWillUnmount = function () {
        window.removeEventListener("resize", this.onResize);
    };
    return Measure;
}(React.Component));
export { Measure };
