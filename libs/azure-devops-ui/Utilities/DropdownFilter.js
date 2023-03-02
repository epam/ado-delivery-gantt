import { arrayEquals } from '../Util';
export function updateFilterToSelection(values, items, filter, filterItemKey) {
    var selectedValues = [];
    for (var rangeIndex = 0; rangeIndex < values.length; rangeIndex++) {
        for (var i = values[rangeIndex].beginIndex; i <= values[rangeIndex].endIndex; i++) {
            selectedValues.push(items[i].data !== undefined ? items[i].data : items[i].id);
        }
    }
    var currentState = filter.getFilterItemState(filterItemKey);
    var changesToSet = false;
    if (currentState) {
        changesToSet = !arrayEquals(currentState.value, selectedValues) && (selectedValues.length || currentState.value);
    }
    else {
        changesToSet = !!selectedValues.length;
    }
    if (changesToSet) {
        if (filterItemKey === "keyword") {
            filter.setFilterItemState(filterItemKey, { value: selectedValues[0] });
        }
        else {
            filter.setFilterItemState(filterItemKey, { value: selectedValues, operator: currentState === null || currentState === void 0 ? void 0 : currentState.operator });
        }
    }
}
