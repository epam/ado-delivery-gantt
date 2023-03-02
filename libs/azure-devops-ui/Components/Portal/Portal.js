import { __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Portal.css";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { ObservableValue } from '../../Core/Observable';
import { Observer } from '../../Observer';
/**
 * The Portal component is used to create a React Portal through a well known component.
 * This component allows the platform to control where portals are rooted in the document
 * and ensure these are managed properly.
 */
var Portal = /** @class */ (function (_super) {
    __extends(Portal, _super);
    function Portal(props) {
        var _this = _super.call(this, props) || this;
        _this.mounted = new ObservableValue(false);
        // Determine the element that will host the portal.
        var parentElement = _this.props.portalElement;
        if (!parentElement && _this.props.portalSelector) {
            parentElement = document.querySelector(_this.props.portalSelector);
        }
        if (!parentElement) {
            parentElement = document.querySelector(".bolt-portal-host");
            if (!parentElement) {
                parentElement = document.createElement("div");
                parentElement.className = "bolt-portal-host absolute-fill no-events scroll-hidden";
                document.body.appendChild(parentElement);
            }
        }
        if (_this.props.parentClassName && !parentElement.classList.contains(_this.props.parentClassName)) {
            parentElement.classList.add(_this.props.parentClassName);
        }
        _this.parentElement = parentElement;
        // Create the hosting element for the portal.
        _this.hostElement = document.createElement("div");
        return _this;
    }
    Portal.prototype.render = function () {
        var _this = this;
        this.hostElement.className = "";
        this.hostElement.classList.add("bolt-portal");
        this.hostElement.classList.add("absolute-fill");
        // If custom class's are supplied add them (1 at a time since IE doesnt support multiple args).
        if (this.props.className) {
            var classNames = this.props.className.split(" ");
            for (var _i = 0, classNames_1 = classNames; _i < classNames_1.length; _i++) {
                var className = classNames_1[_i];
                this.hostElement.classList.add(className);
            }
        }
        // NOTE: We dont render the children until after we have mounted the portal.
        //  If the caller needs to access the document while mounting the content this
        //  will ensure the children of the portal are not mounted until the portal
        //  is attached to the DOM.
        return ReactDOM.createPortal(React.createElement(Observer, { mounted: this.mounted }, function (props) { return (props.mounted ? _this.props.children : null); }), this.hostElement);
    };
    Portal.prototype.componentDidMount = function () {
        this.parentElement.appendChild(this.hostElement);
        this.mounted.value = true;
    };
    Portal.prototype.componentWillUnmount = function () {
        this.parentElement.removeChild(this.hostElement);
    };
    return Portal;
}(React.Component));
export { Portal };
