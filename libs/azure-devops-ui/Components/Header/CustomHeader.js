import { __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Header.css";
import * as React from "react";
import { Spacing, SurfaceContext } from '../../Surface';
import { css } from '../../Util';
var CustomHeader = /** @class */ (function (_super) {
    __extends(CustomHeader, _super);
    function CustomHeader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CustomHeader.prototype.render = function () {
        var _this = this;
        return (React.createElement(SurfaceContext.Consumer, null, function (surfaceContext) {
            return (React.createElement(React.Fragment, null,
                React.createElement("div", { className: css(_this.props.className, "bolt-header flex-row flex-noshrink flex-start", surfaceContext.horizontalClassName, surfaceContext.spacing === undefined && "bolt-header-no-spacing-defined", surfaceContext.spacing === Spacing.condensed && "bolt-header-condensed", surfaceContext.spacing === Spacing.default && "bolt-header-default", surfaceContext.spacing === Spacing.relaxed && "bolt-header-relaxed") }, _this.props.children),
                _this.props.separator && React.createElement("div", { className: "bolt-header-separator flex-noshrink" })));
        }));
    };
    return CustomHeader;
}(React.Component));
export { CustomHeader };
