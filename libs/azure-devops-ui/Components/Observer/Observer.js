import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import { ObservableLike } from '../../Core/Observable';
/**
 * Handles subscription to properties that are IObservableValues, so that components don't have to handle on their own.
 *
 * Usage:
 *
 * <Observer myObservableValue={observableValue}>
 *     <MyComponent myObservableValue='' />
 * </Observer>
 *
 * Your component will get re-rendered with the new value of myObservableValue whenever that value changes.
 * Additionally, any additional props set on the Observer will also get passed down.
 */
var ObserverBase = /** @class */ (function (_super) {
    __extends(ObserverBase, _super);
    function ObserverBase(props) {
        var _this = _super.call(this, props) || this;
        _this.subscriptions = {};
        // Initialize the state with the initial value of the observable.
        var state = { values: {}, oldProps: {} };
        for (var propName in props) {
            state.values[propName] = getPropValue(props[propName]);
        }
        _this.state = state;
        return _this;
    }
    ObserverBase.getDerivedStateFromProps = function (props, state) {
        var newState = updateSubscriptionsAndState(state.oldProps, props, state);
        if (newState != null) {
            return __assign(__assign({}, newState), { oldProps: props });
        }
        return { oldProps: props };
    };
    ObserverBase.prototype.render = function () {
        var newProps = {};
        // Copy over any properties from the observable component to the children.
        for (var key in this.state.values) {
            if (key !== "children") {
                newProps[key] = this.state.values[key];
            }
        }
        if (typeof this.props.children === "function") {
            var child = this.props.children;
            return child(newProps);
        }
        else {
            var child = React.Children.only(this.props.children);
            return React.cloneElement(child, __assign(__assign({}, child.props), newProps), child.props.children);
        }
    };
    ObserverBase.prototype.componentDidMount = function () {
        this.updateSubscriptionsAndStateAfterRender();
    };
    ObserverBase.prototype.componentDidUpdate = function () {
        this.updateSubscriptionsAndStateAfterRender();
        if (this.props.onUpdate) {
            this.props.onUpdate();
        }
    };
    ObserverBase.prototype.componentWillUnmount = function () {
        // Unsubscribe from any of the observable properties.
        for (var propName in this.subscribedProps) {
            this.unsubscribe(propName, this.subscribedProps);
        }
    };
    ObserverBase.prototype.subscribe = function (propName, props) {
        if (propName !== "children") {
            var observableExpression = void 0;
            var observableValue = props[propName];
            var action = void 0;
            // If this is an observableExpression, we need to subscribe to the value
            // and execute the filter on changes.
            if (observableValue && observableValue.observableValue !== undefined) {
                observableExpression = observableValue;
                observableValue = observableExpression.observableValue;
                action = observableExpression.action;
            }
            if (ObservableLike.isObservable(observableValue)) {
                var delegate = this.onValueChanged.bind(this, propName, observableValue, observableExpression);
                ObservableLike.subscribe(observableValue, delegate, action);
                this.subscriptions[propName] = { delegate: delegate, action: action };
            }
        }
    };
    ObserverBase.prototype.unsubscribe = function (propName, props) {
        if (propName !== "children") {
            var observableValue = getObservableValue(props[propName]);
            if (ObservableLike.isObservable(observableValue)) {
                var subscription = this.subscriptions[propName];
                ObservableLike.unsubscribe(observableValue, subscription.delegate, subscription.action);
                delete this.subscriptions[propName];
            }
        }
    };
    ObserverBase.prototype.updateSubscriptionsAndStateAfterRender = function () {
        var newState = updateSubscriptionsAndState(this.subscribedProps, this.props, this.state, this);
        if (newState != null) {
            this.setState(newState);
        }
        this.subscribedProps = __assign({}, this.props);
    };
    ObserverBase.prototype.onValueChanged = function (propName, observableValue, observableExpression, value, action) {
        var setState = true;
        if (!(propName in this.subscriptions)) {
            return;
        }
        // If this is an ObservableExpression we will call the filter before setting state.
        if (observableExpression && observableExpression.filter) {
            setState = observableExpression.filter(value, action);
        }
        if (setState) {
            this.setState(function (prevState, props) {
                var _a;
                return {
                    values: __assign(__assign({}, prevState.values), (_a = {}, _a[propName] = observableValue.value || value, _a))
                };
            });
        }
    };
    return ObserverBase;
}(React.Component));
function getObservableValue(propValue) {
    if (propValue && propValue.observableValue !== undefined) {
        return propValue.observableValue;
    }
    return propValue;
}
function getPropValue(propValue) {
    return ObservableLike.getValue(getObservableValue(propValue));
}
function updateSubscriptionsAndState(oldProps, newProps, state, component) {
    // We need to unsubscribe from any observable values on old props and
    // subscribe to any observable values on new props.
    // In addition, if any of the values of the observables on the new props
    // differ from the value on the state, then we need to update the state.
    // This is possible if the value of the observable changed while the value
    // was being rendered, but before we had set up the subscription.
    // If we want to unsubscribe/resubscribe, then a component should be passed,
    // since this method is always called statically.
    var newState = __assign({}, state);
    var stateChanged = false;
    if (oldProps) {
        for (var propName in oldProps) {
            var oldValue = getObservableValue(oldProps[propName]);
            var newValue = getObservableValue(newProps[propName]);
            if (oldValue !== newValue) {
                component && component.unsubscribe(propName, oldProps);
                if (newValue === undefined) {
                    delete newState.values[propName];
                    stateChanged = true;
                }
            }
        }
    }
    for (var propName in newProps) {
        var oldValue = oldProps && getObservableValue(oldProps[propName]);
        var newValue = getObservableValue(newProps[propName]);
        if (oldValue !== newValue) {
            component && component.subscribe(propName, newProps);
            // Look for changes in the observables between creation and now.
            if (state.values[propName] !== getPropValue(newValue)) {
                newState.values[propName] = getPropValue(newValue);
                stateChanged = true;
            }
        }
    }
    // If any state updates occurred update the state now.
    if (stateChanged) {
        return newState;
    }
    return null;
}
/**
 * Handles subscription to properties that are IObservableValues, so that components don't have to handle on their own.
 *
 * Usage:
 *
 * <Observer myObservableValue={observableValue}>
 *     {(props: {myObservableValue: string}) =>
 *         <MyComponent myObservableValue={props.myObservableValue} />
 *     }
 * </Observer>
 *
 * Your component will get re-rendered with the new value of myObservableValue whenever that value changes.
 */
var Observer = /** @class */ (function (_super) {
    __extends(Observer, _super);
    function Observer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Observer;
}(ObserverBase));
export { Observer };
/**
 * UncheckedObserver is like Observer, except that it performs less (no) typechecking on the child observer function,
 * and allows child React elements.
 *
 * Usage:
 *
 * <Observer myObservableValue={observableValue}>
 *     {(props: {myObservableValue: string}) =>
 *         <MyComponent myObservableValue={props.myObservableValue} />
 *     }
 * </Observer>
 *
 * -or-
 *
 * <Observer myObservableValue={observableValue}>
 *     <MyComponent myObservableValue='' />
 * </Observer>
 *
 * Your component will get re-rendered with the new value of myObservableValue whenever that value changes.
 * Additionally, any additional props set on the Observer will also get passed down.
 */
var UncheckedObserver = /** @class */ (function (_super) {
    __extends(UncheckedObserver, _super);
    function UncheckedObserver() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UncheckedObserver;
}(ObserverBase));
export { UncheckedObserver };
