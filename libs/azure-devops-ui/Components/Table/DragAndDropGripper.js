import { __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Table.css";
import * as React from "react";
/**
 * The DragAndDropGripper is meant to be rendered inside of the
 * spacer column of a table, to indicate an item can be dragged in a table.
 */
var DragAndDropGripper = /** @class */ (function (_super) {
    __extends(DragAndDropGripper, _super);
    function DragAndDropGripper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DragAndDropGripper.prototype.render = function () {
        return (React.createElement("div", { className: "bolt-gripper-container bolt-table-cell-content-reveal" },
            React.createElement("div", { className: "bolt-gripper" })));
    };
    return DragAndDropGripper;
}(React.Component));
export { DragAndDropGripper };
export function renderGripper(index, left) {
    if (left) {
        return React.createElement(DragAndDropGripper, null);
    }
    return null;
}
