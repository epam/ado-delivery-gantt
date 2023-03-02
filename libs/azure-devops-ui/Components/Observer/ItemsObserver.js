import { __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import { getItemsValue } from '../../Utilities/Provider';
import { UncheckedObserver } from "./Observer";
var ItemsObserver = /** @class */ (function (_super) {
    __extends(ItemsObserver, _super);
    function ItemsObserver() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onItemsChanged = function (value, action) {
            var _a = _this.props, getUnselectableRanges = _a.getUnselectableRanges, items = _a.items, selection = _a.selection;
            selection.onItemsChanged(value, action);
            selection.unselectableRanges = getUnselectableRanges(getItemsValue(items));
            return false;
        };
        return _this;
    }
    ItemsObserver.prototype.componentDidMount = function () {
        this.props.selection.unselectableRanges = this.props.getUnselectableRanges(getItemsValue(this.props.items));
    };
    ItemsObserver.prototype.render = function () {
        var itemsObservable = {
            observableValue: this.props.items,
            filter: this.onItemsChanged
        };
        return React.createElement(UncheckedObserver, { itemsObservable: itemsObservable }, this.props.children);
    };
    return ItemsObserver;
}(React.Component));
export { ItemsObserver };
