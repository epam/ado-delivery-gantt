import { __extends } from "tslib";
import { ListSelection } from '../List';
var DropdownSelection = /** @class */ (function (_super) {
    __extends(DropdownSelection, _super);
    function DropdownSelection() {
        return _super.call(this, { selectOnFocus: false }) || this;
    }
    return DropdownSelection;
}(ListSelection));
export { DropdownSelection };
var DropdownMultiSelection = /** @class */ (function (_super) {
    __extends(DropdownMultiSelection, _super);
    function DropdownMultiSelection() {
        return _super.call(this, { alwaysMerge: true, multiSelect: true, selectOnFocus: false }) || this;
    }
    return DropdownMultiSelection;
}(ListSelection));
export { DropdownMultiSelection };
