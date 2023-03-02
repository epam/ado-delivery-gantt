import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import * as Utils_Accessibility from '../../Core/Util/Accessibility';
import { FocusGroupContext } from '../../FocusGroup';
import { FocusZoneContext } from '../../FocusZone';
import { MouseWithin } from '../../MouseWithin';
import * as Resources from '../../Resources.Core';
import { css, getSafeId, KeyCode, setFocusVisible } from '../../Util';
import { getTabIndex } from '../../Utilities/Focus';
var Expandable = /** @class */ (function (_super) {
    __extends(Expandable, _super);
    function Expandable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.state = { expanded: false };
        _this.collapse = function () {
            if (_this.state.expanded) {
                _this.setState({ expanded: false });
                Utils_Accessibility.announce(Resources.Collapsed, true);
                if (_this.props.onCollapse) {
                    _this.props.onCollapse();
                }
            }
        };
        _this.expand = function () {
            if (!_this.state.expanded) {
                _this.setState({ expanded: !_this.state.expanded });
                Utils_Accessibility.announce(Resources.Expanded, true);
                if (_this.props.onExpand) {
                    _this.props.onExpand();
                }
            }
        };
        _this.onClick = function (event) {
            if (!_this.props.disabled) {
                if (!event.defaultPrevented) {
                    if (!_this.state.expanded && !_this.ignoreClick) {
                        _this.expand();
                        event.preventDefault();
                    }
                }
            }
            else {
                event.preventDefault();
            }
        };
        _this.onKeyDown = function (event) {
            if (!event.defaultPrevented) {
                // If the control key is pressed we want to navigate in a focus zone and not open the menu
                if (event.ctrlKey) {
                    return;
                }
                if (!_this.state.expanded && _this.isExpandKey(event)) {
                    _this.ignoreClick = false;
                    _this.expand();
                    event.preventDefault();
                }
            }
        };
        _this.onMouseDown = function () {
            // If the callout is expanded when we click on it, we want to ignore the click
            // and let the blur occur and close the callout.
            _this.ignoreClick = _this.state.expanded;
        };
        return _this;
    }
    Expandable.prototype.render = function () {
        var expanded = this.state.expanded;
        var child = this.props.children;
        return (React.createElement(React.Fragment, null,
            child({ expanded: expanded, onClick: this.onClick, onKeyDown: this.onKeyDown, onMouseDown: this.onMouseDown }),
            expanded && this.props.renderCallout && this.props.renderCallout()));
    };
    Expandable.prototype.isExpandKey = function (event) {
        return (Array.isArray(this.props.expandKey) && this.props.expandKey.indexOf(event.which) !== -1) || event.which === this.props.expandKey;
    };
    Expandable.defaultProps = {
        expandKey: KeyCode.downArrow
    };
    return Expandable;
}(React.Component));
export { Expandable };
var expandableContainerId = 1;
/**
 * ExpandableContainer is a specialized form of Expandable and generally shouldn't be used.
 * It's main goal is to provider mouse enter/leave behavior for collapsing.
 *
 * @NOTE: This component MAY be deprecated in the future, use <Expandable /> instead.
 */
var ExpandableContainer = /** @class */ (function (_super) {
    __extends(ExpandableContainer, _super);
    function ExpandableContainer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.element = React.createRef();
        _this.expandedOnHover = false;
        _this.expandable = React.createRef();
        _this.expandableId = "expandableContainer-" + expandableContainerId++;
        _this.collapse = function () {
            if (_this.expandable.current) {
                _this.expandable.current.collapse();
            }
        };
        _this.expand = function () {
            if (_this.expandable.current) {
                _this.expandable.current.expand();
            }
        };
        _this.onFocus = function (event) {
            // Only call onFocus for the FocusGroup is the expandable itself is getting focus.
            // Otherwise it is going to a child element and it should manage focus appropriately.
            if (_this.props.id && (!_this.element.current || _this.element.current === event.target)) {
                _this.context.onFocus(_this.props.id);
            }
        };
        _this.onMouseEnter = function () {
            if (_this.props.expandOnHover) {
                _this.expandedOnHover = true;
                setFocusVisible(false);
                _this.expand();
            }
        };
        _this.onMouseLeave = function () {
            if (_this.expandedOnHover) {
                _this.collapse();
            }
        };
        _this.renderCallout = function () {
            return _this.props.renderCallout(_this.expandable.current, _this.expandableId, _this.element.current);
        };
        return _this;
    }
    ExpandableContainer.prototype.render = function () {
        var _this = this;
        return (React.createElement(FocusZoneContext.Consumer, null, function (zoneContext) { return (React.createElement(MouseWithin, { enterDelay: _this.props.expandDelay, leaveDelay: _this.props.collapseDelay, onMouseEnter: _this.onMouseEnter, onMouseLeave: _this.onMouseLeave, updateStateOnMouseChange: false }, function (mouseContext) { return (React.createElement(Expandable, __assign({}, _this.props, { renderCallout: undefined, ref: _this.expandable }), function (expandableProps) { return (React.createElement("div", { "aria-controls": expandableProps.expanded ? getSafeId(_this.props.expandableId) : undefined, "aria-expanded": expandableProps.expanded, "aria-haspopup": true, "aria-label": _this.props.ariaLabel, className: css(_this.props.className, "bolt-expandable-container flex-row flex-center", expandableProps.expanded && "expanded"), "data-focuszone": !_this.props.disabled && !_this.props.excludeFocusZone ? zoneContext.focuszoneId : undefined, id: getSafeId(_this.props.id), onClick: expandableProps.onClick, onFocus: _this.onFocus, onKeyDown: expandableProps.onKeyDown, onMouseDown: expandableProps.onMouseDown, onMouseEnter: mouseContext.onMouseEnter, onMouseLeave: mouseContext.onMouseLeave, role: _this.props.role || "button", tabIndex: getTabIndex(_this.props, _this.context), ref: _this.element },
            _this.props.children,
            expandableProps.expanded && _this.renderCallout())); })); })); }));
    };
    ExpandableContainer.contextType = FocusGroupContext;
    ExpandableContainer.defaultProps = {
        collapseDelay: 250,
        expandDelay: 250,
        expandKey: [KeyCode.downArrow, KeyCode.enter]
    };
    return ExpandableContainer;
}(React.Component));
export { ExpandableContainer };
