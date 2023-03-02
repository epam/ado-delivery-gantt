import { ObservableArray, ObservableCollection, ObservableLike } from '../Core/Observable';
import { format } from '../Core/Util/String';
import { wrapListBoxItems } from '../ListBox';
import * as Resources from '../Resources.Dropdown';
var EditableDropdownItemProvider = /** @class */ (function () {
    /**
     * Create a Provider that manages focus on rows with a focused class.
     * @param listItems the current set of filtered items.
     * @param selection The selection object associstaed with items.
     */
    function EditableDropdownItemProvider(listItems, selection) {
        this.itemCollection = new ObservableCollection();
        if (ObservableLike.isObservable(listItems)) {
            this.listItems = listItems;
        }
        else {
            this.listItems = new ObservableArray(wrapListBoxItems(listItems) || listItems);
        }
        this.itemCollection.push(this.listItems);
        this.extraItem = new ObservableArray();
        this.itemCollection.push(this.extraItem);
        this.selection = selection;
    }
    Object.defineProperty(EditableDropdownItemProvider.prototype, "length", {
        /**
         * Get the length of the listItems array.
         */
        get: function () {
            return this.itemCollection.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EditableDropdownItemProvider.prototype, "value", {
        /**
         * Get the interal array of listItems.
         */
        get: function () {
            return this.itemCollection.value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(EditableDropdownItemProvider.prototype, "hasExtraItem", {
        /**
         * Return whether or not there is currently an extra item added for a freeform EditableDropdown.
         */
        get: function () {
            return this.extraItem.length > 0;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Subscribe to changes in the underlying set of items.
     * @param observer the delegate to be called when there are updates.
     * @param action the action on the set to observe.
     */
    EditableDropdownItemProvider.prototype.subscribe = function (observer, action) {
        return this.itemCollection.subscribe(observer, action);
    };
    /**
     * Unsubscribe from changes in the underlying set of items.
     * @param observer the delegate that was used to subscribe.
     * @param action the action that was used to subsribe.
     */
    EditableDropdownItemProvider.prototype.unsubscribe = function (observer, action) {
        return this.itemCollection.unsubscribe(observer, action);
    };
    /**
     * Set the text value currently typed in the EditableDropdown to see if an extra item needs to be added
     * to represent that value.  Only call this if allowFreeform is true.
     * @param value
     */
    EditableDropdownItemProvider.prototype.setTextValue = function (value) {
        if (this.hasExtraItem) {
            this.extraItem.splice(0, 1);
        }
        if (value) {
            var index = this.listItems.value.findIndex(function (item) { return item.text === value; });
            if (index === -1 || !this.selection.selectable(index)) {
                this.extraItem.push({ id: value, text: format(Resources.UseItem, value), className: editableDropdownExtraItemClassName });
            }
        }
    };
    return EditableDropdownItemProvider;
}());
export { EditableDropdownItemProvider };
export var editableDropdownExtraItemClassName = "editable-dropdown-extra-item";
