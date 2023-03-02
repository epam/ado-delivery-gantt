import { __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./FormItem.css";
import * as React from "react";
import { Observer } from '../../Observer';
import { css, getSafeId } from '../../Util';
export var FormItemContext = React.createContext({});
var formItemId = 1;
var FormItem = /** @class */ (function (_super) {
    __extends(FormItem, _super);
    function FormItem() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.id = "form-item-" + formItemId++;
        return _this;
    }
    FormItem.prototype.render = function () {
        var _this = this;
        var _a = this.props, ariaLabel = _a.ariaLabel, className = _a.className, error = _a.error, label = _a.label, message = _a.message;
        var ariaLabelledById = label ? this.id + "-label" : undefined;
        return (React.createElement(Observer, { error: error, message: message }, function (observedProps) {
            var ariaDescribedById = observedProps.message ? _this.id + "-message" : undefined;
            return (React.createElement(FormItemContext.Provider, { value: { ariaDescribedById: ariaDescribedById, ariaLabelledById: ariaLabelledById, error: observedProps.error } },
                React.createElement("div", { className: css(className, "flex-column") },
                    label && (React.createElement("label", { "aria-label": ariaLabel, className: "bolt-formitem-label body-m", id: getSafeId(ariaLabelledById) }, label)),
                    _this.props.children,
                    observedProps.message && (React.createElement("span", { className: css("bolt-formitem-message body-xs", observedProps.error && "bolt-formitem-message-error"), id: getSafeId(ariaDescribedById), role: observedProps.error ? "alert" : undefined }, observedProps.message)))));
        }));
    };
    return FormItem;
}(React.Component));
export { FormItem };
