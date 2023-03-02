import { __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./IdentityCard.css";
import * as React from "react";
import * as Resources from '../../Resources.Persona';
import { Callout } from '../../Callout';
import { FocusZone, FocusZoneDirection } from '../../FocusZone';
import { Location } from '../../Utilities/Position';
import { Spinner, SpinnerSize } from '../../Spinner';
import { css, KeyCode } from '../../Util';
import { ContactCard } from "./ContactCard";
import { DefaultAbridgedCard } from "./DefaultAbridgedCard";
import { DefaultCard } from "./DefaultCard";
import { DefaultSimpleCard } from "./DefaultSimpleCard";
import { GitHubCard } from "./GitHubCard";
import { GroupCard } from "./GroupCard";
import { GroupMembersCard } from "./GroupMembersCard";
import { CardType } from "./IdentityCard.Props";
import { IdentityCardHeaderElement as HeaderElement } from "./IdentityCardHeaderElement";
import * as Utils from "./IdentityCardIdentityUtils";
import { OrganizationCard } from "./OrganizationCard";
/**
 * The content of the callout for the persona card.
 */
var IdentityCardContent = /** @class */ (function (_super) {
    __extends(IdentityCardContent, _super);
    function IdentityCardContent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onKeyDown = function (ev) {
            if (ev.which === KeyCode.escape) {
                _this.onDismissCallout();
                ev.preventDefault();
            }
        };
        // State change helper methods
        _this.onDismissCallout = function () {
            if (_this.props.onDismissCallback) {
                _this.props.onDismissCallback();
            }
        };
        return _this;
    }
    // Render
    IdentityCardContent.prototype.render = function () {
        // Get target element
        var targetElement = this.props.referenceHTMLComponent ? this.props.referenceHTMLComponent : this.props.target;
        // Use component state information to render component
        return (React.createElement(Callout, { onDismiss: this.onDismissCallout, anchorElement: targetElement, anchorOrigin: { horizontal: Location.end, vertical: Location.start }, calloutOrigin: { horizontal: Location.start, vertical: Location.start }, ariaLabel: Resources.IdentityCardProfileCardAriaLabel, className: "bolt-identity-card-callout h-scroll-hidden depth-8", contentClassName: "v-scroll-auto", escDismiss: true, lightDismiss: true, ref: this.props.calloutRef },
            React.createElement("div", null, this.renderCard())));
    };
    IdentityCardContent.prototype.renderCard = function () {
        var cssClassName = "bolt-identity-card scroll-h-hidden";
        if (this.props.working && !Utils.isCompleteIdentity(this.props.dataProps.identity)) {
            // Still working to get initial data
            return (React.createElement("div", { className: css(cssClassName, "loading flex-row justify-center") },
                React.createElement(Spinner, { label: Resources.Loading, size: SpinnerSize.large, className: "bolt-identity-card-loading-spinner" })));
        }
        var isAdOrAadOrGroup = Utils.isAdUser(this.props.dataProps.identity) ||
            Utils.isAadUser(this.props.dataProps.identity) ||
            Utils.isGroup(this.props.dataProps.identity);
        var headerIdentity = this.props.dataProps.header || undefined;
        var innerCard = this.renderInnerCard();
        return innerCard ? (React.createElement(FocusZone, { circularNavigation: true, defaultActiveElement: ".bolt-identity-card-focus-element", direction: FocusZoneDirection.Vertical, focusOnMount: true, handleTabKey: true },
            React.createElement("div", { className: "bolt-identity-card-focus-element", tabIndex: -1 }),
            React.createElement("div", { className: cssClassName, onKeyDown: this.onKeyDown },
                isAdOrAadOrGroup && headerIdentity && React.createElement(HeaderElement, { identity: headerIdentity, onClickFunction: this.props.onHeaderClick }),
                innerCard))) : (React.createElement("div", null));
    };
    IdentityCardContent.prototype.renderInnerCard = function () {
        // Get component state data
        var _a = this.props.dataProps, identity = _a.identity, successors = _a.successors, managerList = _a.managerList, directReportList = _a.directReportList;
        if (!identity || this.props.showUnknownUser === true) {
            return (React.createElement("div", { className: "bolt-identity-card-content bolt-identity-card-unknown-user-content flex-column flex-center justify-center title-xs scroll-hidden" }, Resources.IdentityCardUnknownUser));
        }
        var isGroup = Utils.isGroup(identity);
        var isVsdUser = Utils.isVsdUser(identity);
        var isWmdUser = Utils.isWmdUser(identity);
        var isAadUser = Utils.isAadUser(identity);
        var isAdUser = Utils.isAdUser(identity);
        var isGithubUser = Utils.isGithubUser(identity);
        if (isGroup) {
            switch (this.props.dataProps.cardType) {
                case CardType.Organization:
                    return React.createElement(GroupMembersCard, { identity: identity, members: successors, onClickEntity: this.props.onClickEntity });
                case CardType.Default:
                    return (React.createElement(GroupCard, { identity: identity, isPreviousHeader: !!this.props.dataProps.previousDataState || !!this.props.initialHeader, members: successors, showOrganizationCard: this.props.onShowOrganizationCard }));
            }
        }
        else if (isGithubUser) {
            return React.createElement(GitHubCard, { identity: identity });
        }
        else if (isVsdUser) {
            return React.createElement(DefaultAbridgedCard, { identity: identity });
        }
        else if (isWmdUser) {
            return React.createElement(DefaultSimpleCard, { identity: identity });
        }
        else if (isAadUser || isAdUser) {
            switch (this.props.dataProps.cardType) {
                case CardType.Contact:
                    return React.createElement(ContactCard, { identity: identity });
                case CardType.Organization:
                    return (React.createElement(OrganizationCard, { identity: identity, managerList: managerList, directReportList: directReportList, onClickEntity: this.props.onClickEntity }));
                case CardType.Default:
                default:
                    var manager = managerList && managerList.length > 0 ? managerList[managerList.length - 1] : undefined;
                    return (React.createElement(DefaultCard, { identity: identity, manager: manager, isPreviousHeader: !!this.props.dataProps.previousDataState || !!this.props.initialHeader, showContactCard: this.props.onShowContactCard, showOrganizationCard: this.props.onShowOrganizationCard, onClickEntity: this.props.onClickEntity }));
            }
        }
        return React.createElement("div", null);
    };
    return IdentityCardContent;
}(React.Component));
export { IdentityCardContent };
