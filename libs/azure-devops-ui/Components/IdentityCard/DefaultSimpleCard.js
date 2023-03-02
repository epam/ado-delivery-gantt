import "../../CommonImports";
import "../../Core/core.css";
import "./IdentityCard.css";
import * as React from "react";
import { FocusZoneContext } from '../../FocusZone';
import { Persona } from "../Persona/Persona";
import { PersonaSize } from "../Persona/Persona.Props";
export var DefaultSimpleCard = function (props) {
    var mainIdentityData = {
        imageUrl: props.identity.image,
        primaryText: props.identity.displayName,
        secondaryText: props.identity.scopeName && props.identity.signInAddress
            ? props.identity.scopeName + "\\" + props.identity.signInAddress
            : props.identity.signInAddress
                ? props.identity.signInAddress
                : ""
    };
    return (React.createElement(FocusZoneContext.Consumer, null, function (zoneContext) {
        return (React.createElement("div", { className: "bolt-identity-default-card-simple bolt-identity-card-content flex-row scroll-hidden" },
            React.createElement("div", { className: "flex-row flex-grow" },
                React.createElement(Persona, { className: "bolt-identity-card-persona-main", identity: props.identity, size: PersonaSize.size72 }),
                React.createElement("div", { className: "bolt-identity-card-persona-text flex-column flex-grow" },
                    React.createElement("div", { className: "primary-text flex-row title-s", tabIndex: 0, "data-focuszone": zoneContext.focuszoneId }, mainIdentityData.primaryText),
                    mainIdentityData.secondaryText === "" ? (undefined) : (React.createElement("div", { className: "secondary-text flex-row body-l" }, mainIdentityData.secondaryText))))));
    }));
};
