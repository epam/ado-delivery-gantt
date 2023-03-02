import * as React from "react";
import { ObservableValue } from '../../Core/Observable';
export var ScreenBreakpoints;
(function (ScreenBreakpoints) {
    /**
     * Smallest breakpoint used to react which usually corresponds to a mobile screen < 600px.
     */
    ScreenBreakpoints[ScreenBreakpoints["xsmall"] = 1] = "xsmall";
    /**
     * Medium breakpoint used to react when the screen size >= 600px and less than
     * the next breakpoint if exists.
     */
    ScreenBreakpoints[ScreenBreakpoints["small"] = 600] = "small";
    /**
     * Medium breakpoint used to react when the screen size >= 1024px and less than
     * the next breakpoint if exists.
     */
    ScreenBreakpoints[ScreenBreakpoints["medium"] = 1024] = "medium";
    /**
     * Large breakpoint used to react when the screen size >= 1366px and less than
     * the next breakpoint if exists.
     */
    ScreenBreakpoints[ScreenBreakpoints["large"] = 1366] = "large";
    /**
     * Largest breakpoint used to react when the screen size >= 1920px and less than
     * the next breakpoint if exists.
     */
    ScreenBreakpoints[ScreenBreakpoints["xlarge"] = 1920] = "xlarge";
})(ScreenBreakpoints || (ScreenBreakpoints = {}));
export var ScreenSize;
(function (ScreenSize) {
    ScreenSize[ScreenSize["xsmall"] = 0] = "xsmall";
    ScreenSize[ScreenSize["small"] = 1] = "small";
    ScreenSize[ScreenSize["medium"] = 2] = "medium";
    ScreenSize[ScreenSize["large"] = 3] = "large";
    ScreenSize[ScreenSize["xlarge"] = 4] = "xlarge";
})(ScreenSize || (ScreenSize = {}));
var ScreenContextImp = /** @class */ (function () {
    function ScreenContextImp() {
        var _this = this;
        this.onResize = function () {
            var size = _this.getCurrentSize();
            if (_this.size.value !== size) {
                _this.size.value = size;
            }
        };
        this.size = new ObservableValue(this.getCurrentSize());
        window.addEventListener("resize", this.onResize);
    }
    ScreenContextImp.prototype.getCurrentSize = function () {
        if (window.innerWidth >= ScreenBreakpoints.xlarge) {
            return ScreenSize.xlarge;
        }
        else if (window.innerWidth >= ScreenBreakpoints.large) {
            return ScreenSize.large;
        }
        else if (window.innerWidth >= ScreenBreakpoints.medium) {
            return ScreenSize.medium;
        }
        else if (window.innerWidth >= ScreenBreakpoints.small) {
            return ScreenSize.small;
        }
        else {
            return ScreenSize.xsmall;
        }
    };
    return ScreenContextImp;
}());
export var ScreenContext = React.createContext(new ScreenContextImp());
