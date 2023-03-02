import { __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Tree.css";
import "./TreeExpand.css";
import * as React from "react";
import { FixedHeightList } from '../../List';
import { UncheckedObserver } from '../../Observer';
var FixedHeightTree = /** @class */ (function (_super) {
    __extends(FixedHeightTree, _super);
    function FixedHeightTree() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.list = React.createRef();
        _this.onActivateExpand = function (event, tableRow) {
            if (!event.defaultPrevented && tableRow.data.underlyingItem.childItems) {
                _this.props.onToggle && _this.props.onToggle(event, tableRow.data);
                event.preventDefault();
            }
        };
        _this.renderRow = function (rowIndex, item, details) {
            if (!_this.props.renderRow || !details.data) {
                return React.createElement("div", null);
            }
            var rowDetails = {
                ariaRowOffset: details.ariaRowOffset,
                eventDispatch: details.eventDispatch,
                data: details.data,
                itemProvider: _this.props.itemProvider,
                listProps: details.listProps,
                onFocusItem: details.onFocusItem
            };
            return (React.createElement(UncheckedObserver, { data: item.underlyingItem.data }, function (props) {
                if (props.data) {
                    // We need to forward the onToggle handler to the treeItemEx before it is rendered.
                    item.onToggle = item.underlyingItem.childItems ? _this.props.onToggle : undefined;
                    // First determine if the item supplied a custom row rendering function, if not
                    // attempt to use the global row rendering function.
                    var renderRow = item.underlyingItem.data.renderRow || _this.props.renderRow;
                    return renderRow(rowIndex, item, rowDetails);
                }
                else {
                    var renderLoadingRow = _this.props.renderLoadingRow;
                    // If a custom row loading animation is available use it.
                    if (renderLoadingRow) {
                        return renderLoadingRow(rowIndex, rowDetails);
                    }
                    // Return the default row loading animation.
                    return (React.createElement("div", { className: "bolt-list-row-loading" },
                        React.createElement("div", { className: "shimmer shimmer-line", style: { width: Math.random() * 80 + 20 + "%" } }, "\u00A0")));
                }
            }));
        };
        return _this;
    }
    FixedHeightTree.prototype.render = function () {
        var _a = this.props.role, role = _a === void 0 ? "tree" : _a;
        return (React.createElement(FixedHeightList, { className: this.props.className, eventDispatch: this.props.eventDispatch, focuszoneProps: this.props.focuszoneProps, id: this.props.id, itemProvider: this.props.itemProvider, maxHeight: this.props.maxHeight, onActivate: this.onActivateExpand, onFocus: this.props.onFocus, onSelect: this.props.onSelect, pageSize: this.props.pageSize, renderRow: this.renderRow, role: role, rowHeight: this.props.rowHeight, ref: this.list, selection: this.props.selection, singleClickActivation: this.props.singleClickActivation || true, width: this.props.width || "100%" }));
    };
    FixedHeightTree.prototype.getFocusIndex = function () {
        if (this.list.current) {
            return this.list.current.getFocusIndex();
        }
        return -1;
    };
    FixedHeightTree.prototype.getStats = function () {
        if (this.list.current) {
            return this.list.current.getStats();
        }
        return {
            firstMaterialized: -1,
            lastMaterialized: -1
        };
    };
    FixedHeightTree.prototype.scrollIntoView = function (rowIndex, options) {
        if (this.list.current) {
            return this.list.current.scrollIntoView(rowIndex, options);
        }
    };
    return FixedHeightTree;
}(React.Component));
export { FixedHeightTree };
