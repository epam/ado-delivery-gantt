import { __assign } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./IdentityPickerDropdown.css";
import * as React from "react";
import { ObservableLike, useObservable } from '../../Core/Observable';
import { Observer } from '../../Observer';
import { CustomIdentityPickerDropdown } from "./CustomIdentityPickerDropdown";
export var IdentityPickerDropdown = function (props) {
    var _a = useObservable(getTextValue(props.value)), textValue = _a[0], setTextValue = _a[1];
    var _b = useObservable(false), suggestionsVisible = _b[0], setSuggestionsVisible = _b[1];
    var onChange = props.onChange;
    var suggestionsVisibleChanged = function (opened) {
        props.onSuggestionsVisibleChanged && props.onSuggestionsVisibleChanged(opened);
        setSuggestionsVisible(opened);
    };
    var onPersonaChange = function (item) {
        if (onChange(item) !== false) {
            setTextValue(item ? item.displayName || item.mailNickname : "");
            return true;
        }
        else {
            setTextValue("");
            return false;
        }
    };
    if (!ObservableLike.isObservable(props.value)) {
        React.useEffect(function () {
            setTextValue((props.value && ObservableLike.getValue(props.value) && ObservableLike.getValue(props.value).displayName) || "");
        }, [props.value]);
    }
    return (React.createElement(Observer, { value: {
            observableValue: props.value,
            filter: function () {
                setTextValue(getTextValue(props.value));
                return false;
            }
        } }, function () { return (React.createElement(CustomIdentityPickerDropdown, __assign({}, props, { suggestionsVisible: suggestionsVisible, onChange: onPersonaChange, onInputChange: setTextValue, onSuggestionsVisibleChanged: suggestionsVisibleChanged, textValue: textValue }))); }));
};
function getTextValue(value) {
    return value && ObservableLike.getValue(value) ? ObservableLike.getValue(value).displayName : "";
}
