import { __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import { TimerManagement } from '../../Core/TimerManagement';
import { FILTER_CHANGE_EVENT } from '../../Utilities/Filter';
var FilterBarItem = /** @class */ (function (_super) {
    __extends(FilterBarItem, _super);
    function FilterBarItem(props) {
        var _this = _super.call(this, props) || this;
        _this._onFilterChanged = function (changedState) {
            if (changedState.hasOwnProperty(_this.props.filterItemKey)) {
                _this.onFilterChanged(changedState[_this.props.filterItemKey]);
            }
        };
        _this._setFilterValue = function (filterState) {
            if (_this.props.filter) {
                _this.props.filter.setFilterItemState(_this.props.filterItemKey, filterState);
            }
        };
        _this.timerManagement = new TimerManagement();
        return _this;
    }
    FilterBarItem.prototype.UNSAFE_componentWillMount = function () {
        if (this.props.filter) {
            var itemState = this.props.filter.getFilterItemState(this.props.filterItemKey);
            this.setState({ value: itemState && itemState.value, operator: itemState && itemState.operator });
            var throttleWait = this.getThrottleWait();
            if (throttleWait) {
                this.throttledSetFilterValue = this.timerManagement.debounce(this._setFilterValue, throttleWait, { leading: false, trailing: true });
            }
            else {
                this.throttledSetFilterValue = this._setFilterValue;
            }
        }
    };
    /**
     * Setting state when component state is different from filter item state
     * Needed for handling scenarios when filter object's setState method is called with suppressChangeEvent=true
     * In such cases, FILTER_CHANGE_EVENT is not triggered and thus component state is not updated
     * And then on re-rendering component renders with old state.
     * @param nextProps
     */
    FilterBarItem.prototype.UNSAFE_componentWillReceiveProps = function (nextProps) {
        if (nextProps.filter) {
            var itemState = nextProps.filter.getFilterItemState(nextProps.filterItemKey);
            // If we are throttling the changes from the filter item's state, there is a chance that the props are out of sync with the state.
            // Therefore, we only want to react to new changes in props if we are not throttling or if the setKey for the component has changed
            // (indicating we want to completely reset state, reacting to the props)
            if (this.props.setKey !== nextProps.setKey ||
                (this.getThrottleWait() === 0 &&
                    !nextProps.filter.filterItemStatesAreEqual(nextProps.filterItemKey, itemState, this.state))) {
                this.setState({ value: itemState && itemState.value, operator: itemState && itemState.operator });
            }
        }
    };
    FilterBarItem.prototype.componentDidMount = function () {
        this.props.filter && this.props.filter.subscribe(this._onFilterChanged, FILTER_CHANGE_EVENT);
    };
    FilterBarItem.prototype.componentWillUnmount = function () {
        this.props.filter && this.props.filter.unsubscribe(this._onFilterChanged, FILTER_CHANGE_EVENT);
        this.timerManagement.dispose();
    };
    FilterBarItem.prototype.onFilterChanged = function (filterState) {
        this.setState({
            value: filterState && filterState.value,
            operator: filterState && filterState.operator
        });
    };
    FilterBarItem.prototype.getThrottleWait = function () {
        return 0;
    };
    FilterBarItem.prototype.setFilterValue = function (filterState) {
        if (this.getThrottleWait()) {
            this.setState({
                value: filterState && filterState.value,
                operator: filterState && filterState.operator
            });
        }
        this.throttledSetFilterValue(filterState);
    };
    return FilterBarItem;
}(React.Component));
export { FilterBarItem };
