import { __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Tabs.css";
import * as React from "react";
import { Observer } from '../../Observer';
export var TabGroupProviderContext = React.createContext({ groups: [] });
var TabGroupProvider = /** @class */ (function (_super) {
    __extends(TabGroupProvider, _super);
    function TabGroupProvider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TabGroupProvider.prototype.render = function () {
        var _this = this;
        return (React.createElement(Observer, { groups: this.props.providers }, function (props) {
            var groups = props.groups.sort(function (a, b) { return (a.order || 100) - (b.order || 100); });
            return React.createElement(TabGroupProviderContext.Provider, { value: { groups: groups } }, _this.props.children);
        }));
    };
    return TabGroupProvider;
}(React.Component));
export { TabGroupProvider };
