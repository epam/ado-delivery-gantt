import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./VssPersona.css";
import * as React from "react";
import { Icon } from '../../Icon';
import { Tooltip } from '../../TooltipEx';
import { css, KeyCode } from '../../Util';
import { getColorString } from '../../Utilities/Color';
import { getInitialsColorFromName, getInitialsFromName } from "./VssPersona.Initials";
/**
 * Renders a user's profile/identity/avatar image.
 */
var VssPersona = /** @class */ (function (_super) {
    __extends(VssPersona, _super);
    function VssPersona(props) {
        var _this = _super.call(this, props) || this;
        _this.setTargetElement = function (element) {
            _this.targetElement = element;
        };
        _this.onImageError = function (event) {
            if (_this.props.showInitialsOnImageError) {
                _this.setState({ imageError: true });
            }
            else if (_this.props.onImageError) {
                _this.props.onImageError(event);
            }
        };
        _this.handleKeyDown = function (e) {
            if (e.keyCode === KeyCode.enter || e.keyCode === KeyCode.space) {
                _this.showPersonaCard();
            }
        };
        _this.showPersonaCard = function () {
            if (!_this.props.suppressPersonaCard) {
                _this.setState({ showPersonaCard: true });
            }
        };
        _this.hidePersonaCard = function () {
            _this.setState({ showPersonaCard: false });
        };
        _this.state = {
            imageError: false,
            showPersonaCard: false,
            imageUrlVal: _this._getImageUrl(props)
        };
        return _this;
    }
    VssPersona.prototype.UNSAFE_componentWillReceiveProps = function (nextProps) {
        this.setState({
            showPersonaCard: false,
            imageUrlVal: this._getImageUrl(nextProps)
        });
    };
    VssPersona.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        if (!nextProps.identityDetailsProvider && (this.props.imageUrl !== nextProps.imageUrl || this.props.displayName !== nextProps.displayName)) {
            return true;
        }
        else if (!this.props.identityDetailsProvider && !nextProps.identityDetailsProvider) {
            return false;
        }
        else if (!this.props.identityDetailsProvider || !nextProps.identityDetailsProvider) {
            return true;
        }
        return (this.props.size !== nextProps.size ||
            this.props.cssClass !== nextProps.cssClass ||
            this.props.identityDetailsProvider !== nextProps.identityDetailsProvider ||
            this.state.showPersonaCard !== nextState.showPersonaCard);
    };
    VssPersona.prototype.render = function () {
        var _a = this.props, ariaLabel = _a.ariaLabel, identityDetailsProvider = _a.identityDetailsProvider, _b = _a.size, size = _b === void 0 ? "medium" : _b, _c = _a.imgAltText, imgAltText = _c === void 0 ? "" : _c, imageUrl = _a.imageUrl, displayName = _a.displayName;
        var imageUrlVal = !identityDetailsProvider ? imageUrl : this.state.imageUrlVal;
        // Set the focus and aria-expand attributes based on props passed
        var additionalAttributes = {};
        additionalAttributes["role"] = "img";
        if (this.props.dataIsFocusable) {
            additionalAttributes["data-is-focusable"] = true;
        }
        if (this.props.isTabStop) {
            additionalAttributes["tabIndex"] = 0;
        }
        // Setting the aria related properties and user action delegates unless we supress persona card or persona card isnt't provided
        if (!this.props.suppressPersonaCard && this.props.identityDetailsProvider && this.props.identityDetailsProvider.onRenderPersonaCard) {
            additionalAttributes["aria-expanded"] = this.state.showPersonaCard;
            additionalAttributes["onKeyDown"] = this.handleKeyDown;
            additionalAttributes["onClick"] = this.showPersonaCard;
            additionalAttributes["role"] = "button";
        }
        var displayNameVal = !identityDetailsProvider ? displayName : identityDetailsProvider.getDisplayName();
        if (ariaLabel) {
            additionalAttributes["aria-label"] = ariaLabel;
        }
        else if (displayNameVal) {
            additionalAttributes["aria-label"] = displayNameVal;
        }
        else {
            additionalAttributes["aria-hidden"] = "true";
        }
        var backgroundColor = displayNameVal === undefined ? undefined : getInitialsColorFromName(displayNameVal);
        var imageElement = imageUrlVal !== undefined && !this.state.imageError ? (React.createElement("img", { className: "vss-Persona-content using-image", src: imageUrlVal, alt: imgAltText, onError: this.onImageError })) : (React.createElement("div", { className: css("vss-Persona-content", size), style: backgroundColor && { background: getColorString(backgroundColor) } }, displayNameVal ? React.createElement("span", null, getInitialsFromName(displayNameVal)) : React.createElement(Icon, { iconName: "Contact" })));
        // Getting the reference to the div around the image because the Callout within PersonaCard has positioning problems in some cases when passing in img element as the target
        return (React.createElement(React.Fragment, null,
            React.createElement(Tooltip, { text: displayNameVal, showOnFocus: true },
                React.createElement("div", __assign({ className: css("vss-Persona flex-noshrink", this.props.className, this.props.cssClass, size), ref: this.setTargetElement }, additionalAttributes), imageElement)),
            !this.props.suppressPersonaCard &&
                this.state.showPersonaCard &&
                identityDetailsProvider &&
                identityDetailsProvider.onRenderPersonaCard &&
                identityDetailsProvider.onRenderPersonaCard(this.targetElement, this.hidePersonaCard)));
    };
    /**
     * Resolve the URL for the profile image.
     * @param props
     */
    VssPersona.prototype._getImageUrl = function (props) {
        var identityDetailsProvider = props.identityDetailsProvider, _a = props.size, size = _a === void 0 ? "medium" : _a;
        var sizePx = this._getSize(size);
        return identityDetailsProvider && identityDetailsProvider.getIdentityImageUrl(sizePx);
    };
    /**
     * Get the size in pixels for the given css class.
     * @param size
     */
    VssPersona.prototype._getSize = function (size) {
        switch (size) {
            case "extra-extra-small":
                return 16;
            case "extra-small":
                return 18;
            case "extra-small-plus":
                return 20;
            case "small":
                return 24;
            case "small-plus":
                return 28;
            case "medium":
                return 32;
            case "medium-plus":
                return 40;
            default:
            case "large":
                return 48;
            case "extra-large":
                return 72;
            case "extra-extra-large":
                return 100;
        }
    };
    return VssPersona;
}(React.Component));
export { VssPersona };
