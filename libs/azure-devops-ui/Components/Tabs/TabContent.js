import { __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Tabs.css";
import * as React from "react";
import { ObservableArray } from '../../Core/Observable';
import { TabProviderContext, TabProvider } from "./TabProviderContext";
/**
 * Hooks into tab provider context to render the tab's provided content, as well
 * as optionally the a filter bar if it is to be rendered outside of the TabBar.
 */
var TabContent = /** @class */ (function (_super) {
    __extends(TabContent, _super);
    function TabContent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TabContent.prototype.render = function () {
        var _this = this;
        return (React.createElement(TabProviderContext.Consumer, null, function (tabProviderContext) {
            var content;
            if (tabProviderContext.renderContent) {
                var filterBar = tabProviderContext.renderFilterBar && tabProviderContext.renderFilterBar(false);
                content = (React.createElement(React.Fragment, null,
                    filterBar,
                    tabProviderContext.renderContent()));
            }
            else {
                content = React.createElement(React.Fragment, null, _this.props.children);
            }
            return (React.createElement(TabProvider, { providers: new ObservableArray([]), selectedTabId: tabProviderContext.selectedId || "" }, content));
        }));
    };
    return TabContent;
}(React.Component));
export { TabContent };
