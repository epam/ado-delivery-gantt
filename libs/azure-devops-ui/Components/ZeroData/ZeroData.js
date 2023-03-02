import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./ZeroData.css";
import * as React from "react";
import { Button } from '../../Button';
import { Icon } from '../../Icon';
import { Link } from '../../Link';
import { css } from '../../Util';
import { ZeroDataActionType } from "./ZeroData.Props";
/**
 * Component for displaying helpful information when there is no data to show.
 */
export var ZeroData = function (props) {
    return React.createElement(ZeroDataMultiple, { items: [props], className: props.className });
};
/**
 * Component for displaying helpful information when there is no data to show. This one displays
 * multiple (or one) ZeroDataItems.
 *
 * THIS CLASS IS NOT EXPORTED presently because no design for multiple ZeroDataItems has yet been
 * approved.
 */
var ZeroDataMultiple = function (props) {
    var multiple = props.items.length > 1;
    return (React.createElement("div", { className: css("vss-ZeroData flex-row justify-center", multiple ? "multiple" : "single", props.className) }, props.items.map(function (item, index) { return (React.createElement(ZeroDataItem, { item: item, key: index, multiple: multiple })); })));
};
/**
 * Represents a single item for the ZeroData component.
 */
var ZeroDataItem = /** @class */ (function (_super) {
    __extends(ZeroDataItem, _super);
    function ZeroDataItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ZeroDataItem.prototype.render = function () {
        var item = this.props.item;
        var secondary;
        if (typeof item.secondaryText === "string") {
            secondary = React.createElement("span", null, item.secondaryText);
        }
        else {
            secondary = item.secondaryText;
        }
        return (React.createElement("div", { className: css("vss-ZeroDataItem flex-column flex-center", this.props.multiple && "flex-grow") },
            item.iconProps ? (React.createElement(Icon, __assign({ className: "vss-ZeroDataItem--icon-image" }, item.iconProps))) : (React.createElement("img", { className: "vss-ZeroDataItem--image", src: item.imagePath, alt: item.imageAltText })),
            React.createElement("div", { className: css("vss-ZeroDataItem--primary margin-horizontal-16", this.props.multiple ? "title-m" : "title-l") }, item.primaryText),
            secondary && React.createElement("div", { className: "vss-ZeroDataItem--secondary margin-horizontal-16" }, secondary),
            this.renderAction(item)));
    };
    ZeroDataItem.prototype.renderAction = function (item) {
        if (item.renderAction) {
            return item.renderAction();
        }
        if (!item.actionText) {
            return null;
        }
        // actionType === 1 is for back-compat where it used to be button type
        // button type is rendered same as ctaButton now
        // we can remove actionType === 1 in 143
        if (item.actionType === ZeroDataActionType.ctaButton || item.actionType === 1) {
            var onActionClick = function (ev) {
                if (item.onActionClick) {
                    item.onActionClick.call(null, ev, item);
                }
            };
            var buttonProps = __assign(__assign({}, (item.actionButtonProps || {})), { className: "vss-ZeroDataItem--action", text: item.actionText, onClick: onActionClick, href: item.actionHref, role: item.actionHref ? "link" : undefined });
            return React.createElement(Button, __assign({}, buttonProps, { primary: true }));
        }
        else {
            return React.createElement(Link, { href: item.actionHref }, item.actionText);
        }
    };
    return ZeroDataItem;
}(React.Component));
