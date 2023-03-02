import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Tabs.css";
import * as React from "react";
import { Orientation, TabSize } from '../../Components/Tabs/Tabs.Props';
import { ObservableLike } from '../../Core/Observable';
import { FocusZone, FocusZoneDirection } from '../../FocusZone';
import { css } from '../../Util';
import { Tab } from "./Tab";
/**
 * Renders all children as focusable, selectable elements and indicates whether or not they are
 * currently selected.
 */
var Tabs = /** @class */ (function (_super) {
    __extends(Tabs, _super);
    function Tabs(props) {
        var _this = _super.call(this, props) || this;
        _this.onTabClick = function (newTabId) {
            var onSelectedTabChanged = _this.props.onSelectedTabChanged;
            if (onSelectedTabChanged) {
                onSelectedTabChanged(newTabId);
            }
        };
        _this.onSelectedTabIdChanged = function () {
            _this.forceUpdate();
        };
        if (ObservableLike.isObservable(props.selectedTabId)) {
            props.selectedTabId.subscribe(_this.onSelectedTabIdChanged);
        }
        return _this;
    }
    Tabs.prototype.componentWillUnmount = function () {
        if (ObservableLike.isObservable(this.props.selectedTabId)) {
            this.props.selectedTabId.unsubscribe(this.onSelectedTabIdChanged);
        }
    };
    Tabs.prototype.render = function () {
        var _this = this;
        var _a = this.props, _b = _a.tabSize, tabSize = _b === void 0 ? TabSize.Tall : _b, _c = _a.orientation, orientation = _c === void 0 ? Orientation.Horizontal : _c;
        var selectedTabId = this.props.selectedTabId && ObservableLike.getValue(this.props.selectedTabId);
        var childrenCount = 0;
        var childIndex = 0;
        var idToIndex = {};
        var defaultId;
        React.Children.map(this.props.children, function (child) {
            if (child && child.type === Tab) {
                idToIndex[child.props.id] = childIndex++;
                childrenCount++;
                if (!defaultId && child.props.id) {
                    defaultId = "tab-" + child.props.id;
                }
            }
        });
        var children = React.Children.map(this.props.children, function (child) {
            if (child && typeof child.type !== "string") {
                // We don't want to pass along the following props, unless the
                // child is a React component that will presumably know what
                // to do with them.
                var isSelected = (child.props.id && child.props.id.toLocaleLowerCase()) === (selectedTabId && selectedTabId.toLocaleLowerCase());
                var onClick = _this.onTabClick;
                return React.cloneElement(child, __assign(__assign({}, child.props), { isSelected: isSelected,
                    onClick: onClick, index: idToIndex[child.props.id], setSize: childrenCount }));
            }
            return child;
        });
        var orientationClass = orientation === Orientation.Vertical ? "flex-column" : "flex-row";
        var focusZoneDirection = orientation === Orientation.Vertical ? FocusZoneDirection.Vertical : FocusZoneDirection.Horizontal;
        return (React.createElement(FocusZone, { direction: focusZoneDirection, focusGroupProps: { defaultElementId: defaultId } },
            React.createElement("div", { "aria-label": this.props.ariaLabel, className: css(this.props.className, "bolt-tabs", orientationClass, tabSize), role: "tablist" }, children)));
    };
    return Tabs;
}(React.Component));
export { Tabs };
