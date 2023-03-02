import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import { TextField } from "../TextField/TextField";
import { ObservableLike } from '../../Core/Observable';
import { css, KeyCode } from '../../Util';
var TypeAhead = /** @class */ (function (_super) {
    __extends(TypeAhead, _super);
    function TypeAhead() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.textFieldRef = React.createRef();
        _this.autofillEnabled = true;
        _this.select = function () {
            _this.textFieldRef.current.select();
        };
        _this.onKeyDown = function (event) {
            _this.props.onKeyDown && _this.props.onKeyDown(event);
            if (event.isDefaultPrevented()) {
                return;
            }
            var suggestedValue = _this.props.suggestedValue && ObservableLike.getValue(_this.props.suggestedValue);
            var typedValue = _this.props.value && ObservableLike.getValue(_this.props.value);
            switch (event.which) {
                case KeyCode.tab:
                    if (suggestedValue && typedValue !== suggestedValue && _this.autofillEnabled && _this.props.onAutoComplete) {
                        _this.props.onAutoComplete(suggestedValue);
                        event.preventDefault();
                    }
                    break;
                case KeyCode.backspace:
                case KeyCode.delete:
                    _this.autofillEnabled = false;
                    break;
                default:
                    _this.autofillEnabled = true;
                    break;
            }
        };
        return _this;
    }
    // We have to use this paradigm because otherwise componentDidUpdate won't get called
    TypeAhead.prototype.subscribeAll = function (props) {
        var _this = this;
        ObservableLike.subscribe(props.value, function () { return _this.forceUpdate(); });
        ObservableLike.subscribe(props.suggestedValue, function () { return _this.forceUpdate(); });
    };
    TypeAhead.prototype.unsubscribeAll = function (props) {
        var _this = this;
        ObservableLike.unsubscribe(props.value, function () { return _this.forceUpdate(); });
        ObservableLike.unsubscribe(props.suggestedValue, function () { return _this.forceUpdate(); });
    };
    TypeAhead.prototype.componentDidMount = function () {
        this.subscribeAll(this.props);
    };
    TypeAhead.prototype.componentWillUnmount = function () {
        this.unsubscribeAll(this.props);
    };
    TypeAhead.prototype.UNSAFE_componentWillReceiveProps = function (newProps) {
        this.unsubscribeAll(this.props);
        this.subscribeAll(newProps);
    };
    TypeAhead.prototype.focus = function () {
        this.textFieldRef.current.focus();
    };
    Object.defineProperty(TypeAhead.prototype, "selectionEnd", {
        get: function () {
            return this.textFieldRef.current.selectionEnd;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TypeAhead.prototype, "selectionStart", {
        get: function () {
            return this.textFieldRef.current.selectionStart;
        },
        enumerable: false,
        configurable: true
    });
    TypeAhead.prototype.setSelectionRange = function (start, end, direction) {
        this.textFieldRef.current.setSelectionRange(start, end, direction);
    };
    TypeAhead.prototype.render = function () {
        var _a = this.props, value = _a.value, suggestedValue = _a.suggestedValue, className = _a.className;
        var renderValue = this.autofillEnabled ? suggestedValue : value;
        return (React.createElement(TextField, __assign({}, this.props, { className: css(className, "bolt-typeahead"), onKeyDown: this.onKeyDown, ref: this.textFieldRef, value: renderValue })));
    };
    TypeAhead.prototype.componentDidUpdate = function () {
        var suggestedValue = this.props.suggestedValue && ObservableLike.getValue(this.props.suggestedValue);
        var typedValue = this.props.value && ObservableLike.getValue(this.props.value);
        if (suggestedValue && this.autofillEnabled) {
            if (typedValue && suggestedValue.startsWith(typedValue)) {
                this.textFieldRef.current.setSelectionRange(typedValue.length, suggestedValue.length, "backward");
            }
            else if (!typedValue) {
                this.textFieldRef.current.setSelectionRange(0, suggestedValue.length);
            }
        }
    };
    return TypeAhead;
}(React.Component));
export { TypeAhead };
