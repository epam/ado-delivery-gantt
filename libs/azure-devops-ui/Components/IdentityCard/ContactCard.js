import "../../CommonImports";
import "../../Core/core.css";
import "./IdentityCard.css";
import * as React from "react";
import { Link } from '../../Link';
import * as Resources from '../../Resources.Persona';
import { css } from '../../Util';
export var ContactCardContactLine = function (props) {
    var content = props.content, label = props.label, link = props.link, padTop = props.padTop;
    return (React.createElement("div", { className: "flex-column scroll-hidden" },
        React.createElement("div", { className: css("bolt-identity-contact-card-line flex-row flex-grow", padTop && "bolt-identity-contact-card-line-top") },
            React.createElement("div", { className: "bolt-identity-contact-card-span-label flex-noshrink" }, label),
            React.createElement("div", { className: "bolt-identity-contact-card-span-content flex-grow flex-row" },
                link && content && (React.createElement(Link, { className: "flex-row text-ellipsis", href: link }, content)),
                !link && content))));
};
export var ContactCard = function (props) {
    var identity = props.identity;
    return (React.createElement("div", { className: "bolt-bolt-identity-contact-card-organization-card-wrapper flex-column scroll-hidden" },
        React.createElement("div", { className: "bolt-identity-contact-card-header-wrapper" },
            React.createElement("div", { className: "body-m" }, Resources.IdentityCardContactInfo)),
        React.createElement("div", { className: "bolt-identity-contact-card-info-wrapper flex-column flex-grow body-s" },
            React.createElement(ContactCardContactLine, { label: Resources.IdentityCardEmail, content: identity.mail, link: "mailto:" + identity.mail }),
            React.createElement(ContactCardContactLine, { content: identity.telephoneNumber, label: Resources.IdentityCardPhoneNumber, link: "mailto:" + identity.telephoneNumber }),
            React.createElement(ContactCardContactLine, { label: Resources.IdentityCardLocation, content: identity.physicalDeliveryOfficeName }),
            React.createElement(ContactCardContactLine, { label: Resources.IdentityCardTitle, content: identity.jobTitle, padTop: true }),
            React.createElement(ContactCardContactLine, { label: Resources.IdentityCardDepartment, content: identity.department }),
            React.createElement(ContactCardContactLine, { label: Resources.IdentityCardAlias, content: identity.mailNickname }))));
};
