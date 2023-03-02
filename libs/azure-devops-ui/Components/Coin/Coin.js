import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Coin.css";
import * as React from "react";
import { Tooltip } from '../../TooltipEx';
import { css, KeyCode } from '../../Util';
import { getColorString } from '../../Utilities/Color';
import { getInitialsColorFromName, getInitialsFromName } from "./Coin.Initials";
/**
 * Renders a user's profile/identity/avatar image.
 */
var Coin = /** @class */ (function (_super) {
    __extends(Coin, _super);
    function Coin(props) {
        var _this = _super.call(this, props) || this;
        _this.onImageError = function (event) {
            _this.setState({ imageError: true });
        };
        _this.onLoad = function (event) {
            _this.setState({ imageLoaded: true });
        };
        _this.handleKeyDown = function (e) {
            if (e.keyCode === KeyCode.enter || e.keyCode === KeyCode.space) {
                _this.props.onClick && _this.props.onClick();
            }
        };
        _this.state = {
            imageError: false,
            imageLoaded: false,
            showIdentityCard: false
        };
        return _this;
    }
    Coin.prototype.render = function () {
        var _a = this.props, ariaLabel = _a.ariaLabel, className = _a.className, displayName = _a.displayName, dataIsFocusable = _a.dataIsFocusable, onClick = _a.onClick, isTabStop = _a.isTabStop, _b = _a.imgAltText, imgAltText = _b === void 0 ? "" : _b, imageUrl = _a.imageUrl, size = _a.size, tooltipProps = _a.tooltipProps;
        var sizeClass = "size" + size;
        // Set the focus and aria-expand attributes based on props passed
        var additionalAttributes = {};
        if (dataIsFocusable) {
            additionalAttributes["data-is-focusable"] = true;
        }
        if (isTabStop) {
            additionalAttributes["tabIndex"] = 0;
        }
        // Setting the aria related properties and user action delegates only if there is a renderIdentityCard callback
        if (onClick) {
            additionalAttributes["onKeyDown"] = this.handleKeyDown;
            additionalAttributes["onClick"] = onClick;
            additionalAttributes["role"] = "button";
        }
        additionalAttributes["aria-label"] = ariaLabel !== undefined ? ariaLabel : displayName;
        var backgroundColor = getInitialsColorFromName(displayName);
        var initialsIdentity = (React.createElement("div", { className: css("bolt-coin-content", sizeClass), style: backgroundColor && { background: getColorString(backgroundColor) } },
            React.createElement("span", null, getInitialsFromName(displayName))));
        var imageElement = imageUrl !== undefined && !this.state.imageError ? (React.createElement(React.Fragment, null,
            React.createElement("img", { className: css("bolt-coin-content using-image", sizeClass, !this.state.imageLoaded && "pending-load-image"), src: imageUrl, alt: imgAltText, onError: this.onImageError, onLoad: this.onLoad }))) : (initialsIdentity);
        // Getting the reference to the div around the image because the Callout within IdentityCard has positioning problems in some cases when passing in img element as the target
        var content = (React.createElement("div", __assign({ className: css("bolt-coin flex-noshrink", className, sizeClass, onClick && "cursor-pointer") }, additionalAttributes), imageElement));
        if (tooltipProps !== null) {
            return (React.createElement(Tooltip, __assign({ text: displayName, showOnFocus: true }, tooltipProps), content));
        }
        else {
            return content;
        }
    };
    return Coin;
}(React.Component));
export { Coin };
