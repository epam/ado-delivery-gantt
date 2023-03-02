import { __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./IdentityCard.css";
import * as React from "react";
import * as Resources from '../../Resources.Persona';
import { Button } from '../../Button';
import { Icon } from '../../Icon';
import { Persona } from "../Persona/Persona";
import { PersonaSize } from "../Persona/Persona.Props";
var IdentityCardHeaderElement = /** @class */ (function (_super) {
    __extends(IdentityCardHeaderElement, _super);
    function IdentityCardHeaderElement() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.personaElement = React.createRef();
        return _this;
    }
    IdentityCardHeaderElement.prototype.componentDidMount = function () {
        this.setFocus();
    };
    IdentityCardHeaderElement.prototype.componentDidUpdate = function () {
        this.setFocus();
    };
    // Render
    IdentityCardHeaderElement.prototype.render = function () {
        var identity = this.props.identity;
        if (!identity) {
            // Identity is empty in the case of previous
            return React.createElement("div", null);
        }
        return (React.createElement("div", { className: "flex-row scroll-hidden" },
            React.createElement(Button, { className: "bolt-identity-card-go-back-wrapper flex-row flex-grow scroll-hidden", onClick: this.props.onClickFunction, "aria-label": Resources.IdentityCardHeaderButtonLabel, ref: this.personaElement, primary: true },
                React.createElement(Icon, { iconName: "ChevronLeftMed" }),
                React.createElement(Persona, { className: "bolt-identity-card-go-back", size: PersonaSize.size24, identity: identity }),
                React.createElement("div", { className: "bolt-identity-card-name text-ellipsis" }, identity.displayName))));
    };
    /**
     * Sets the focus on this header.
     */
    IdentityCardHeaderElement.prototype.setFocus = function () {
        if (this.personaElement.current) {
            this.personaElement.current.focus();
        }
    };
    return IdentityCardHeaderElement;
}(React.Component));
export { IdentityCardHeaderElement };
