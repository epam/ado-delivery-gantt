import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Tabs.css";
import * as React from "react";
import { FocusGroupContext } from '../../FocusGroup';
import { FocusZoneContext } from '../../FocusZone';
import { Icon } from '../../Icon';
import { Observer } from '../../Observer';
import { Tooltip } from '../../TooltipEx';
import { css, getSafeId, KeyCode } from '../../Util';
import { getFriendlyDisplayValue } from '../../Utilities/FriendlyNumber';
import { TabBadge } from "./TabBadge";
/**
 * Presentational component that represents a single tab.
 */
var Tab = /** @class */ (function (_super) {
    __extends(Tab, _super);
    function Tab() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onClick = function (event) {
            var url = _this.props.url;
            var updatePivot = true;
            // If ctrl-click is pressed, and there is a URL specified for this item, then
            // don't handle the click here, allowing the browser to perform a navigation
            // (i.e. open in a new tab/window)
            if (event.ctrlKey) {
                if (url) {
                    updatePivot = false;
                }
            }
            if (updatePivot) {
                event.preventDefault();
                _this.updateSelectedItem(event);
            }
        };
        _this.onKeyDown = function (event) {
            if (!event.defaultPrevented) {
                if (event.which === KeyCode.space || event.which === KeyCode.enter) {
                    event.preventDefault();
                    _this.updateSelectedItem(event);
                }
            }
        };
        return _this;
    }
    Tab.prototype.render = function () {
        var _this = this;
        var _a = this.props, ariaLabel = _a.ariaLabel, index = _a.index, setSize = _a.setSize, iconProps = _a.iconProps, id = _a.id, isSelected = _a.isSelected, renderBadge = _a.renderBadge, url = _a.url;
        var TagName = url ? "a" : "div";
        return (React.createElement(Observer, { name: this.props.name, badgeCount: this.props.badgeCount }, function (props) {
            var name = props.name;
            return (React.createElement(FocusGroupContext.Consumer, null, function (focusGroupContext) { return (React.createElement(FocusZoneContext.Consumer, null, function (zoneContext) {
                var badge = renderBadge ? renderBadge() : _this.renderBadge(props.badgeCount);
                var icon = iconProps !== undefined && Icon(__assign({ className: "bolt-tab-icon" }, iconProps));
                var text = name && (React.createElement("span", { className: "bolt-tab-text", "data-content": name }, name));
                var tooltipProps = icon && !name && ariaLabel
                    ? {
                        text: ariaLabel,
                        overflowOnly: false
                    }
                    : {
                        text: name,
                        overflowDetected: overflowDetected,
                        overflowOnly: true
                    };
                return (React.createElement(Tooltip, __assign({}, tooltipProps),
                    React.createElement(TagName, { "aria-label": ariaLabel, "aria-posinset": index !== undefined ? index + 1 : undefined, "aria-selected": isSelected, "aria-setsize": setSize, className: css(_this.props.className, "bolt-tab focus-treatment flex-noshrink", isSelected && "selected"), "data-focuszone": zoneContext.focuszoneId, href: url, id: getSafeId("tab-" + id), key: id, onClick: _this.onClick, onKeyDown: _this.onKeyDown, role: "tab", tabIndex: focusGroupContext.focusedElementId === "tab-" + id ? 0 : -1 },
                        React.createElement("span", { className: "bolt-tab-inner-container" },
                            icon,
                            text,
                            badge))));
            })); }));
        }));
    };
    Tab.prototype.renderBadge = function (badgeCount) {
        var badgeDisplayValue = badgeCount !== undefined ? getFriendlyDisplayValue(badgeCount) : undefined;
        var badgeTooltip = undefined;
        if (badgeCount && badgeDisplayValue !== badgeCount.toString()) {
            badgeTooltip = badgeCount.toString();
        }
        var badge = null;
        if (badgeDisplayValue) {
            var tooltipProps = badgeTooltip ? { text: badgeTooltip } : undefined;
            badge = React.createElement(TabBadge, { tooltipProps: tooltipProps }, badgeDisplayValue);
        }
        return badge;
    };
    /**
     * Updates the state with the new selected pivot.
     */
    Tab.prototype.updateSelectedItem = function (ev) {
        var onClick = this.props.onClick;
        if (ev && this.props.onBeforeTabChange && !this.props.onBeforeTabChange(ev, this.props.id, this.props.url)) {
            ev.preventDefault();
            return;
        }
        // Update notifiers
        if (onClick) {
            onClick(this.props.id);
        }
    };
    return Tab;
}(React.Component));
export { Tab };
function overflowDetected(anchorElement) {
    var overflowElement = anchorElement.querySelector(".bolt-tab-text");
    if (overflowElement) {
        return overflowElement && overflowElement.scrollWidth > Math.ceil(overflowElement.offsetWidth);
    }
    return false;
}
