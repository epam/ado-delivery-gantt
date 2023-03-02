import { __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./IdentityCard.css";
import * as React from "react";
import * as Resources from '../../Resources.Persona';
import { format } from '../../Core/Util/String';
import { Button } from '../../Button';
import { Persona } from "../Persona/Persona";
import { PersonaSize } from "../Persona/Persona.Props";
var OrganizationCard = /** @class */ (function (_super) {
    __extends(OrganizationCard, _super);
    function OrganizationCard() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // Helper methods to create Presona elements
        _this.createManagerChainIdentityElements = function () {
            var managerChainElementList = _this.props.managerList
                ? _this.props.managerList.map(function (manager) {
                    var managerData = {
                        imageUrl: manager.image,
                        primaryText: manager.displayName ? manager.displayName : "",
                        secondaryText: manager.jobTitle ? manager.jobTitle : "",
                        tertiaryText: manager.department ? manager.department : ""
                    };
                    return (React.createElement("div", { className: "bolt-identity-card-persona-list-row flex-row flex-grow scroll-hidden", key: manager.entityId + manager.signInAddress },
                        React.createElement(Button, { "aria-label": manager.displayName, className: "bolt-identity-card-persona-list-element profile-card-tab-element flex-row text-ellipsis", onClick: function () {
                                _this.props.onClickEntity && _this.props.onClickEntity(manager);
                            }, subtle: true },
                            React.createElement(Persona, { size: PersonaSize.size40, identity: manager }),
                            React.createElement("div", { className: "flex-column flex-grow bolt-identity-card-name text-ellipsis" },
                                React.createElement("div", { className: "text-left text-ellipsis" }, managerData.primaryText),
                                managerData.secondaryText === "" ? (undefined) : (React.createElement("div", { className: "text-left text-ellipsis" }, managerData.secondaryText))))));
                })
                : [];
            // Append current identity to list
            var mainIdentityData = {
                imageUrl: _this.props.identity.image,
                primaryText: _this.props.identity.displayName,
                secondaryText: _this.props.identity.jobTitle,
                tertiaryText: _this.props.identity.department
            };
            managerChainElementList.push(React.createElement("div", { className: "bolt-identity-card-persona-list-row flex-row flex-grow", key: _this.props.identity.entityId + _this.props.identity.signInAddress },
                React.createElement(Button, { className: "bolt-identity-card-persona-list-element profile-card-tab-element flex-row flex-shrink text-ellipsis", "aria-label": _this.props.identity.displayName, onClick: function () {
                        _this.props.onClickEntity && _this.props.onClickEntity(_this.props.identity);
                    }, subtle: true },
                    React.createElement(Persona, { size: PersonaSize.size40, identity: _this.props.identity }),
                    React.createElement("div", { className: "flex-column flex-grow bolt-identity-card-name text-ellipsis" },
                        React.createElement("div", { className: "text-left text-ellipsis" }, mainIdentityData.primaryText),
                        mainIdentityData.secondaryText === "" ? (undefined) : (React.createElement("div", { className: "text-left text-ellipsis" }, mainIdentityData.secondaryText))))));
            return managerChainElementList;
        };
        _this.createDirectReportsIdentityElements = function () {
            var directReportElementList = _this.props.directReportList
                ? _this.props.directReportList.map(function (directReport) {
                    var directReportData = {
                        imageUrl: directReport.image,
                        primaryText: directReport.displayName ? directReport.displayName : "",
                        secondaryText: directReport.jobTitle ? directReport.jobTitle : "",
                        tertiaryText: directReport.department ? directReport.department : ""
                    };
                    return (React.createElement("div", { className: "bolt-identity-card-persona-list-row flex-row flex-grow", key: directReport.entityId + directReport.signInAddress },
                        React.createElement(Button, { className: "bolt-identity-card-persona-list-element profile-card-tab-element flex-row text-ellipsis", "aria-label": directReport.displayName, onClick: function () {
                                _this.props.onClickEntity && _this.props.onClickEntity(directReport);
                            }, subtle: true },
                            React.createElement(Persona, { size: PersonaSize.size40, identity: directReport }),
                            React.createElement("div", { className: "flex-column flex-grow bolt-identity-card-name text-ellipsis" },
                                React.createElement("div", { className: "text-left text-ellipsis" }, directReportData.primaryText),
                                directReportData.secondaryText === "" ? (undefined) : (React.createElement("div", { className: "text-left text-ellipsis" }, directReportData.secondaryText))))));
                })
                : [];
            return directReportElementList;
        };
        return _this;
    }
    // Render
    OrganizationCard.prototype.render = function () {
        var managerIdentityList = this.createManagerChainIdentityElements();
        var directReportIdentityList = this.createDirectReportsIdentityElements();
        return (React.createElement("div", { className: "bolt-identity-contact-card-organization-card-wrapper bolt-identity-card-content" },
            React.createElement("div", { className: "bolt-identity-organization-card-content v-scroll-auto h-scroll-hidden" },
                React.createElement("div", { className: "bolt-identity-organization-card-header-wrapper" },
                    Resources.IdentityCardOrganization,
                    " "),
                React.createElement("div", { className: "bolt-identity-organization-card-manager-chain-wrapper" }, managerIdentityList),
                directReportIdentityList.length > 0 && (React.createElement("div", { className: "bolt-identity-organization-card-direct-reports-wrapper" },
                    format(Resources.IdentityCardReportingTo, this.props.identity.displayName, this.props.directReportList ? this.props.directReportList.length : 0),
                    directReportIdentityList)))));
    };
    return OrganizationCard;
}(React.Component));
export { OrganizationCard };
