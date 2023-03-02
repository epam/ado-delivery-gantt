import "../../CommonImports";
import "../../Core/core.css";
import "./IdentityCard.css";
import * as React from "react";
import * as Resources from '../../Resources.Persona';
import { format } from '../../Core/Util/String';
import { Button } from '../../Button';
import { Spinner, SpinnerSize } from '../../Spinner';
import { css } from '../../Util';
import { Persona } from "../Persona/Persona";
import { PersonaSize } from "../Persona/Persona.Props";
export var GroupMembersCard = function (props) {
    var members = props.members, onClickEntity = props.onClickEntity;
    var membersString = format(Resources.IdentityCardMembers, members ? members.length : 0);
    var membersElementList = members
        ? members.map(function (member) {
            var directReportData = {
                imageUrl: member.image,
                primaryText: member.displayName ? member.displayName : "",
                secondaryText: member.jobTitle ? member.jobTitle : "",
                tertiaryText: member.department ? member.department : ""
            };
            return (React.createElement("div", { className: "bolt-identity-card-persona-list-row flex-row flex-grow scroll-hidden", key: member.entityId + member.signInAddress },
                React.createElement(Button, { className: "bolt-identity-card-persona-list-element profile-card-tab-element flex-row flex-grow flex-shrink text-ellipsis", "aria-label": member.displayName, onClick: function () {
                        onClickEntity && onClickEntity(member);
                    }, subtle: true },
                    React.createElement(Persona, { size: PersonaSize.size40, identity: member }),
                    React.createElement("div", { className: "flex-column flex-grow flex-shrink bolt-identity-card-name scroll-hidden" },
                        React.createElement("div", { className: "text-left text-ellipsis" }, directReportData.primaryText),
                        directReportData.secondaryText === "" ? (undefined) : (React.createElement("div", { className: "text-left text-ellipsis" }, directReportData.secondaryText))))));
        })
        : [];
    return (React.createElement("div", { className: "bolt-identity-contact-card-organization-card-wrapper bolt-identity-card-content" },
        React.createElement("div", { className: css("bolt-identity-organization-card-content v-scroll-auto h-scroll-hidden", membersElementList.length === 0 && "flex-row justify-center") }, membersElementList.length > 0 ? (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "bolt-identity-organization-card-header-wrapper" },
                membersString,
                " "),
            React.createElement("div", { className: "bolt-identity-organization-card-members-wrapper" }, membersElementList))) : (React.createElement(Spinner, { label: Resources.Loading, size: SpinnerSize.large, className: "bolt-identity-card-loading-spinner" })))));
};
