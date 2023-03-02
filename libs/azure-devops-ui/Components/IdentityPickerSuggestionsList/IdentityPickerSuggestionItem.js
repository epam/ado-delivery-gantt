import { __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./IdentityPickerSuggestionsList.css";
import * as React from "react";
import { Button } from '../../Button';
import { Icon } from '../../Icon';
import { Persona, PersonaSize } from '../../Persona';
import * as Resources from '../../Resources.IdentityPicker';
import { Tooltip } from '../../TooltipEx';
import { getScopedGroupParts, getSignInAddress, isGithubUser, shouldShowIdentityCard } from "../IdentityPickerDropdown/IdentityPickerUtils";
import { IdentityType } from "../IdentityPickerDropdown/SharedIdentityPicker.Props";
var IdentityPickerSuggestionItem = /** @class */ (function (_super) {
    __extends(IdentityPickerSuggestionItem, _super);
    function IdentityPickerSuggestionItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.contactCardButtonRef = React.createRef();
        return _this;
    }
    IdentityPickerSuggestionItem.prototype.render = function () {
        var _this = this;
        var identity = this.props.item;
        var signInAddress = getSignInAddress(identity);
        var displayName = identity.displayName;
        var scopedGroupParts = getScopedGroupParts(identity);
        if (scopedGroupParts) {
            displayName = scopedGroupParts.name;
            if (!signInAddress) {
                signInAddress = scopedGroupParts.scope;
            }
        }
        return (React.createElement("div", { className: "bolt-picker-suggesteditem flex-row flex-grow flex-center scroll-hidden" },
            this.props.renderSuggestion && identity.entityType === IdentityType.Custom ? (this.props.renderSuggestion(this.props)) : (React.createElement("div", { className: "bolt-picker-suggesteditem-text flex-row flex-grow flex-center text-ellipsis" },
                React.createElement(Persona, { ariaHidden: true, className: "bolt-picker-persona text-ellipsis", identity: identity, size: PersonaSize.size24 }),
                React.createElement("div", { className: "bolt-picker-persona-name flex-column flex-grow" },
                    displayName && (React.createElement(Tooltip, { text: identity.displayName, overflowOnly: identity.displayName === displayName },
                        React.createElement("div", { className: "fontSizeM text-ellipsis" }, displayName))),
                    !signInAddress ? (undefined) : (React.createElement("div", { className: "flex-row" },
                        isGithubUser(identity) && (React.createElement(Icon, { className: "bolt-identitypicker-github-icon flex-row flex-center justify-center", iconName: "GitHubLogo" })),
                        React.createElement("div", { className: "fontSize secondary-text text-ellipsis" }, signInAddress)))))),
            !!this.props.onOpenPersonaCard && shouldShowIdentityCard(identity) && (React.createElement(Button, { ariaLabel: Resources.IdentityPickerProfileCardButtonTooltip, className: "bolt-contact-card-button flex-noshrink", iconProps: { iconName: "ContactCard", className: "flex-shrink" }, onClick: function (e) {
                    _this.props.onOpenPersonaCard && _this.props.onOpenPersonaCard(identity);
                    e.preventDefault();
                }, onBlur: this.props.onBlur, onFocus: this.props.onFocus, ref: this.contactCardButtonRef, subtle: true, tooltipProps: { text: Resources.IdentityPickerProfileCardButtonTooltip, showOnFocus: true } }))));
    };
    IdentityPickerSuggestionItem.prototype.focus = function () {
        if (this.contactCardButtonRef.current) {
            this.contactCardButtonRef.current.focus();
        }
    };
    return IdentityPickerSuggestionItem;
}(React.Component));
export { IdentityPickerSuggestionItem };
