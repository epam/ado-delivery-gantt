import { __extends, __spreadArrays } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Tabs.css";
import * as React from "react";
import { Observer } from '../../Observer';
export var TabProviderContext = React.createContext({
    selectedId: undefined,
    tabs: [],
    commandBarItems: [],
    renderContent: undefined,
    renderFilterBar: undefined
});
var TabProvider = /** @class */ (function (_super) {
    __extends(TabProvider, _super);
    function TabProvider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TabProvider.prototype.render = function () {
        var _this = this;
        return (React.createElement(Observer, { selectedTabId: this.props.selectedTabId, tabs: this.props.providers }, function (props) {
            var selectedTabId = props.selectedTabId;
            var selectedTab = undefined;
            var tabs = __spreadArrays(props.tabs.sort(function (a, b) { return (a.order || 100) - (b.order || 100); }));
            tabs.forEach(function (tab) {
                if (tab.id === selectedTabId) {
                    selectedTab = tab;
                }
            });
            if (selectedTab === undefined) {
                selectedTab = {
                    id: selectedTabId,
                    name: undefined,
                    render: undefined
                };
            }
            return (React.createElement(TabProviderContext.Provider, { value: {
                    selectedId: selectedTab.id,
                    tabs: tabs,
                    commandBarItems: selectedTab.commandBarItems,
                    renderContent: selectedTab.render,
                    renderFilterBar: selectedTab.renderFilterBar
                } }, _this.props.children));
        }));
    };
    return TabProvider;
}(React.Component));
export { TabProvider };
