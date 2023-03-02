import { __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import { Coin, CoinSize } from '../../Coin';
/**
 * Renders a user's profile/identity/avatar image.
 */
var Persona = /** @class */ (function (_super) {
    __extends(Persona, _super);
    function Persona(props) {
        var _this = _super.call(this, props) || this;
        _this.targetElement = React.createRef();
        _this.showIdentityCard = function () {
            if (_this.props.personaProvider && _this.props.personaProvider.renderIdentityCard) {
                _this.setState({ showIdentityCard: true });
            }
        };
        _this.onClick = function (ev) {
            if (_this.props.personaProvider && _this.props.personaProvider.renderIdentityCard) {
                _this.setState({ showIdentityCard: true });
            }
            ev.preventDefault();
        };
        _this.hideIdentityCard = function () {
            _this.setState({ showIdentityCard: false });
        };
        _this.state = {
            imageError: false,
            imageLoaded: false,
            showIdentityCard: false
        };
        return _this;
    }
    Persona.prototype.render = function () {
        var _a = this.props, ariaLabel = _a.ariaLabel, ariaHidden = _a.ariaHidden, className = _a.className, personaProvider = _a.personaProvider, identity = _a.identity, size = _a.size, tooltipProps = _a.tooltipProps;
        var canShowPersonaCard = !!personaProvider && !!personaProvider.renderIdentityCard;
        var image = identity.image || identity.imageUrl;
        // Getting the reference to the div around the image because the Callout within IdentityCard has positioning problems in some cases when passing in img element as the target
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { "aria-hidden": ariaHidden, ref: this.targetElement },
                React.createElement(Coin, { ariaLabel: ariaLabel, className: className, dataIsFocusable: canShowPersonaCard, isTabStop: canShowPersonaCard, onClick: canShowPersonaCard ? this.onClick : undefined, displayName: identity.displayName || "", imageUrl: this.getServerImageFromSize(image), imgAltText: identity.displayName, size: size, tooltipProps: tooltipProps })),
            this.state.showIdentityCard &&
                personaProvider &&
                personaProvider.renderIdentityCard &&
                personaProvider.renderIdentityCard(identity, personaProvider, this.hideIdentityCard, this.targetElement.current)));
    };
    Persona.prototype.getServerImageFromSize = function (url) {
        if (!url) {
            return undefined;
        }
        if (this.props.size) {
            if (this.props.size <= CoinSize.size24) {
                return url + (url.indexOf("?") === -1 ? "?size=0" : "&size=0");
            }
            else if (this.props.size > CoinSize.size40) {
                return url + (url.indexOf("?") === -1 ? "?size=2" : "&size=2");
            }
        }
        return url;
    };
    return Persona;
}(React.Component));
export { Persona };
