import "../../CommonImports";
import "../../Core/core.css";
import "./IdentityPickerSuggestionsList.css";
import * as React from "react";
import { Button } from '../../Button';
import { Icon } from '../../Icon';
import { Persona, PersonaSize } from '../../Persona';
import * as Resources from '../../Resources.IdentityPicker';
import { getSignInAddress, isGithubUser } from "../IdentityPickerDropdown/IdentityPickerUtils";
import { IdentityType } from "../IdentityPickerDropdown/SharedIdentityPicker.Props";
export var renderNoIdentitiesFound = function () {
    return React.createElement("div", { className: "bolt-identitypickerdropdown-noresults flex-row flex-grow flex-center" }, Resources.IdentityPickerNoResultsText);
};
/**
 * Called when the user removes a previously selected person
 */
export var renderSuggestionItem = function (suggestion, onOpenPersonaCard, renderCustomIdentitySuggestion) {
    var identity = suggestion.item;
    var signInAddress = getSignInAddress(identity);
    return (React.createElement("div", { className: "bolt-picker-suggesteditem flex-row flex-grow flex-center text-ellipsis" }, !!renderCustomIdentitySuggestion && suggestion.item.entityType === IdentityType.Custom ? (renderCustomIdentitySuggestion(suggestion.item)) : (React.createElement(React.Fragment, null,
        React.createElement(Persona, { className: "bolt-picker-persona text-ellipsis", identity: identity, size: PersonaSize.size24 }),
        React.createElement("div", { className: "bolt-picker-persona-name flex-column flex-grow" },
            identity.displayName && React.createElement("div", { className: "fontSizeM text-ellipsis" }, identity.displayName),
            signInAddress === "" ? (undefined) : (React.createElement("div", { className: "flex-row" },
                isGithubUser(identity) && (React.createElement(Icon, { className: "bolt-identitypicker-github-icon flex-row flex-center justify-center", iconName: "GitHubLogo" })),
                React.createElement("div", { className: "fontSize secondary-text text-ellipsis" }, signInAddress)))),
        !!onOpenPersonaCard && (React.createElement(Button, { className: "bolt-contact-card", iconProps: { iconName: "ContactCard", className: "bolt-contactcard-button flex-shrink" }, onClick: function (e) {
                onOpenPersonaCard && onOpenPersonaCard(identity);
                e.preventDefault();
            }, subtle: true }))))));
};
