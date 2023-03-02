import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Menu.css";
import "./MenuButton.css";
import * as React from "react";
import { ObservableCollection, ObservableLike, ObservableValue } from '../../Core/Observable';
import { Callout } from '../../Callout';
import { Checkbox } from '../../Checkbox';
import { FocusWithin } from '../../FocusWithin';
import { FocusZone, FocusZoneContext, FocusZoneDirection, FocusZoneKeyStroke } from '../../FocusZone';
import { Icon, IconSize } from '../../Icon';
import { List } from '../../List';
import { MouseWithin } from '../../MouseWithin';
import { Observer } from '../../Observer';
import { Tooltip } from '../../TooltipEx';
import { css, getSafeId, getSafeIdSelector, isArrowKey, KeyCode, preventDefault, setFocusVisible } from '../../Util';
import { Location } from '../../Utilities/Position';
import { ArrayItemProvider } from '../../Utilities/Provider';
import { MenuCell, MenuItemType } from "./Menu.Props";
/**
 * Arrange the items into groups and put separators between them and headings above them as needed.
 *
 * @param items Menu items with optional order and groupKey properties
 * @param groupInfo Optional list of menu groups
 */
export function groupMenuItems(items, groupInfo) {
    var groupMap = {};
    var maxGroupRank = 0;
    var ungroupedItems = [];
    var groups = groupInfo || [];
    // gather known groups
    if (groups.length > 0) {
        maxGroupRank = groups.reduce(function (max, g) { return (g.rank || 0 > max ? g.rank : max); }, 0) || 0;
        for (var _i = 0, groups_1 = groups; _i < groups_1.length; _i++) {
            var g = groups_1[_i];
            groupMap[g.key] = {
                key: g.key,
                rank: g.rank === undefined ? ++maxGroupRank : g.rank,
                items: []
            };
        }
    }
    // put all menu items in groups
    for (var _a = 0, items_1 = items; _a < items_1.length; _a++) {
        var i = items_1[_a];
        if (i.groupKey) {
            if (groupMap[i.groupKey]) {
                groupMap[i.groupKey].items.push(i);
            }
            else {
                groupMap[i.groupKey] = {
                    key: i.groupKey,
                    rank: ++maxGroupRank,
                    items: [i]
                };
            }
        }
        else {
            ungroupedItems.push(i);
        }
    }
    // sort the groups
    var groupList = Object.keys(groupMap).map(function (n) { return groupMap[n]; });
    groupList.sort(function (a, b) { return (a.rank || Number.MAX_VALUE) - (b.rank || Number.MAX_VALUE); });
    // add ungrouped items to end of group list
    groupList.push({
        key: "ungrouped",
        rank: ++maxGroupRank,
        items: ungroupedItems
    });
    // remove dividers from the beginning and end of each group
    groupList.forEach(function (g) {
        var array = g.items;
        while (array.length > 0 && array[0].itemType === MenuItemType.Divider) {
            array.shift();
        }
        while (array.length > 0 && array[array.length - 1].itemType === MenuItemType.Divider) {
            array.pop();
        }
    });
    // merge the groups into the final array
    items = [];
    var first = true;
    for (var _b = 0, groupList_1 = groupList; _b < groupList_1.length; _b++) {
        var g = groupList_1[_b];
        if (g.items.length === 0) {
            continue;
        }
        // add the separator or header for the top of the group
        if (!first) {
            items.push({
                id: "divider_" + g.key,
                itemType: MenuItemType.Divider
            });
        }
        if (first) {
            first = false;
        }
        items = items.concat(g.items);
    }
    return items;
}
var MenuItemProvider = /** @class */ (function (_super) {
    __extends(MenuItemProvider, _super);
    function MenuItemProvider(menuItems, menuGroups) {
        var _this = _super.call(this, menuItems) || this;
        _this.positions = [];
        var derivedItems = [];
        // Process the set of menu items.
        if (menuItems) {
            var shouldGroupMenuItems = false;
            var shouldSortMenuItems = false;
            var lastItemType = MenuItemType.Divider;
            var dividerItem = void 0;
            for (var _i = 0, menuItems_1 = menuItems; _i < menuItems_1.length; _i++) {
                var menuItem = menuItems_1[_i];
                // Exclude hidden items
                if (menuItem.hidden) {
                    continue;
                }
                // Don't allow multiple dividers to render next to each other.
                if (menuItem.itemType === MenuItemType.Divider) {
                    if (menuItem.itemType === lastItemType) {
                        continue;
                    }
                    dividerItem = menuItem;
                }
                else {
                    if (dividerItem) {
                        derivedItems.push(dividerItem);
                        dividerItem = undefined;
                    }
                    derivedItems.push(menuItem);
                }
                lastItemType = menuItem.itemType || MenuItemType.Normal;
                // If the item is ranked or grouped we need to sort and group them.
                shouldGroupMenuItems = !!menuItem.groupKey || shouldGroupMenuItems;
                shouldSortMenuItems = menuItem.rank >= 0 || shouldSortMenuItems;
            }
            if (shouldSortMenuItems) {
                derivedItems.sort(function (a, b) {
                    var aRank = a.rank || Number.MAX_VALUE;
                    var bRank = b.rank || Number.MAX_VALUE;
                    return aRank - bRank;
                });
            }
            if (shouldGroupMenuItems) {
                derivedItems = groupMenuItems(derivedItems, menuGroups);
            }
        }
        // Update the items to be the derived items.
        _this.items = derivedItems;
        return _this;
    }
    // Custom getCount to support excluding the decorative items from the count.
    MenuItemProvider.prototype.getCount = function () {
        if (this.count === undefined) {
            this.count = 0;
            for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
                var menuItem = _a[_i];
                if (menuItem.itemType === MenuItemType.Divider || menuItem.itemType === MenuItemType.Header) {
                    this.positions.push(-1);
                }
                else {
                    this.positions.push(++this.count);
                }
            }
        }
        return this.count;
    };
    MenuItemProvider.prototype.getItem = function (index) {
        return this.items[index];
    };
    MenuItemProvider.prototype.getPosition = function (index) {
        if (!this.positions.length) {
            this.getCount();
        }
        return this.positions[index];
    };
    return MenuItemProvider;
}(ArrayItemProvider));
var Menu = /** @class */ (function (_super) {
    __extends(Menu, _super);
    function Menu(props) {
        var _this = _super.call(this, props) || this;
        _this.containerElement = React.createRef();
        _this.expandItem = function (menuItem, expanded) {
            if (!menuItem && _this.state.expandedIndex.value !== -1) {
                menuItem = _this.itemProvider.getItem(_this.state.expandedIndex.value);
            }
            if (menuItem && menuItem.subMenuProps) {
                for (var index = 0; index < _this.itemProvider.length; index++) {
                    if (menuItem === _this.itemProvider.getItem(index)) {
                        if (expanded) {
                            _this.state.expandedIndex.value = index;
                        }
                        else {
                            _this.state.expandedIndex.value = -1;
                        }
                        break;
                    }
                }
            }
        };
        _this.focus = function () {
            if (_this.containerElement.current) {
                _this.containerElement.current.focus();
            }
        };
        _this.getParent = function () {
            return _this.props.parentMenu;
        };
        _this.onActivate = function (menuItem, event) {
            if (_this.props.onActivate) {
                _this.props.onActivate(menuItem, event);
            }
        };
        _this.renderMenuItem = function (index, menuItem, details) {
            var onFocusItem = details.onFocusItem;
            var menuItemDetails = {
                expandedIndex: _this.state.expandedIndex,
                menu: _this,
                menuProps: _this.props,
                onActivate: _this.onActivate,
                onFocusItem: onFocusItem,
                position: _this.itemProvider.getPosition(index),
                setSize: _this.itemProvider.getCount()
            };
            if (menuItem.renderMenuItem) {
                return menuItem.renderMenuItem(index, menuItem, menuItemDetails);
            }
            var key = menuItem.id;
            switch (menuItem.itemType) {
                case MenuItemType.Divider:
                    return MenuDivider(index, menuItem);
                case MenuItemType.Header:
                    return MenuHeader(index, menuItem);
                default:
                    return React.createElement(MenuItem, { key: key, index: index, menuItem: menuItem, details: menuItemDetails });
            }
        };
        _this.state = {
            expandedIndex: new ObservableValue(-1)
        };
        return _this;
    }
    Menu.prototype.render = function () {
        var _this = this;
        return (React.createElement(Observer, { items: this.props.items }, function (props) {
            _this.itemProvider = new MenuItemProvider(props.items, _this.props.groups);
            return _this.renderList();
        }));
    };
    Menu.prototype.renderList = function () {
        return (React.createElement("div", { className: "bolt-menu-container no-outline", ref: this.containerElement, tabIndex: -1 }, this.itemProvider.length > 0 && (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "bolt-menu-spacer", onMouseDown: preventDefault }),
            React.createElement(List, { ariaLabel: this.props.ariaLabel, className: css(this.props.className, "bolt-menu"), columnCount: 7, focuszoneProps: null, id: this.props.id, itemProvider: this.itemProvider, renderRow: this.renderMenuItem, role: "menu", virtualize: false }),
            React.createElement("div", { className: "bolt-menu-spacer", onMouseDown: preventDefault })))));
    };
    return Menu;
}(React.Component));
export { Menu };
export function MenuDivider(index, menuItem) {
    return (React.createElement("tr", { "aria-hidden": "true", className: css(menuItem.className, "bolt-menuitem-row bolt-list-row bolt-menuitem-divider"), key: menuItem.id || "divider-" + index, onMouseDown: preventDefault },
        React.createElement("td", { className: "bolt-menuitem-cell bolt-list-cell" }),
        React.createElement("td", { className: "bolt-menuitem-cell bolt-list-cell bolt-menuitem-divider-column", colSpan: 5 },
            React.createElement("div", { className: "bolt-menuitem-divider-content" })),
        React.createElement("td", { className: "bolt-menuitem-cell bolt-list-cell" })));
}
export function MenuHeader(index, menuItem) {
    return (React.createElement("tr", { "aria-level": 1, className: css(menuItem.className, "bolt-menuitem-row bolt-list-row bolt-menuitem-header"), key: menuItem.id || "header-" + index, onMouseDown: preventDefault, role: "heading" },
        React.createElement("td", { className: "bolt-menuitem-cell bolt-list-cell" }),
        React.createElement("td", { className: "bolt-menuitem-cell bolt-list-cell", colSpan: 3 },
            React.createElement("div", { className: "bolt-menuitem-cell-content bolt-menuitem-cell-text" }, menuItem.text)),
        React.createElement("td", { className: "bolt-menuitem-cell bolt-list-cell", colSpan: 3 })));
}
var MenuItem = /** @class */ (function (_super) {
    __extends(MenuItem, _super);
    function MenuItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.localKeyStroke = false;
        _this.expanded = false;
        _this.element = React.createRef();
        _this.handleClick = function (event) {
            var menuItem = _this.props.menuItem;
            if (menuItem.disabled) {
                event.preventDefault();
            }
            else if (!_this.expanded) {
                var ownerResponse = void 0;
                // If the menu owner supplied a handler, we will get feedback from them before doing
                // default processing on the menu item.
                if (menuItem.onActivate) {
                    ownerResponse = menuItem.onActivate(menuItem, event);
                }
                // If the owner specifically returned true, we will not perform any defaults.
                if (!ownerResponse) {
                    if (!menuItem.href) {
                        event.preventDefault();
                    }
                    // For menus with sub-menus we will expand it on activation. For other menu items
                    // they are executed.
                    if (menuItem.subMenuProps) {
                        _this.props.details.menu.expandItem(menuItem, true);
                    }
                    else if (menuItem.href) {
                        _this.props.details.onActivate(menuItem, event);
                    }
                    else if (menuItem.checked === undefined || menuItem.readonly) {
                        _this.props.details.onActivate(menuItem, event);
                    }
                }
            }
        };
        // If the click handler doesn't return false explicitly close dismiss the menu.
        _this.onClick = function (event) {
            if (!event.defaultPrevented) {
                _this.handleClick(event);
            }
        };
        _this.onDismissSubMenu = function (dismissAll) {
            if (!dismissAll && _this.element.current) {
                _this.props.details.menu.expandItem(_this.props.menuItem, false);
            }
        };
        _this.onExpandedChange = function (expandedIndex) {
            return (_this.expanded && expandedIndex !== _this.props.index) || (!_this.expanded && expandedIndex === _this.props.index);
        };
        _this.onFocus = function (event) {
            if (_this.element.current === document.activeElement) {
                _this.props.details.onFocusItem(_this.props.index, event);
            }
        };
        // Handle the keydown to expand the menu.
        _this.onKeyDown = function (event) {
            _this.localKeyStroke = true;
            if (!event.defaultPrevented) {
                var menuItem = _this.props.menuItem;
                if (event.which === KeyCode.tab || event.which === KeyCode.space) {
                    event.preventDefault();
                }
                else if (event.which === KeyCode.rightArrow && menuItem.subMenuProps) {
                    event.preventDefault();
                    _this.props.details.menu.expandItem(menuItem, true);
                }
            }
        };
        // Translate the space and enter keys into onClick event for a menuItem.
        _this.onKeyUp = function (event) {
            // If we get focus while a key is down we will get the keyup. We dont want
            // to process this key, it needs to originate from us.
            if (!_this.localKeyStroke) {
                return;
            }
            if (!event.defaultPrevented) {
                if (event.which === KeyCode.enter || event.which === KeyCode.space) {
                    _this.handleClick(event);
                }
            }
        };
        _this.onMouseDown = function (event) {
            if (!event.defaultPrevented) {
                var menuItem = _this.props.menuItem;
                if (menuItem.disabled || _this.props.details.expandedIndex.value === _this.props.index) {
                    event.preventDefault();
                }
            }
        };
        // If you hover over a menu with a submenu we will open it after a short delay
        // or stop the closing timeout.
        _this.onMouseEnter = function () {
            if (!_this.props.menuItem.disabled) {
                if (_this.element.current) {
                    _this.element.current.focus();
                }
                _this.props.details.menu.expandItem(_this.props.menuItem, true);
                setFocusVisible(false);
            }
        };
        // If you leave the menu item and sub-menu we will close the menu after a short delay
        // or stop the open timeout.
        _this.onMouseLeave = function () {
            _this.onDismissSubMenu(false);
        };
        return _this;
    }
    MenuItem.prototype.render = function () {
        var _this = this;
        var _a = this.props, index = _a.index, menuItem = _a.menuItem, details = _a.details;
        var menu = details.menu, position = details.position, setSize = details.setSize;
        var ariaLabel = menuItem.ariaLabel, checked = menuItem.checked, className = menuItem.className, disabled = menuItem.disabled, href = menuItem.href, iconProps = menuItem.iconProps, readonly = menuItem.readonly, secondaryText = menuItem.secondaryText, subMenuProps = menuItem.subMenuProps, target = menuItem.target;
        var id = menuItem.id, rel = menuItem.rel, text = menuItem.text;
        // If this is a link menu item we will use an anchor otherwise a plain div.
        var CellType = href ? "div" : "td";
        var RowType = href ? "a" : "tr";
        // If the menu item is a link is targetting an external window or tab and no explicit rel
        // attribute was supplied we will set noopener.
        if (href && target && !rel) {
            rel = "noopener";
        }
        return (React.createElement(Observer, { checked: checked, expandedIndex: { observableValue: this.props.details.expandedIndex, filter: this.onExpandedChange } }, function (props) {
            _this.expanded = props.expandedIndex === index;
            return (React.createElement(MouseWithin, { enterDelay: 250, leaveDelay: 250, onMouseEnter: _this.onMouseEnter, onMouseLeave: _this.onMouseLeave }, function (mouseWithinEvents) { return (React.createElement(FocusZoneContext.Consumer, null, function (rowContext) { return (React.createElement(FocusWithin, { onFocus: _this.onFocus }, function (focusStatus) { return (React.createElement(FocusZone, { direction: FocusZoneDirection.Horizontal },
                React.createElement(RowType, { "aria-label": ariaLabel, "aria-checked": props.checked === true || undefined, "aria-controls": _this.expanded && subMenuProps ? getSafeId(subMenuProps.id) : undefined, "aria-disabled": disabled ? "true" : undefined, "aria-expanded": subMenuProps ? _this.expanded : undefined, "aria-haspopup": subMenuProps ? true : undefined, "aria-posinset": position, "aria-setsize": setSize, className: css(className, "bolt-menuitem-row bolt-list-row bolt-menuitem-row-normal cursor-pointer", disabled && "disabled", _this.expanded && "expanded", focusStatus.hasFocus && "focused"), "data-focuszone": disabled ? undefined : rowContext.focuszoneId, href: href, id: getSafeId(id), role: props.checked !== undefined ? "menuitemcheckbox" : "menuitem", onBlur: focusStatus.onBlur, onClick: _this.onClick, onFocus: focusStatus.onFocus, onKeyDown: _this.onKeyDown, onKeyUp: _this.onKeyUp, onMouseDown: _this.onMouseDown, onMouseEnter: mouseWithinEvents.onMouseEnter, onMouseLeave: mouseWithinEvents.onMouseLeave, ref: _this.element, rel: rel, tabIndex: disabled ? undefined : -1, target: target },
                    React.createElement(CellType, { className: "bolt-menuitem-cell bolt-list-cell" },
                        React.createElement("div", { className: "bolt-menuitem-cell-content flex-row" })),
                    React.createElement(CellType, { className: "bolt-menuitem-cell bolt-list-cell" }, props.checked !== undefined &&
                        ((menuItem.renderMenuCell &&
                            menuItem.renderMenuCell(MenuCell.State, menuItem, details)) || (React.createElement("div", { className: "bolt-menuitem-cell-content bolt-menuitem-cell-state flex-row" }, readonly === true ? (Icon({
                            className: css(!props.checked && "invisible"),
                            iconName: "CheckMark"
                        })) : (React.createElement(Checkbox, { checked: props.checked, disabled: disabled, excludeFocusZone: true, excludeTabStop: true, onChange: _this.onClick })))))),
                    React.createElement(CellType, { className: "bolt-menuitem-cell bolt-list-cell" }, (menuItem.renderMenuCell && menuItem.renderMenuCell(MenuCell.Icon, menuItem, details)) ||
                        (iconProps && (React.createElement("div", { className: "bolt-menuitem-cell-content bolt-menuitem-cell-icon flex-row" }, Icon(iconProps))))),
                    React.createElement(CellType, { className: "bolt-menuitem-cell bolt-list-cell" }, (menuItem.renderMenuCell &&
                        menuItem.renderMenuCell(MenuCell.PrimaryText, menuItem, details)) || (React.createElement("div", { id: getSafeId(id + "-text"), className: "bolt-menuitem-cell-content bolt-menuitem-cell-text flex-row" }, text ? (React.createElement(Tooltip, { overflowOnly: true, text: text },
                        React.createElement("div", { className: "text-ellipsis" }, text))) : (React.createElement("div", null, "\u00A0"))))),
                    React.createElement(CellType, { className: "bolt-menuitem-cell bolt-list-cell" }, (menuItem.renderMenuCell &&
                        menuItem.renderMenuCell(MenuCell.SecondaryText, menuItem, details)) ||
                        (secondaryText && (React.createElement("div", { className: "bolt-menuitem-cell-content bolt-menuitem-cell-secondary flex-row" }, secondaryText)))),
                    React.createElement(CellType, { className: "bolt-menuitem-cell bolt-list-cell" }, (menuItem.renderMenuCell &&
                        menuItem.renderMenuCell(MenuCell.Action, menuItem, details)) ||
                        (subMenuProps && (React.createElement("div", { className: "bolt-menuitem-cell-content bolt-menuitem-cell-submenu flex-row" },
                            Icon({ iconName: "ChevronRightMed", size: IconSize.small }),
                            _this.expanded && _this.element.current && (React.createElement(ContextualMenu, { anchorElement: _this.element.current, anchorOffset: { horizontal: 0, vertical: -8 }, anchorOrigin: { horizontal: Location.end, vertical: Location.start }, subMenu: true, menuOrigin: { horizontal: Location.start, vertical: Location.start }, menuProps: subMenuProps, onActivate: _this.props.details.onActivate, onDismiss: _this.onDismissSubMenu, parentMenu: menu })))))),
                    React.createElement(CellType, { className: "bolt-menuitem-cell bolt-list-cell" },
                        React.createElement("div", { className: "bolt-menuitem-cell-content flex-row" }))))); })); })); }));
        }));
    };
    return MenuItem;
}(React.Component));
export { MenuItem };
var ContextualMenu = /** @class */ (function (_super) {
    __extends(ContextualMenu, _super);
    function ContextualMenu() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.calloutRef = React.createRef();
        _this.onDismiss = function () {
            if (_this.props.onDismiss) {
                _this.props.onDismiss(false);
            }
        };
        _this.onKeyDown = function (event) {
            if (!event.defaultPrevented) {
                if (event.which === KeyCode.escape || event.which === KeyCode.tab || (event.which === KeyCode.leftArrow && _this.props.subMenu)) {
                    event.preventDefault();
                    if (_this.props.onDismiss) {
                        _this.props.onDismiss(false);
                    }
                }
            }
        };
        _this.onActivate = function (menuItem, event) {
            if (_this.props.menuProps.onActivate) {
                _this.props.menuProps.onActivate(menuItem, event);
            }
            if (_this.props.onActivate) {
                _this.props.onActivate(menuItem, event);
            }
            if (_this.props.onDismiss) {
                _this.props.onDismiss(true);
            }
        };
        _this.preprocessKeyStroke = function (event) {
            if (isArrowKey(event)) {
                return FocusZoneKeyStroke.IgnoreParents;
            }
            return FocusZoneKeyStroke.IgnoreNone;
        };
        return _this;
    }
    ContextualMenu.prototype.render = function () {
        var _this = this;
        var defaultActiveElement = ".bolt-menu-container";
        // Determine which element should be the first to get focus.
        // Headers may be the first row and they wont take focus.
        var items = ObservableLike.getValue(this.props.menuProps.items);
        // Need slice() because order of elements matters in ObservableCollection
        if (this.props.menuProps.items instanceof ObservableCollection) {
            items = items.slice();
        }
        var sortedItems = items.sort(function (a, b) {
            return (a.rank || Number.MAX_VALUE) - (b.rank || Number.MAX_VALUE);
        });
        for (var menuIndex = 0; menuIndex < sortedItems.length; menuIndex++) {
            if (sortedItems[menuIndex].itemType === MenuItemType.Normal || sortedItems[menuIndex].itemType === undefined) {
                var menuItemId = sortedItems[menuIndex].id;
                if (!menuItemId || sortedItems[menuIndex].disabled) {
                    continue;
                }
                defaultActiveElement = getSafeIdSelector(menuItemId);
                break;
            }
        }
        return (React.createElement(Observer, { menuItems: {
                observableValue: this.props.menuProps.items,
                filter: function () {
                    var _a;
                    (_a = _this.calloutRef.current) === null || _a === void 0 ? void 0 : _a.updateLayout();
                    return false;
                }
            } }, function () { return (React.createElement(Callout, { ref: _this.calloutRef, anchorElement: _this.props.anchorElement, anchorOffset: _this.props.anchorOffset, anchorOrigin: _this.props.anchorOrigin, anchorPoint: _this.props.anchorPoint, blurDismiss: true, calloutOrigin: _this.props.menuOrigin, className: _this.props.className, contentClassName: css("bolt-contextual-menu flex-column custom-scrollbar depth-8", _this.props.subMenu && "bolt-contextual-submenu"), contentShadow: true, onDismiss: _this.onDismiss, fixedLayout: _this.props.fixedLayout, focuszoneProps: {
                defaultActiveElement: defaultActiveElement,
                direction: FocusZoneDirection.Vertical,
                focusOnMount: true,
                preprocessKeyStroke: _this.preprocessKeyStroke,
                circularNavigation: true
            }, id: _this.props.menuProps.id + "-callout", portalProps: { className: "bolt-menu-portal" } },
            React.createElement("div", { className: "bolt-contextualmenu-container", onKeyDown: _this.onKeyDown },
                React.createElement(Menu, __assign({}, _this.props.menuProps, { onActivate: _this.onActivate, parentMenu: _this.props.parentMenu }))))); }));
    };
    return ContextualMenu;
}(React.Component));
export { ContextualMenu };
