import { __assign } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Card.css";
import * as React from "react";
import { Button } from '../../Button';
import { Header } from '../../Header';
import { IconSize } from '../../Icon';
import { Observer } from '../../Observer';
import * as Resources from '../../Resources.Card';
import { css } from '../../Util';
import { CardContent } from "./CardContent";
import { CustomCard } from "./CustomCard";
export var Card = function (props) {
    var collapsible = props.collapsible, _a = props.collapsed, collapsed = _a === void 0 ? false : _a, _b = props.titleProps, titleProps = _b === void 0 ? {} : _b, headerCommandBarItems = props.headerCommandBarItems, onCollapseClick = props.onCollapseClick, renderHeader = props.renderHeader;
    var text = titleProps.text;
    return (React.createElement(CustomCard, { className: css(props.className, (text || headerCommandBarItems) && "bolt-card-with-header") }, collapsible ? (React.createElement(Observer, { collapsed: collapsed }, function (observerProps) { return (React.createElement(React.Fragment, null,
        (text || headerCommandBarItems || renderHeader) && (React.createElement("div", { className: "flex-row" },
            React.createElement(Button, { ariaExpanded: !observerProps.collapsed, ariaLabel: (text ? text + " " : "") + (observerProps.collapsed ? Resources.ExpandButtonAriaLabel : Resources.CollapseButtonAriaLabel), subtle: true, iconProps: { iconName: observerProps.collapsed ? "ChevronRightMed" : "ChevronDownMed", size: IconSize.small }, className: "bolt-card-expand-button flex-self-start", onClick: onCollapseClick }),
            renderHeader ? (renderHeader()) : (React.createElement(CardHeader, __assign({}, props, { headerClassName: css(props.headerClassName, "bolt-card-expandable-header", observerProps.collapsed && "bolt-card-header-collapsed") }))))),
        !observerProps.collapsed && React.createElement(CardContent, __assign({}, props.contentProps), props.children))); })) : (React.createElement(React.Fragment, null,
        renderHeader ? renderHeader() : (text || headerCommandBarItems) && React.createElement(CardHeader, __assign({}, props)),
        React.createElement(CardContent, __assign({}, props.contentProps), props.children)))));
};
var CardHeader = function (props) {
    var collapsible = props.collapsible, _a = props.titleProps, titleProps = _a === void 0 ? {} : _a, headerBreakpoints = props.headerBreakpoints, headerClassName = props.headerClassName, headerCommandBarItems = props.headerCommandBarItems, _b = props.headerDescriptionProps, headerDescriptionProps = _b === void 0 ? {} : _b, headerIconProps = props.headerIconProps;
    var text = titleProps.text, className = titleProps.className, id = titleProps.id, size = titleProps.size, ariaLevel = titleProps.ariaLevel;
    return (React.createElement(Header, { className: css(headerClassName, "bolt-card-header", collapsible && "bolt-card-header-collapsible"), commandBarClassName: "justify-end", commandBarItems: headerCommandBarItems, description: headerDescriptionProps.text, descriptionClassName: headerDescriptionProps.className, headerBreakpoints: headerBreakpoints, titleId: id, titleIconProps: headerIconProps, title: text, titleAriaLevel: ariaLevel, titleClassName: className, titleSize: size }));
};
