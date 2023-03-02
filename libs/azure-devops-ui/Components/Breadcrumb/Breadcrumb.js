import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Breadcrumb.css";
import * as React from "react";
import { Icon } from '../../Icon';
import { Link } from '../../Link';
import { MenuCell } from '../../Menu';
import { OverflowButton, ResizeGroup } from '../../ResizeGroup';
import * as Resources from '../../Resources.Breadcrumb';
import { Tooltip } from '../../TooltipEx';
import { css, getSafeId } from '../../Util';
var breadcrumbCount = 0;
var Breadcrumb = /** @class */ (function (_super) {
    __extends(Breadcrumb, _super);
    function Breadcrumb(props) {
        var _this = _super.call(this, props) || this;
        _this.renderBreadcrumbItems = function () {
            var _a = _this.props, excludeFocusZone = _a.excludeFocusZone, excludeTabStop = _a.excludeTabStop, extraContent = _a.extraContent, role = _a.role;
            var _b = _this.state, displayedItems = _b.displayedItems, hiddenItemCount = _b.hiddenItemCount;
            var ariaLabel = _this.props.ariaLabel || Resources.BreadcrumbItemAriaLabel;
            // Find index of last rendered item so the divider icon
            // knows not to render on that item
            var lastItemIndex = displayedItems.length - 1;
            var itemElements = displayedItems.map(function (item, index) { return (React.createElement("div", { className: "bolt-breadcrumb-list-item", key: item.key || String(index) },
                _this.renderItem(item),
                (index !== lastItemIndex || extraContent) && _this.renderDivider(item.key))); });
            itemElements.splice(0, 0, React.createElement("div", { className: css("bolt-breadcrumb-overflow", hiddenItemCount > 0 && "bolt-breadcrumb-overflow-visible"), key: "overflowItem" },
                React.createElement(OverflowButton, { excludeTabStop: excludeTabStop, excludeFocusZone: excludeFocusZone }),
                hiddenItemCount > 0 && hiddenItemCount < displayedItems.length && _this.renderDivider("overflow")));
            if (extraContent) {
                itemElements.push(React.createElement("div", { className: "bolt-breadcrumb-list-item", id: getSafeId("breadcrumb-extra-content"), key: "breadcrumb-extra-content" }, extraContent));
            }
            return (React.createElement("div", { className: css("bolt-breadcrumb flex-row flex-grow", itemElements.length > 0 && "bolt-breadcrumb-with-items"), role: role, "aria-label": ariaLabel }, itemElements));
        };
        _this.renderDivider = function (key) {
            return (React.createElement("div", { key: "BID$" + key, className: "bolt-breadcrumb-divider secondary-text cursor-default flex-noshrink" }, "/"));
        };
        _this.renderItem = function (item) {
            var internalItem = (React.createElement(React.Fragment, null,
                item.iconProps && (React.createElement(Icon, __assign({}, item.iconProps, { className: css("bolt-breadcrumb-item-icon", !item.text && "icon-only", item.iconProps.className) }))),
                item.text && (React.createElement(Tooltip, { overflowOnly: true },
                    React.createElement("span", { className: "bolt-breadcrumb-item-text text-ellipsis" }, item.text)))));
            var ariaDescribedById = "bolt-breadcrumb" + _this.breadcrumbId + "-item-described-by" + item.key;
            if (item.onClick || item.href) {
                return (React.createElement("div", { className: "bolt-breadcrumb-item" },
                    React.createElement(Link, { ariaLabel: item.ariaLabel, ariaDescribedBy: ariaDescribedById, key: "BreadcrumbItem$" + item.key, onClick: item.onClick, href: item.href, excludeFocusZone: _this.props.excludeFocusZone, excludeTabStop: _this.props.excludeTabStop },
                        React.createElement("div", { className: "bolt-breadcrumb-item-text-container" }, internalItem),
                        React.createElement("div", { className: "bolt-breadcrumb-hidden-element", id: getSafeId(ariaDescribedById) }, item.ariaDescription))));
            }
            else {
                return (React.createElement("div", { className: "bolt-breadcrumb-item", "aria-label": item.ariaLabel }, internalItem));
            }
        };
        _this.onLayoutChanged = function (hiddenCount) {
            _this.setState({ hiddenItemCount: hiddenCount });
        };
        _this.onMenuItemActivate = function (menuItem, event) {
            var breadcrumbItem = menuItem.data;
            if (breadcrumbItem.onClick) {
                breadcrumbItem.onClick(event, breadcrumbItem);
            }
        };
        _this.breadcrumbId = breadcrumbCount++;
        _this.state = Breadcrumb.getDerivedStateFromProps(props, _this.state);
        return _this;
    }
    Breadcrumb.getDerivedStateFromProps = function (props, state) {
        var displayedItems = arrangeItems(props.items);
        return __assign(__assign({}, state), { displayedItems: displayedItems, linkItems: getLinkItems(displayedItems) });
    };
    Breadcrumb.prototype.render = function () {
        var _this = this;
        var items = this.state.displayedItems;
        var overflowMenuItems = items.map(function (item, index) {
            return (__assign(__assign({ data: item, iconProps: item.iconProps, text: item.text, id: item.key, href: item.href }, item.menuItemProps), { onActivate: _this.onMenuItemActivate }));
        });
        if (this.props.extraContent) {
            overflowMenuItems.push({
                id: "overflow-item",
                className: css(this.props.extraContentClassName || ""),
                onActivate: function () {
                    return true;
                },
                renderMenuCell: function (menuCell, menuItem, details) {
                    if (menuCell === MenuCell.PrimaryText) {
                        return _this.props.extraContent;
                    }
                }
            });
        }
        var responsiveChildren = overflowMenuItems.map(function (items, index) { return index + 1; });
        var responsiveLayoutProps = { responsiveChildren: responsiveChildren, onLayoutChange: this.onLayoutChanged };
        return (React.createElement("div", { className: css("bolt-breadcrumb-container", items.length > 0 && "bolt-breadcrumb-with-items", this.props.className) },
            React.createElement(ResizeGroup, { responsiveLayoutProps: responsiveLayoutProps, overflowMenuItems: overflowMenuItems }, this.renderBreadcrumbItems())));
    };
    Breadcrumb.defaultProps = {
        items: []
    };
    return Breadcrumb;
}(React.Component));
export { Breadcrumb };
function getLinkItems(displayedItems) {
    return displayedItems.filter(function (item) {
        return item.href || item.onClick;
    });
}
function arrangeItems(items) {
    if (items === undefined) {
        return [];
    }
    // Build map of what is currently in the list of breadcrumb items
    var existingItemsMap = {};
    // If exisiting items have the same id and different priorities, the higher priority item will be shown.
    items.forEach(function (item) {
        if (!existingItemsMap[item.key] || (existingItemsMap[item.key].priority || 0) <= (item.priority || 0)) {
            existingItemsMap[item.key] = item;
        }
    });
    var newItems = [];
    Object.keys(existingItemsMap).forEach(function (key) {
        if (!existingItemsMap[key].hidden) {
            newItems.push(existingItemsMap[key]);
        }
    });
    var shouldSortItems = newItems.some(function (x) { return x.rank >= 0; });
    if (shouldSortItems) {
        // This is not a stable sort. If we pass items with the same rank, we may not always get them back in the
        // same order. We have a stable sort in vssf webplatform, but we're not taking a dependency there.
        newItems.sort(function (a, b) {
            var aRank = a.rank || Number.MAX_VALUE;
            var bRank = b.rank || Number.MAX_VALUE;
            return aRank - bRank;
        });
    }
    return newItems;
}
