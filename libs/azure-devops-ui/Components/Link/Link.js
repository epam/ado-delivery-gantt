import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Link.css";
import * as React from "react";
import { FocusGroupContext } from '../../FocusGroup';
import { FocusZoneContext } from '../../FocusZone';
import { Tooltip } from '../../TooltipEx';
import { css, getSafeId, KeyCode } from '../../Util';
import { getTabIndex } from '../../Utilities/Focus';
var Link = /** @class */ (function (_super) {
    __extends(Link, _super);
    function Link() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ref = React.createRef();
        _this.onClick = function (event) {
            _this.handleActivation(event);
        };
        _this.onKeyPress = function (event) {
            if (!_this.props.href && event.which === KeyCode.enter) {
                // We only want to handle keyboard interaction if there is no href
                _this.handleActivation(event);
            }
        };
        _this.onFocus = function (event) {
            if (_this.props.onFocus) {
                _this.props.onFocus(event);
            }
            if (_this.props.id) {
                _this.context.onFocus(_this.props.id);
            }
        };
        return _this;
    }
    Link.prototype.render = function () {
        var _this = this;
        return (React.createElement(FocusZoneContext.Consumer, null, function (focusZoneContext) {
            var props = _this.props;
            var ariaDescribedBy = props.ariaDescribedBy, ariaLabel = props.ariaLabel, ariaExpanded = props.ariaExpanded, ariaHasPopup = props.ariaHasPopup, ariaSelected = props.ariaSelected, className = props.className, draggable = props.draggable, excludeFocusZone = props.excludeFocusZone, target = props.target, dataIsFocusable = props.dataIsFocusable;
            var rel = props.rel, role = props.role;
            var TagType = "a";
            // If the link is targetting an external window or tab and no explicit rel
            // attribute was supplied we will set noopener.
            if (target && !rel) {
                rel = "noopener";
            }
            if (!props.href && !props.role) {
                role = "button";
            }
            if (!props.href) {
                TagType = "span";
            }
            var link = (React.createElement(TagType, { ref: _this.ref, "aria-describedby": getSafeId(ariaDescribedBy), "aria-expanded": ariaExpanded, "aria-haspopup": ariaHasPopup, "aria-label": ariaLabel, "aria-selected": ariaSelected, className: css(className, "bolt-link", props.disabled && "disabled", props.subtle && "subtle", props.underline && "underline"), "data-focuszone": !excludeFocusZone && focusZoneContext.focuszoneId, "data-is-focusable": dataIsFocusable, download: props.download, draggable: draggable, href: props.href, id: getSafeId(props.id), onBlur: props.onBlur, onClick: _this.onClick, onFocus: _this.onFocus, onKeyPress: _this.onKeyPress, onMouseEnter: props.onMouseEnter, onMouseLeave: props.onMouseLeave, onMouseOver: props.onMouseOver, onTouchEnd: props.onTouchEnd, onTouchMove: props.onTouchMove, onTouchStart: props.onTouchStart, rel: rel, role: role, tabIndex: getTabIndex(_this.props, _this.context), target: target }, _this.props.children));
            if (props.tooltipProps) {
                link = React.createElement(Tooltip, __assign({}, props.tooltipProps), link);
            }
            return link;
        }));
    };
    Link.prototype.focus = function () {
        this.ref.current && this.ref.current.focus();
    };
    Link.prototype.handleActivation = function (event) {
        if (!event.defaultPrevented) {
            if (this.props.disabled) {
                event.preventDefault();
            }
            else {
                this.props.onClick && this.props.onClick(event);
            }
        }
    };
    Link.contextType = FocusGroupContext;
    return Link;
}(React.Component));
export { Link };
