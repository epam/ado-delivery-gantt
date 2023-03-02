import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Header.css";
import * as React from "react";
import { ObservableValue } from '../../Core/Observable';
import { Breakpoint } from '../../Breakpoint';
import { HeaderCommandBar } from '../../HeaderCommandBar';
import { Observer } from '../../Observer';
import { TabProviderContext } from '../../Tabs';
import { css } from '../../Util';
import { CustomHeader } from "./CustomHeader";
import { HeaderBackButton } from "./HeaderBackButton";
import { HeaderDescription } from "./HeaderDescription";
import { HeaderIcon } from "./HeaderIcon";
import { HeaderTitle } from "./HeaderTitle";
import { HeaderTitleArea } from "./HeaderTitleArea";
import { HeaderTitleRow } from "./HeaderTitleRow";
var Header = /** @class */ (function (_super) {
    __extends(Header, _super);
    function Header(props) {
        var _this = _super.call(this, props) || this;
        _this.breakpointIndex = 0;
        _this.headerCommandBarRef = React.createRef();
        _this.onBreakPoint = function (index, breakpoint) {
            _this.breakpointIndex = index;
            // This is making sure that command bar items are made visible after getting notified
            // for the exact breakpoint. Otherwise, there is flickering from default to current breakpoint.
            // If there are no breakpoints specified, actions are rendered at first place.
            _this.commandBarClassName.value = css(_this.props.commandBarClassName, "flex-self-start");
        };
        _this.commandBarClassName = new ObservableValue(css(props.commandBarClassName, "flex-self-start", !!props.headerBreakpoints && "invisible"));
        return _this;
    }
    Header.prototype.render = function () {
        var _this = this;
        return (React.createElement(TabProviderContext.Consumer, null, function (tabProviderContext) {
            var _a = _this.props, backButtonProps = _a.backButtonProps, buttonCount = _a.buttonCount, className = _a.className, contentClassName = _a.contentClassName, commandBarMoreButtonId = _a.commandBarMoreButtonId, description = _a.description, descriptionClassName = _a.descriptionClassName, descriptionId = _a.descriptionId, headerBreakpoints = _a.headerBreakpoints, title = _a.title, titleAriaLevel = _a.titleAriaLevel, titleClassName = _a.titleClassName, titleIconProps = _a.titleIconProps, titleId = _a.titleId, titleSize = _a.titleSize, useAriaLabelForOverflow = _a.useAriaLabelForOverflow;
            var commandBarItems = _this.props.commandBarItems || tabProviderContext.commandBarItems;
            var commandBarComponent = undefined;
            if (commandBarItems) {
                commandBarComponent = (React.createElement(Observer, { items: commandBarItems, className: _this.commandBarClassName }, function (props) {
                    return (React.createElement(HeaderCommandBar, { buttonCount: buttonCount, className: props.className, items: _this.getUpdatedCommandBarItems(props.items), moreButtonId: commandBarMoreButtonId, ref: _this.headerCommandBarRef, useAriaLabelForOverflow: useAriaLabelForOverflow }));
                }));
            }
            return (React.createElement(React.Fragment, null,
                headerBreakpoints && (React.createElement(Breakpoint, { breakpoints: headerBreakpoints.map(function (hbp) { return hbp.breakpoint; }), onBreakpoint: _this.onBreakPoint })),
                React.createElement(CustomHeader, { className: css(className, commandBarItems && commandBarItems.length > 0 && "bolt-header-with-commandbar", backButtonProps && "bolt-header-with-back-button"), separator: _this.props.separator },
                    backButtonProps && React.createElement(HeaderBackButton, { buttonProps: backButtonProps }),
                    React.createElement("div", { className: css(contentClassName, "bolt-header-content-area flex-row flex-grow flex-self-stretch") },
                        titleIconProps && React.createElement(HeaderIcon, { iconProps: titleIconProps, titleSize: titleSize }),
                        React.createElement(HeaderTitleArea, null,
                            React.createElement(HeaderTitleRow, null, title && (React.createElement(HeaderTitle, { ariaLevel: titleAriaLevel, className: titleClassName, id: titleId, titleSize: titleSize }, title))),
                            description && (React.createElement(HeaderDescription, { className: descriptionClassName, id: descriptionId }, description)),
                            _this.props.children),
                        commandBarComponent))));
        }));
    };
    Header.prototype.focus = function (options) {
        if (this.headerCommandBarRef.current) {
            this.headerCommandBarRef.current.focus(options);
        }
    };
    Header.prototype.getUpdatedCommandBarItems = function (sourceCommandBarItems) {
        var headerBreakpoints = this.props.headerBreakpoints;
        var breakpoint = headerBreakpoints ? headerBreakpoints[Math.max(0, this.breakpointIndex)] : null;
        if (breakpoint) {
            var _a = breakpoint.commandBarItems, commandBarItems = _a === void 0 ? [] : _a;
            // Update if there are actions changing their look for this breakpoint
            if (commandBarItems.length > 0) {
                // Convert actions to a map to access later quickly
                var commandBarItemsMap_1 = {};
                commandBarItems.forEach(function (item) { return (commandBarItemsMap_1[item.id] = item); });
                var targetCommandBarItems = [];
                for (var _i = 0, sourceCommandBarItems_1 = sourceCommandBarItems; _i < sourceCommandBarItems_1.length; _i++) {
                    var commandBarItem = sourceCommandBarItems_1[_i];
                    var changedItem = commandBarItemsMap_1[commandBarItem.id];
                    if (changedItem) {
                        // Update command bar item with the specified properties
                        targetCommandBarItems.push(__assign(__assign({}, commandBarItem), changedItem));
                    }
                    else {
                        // If there is no change requested, use the same item
                        targetCommandBarItems.push(__assign({}, commandBarItem));
                    }
                }
                return targetCommandBarItems;
            }
        }
        return sourceCommandBarItems;
    };
    return Header;
}(React.Component));
export { Header };
