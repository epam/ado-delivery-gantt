import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import { getSafeId, noop } from '../../Util';
export var FocusGroupContext = React.createContext({
    onFocus: noop
});
var FocusGroup = /** @class */ (function (_super) {
    __extends(FocusGroup, _super);
    function FocusGroup(props) {
        var _this = _super.call(this, props) || this;
        _this.onFocus = function (focusedElementId) {
            // Only setState if the focusedElement is changing. This prevents us from setting the state
            // when focus keeps getting fired on the same element. Example: Browser keeps losing and
            // getting focus.
            if (_this.state.focusedElementId !== focusedElementId) {
                _this.setState({ focusedElementId: focusedElementId });
            }
        };
        _this.state = { defaultElementId: props.defaultElementId, focusedElementId: props.defaultElementId };
        return _this;
    }
    FocusGroup.getDerivedStateFromProps = function (props, state) {
        if (state.defaultElementId !== props.defaultElementId) {
            return __assign(__assign({}, state), { defaultElementId: props.defaultElementId, focusedElementId: props.defaultElementId });
        }
        return null;
    };
    FocusGroup.prototype.render = function () {
        return (React.createElement(FocusGroupContext.Provider, { value: {
                focusedElementId: this.state.focusedElementId,
                onFocus: this.onFocus
            } }, this.props.children));
    };
    FocusGroup.prototype.focus = function (elementId) {
        var id = getSafeId(elementId || this.state.focusedElementId);
        if (id) {
            var element = document.getElementById(id);
            if (element) {
                element.focus();
            }
        }
    };
    return FocusGroup;
}(React.Component));
export { FocusGroup };
