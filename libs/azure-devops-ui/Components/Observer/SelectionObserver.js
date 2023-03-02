import { __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import { UncheckedObserver } from "./Observer";
var SelectionObserver = /** @class */ (function (_super) {
    __extends(SelectionObserver, _super);
    function SelectionObserver() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onSelectionChanged = function (value, action) {
            var shouldUpdate = false;
            if (action === "select" && _this.props.onSelect) {
                shouldUpdate = _this.props.onSelect(value);
            }
            if ((action === "select" || action === "unselect" || action === "set") && _this.props.onSelectionChanged) {
                shouldUpdate = _this.props.onSelectionChanged(_this.props.selection.value, action);
            }
            return shouldUpdate;
        };
        return _this;
    }
    SelectionObserver.prototype.render = function () {
        var selectionObservable = { observableValue: this.props.selection, filter: this.onSelectionChanged };
        return React.createElement(UncheckedObserver, { selectionObservable: selectionObservable }, this.props.children);
    };
    return SelectionObserver;
}(React.Component));
export { SelectionObserver };
