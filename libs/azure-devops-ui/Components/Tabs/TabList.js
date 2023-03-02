import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Tabs.css";
import * as React from "react";
import { ObservableLike } from '../../Core/Observable';
import { Orientation } from '../../Components/Tabs/Tabs.Props';
import { css } from '../../Util';
import { Tab } from "./Tab";
import { TabGroupProviderContext } from "./TabGroupProviderContext";
import { TabProviderContext } from "./TabProviderContext";
import { Tabs } from "./Tabs";
var TabList = /** @class */ (function (_super) {
    __extends(TabList, _super);
    function TabList(props) {
        var _this = _super.call(this, props) || this;
        _this.generateGroupMap = function (groups) {
            if (!groups) {
                return {};
            }
            var map = {};
            groups.forEach(function (group) {
                map[group.id] = group;
            });
            return map;
        };
        _this.processChildren = function (groups) {
            var childGroups = {};
            React.Children.forEach(_this.props.children, function (child) {
                if (child) {
                    var groupId = child.props.groupId || "";
                    if (!childGroups[groupId]) {
                        childGroups[groupId] = {
                            items: [child],
                            groupProps: groups[groupId] || {
                                id: "",
                                name: "",
                                order: -1
                            }
                        };
                    }
                    else {
                        childGroups[groupId].items.push(child);
                    }
                }
            });
            return childGroups;
        };
        _this.processContributions = function (tabs, baseGroups, childGroups) {
            tabs.forEach(function (tab) {
                var mappedTab = _this.createRow(tab);
                var groupId = tab.groupId || "";
                if (!childGroups[groupId]) {
                    childGroups[groupId] = {
                        items: [mappedTab],
                        groupProps: baseGroups[groupId] || {
                            id: "",
                            name: "",
                            order: -1
                        }
                    };
                }
                else {
                    childGroups[groupId].items.push(mappedTab);
                }
            });
            return childGroups;
        };
        _this.processGroups = function (groups) {
            var elements = [];
            // Flattening to allow for sort
            var flatMappedGroups = [];
            for (var groupId in groups) {
                flatMappedGroups.push(groups[groupId]);
            }
            flatMappedGroups
                .sort(function (a, b) { return (a.groupProps.order || 1000) - (b.groupProps.order || 1000); })
                .forEach(function (group) {
                group.groupProps.name &&
                    elements.push(React.createElement("div", { key: group.groupProps.name, className: "bolt-tablist-heading title-xs flex-noshrink" }, group.groupProps.name));
                elements.push.apply(elements, group.items);
            });
            return elements;
        };
        _this.createRow = function (tab) {
            return (React.createElement(Tab, { key: tab.id, id: tab.id, name: tab.name, url: tab.url && ObservableLike.getValue(tab.url), onBeforeTabChange: tab.onBeforeTabChange, iconProps: tab.iconProps }));
        };
        _this.renderTitle = function (header) {
            return React.createElement("div", { className: "bolt-tablist-title title-m flex-noshrink" }, header);
        };
        _this.renderSubTitle = function (header) {
            return React.createElement("div", { className: "bolt-tablist-subtitle secondary-text flex-noshrink text-ellipsis" }, header);
        };
        _this.onSelectedTabIdChanged = function () {
            _this.forceUpdate();
        };
        return _this;
    }
    TabList.prototype.render = function () {
        var _this = this;
        return (React.createElement(TabGroupProviderContext.Consumer, null, function (provider) {
            var _a = _this.props, className = _a.className, tabGroups = _a.tabGroups;
            var mergedGroups = tabGroups ? tabGroups.concat(provider.groups) : provider.groups;
            var groupMap = _this.generateGroupMap(mergedGroups);
            return (React.createElement(TabProviderContext.Consumer, null, function (provider) {
                var selectedTabId = _this.props.selectedTabId || provider.selectedId;
                var tabGroups = _this.processContributions(provider.tabs, groupMap, _this.processChildren(groupMap));
                var trueChildren = _this.processGroups(tabGroups);
                return (React.createElement("div", { className: css(className, "bolt-tablist flex-column") },
                    _this.props.listTitle && _this.renderTitle(_this.props.listTitle),
                    _this.props.listSubTitle && _this.renderSubTitle(_this.props.listSubTitle),
                    React.createElement(Tabs, __assign({ ariaLabel: _this.props.listTitle, selectedTabId: selectedTabId }, _this.props, { className: "bolt-tablist-tabs", orientation: Orientation.Vertical }), trueChildren)));
            }));
        }));
    };
    return TabList;
}(React.Component));
export { TabList };
