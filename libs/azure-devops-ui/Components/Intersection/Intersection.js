import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import { createMergedRef } from '../../Util';
// We need to monitor fine grained changes, especially when the list
// has horizontal scroll. You dont get 100% visible ever.
var defaultThreshold = [];
for (var index = 0; index <= 100; index++) {
    defaultThreshold.push(index / 100);
}
var IntersectionContextImpl = /** @class */ (function () {
    function IntersectionContextImpl() {
        var _this = this;
        this.callbacks = [];
        this.pending = [];
        this.rootMargin = 0;
        this.root = document.body;
        this.onIntersect = function (entries) {
            if (_this.observer) {
                for (var _i = 0, _a = _this.callbacks; _i < _a.length; _i++) {
                    var callback = _a[_i];
                    callback(entries, _this.observer);
                }
            }
        };
    }
    IntersectionContextImpl.prototype.connect = function (root, rootMargin, threshold) {
        if (rootMargin === void 0) { rootMargin = 0; }
        if (threshold === void 0) { threshold = defaultThreshold; }
        this.observer = new IntersectionObserver(this.onIntersect, { root: root, rootMargin: rootMargin + "px", threshold: threshold });
        this.rootMargin = rootMargin;
        this.root = root;
        for (var _i = 0, _a = this.pending; _i < _a.length; _i++) {
            var element = _a[_i];
            this.observer.observe(element);
        }
    };
    IntersectionContextImpl.prototype.disconnect = function () {
        if (this.observer) {
            this.observer.disconnect();
        }
    };
    IntersectionContextImpl.prototype.observe = function (element) {
        if (this.observer) {
            this.observer.observe(element);
        }
        else {
            this.pending.push(element);
        }
    };
    IntersectionContextImpl.prototype.register = function (callback) {
        this.callbacks.push(callback);
    };
    IntersectionContextImpl.prototype.unobserve = function (element) {
        var elementIndex = this.pending.indexOf(element);
        if (elementIndex >= 0) {
            this.pending.splice(elementIndex, 1);
        }
        if (this.observer) {
            this.observer.unobserve(element);
        }
    };
    IntersectionContextImpl.prototype.unregister = function (callback) {
        var callbackIndex = this.callbacks.indexOf(callback);
        if (callbackIndex >= 0) {
            this.callbacks.splice(callbackIndex, 1);
        }
    };
    return IntersectionContextImpl;
}());
export var IntersectionContext = React.createContext(new IntersectionContextImpl());
/**
 * The Intersection is used to observe the changes of visibility in the children
 * of the rootElement. It also will notify the caller when the rootElement is
 * scrolled. It will pass an empty array of entries in the scorlling case.
 */
var Intersection = /** @class */ (function (_super) {
    __extends(Intersection, _super);
    function Intersection() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mergedRef = createMergedRef();
        _this.rootElement = React.createRef();
        _this.state = new IntersectionContextImpl();
        _this.onScroll = function (event) {
            _this.state.onIntersect([]);
        };
        return _this;
    }
    // Render the provider around a SINGLE child. This is the element that is scrollable.
    Intersection.prototype.render = function () {
        var _this = this;
        var child = React.Children.only(this.props.children);
        var onScroll;
        if (child.props.onScroll) {
            onScroll = function (event) {
                if (child.props.onScroll) {
                    child.props.onScroll(event);
                }
                _this.onScroll(event);
            };
        }
        else {
            onScroll = this.onScroll;
        }
        return (React.createElement(IntersectionContext.Provider, { value: this.state }, React.cloneElement(child, __assign(__assign({}, child.props), { ref: this.mergedRef(this.rootElement, child.ref), onScroll: onScroll }), child.props.children)));
    };
    Intersection.prototype.componentDidMount = function () {
        var _a = this.props, observationElement = _a.observationElement, rootElement = _a.rootElement;
        var connectElement = null;
        if (rootElement) {
            if (typeof rootElement === "string") {
                connectElement = document.querySelector(rootElement);
            }
            else if (typeof rootElement === "function") {
                connectElement = rootElement();
            }
            else {
                connectElement = rootElement;
            }
            if (connectElement) {
                connectElement.addEventListener("scroll", this.onScroll);
                this.externalElement = connectElement;
            }
        }
        else if (this.rootElement) {
            connectElement = this.rootElement.current;
        }
        if (connectElement) {
            this.state.connect(connectElement, this.props.rootMargin, this.props.threshold);
            // Allow the creator of the intersection to observe intersection events.
            if (this.props.onIntersect) {
                this.state.register(this.props.onIntersect);
            }
            if (observationElement) {
                var observeElement = void 0;
                if (typeof observationElement === "string") {
                    observeElement = document.querySelector(observationElement);
                }
                else if (typeof observationElement === "function") {
                    observeElement = observationElement();
                }
                else {
                    observeElement = observationElement;
                }
                if (observeElement) {
                    this.state.observe(observeElement);
                }
            }
        }
    };
    Intersection.prototype.componentWillUnmount = function () {
        if (this.externalElement) {
            this.externalElement.removeEventListener("scroll", this.onScroll);
        }
        this.state.disconnect();
    };
    return Intersection;
}(React.Component));
export { Intersection };
