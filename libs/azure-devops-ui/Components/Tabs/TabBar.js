import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Tabs.css";
import * as React from "react";
import { ObservableLike } from '../../Core/Observable';
import { ScreenContext, ScreenSize } from '../../Core/Util/Screen';
import { Observer } from '../../Observer';
import { SurfaceBackground, SurfaceContext } from '../../Surface';
import { css } from '../../Util';
import { Tab } from "./Tab";
import { TabProviderContext } from "./TabProviderContext";
import { Tabs } from "./Tabs";
/**
 * Renders tabs (provided as children or through a tab provider context) as well as addtional
 * content such as in-line filters, view options, etc.
 *
 * Tabs provided directly as children will always be place before contributed tabs.
 */
var TabBar = /** @class */ (function (_super) {
    __extends(TabBar, _super);
    function TabBar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderAdditionalContent = function (renderFilterBar) {
            if (renderFilterBar) {
                return renderFilterBar(true);
            }
            return _this.props.renderAdditionalContent && _this.props.renderAdditionalContent();
        };
        _this.createTab = function (tab) {
            return (React.createElement(Tab, { ariaLabel: tab.ariaLabel, badgeCount: tab.badgeCount, className: tab.className, key: tab.id, iconProps: tab.iconProps, id: tab.id, name: tab.name, onBeforeTabChange: tab.onBeforeTabChange, url: tab.url && ObservableLike.getValue(tab.url), renderBadge: tab.renderBadge }));
        };
        return _this;
    }
    TabBar.prototype.render = function () {
        var _this = this;
        return (React.createElement(Observer, { size: this.context.size }, function (props) {
            //determine on which screen sizes we should stack line by line.
            var shouldBeStacked = props.size <= ScreenSize.medium;
            return (React.createElement(SurfaceContext.Consumer, null, function (surfaceContext) { return (React.createElement(TabProviderContext.Consumer, null, function (tabProviderContext) {
                var selectedTabId = _this.props.selectedTabId || tabProviderContext.selectedId;
                return (React.createElement("div", { className: css(_this.props.className, "bolt-tabbar flex-row flex-center flex-noshrink", !_this.props.disableSticky && props.size >= ScreenSize.small && "sticky", surfaceContext.background === SurfaceBackground.neutral && "bolt-tabbar-grey", surfaceContext.background === SurfaceBackground.callout && "bolt-tabbar-on-callout") },
                    React.createElement(Tabs, __assign({ selectedTabId: selectedTabId }, _this.props, { className: css(_this.props.tabsClassName, "bolt-tabbar-tabs flex-grow", !shouldBeStacked && "flex-noshrink", shouldBeStacked && "flex-wrap") }),
                        _this.props.children,
                        tabProviderContext.tabs.map(_this.createTab)),
                    _this.renderAdditionalContent(tabProviderContext.renderFilterBar)));
            })); }));
        }));
    };
    TabBar.contextType = ScreenContext;
    return TabBar;
}(React.Component));
export { TabBar };
