import "../../CommonImports";
import "../../Core/core.css";
import "./IdentityCard.css";
import * as React from "react";
import * as Resources from '../../Resources.Persona';
import { Persona } from "../Persona/Persona";
import { PersonaSize } from "../Persona/Persona.Props";
import { CardContactLine } from "./CardContactLine";
function verifySignInAddress(signInAddress) {
    if (!signInAddress) {
        return false;
    }
    // this is copied from System.ComponentModel.DataAnnotations.EmailAddressAttribute
    var PROFILE_EMAIL_ADDRESS_PATTERN = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i;
    if (PROFILE_EMAIL_ADDRESS_PATTERN.test(signInAddress)) {
        return true;
    }
    return false;
}
export var DefaultAbridgedCard = function (props) {
    var _a = props.identity, displayName = _a.displayName, signInAddress = _a.signInAddress;
    return (React.createElement("div", { className: "bolt-default-card-abridged flex-column scroll-hidden" },
        React.createElement("div", { className: "flex-row" },
            React.createElement(Persona, { className: "bolt-identity-card-persona-main", size: PersonaSize.size72, identity: props.identity }),
            React.createElement("div", { className: "flex-column flex-grow bolt-identity-card-name scroll-hidden" },
                React.createElement("div", { className: "text-ellipsis title-s" }, displayName))),
        verifySignInAddress(signInAddress) && (React.createElement("div", { className: "flex-column scroll-hidden" },
            React.createElement("div", { className: "bolt-identity-default-card-info-wrapper" },
                React.createElement("hr", { className: "bolt-identity-card-hr" }),
                React.createElement("div", { className: "bolt-identity-default-card-header-wrapper" },
                    React.createElement("b", null, Resources.IdentityCardContact))),
            React.createElement("div", { className: "bolt-identity-default-card-contact-info-container" },
                React.createElement(CardContactLine, { iconName: "Mail", content: signInAddress, link: "mailto:" + signInAddress }),
                React.createElement(CardContactLine, { iconName: "Chat", content: Resources.IdentityCardStartChat, link: "sip:" + signInAddress }))))));
};
