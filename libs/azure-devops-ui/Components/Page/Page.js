import { __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Page.css";
import * as React from "react";
import { Orientation } from "./Page.Props";
import { ObservableArray } from '../../Core/Observable';
import { Intersection } from '../../Intersection';
import { SurfaceBackground, SurfaceContext } from '../../Surface';
import { TabGroupProvider, TabProvider } from '../../Tabs';
import { css } from '../../Util';
/**
 * Component for stitching together the various components that make a up a page.
 * Renders all children in a column-based flexbox.
 * If passed an observable selected tab id and contributed tab providers, will
 * wrap with a TabProvider component to provide context to consuming children.
 */
var Page = /** @class */ (function (_super) {
    __extends(Page, _super);
    function Page() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Page.prototype.render = function () {
        var _this = this;
        var _a = this.props, tabProviders = _a.tabProviders, selectedTabId = _a.selectedTabId, tabGroups = _a.tabGroups, _b = _a.orientation, orientation = _b === void 0 ? Orientation.Vertical : _b, scrollableContainerRef = _a.scrollableContainerRef;
        var orientationClass = orientation === Orientation.Vertical ? "flex-column" : "flex-row";
        var page = (React.createElement(SurfaceContext.Consumer, null, function (surfaceContext) { return (React.createElement(Intersection, null,
            React.createElement("div", { ref: scrollableContainerRef, className: css(_this.props.className, "bolt-page v-scroll-auto", orientationClass, surfaceContext.background === SurfaceBackground.neutral && "bolt-page-grey", surfaceContext.background === SurfaceBackground.normal && "bolt-page-white") }, _this.props.children))); }));
        if (selectedTabId) {
            page = (React.createElement(TabProvider, { providers: tabProviders || new ObservableArray([]), selectedTabId: selectedTabId }, page));
        }
        if (tabGroups) {
            page = React.createElement(TabGroupProvider, { providers: tabGroups }, page);
        }
        return page;
    };
    return Page;
}(React.Component));
export { Page };
