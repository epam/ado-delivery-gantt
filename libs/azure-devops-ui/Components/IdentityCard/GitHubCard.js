import "../../CommonImports";
import "../../Core/core.css";
import "./IdentityCard.css";
import * as React from "react";
import * as Resources from '../../Resources.Persona';
import { Persona } from "../Persona/Persona";
import { PersonaSize } from "../Persona/Persona.Props";
import { CardContactLine } from "./CardContactLine";
export var GitHubCard = function (props) {
    var identity = props.identity;
    var displayName = identity.displayName, mail = identity.mail, mailNickname = identity.mailNickname;
    return (React.createElement("div", { className: "bolt-identity-default-card-without-header bolt-identity-card-content" },
        React.createElement("div", { className: "flex-row" },
            React.createElement(Persona, { className: "bolt-identity-card-persona-main", size: PersonaSize.size72, identity: identity }),
            React.createElement("div", { className: "flex-column flex-grow bolt-identity-card-name" },
                React.createElement("div", { className: "text-ellipsis title-s" }, displayName),
                mailNickname === "" ? undefined : React.createElement("div", { className: "text-ellipsis" }, mailNickname),
                mail === "" ? undefined : React.createElement("div", { className: "text-ellipsis" }, mail))),
        React.createElement("div", null, (mail || mailNickname) && (React.createElement("div", { className: "bolt-identity-default-card-info-wrapper" },
            React.createElement("hr", { className: "bolt-identity-card-hr" }),
            React.createElement("div", { className: "bolt-identity-default-card-header-wrapper" },
                React.createElement("div", { className: "bolt-identity-default-card-header pointer bolt-profile-card-tab-element" }, Resources.IdentityCardContact)),
            React.createElement("div", { className: "bolt-identity-default-card-contact-info-container" },
                mailNickname && React.createElement(CardContactLine, { iconName: "GitHubLogo", content: "thomabr" }),
                mail && React.createElement(CardContactLine, { iconName: "Mail", content: mail, link: "mailto:" + mail }),
                mail && React.createElement(CardContactLine, { iconName: "Chat", content: Resources.IdentityCardStartChat, link: "sip:" + mail })))))));
};
