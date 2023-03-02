import { __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./IdentityPickerDropdown.css";
import * as React from "react";
import { ObservableLike, ObservableValue } from '../../Core/Observable';
import { FilterBarItem } from '../../FilterBarItem';
import { css } from '../../Util';
import { CustomIdentityPickerDropdown } from "./CustomIdentityPickerDropdown";
var IdentityPickerDropdownFilterBarItem = /** @class */ (function (_super) {
    __extends(IdentityPickerDropdownFilterBarItem, _super);
    function IdentityPickerDropdownFilterBarItem(props) {
        var _this = _super.call(this, props) || this;
        _this.selectedUser = new ObservableValue(undefined);
        _this.selectedUserFriendlyName = new ObservableValue("");
        _this.areSuggestionsVisible = new ObservableValue(false);
        _this.onFilterChanged = function (filterState) {
            _super.prototype.onFilterChanged.call(_this, filterState);
            if (!filterState || !filterState.value) {
                _this.selectedUser.value = undefined;
                _this.setTextValue("");
            }
        };
        _this.onSuggestionsVisibleChanged = function (areSuggestionsVisible) {
            _this.areSuggestionsVisible.value = areSuggestionsVisible;
        };
        _this.onIdentityChanged = function (identity) {
            _this.selectedUser.value = identity;
            _this.setFilterValue({ value: _this.selectedUser.value });
            _this.setTextValue((identity && identity.displayName) || "");
        };
        _this.setTextValue = function (text) {
            _this.selectedUserFriendlyName.value = text;
        };
        if (props.initialValue) {
            if (ObservableLike.isObservable(props.initialValue)) {
                _this.selectedUser = props.initialValue;
            }
            else {
                _this.selectedUser.value = props.initialValue;
            }
            _this.selectedUserFriendlyName.value = (_this.selectedUser.value && _this.selectedUser.value.displayName) || "";
        }
        if (props.initialTextValue) {
            if (ObservableLike.isObservable(props.initialTextValue)) {
                _this.selectedUserFriendlyName = props.initialTextValue;
            }
            else {
                _this.selectedUserFriendlyName.value = props.initialTextValue;
            }
        }
        return _this;
    }
    IdentityPickerDropdownFilterBarItem.prototype.focus = function () {
        // CustomIdentityPickerDropdown needs a focus() method for this to work
        return false;
    };
    IdentityPickerDropdownFilterBarItem.prototype.render = function () {
        return (React.createElement(CustomIdentityPickerDropdown, { className: css(this.props.className, "bolt-identitypicker-filterbaritem"), pickerProvider: this.props.pickerProvider, onChange: this.onIdentityChanged, placeholder: this.props.placeholder, editPlaceholder: this.props.editPlaceholder, value: this.selectedUser, textValue: this.selectedUserFriendlyName, resolveUnrecognizedIdentity: this.props.resolveUnrecognizedIdentity, suggestionsVisible: this.areSuggestionsVisible, onSuggestionsVisibleChanged: this.onSuggestionsVisibleChanged, onInputChange: this.setTextValue }));
    };
    return IdentityPickerDropdownFilterBarItem;
}(FilterBarItem));
export { IdentityPickerDropdownFilterBarItem };
