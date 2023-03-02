import { __assign } from "tslib";
import * as React from "react";
import { Observable } from '../Core/Observable';
export var FilterOperatorType;
(function (FilterOperatorType) {
    /**
     * The filter's value should be treated as having the AND operator
     * e.g. If the value is ['a', 'c', 'd'] any item which does not contain
     * 'a' AND 'c' AND 'd' should not be included
     */
    FilterOperatorType["and"] = "and";
    /**
     * The filter's value should be treated as having the OR operator
     * e.g. If the value is ['a', 'c', 'd'] any item which contains
     * 'a' OR 'c' OR 'd' should be included
     */
    FilterOperatorType["or"] = "or";
})(FilterOperatorType || (FilterOperatorType = {}));
export var FILTER_CHANGE_EVENT = "filter-changed";
export var FILTER_APPLIED_EVENT = "filter-applied";
export var FILTER_RESET_EVENT = "reset-filters";
/**
 * Store for a set of filter values
 *
 * Events:
 *
 *  FILTER_CHANGE_EVENT: IFilterState
 *  Fired whenever a filter value changes. The event object contains the changed items.
 *  When using explicit apply-mode, this event is fired when the filter is changed (i.e. by user action)
 *  but not yet applied.
 *
 *  FILTER_APPLIED_EVENT: IFilterState
 *  Fired when new filter changes have been applied. The event object contains the changed items.
 *  When not using explicit apply-mode, this event is fired on every state change
 */
var Filter = /** @class */ (function () {
    /**
     * Create a new Filter store
     * @param options Options for the filter store
     */
    function Filter(options, observable) {
        if (options === void 0) { options = {}; }
        this.observable = observable || new Observable();
        this.applyMode = !!options.useApplyMode;
        this.defaultState = __assign({}, options.defaultState);
        this.currentState = __assign({}, this.defaultState);
        this.customValueComparers = __assign({}, options.customValueComparers);
        if (this.applyMode) {
            this.appliedState = __assign({}, this.currentState);
        }
        else {
            this.appliedState = this.currentState;
        }
    }
    Filter.prototype.subscribe = function (observer, action) {
        return this.observable.subscribe(observer, action);
    };
    Filter.prototype.unsubscribe = function (observer, action) {
        this.observable.unsubscribe(observer, action);
    };
    /**
     * Gets a dictionary containing the current values of all filter items
     */
    Filter.prototype.getState = function () {
        return __assign({}, this.currentState);
    };
    /**
     * Gets a dictionary containing the applied values of all filter items.
     * When useApplyMode is false, this always matches the value returned by getState.
     */
    Filter.prototype.getAppliedState = function () {
        return __assign({}, this.appliedState);
    };
    /**
     * Gets a dictionary containing the default values of all filter items
     */
    Filter.prototype.getDefaultState = function () {
        return this.defaultState;
    };
    /**
     * Update what the filter considers as its default state
     * @param defaultState The new default state
     */
    Filter.prototype.setDefaultState = function (defaultState) {
        this.defaultState = defaultState;
    };
    /**
     * Sets the current values of all filter items
     * @param state Dictionary of all current filter item values
     * @param supressChangeEvent If true, don't invoke the onFilterChanged callback at this time
     */
    Filter.prototype.setState = function (state, supressChangeEvent) {
        if (supressChangeEvent === void 0) { supressChangeEvent = false; }
        var prevState = this.currentState;
        this.currentState = __assign({}, state);
        if (!this.applyMode) {
            this.appliedState = this.currentState;
        }
        if (!supressChangeEvent) {
            var changedState = __assign({}, state);
            for (var key in prevState) {
                // Add current filters that are cleared by the new state
                // (i.e. these changed from "something" to "nothing")
                if (!state.hasOwnProperty(key)) {
                    changedState[key] = null;
                }
            }
            this._triggerStateChange(changedState);
        }
    };
    /**
     * Gets the value of the specified filter item
     * @param key Filter item key
     */
    Filter.prototype.getFilterItemState = function (key) {
        return this.currentState[key];
    };
    /**
     * Gets the applied value of the specified filter item. When applyMode is false,
     * this is equivalent to getFilterItemState.
     * @param key Filter item key
     */
    Filter.prototype.getAppliedFilterItemState = function (key) {
        return this.appliedState[key];
    };
    /**
     * Gets the value property for the filter item with the given key.
     * @param key The filter item's key
     */
    Filter.prototype.getFilterItemValue = function (key) {
        var item = this.currentState[key];
        if (item) {
            return item.value;
        }
        else {
            return undefined;
        }
    };
    /**
     * Sets the value of the specified filter item
     * @param key Filter item key
     * @param value Filter value
     */
    Filter.prototype.setFilterItemState = function (key, value) {
        this.currentState[key] = value;
        var changeEvent = {};
        changeEvent[key] = value;
        this._triggerStateChange(changeEvent);
    };
    /**
     * Resets the filter values to their default state
     * @param suppressChangeEvent If true, don't invoke the onFilterChanged callback at this time
     */
    Filter.prototype.reset = function (suppressChangeEvent) {
        if (suppressChangeEvent === void 0) { suppressChangeEvent = false; }
        this.setState(this.defaultState, suppressChangeEvent);
        if (!suppressChangeEvent) {
            this._raiseEventAndCallListeners(FILTER_RESET_EVENT, {});
        }
    };
    Filter.prototype.resetFilterItemState = function (key) {
        var value = this.defaultState[key];
        this.setFilterItemState(key, value);
    };
    Filter.prototype.applyChanges = function () {
        this.appliedState = __assign({}, this.currentState);
        this._raiseEventAndCallListeners(FILTER_APPLIED_EVENT, this.appliedState);
    };
    Filter.prototype.usesApplyMode = function () {
        return this.applyMode;
    };
    Filter.prototype.hasChangesToApply = function () {
        return !this.statesAreEqual(this.appliedState, this.currentState);
    };
    Filter.prototype.hasChangesToReset = function () {
        return !this.statesAreEqual(this.defaultState, this.currentState);
    };
    Filter.prototype.statesAreEqual = function (state1, state2) {
        return this._checkStateEquality(state1, state2) && this._checkStateEquality(state2, state1);
    };
    Filter.prototype.filterItemStatesAreEqual = function (item, state1, state2) {
        return this._checkFilterItemStateEquality(item, state1, state2);
    };
    Filter.prototype._triggerStateChange = function (changedState) {
        this._raiseEventAndCallListeners(FILTER_CHANGE_EVENT, changedState);
        if (!this.applyMode) {
            this._raiseEventAndCallListeners(FILTER_APPLIED_EVENT, changedState);
        }
    };
    Filter.prototype._raiseEventAndCallListeners = function (eventName, changedState) {
        this.observable.notify(changedState, eventName);
    };
    Filter.prototype._checkStateEquality = function (state1, state2) {
        for (var item in state1) {
            var filterItemStateEqual = this._checkFilterItemStateEquality(item, state1[item], state2[item]);
            if (!filterItemStateEqual) {
                return false;
            }
        }
        return true;
    };
    Filter.prototype._checkFilterItemStateEquality = function (item, item1State, item2State) {
        var item1Value = item1State && item1State.value;
        var item2Value = item2State && item2State.value;
        if (Array.isArray(item1Value)) {
            if (Array.isArray(item2Value)) {
                if (item1Value.length !== item2Value.length) {
                    return false;
                }
                for (var index = 0; index < item1Value.length; index++) {
                    if (!this._checkValueEquality(item, item1Value[index], item2Value[index])) {
                        return false;
                    }
                }
            }
            else {
                if (item1Value.length !== 0 || !!item2Value) {
                    return false;
                }
            }
        }
        else if (!this._checkValueEquality(item, item1Value, item2Value)) {
            return false;
        }
        else if (Array.isArray(item2Value)) {
            if (item2Value.length !== 0) {
                return false;
            }
        }
        return true;
    };
    Filter.prototype._checkValueEquality = function (key, item1, item2) {
        if (this.customValueComparers[key]) {
            return this.customValueComparers[key](item1, item2);
        }
        if (item1 && item1 !== item2) {
            return false;
        }
        else if (!!item1 !== !!item2) {
            return false;
        }
        return true;
    };
    return Filter;
}());
export { Filter };
export var FilterContext = React.createContext({
    filter: null,
    filterToggled: null
});
