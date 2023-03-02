import { __assign, __extends, __spreadArrays } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import { ObservableArray, ObservableValue } from '../../Core/Observable';
import { ResponsiveLayout } from '../../ResponsiveLayout';
export var ResizeGroupContext = React.createContext({});
var ResizeGroup = /** @class */ (function (_super) {
    __extends(ResizeGroup, _super);
    function ResizeGroup(props) {
        var _this = _super.call(this, props) || this;
        _this.onLayoutChange = function (hiddenCount) {
            _this.state.hiddenCount.value = hiddenCount;
            if (_this.props.responsiveLayoutProps.onLayoutChange) {
                _this.props.responsiveLayoutProps.onLayoutChange(hiddenCount);
            }
            ResizeGroup.updateOverflowItems(_this.props, _this.state);
        };
        var extraItems = _this.props.extraItems || [];
        _this.state = {
            hiddenCount: new ObservableValue(0),
            overflowItems: new ObservableArray(__spreadArrays(extraItems)),
            editedItems: []
        };
        return _this;
    }
    ResizeGroup.getDerivedStateFromProps = function (nextProps, prevState) {
        ResizeGroup.updateOverflowItems(nextProps, prevState);
        return prevState;
    };
    ResizeGroup.prototype.render = function () {
        return (React.createElement(ResizeGroupContext.Provider, { value: { overflowItems: this.state.overflowItems } },
            React.createElement(ResponsiveLayout, __assign({}, this.props.responsiveLayoutProps, { onLayoutChange: this.onLayoutChange }), this.props.children)));
    };
    ResizeGroup.updateOverflowItems = function (props, state) {
        var extraItems = props.extraItems || [];
        state.overflowItems.value = __spreadArrays(extraItems, props.overflowMenuItems.slice(0, state.hiddenCount.value));
        if (props.useAriaLabelForOverflow) {
            // clear out previously edited menu items text values
            state.editedItems.forEach(function (item) { return (item.text = ""); });
            state.editedItems = [];
            state.overflowItems.value.forEach(function (item) {
                if (!item.text && item.ariaLabel) {
                    item.text = item.ariaLabel;
                    state.editedItems.push(item);
                }
            });
        }
    };
    return ResizeGroup;
}(React.Component));
export { ResizeGroup };
