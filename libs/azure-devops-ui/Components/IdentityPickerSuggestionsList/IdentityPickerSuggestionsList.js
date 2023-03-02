import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./IdentityPickerSuggestionsList.css";
import * as React from "react";
import { Callout } from '../../Callout';
import { IdentityCard } from '../../IdentityCard';
import { Observer } from '../../Observer';
import * as Resources from '../../Resources.IdentityPicker';
import { SuggestionsList } from '../../SuggestionsList';
import { css } from '../../Util';
var IdentityPickerSuggestionsList = /** @class */ (function (_super) {
    __extends(IdentityPickerSuggestionsList, _super);
    function IdentityPickerSuggestionsList() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.renderNoIdentitiesFound = function () {
            return (React.createElement("div", { className: "bolt-identitypickerdropdown-noresults flex-row flex-grow flex-center" }, _this.props.noResultsFoundText || Resources.IdentityPickerNoResultsText));
        };
        return _this;
    }
    IdentityPickerSuggestionsList.prototype.render = function () {
        var _this = this;
        return (React.createElement(React.Fragment, null,
            React.createElement(Observer, { suggestionsVisible: this.props.suggestionsVisible, suggestionsLoading: this.props.isLoading, selectedIndex: this.props.selectedIndex, suggestions: this.props.suggestions }, function (props) {
                return props.suggestionsVisible ? (React.createElement(Callout, __assign({}, _this.props.calloutProps, { className: css("bolt-identitypickerdropdown-callout", _this.props.calloutProps.className), contentClassName: css("bolt-identitypickerdropdown-callout-content flex-row flex-grow", _this.props.calloutProps.contentClassName) }),
                    React.createElement(SuggestionsList, __assign({}, _this.props, { className: css("bolt-identitypickerdropdown-list", _this.props.className), isLoading: props.suggestionsLoading, loadingText: _this.props.loadingText || Resources.IdentityPickerLoadingText, renderNoResultFound: _this.renderNoIdentitiesFound, renderSuggestion: _this.props.renderSuggestion, onBlur: _this.props.onBlur, onFocus: _this.props.onFocus, resultsMaximumNumber: 25, suggestionsItemClassName: css("bolt-identitypickerdropdown-item", _this.props.suggestionsItemClassName), suggestions: props.suggestions, selectedIndex: props.selectedIndex, width: _this.props.width })))) : (React.createElement("div", null));
            }),
            React.createElement(Observer, { openedIdentityCard: this.props.openedIdentityCard }, function (props) {
                return props.openedIdentityCard ? (React.createElement(IdentityCard, { getEntityFromUniqueAttribute: _this.props.pickerProvider.getEntityFromUniqueAttribute, key: props.openedIdentityCard.entityId, identity: props.openedIdentityCard, target: _this.props.suggestionTarget, onDismissCallback: _this.props.onClosePersonaCard, onRequestConnectionInformation: _this.props.pickerProvider.onRequestConnectionInformation })) : (React.createElement("div", null));
            })));
    };
    return IdentityPickerSuggestionsList;
}(React.Component));
export { IdentityPickerSuggestionsList };
