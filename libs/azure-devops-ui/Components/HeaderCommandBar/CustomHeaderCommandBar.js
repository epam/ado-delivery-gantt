import { __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./HeaderCommandBar.css";
import * as React from "react";
import { ButtonGroup } from '../../ButtonGroup';
import { FocusZone, FocusZoneDirection } from '../../FocusZone';
import { css } from '../../Util';
/**
 * Renders children in a FocusZone and ButtonGroup. This should be used directly only
 * if you need to render custom content that does not map to an IHeaderCommandBarItem.
 *
 * This component will always render all of its children - the logic for which items live
 * in the ... button and which items are always shown is only in the HeaderCommandBar. It is assumed
 * that if you are custom rendering the header command bar, that you are responsible for putting
 * the items correctly into the menu button.
 */
var CustomHeaderCommandBar = /** @class */ (function (_super) {
    __extends(CustomHeaderCommandBar, _super);
    function CustomHeaderCommandBar() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CustomHeaderCommandBar.prototype.render = function () {
        return (React.createElement(FocusZone, { direction: FocusZoneDirection.Horizontal, focusGroupProps: this.props.focusGroupProps }, ButtonGroup({
            className: css(this.props.className, "bolt-header-commandbar", this.props.lastItemIsIconButton && "bolt-header-commandbar-no-right-padding"),
            children: this.props.children,
            role: this.props.role
        })));
    };
    return CustomHeaderCommandBar;
}(React.Component));
export { CustomHeaderCommandBar };
