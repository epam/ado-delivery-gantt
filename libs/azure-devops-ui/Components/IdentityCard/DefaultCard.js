import { __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./IdentityCard.css";
import * as React from "react";
import * as Resources from '../../Resources.Persona';
import { Button } from '../../Button';
import { CardContactLine } from "./CardContactLine";
import { Icon } from '../../Icon';
import { Persona } from "../Persona/Persona";
import { PersonaSize } from "../Persona/Persona.Props";
import { css } from '../../Util';
var DefaultCard = /** @class */ (function (_super) {
    __extends(DefaultCard, _super);
    function DefaultCard() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.contactButtonRef = React.createRef();
        return _this;
    }
    // Setting the focus for the case of default card mounting when we come back via back header
    DefaultCard.prototype.componentDidMount = function () {
        if (this.contactButtonRef.current) {
            this.contactButtonRef.current.focus();
        }
    };
    // Render
    DefaultCard.prototype.render = function () {
        var _this = this;
        var _a = this.props, identity = _a.identity, isPreviousHeader = _a.isPreviousHeader;
        var displayName = identity.displayName, department = identity.department, jobTitle = identity.jobTitle, mail = identity.mail, physicalDeliveryOfficeName = identity.physicalDeliveryOfficeName, telephoneNumber = identity.telephoneNumber;
        return (React.createElement("div", { className: css("bolt-identity-card-content flex-column scroll-hidden", isPreviousHeader ? "bolt-identity-default-card-with-header" : "bolt-identity-default-card-without-header") },
            React.createElement("div", { className: "flex-row" },
                React.createElement(Persona, { className: "bolt-identity-card-persona-main", size: PersonaSize.size72, identity: this.props.identity }),
                React.createElement("div", { className: "flex-column flex-grow bolt-identity-card-name scroll-hidden" },
                    React.createElement("div", { className: "text-ellipsis title-s" }, displayName),
                    jobTitle === "" ? undefined : React.createElement("div", { className: "text-ellipsis" }, jobTitle),
                    department === "" ? undefined : React.createElement("div", { className: "text-ellipsis" }, department))),
            React.createElement("div", { className: "flex-column scroll-hidden" },
                (mail || telephoneNumber || physicalDeliveryOfficeName) && (React.createElement("div", { className: "bolt-identity-default-card-info-wrapper " },
                    React.createElement("hr", { className: "bolt-identity-card-hr" }),
                    React.createElement("div", { className: "bolt-identity-default-card-header-wrapper" },
                        React.createElement(Button, { "aria-label": Resources.IdentityCardContact, className: "bolt-identity-default-card-header pointer bolt-profile-card-tab-element", onClick: function () {
                                _this.props.showContactCard();
                            }, ref: this.contactButtonRef, role: "button", subtle: true, text: Resources.IdentityCardContact },
                            React.createElement(Icon, { iconName: "ChevronRight" }))),
                    React.createElement("div", { className: "bolt-identity-default-card-contact-info-container flex-column scroll-hidden" },
                        mail && React.createElement(CardContactLine, { iconName: "Mail", content: mail, link: "mailto:" + mail }),
                        mail && React.createElement(CardContactLine, { iconName: "Chat", content: Resources.IdentityCardStartChat, link: "sip:" + mail }),
                        telephoneNumber && React.createElement(CardContactLine, { iconName: "Phone", content: telephoneNumber, link: "tel:" + telephoneNumber }),
                        physicalDeliveryOfficeName && React.createElement(CardContactLine, { iconName: "POI", content: physicalDeliveryOfficeName })))),
                this.renderDirectManagerElement())));
    };
    /**
     * Renders the direct manager for the persona.
     * @param managerIdentity The manager persona.
     */
    DefaultCard.prototype.renderDirectManagerElement = function () {
        var _this = this;
        if (!this.props.manager) {
            return React.createElement("div", null);
        }
        var adjacentManager = this.props.manager;
        var adjacentManagerData = {
            imageUrl: adjacentManager.image,
            primaryText: adjacentManager.displayName,
            secondaryText: adjacentManager.jobTitle,
            tertiaryText: adjacentManager.department
        };
        return (React.createElement("div", { className: "bolt-identity-default-card-direct-manager-wrapper" },
            React.createElement("hr", { className: "bolt-identity-card-hr" }),
            React.createElement("div", { className: "bolt-identity-default-card-header-wrapper" },
                React.createElement(Button, { "aria-label": Resources.IdentityCardOrganization, className: "bolt-identity-default-card-header pointer bolt-profile-card-tab-element", onClick: function () {
                        _this.props.showOrganizationCard && _this.props.showOrganizationCard();
                    }, role: "button", text: Resources.IdentityCardOrganization, subtle: true },
                    React.createElement(Icon, { iconName: "ChevronRight" }))),
            React.createElement("div", { className: "bolt-identity-default-card-direct-manager" },
                React.createElement("div", { className: "bolt-identity-default-card-header-reportsto" }, Resources.IdentityCardReportsTo),
                React.createElement("div", { className: "flex-row scroll-hidden bolt-identity-card-reports-to-wrapper" },
                    React.createElement(Button, { className: "bolt-identity-card-persona-list-element bolt-profile-card-tab-element flex-shrink text-ellipsis", "aria-label": adjacentManager.displayName, key: adjacentManager.entityId + adjacentManager.signInAddress, onClick: function () {
                            _this.props.onClickEntity && _this.props.onClickEntity(adjacentManager);
                        }, subtle: true },
                        React.createElement(Persona, { size: PersonaSize.size40, identity: adjacentManager }),
                        React.createElement("div", { className: "bolt-identity-card-text flex-column scroll-hidden" },
                            React.createElement("div", { className: "primary-text flex-row text-ellipsis" }, adjacentManagerData.primaryText),
                            adjacentManagerData.secondaryText === "" ? (undefined) : (React.createElement("div", { className: "secondary-text flex-row text-ellipsis" }, adjacentManagerData.secondaryText))))))));
    };
    return DefaultCard;
}(React.Component));
export { DefaultCard };
