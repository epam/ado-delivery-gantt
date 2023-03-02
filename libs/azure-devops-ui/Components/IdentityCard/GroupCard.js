import "../../CommonImports";
import "../../Core/core.css";
import "./IdentityCard.css";
import * as React from "react";
import { format } from '../../Core/Util/String';
import { Button } from '../../Button';
import { Icon } from '../../Icon';
import * as Resources from '../../Resources.Persona';
import { Tooltip } from '../../TooltipEx';
import { Persona } from "../Persona/Persona";
import { PersonaSize } from "../Persona/Persona.Props";
import { CardContactLine } from "./CardContactLine";
export var GroupCard = function (props) {
    var identity = props.identity, members = props.members, showOrganizationCard = props.showOrganizationCard;
    var displayName = identity.displayName, mail = identity.mail, physicalDeliveryOfficeName = identity.physicalDeliveryOfficeName, telephoneNumber = identity.telephoneNumber;
    var hiddenFocusElement = React.useRef(null);
    var renderContactInformation = mail || telephoneNumber || physicalDeliveryOfficeName;
    // onMount
    React.useEffect(function () {
        if (!renderContactInformation) {
            hiddenFocusElement.current && hiddenFocusElement.current.focus();
        }
    }, []);
    var memberButtonText = format(Resources.IdentityCardMembersCount, members ? members.length : 0);
    return (React.createElement("div", { className: "bolt-identity-default-card-without-header bolt-identity-card-content" },
        React.createElement("div", { ref: hiddenFocusElement, tabIndex: -1 }),
        React.createElement("div", { className: "flex-row" },
            React.createElement(Persona, { className: "bolt-identity-card-persona-main", size: PersonaSize.size72, identity: identity }),
            React.createElement("div", { className: "flex-column flex-grow bolt-identity-card-name scroll-hidden" },
                React.createElement(Tooltip, { text: displayName, overflowOnly: true },
                    React.createElement("div", { className: "text-ellipsis title-s" }, displayName)),
                members && members.length > 0 ? (React.createElement("div", { className: "text-ellipsis" }, format(Resources.IdentityCardMembers, members.length))) : (undefined))),
        React.createElement("div", null,
            renderContactInformation && (React.createElement("div", { className: "bolt-identity-default-card-info-wrapper" },
                React.createElement("hr", { className: "bolt-identity-card-hr" }),
                React.createElement("div", { className: "bolt-identity-default-card-contact-info-container" }, mail && React.createElement(CardContactLine, { iconName: "Mail", content: mail, link: "mailto:" + mail })))),
            members && members.length > 0 ? (React.createElement("div", { className: "bolt-identity-default-card-member-list-wrapper " },
                React.createElement("hr", { className: "bolt-identity-card-hr" }),
                React.createElement("div", { className: "bolt-identity-default-card-header-wrapper" },
                    React.createElement(Button, { "aria-label": memberButtonText, className: "bolt-identity-default-card-header pointer bolt-profile-card-tab-element flex-center", onClick: function () {
                            showOrganizationCard && showOrganizationCard();
                        }, role: "button", text: memberButtonText, subtle: true },
                        React.createElement(Icon, { iconName: "ChevronRight" }))))) : (undefined))));
};
