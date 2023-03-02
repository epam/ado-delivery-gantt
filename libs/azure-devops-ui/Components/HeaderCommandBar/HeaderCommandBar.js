import { __assign, __extends, __spreadArrays } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./HeaderCommandBar.css";
import * as React from "react";
import { ObservableLike } from '../../Core/Observable';
import { Button } from '../../Button';
import { MenuButton, MenuItemType } from '../../Menu';
import { OverflowButton, ResizeGroup } from '../../ResizeGroup';
import { css } from '../../Util';
import { FILTER_CHANGE_EVENT } from '../../Utilities/Filter';
import { CustomHeaderCommandBar } from "./CustomHeaderCommandBar";
import { getFilterItem } from "./Items";
var headerCommandBarId = 1;
var HeaderCommandBar = /** @class */ (function (_super) {
    __extends(HeaderCommandBar, _super);
    function HeaderCommandBar(props) {
        var _this = _super.call(this, props) || this;
        _this.overflowButtonRef = React.createRef();
        _this.buttonRefs = {};
        _this.moreButtonId = props.moreButtonId || "header-command-bar-menu-button" + headerCommandBarId++;
        return _this;
    }
    HeaderCommandBar.prototype.render = function () {
        var _this = this;
        var _a;
        var items = this.props.items;
        var sortedItems = items.sort(function (a, b) {
            var _a, _b;
            var aRank = (_a = a.rank) !== null && _a !== void 0 ? _a : Number.MAX_VALUE;
            var bRank = (_b = b.rank) !== null && _b !== void 0 ? _b : Number.MAX_VALUE;
            return aRank > bRank ? 1 : aRank < bRank ? -1 : 0;
        });
        var defaultElementId = "";
        this.buttonRefs = {};
        var buttonItems = [];
        var overflowItems = [];
        var extraItems = [];
        var responsiveChildren = [];
        // Anything with important: true will be rendered as a button
        // Anything with important: false will be rendered in overflow
        // If buttonCount is supplied, that many buttons will be rendered into
        // a resizeGroup, and the rest will be overflow.  By default, buttonCount is 3.
        var buttonCount = (_a = this.props.buttonCount) !== null && _a !== void 0 ? _a : 3;
        var isMenuBar = !items.length || items[0].role !== "button";
        sortedItems.forEach(function (value, index) {
            var id = value.id;
            if (value.itemType === MenuItemType.Divider) {
                if (value.important) {
                    buttonItems.push(React.createElement("div", { className: "bolt-header-command-item-separator", key: id }));
                }
                else {
                    extraItems.push(value);
                }
            }
            else {
                var buttonProps = {
                    ariaChecked: ObservableLike.getValue(value.checked),
                    ariaLabel: value.ariaLabel,
                    ariaRoleDescription: value.href ? "link" : "button",
                    ariaControls: value.ariaControls,
                    ariaDescribedBy: value.ariaDescribedBy,
                    ariaExpanded: value.ariaExpanded,
                    ariaHasPopup: value.ariaHasPopup,
                    ariaSetSize: value.ariaSetSize,
                    ariaPosInSet: value.ariaPosInSet,
                    ariaSelected: value.ariaSelected,
                    ariaPressed: value.ariaPressed,
                    className: css(value.className, "bolt-header-command-item-button"),
                    disabled: value.disabled,
                    href: value.href,
                    iconProps: value.iconProps,
                    id: id,
                    primary: value.isPrimary,
                    role: value.role || "menuitem",
                    subtle: value.subtle,
                    target: value.target,
                    text: value.text,
                    tooltipProps: value.tooltipProps
                };
                if (value.important === false || (value.important === undefined && buttonCount === 0)) {
                    extraItems.push(value);
                    return;
                }
                else {
                    if (value.important === undefined) {
                        responsiveChildren.push(index);
                        overflowItems.push(value);
                    }
                    buttonCount--;
                }
                var TagName = Button;
                var ref = React.createRef();
                _this.buttonRefs[id] = ref;
                if (value.subMenuProps) {
                    buttonProps.contextualMenuProps = { menuProps: value.subMenuProps };
                    buttonProps.hideDropdownIcon = value.hideDropdownIcon;
                    TagName = MenuButton;
                }
                else {
                    buttonProps.onClick = function (e) { return value.onActivate && value.onActivate(value, e); };
                }
                if (!defaultElementId && !value.disabled) {
                    defaultElementId = id;
                }
                if (value.renderButton) {
                    buttonItems.push(value.renderButton(buttonProps));
                }
                else {
                    buttonItems.push(React.createElement(TagName, __assign({}, buttonProps, { key: id, ref: ref })));
                }
            }
        });
        buttonItems.push(React.createElement(OverflowButton, { className: css(this.props.overflowClassName, "bolt-header-command-item-button"), id: this.moreButtonId, key: this.moreButtonId, role: "menuitem", ref: this.overflowButtonRef }));
        this.buttonRefs[this.moreButtonId] = this.overflowButtonRef;
        // We will use a role of "menubar", unless the first item has a role of button.
        // This will be the case the close button in Panel Headers.
        if (items.length > 0) {
            return (React.createElement(CustomHeaderCommandBar, { className: this.props.className, focusGroupProps: { defaultElementId: defaultElementId || this.moreButtonId }, role: isMenuBar ? "menubar" : undefined },
                React.createElement(ResizeGroup, { responsiveLayoutProps: { responsiveChildren: responsiveChildren.reverse() }, overflowMenuItems: overflowItems.reverse(), extraItems: extraItems, useAriaLabelForOverflow: this.props.useAriaLabelForOverflow },
                    React.createElement("div", { className: css(this.props.className, "flex-row flex-center flex-grow scroll-hidden rhythm-horizontal-8") }, buttonItems))));
        }
        return null;
    };
    HeaderCommandBar.prototype.focus = function (options) {
        var ref = this.buttonRefs[options.commandBarItemId];
        if (ref && ref.current) {
            ref.current.focus();
        }
    };
    return HeaderCommandBar;
}(React.Component));
export { HeaderCommandBar };
var HeaderCommandBarWithFilter = /** @class */ (function (_super) {
    __extends(HeaderCommandBarWithFilter, _super);
    function HeaderCommandBarWithFilter(props) {
        var _this = _super.call(this, props) || this;
        _this.headerCommandBarRef = React.createRef();
        _this.onFilterClicked = function () {
            _this.props.filterToggled.value = !_this.props.filterToggled.value;
        };
        _this.onFilterChanged = function () {
            var hasChanges = _this.props.filter.hasChangesToReset();
            if (hasChanges !== _this.state.filterHasChanges) {
                _this.setState({
                    filterHasChanges: hasChanges
                });
            }
        };
        _this.state = { filterHasChanges: _this.props.filter.hasChangesToReset() };
        return _this;
    }
    HeaderCommandBarWithFilter.prototype.componentDidMount = function () {
        this.props.filter.subscribe(this.onFilterChanged, FILTER_CHANGE_EVENT);
    };
    HeaderCommandBarWithFilter.prototype.componentWillUnmount = function () {
        this.props.filter.unsubscribe(this.onFilterChanged, FILTER_CHANGE_EVENT);
    };
    HeaderCommandBarWithFilter.prototype.render = function () {
        var items = this.props.items ? __spreadArrays(this.props.items) : [];
        items.push(getFilterItem(this.onFilterClicked, this.state.filterHasChanges));
        return React.createElement(HeaderCommandBar, __assign({}, this.props, { items: items, ref: this.headerCommandBarRef }));
    };
    HeaderCommandBarWithFilter.prototype.focus = function (options) {
        if (this.headerCommandBarRef.current) {
            this.headerCommandBarRef.current.focus(options);
        }
    };
    return HeaderCommandBarWithFilter;
}(React.Component));
export { HeaderCommandBarWithFilter };
