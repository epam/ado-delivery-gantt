import { __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./ColorPip.css";
import * as React from "react";
import { getColorString } from '../../Utilities/Color';
import { FocusZoneContext } from '../../FocusZone';
import { css } from '../../Util';
var ColorPip = /** @class */ (function (_super) {
    __extends(ColorPip, _super);
    function ColorPip() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.rootRef = React.createRef();
        _this.onClick = function (event) {
            _this.props.onClick && _this.props.onClick(event, _this.props.color);
        };
        return _this;
    }
    ColorPip.prototype.render = function () {
        var _this = this;
        var _a = this.props, className = _a.className, color = _a.color, isSelected = _a.isSelected;
        return (React.createElement(FocusZoneContext.Consumer, null, function (zoneContext) { return (React.createElement("div", { ref: _this.rootRef, className: css(className, "bolt-colorpip"), onClick: _this.onClick, "data-focuszone": zoneContext.focuszoneId, tabIndex: isSelected ? 0 : -1 },
            React.createElement("div", { className: css("bolt-colorpip-content", isSelected && "selected"), style: color ? { backgroundColor: getColorString(color) } : undefined }))); }));
    };
    return ColorPip;
}(React.Component));
export { ColorPip };
