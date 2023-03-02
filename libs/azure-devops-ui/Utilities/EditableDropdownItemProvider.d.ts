import { IObservable, IObservableArrayEventArgs, IReadonlyObservableArray, ObservableArrayAction } from '../Core/Observable';
import { IListSelection } from '../List';
import { IListBoxItem } from '../ListBox';
import { IItemProvider } from './Provider';
export declare class EditableDropdownItemProvider<T = {}> implements IItemProvider<IListBoxItem<T>>, IObservable<IObservableArrayEventArgs<IListBoxItem<T>>, ObservableArrayAction> {
    private itemCollection;
    private listItems;
    private extraItem;
    private selection;
    /**
     * Create a Provider that manages focus on rows with a focused class.
     * @param listItems the current set of filtered items.
     * @param selection The selection object associstaed with items.
     */
    constructor(listItems: IReadonlyObservableArray<IListBoxItem<T>> | IListBoxItem<T>[] | string[], selection: IListSelection);
    /**
     * Get the length of the listItems array.
     */
    get length(): number;
    /**
     * Get the interal array of listItems.
     */
    get value(): IListBoxItem<T>[];
    /**
     * Return whether or not there is currently an extra item added for a freeform EditableDropdown.
     */
    get hasExtraItem(): boolean;
    /**
     * Subscribe to changes in the underlying set of items.
     * @param observer the delegate to be called when there are updates.
     * @param action the action on the set to observe.
     */
    subscribe(observer: (value: IObservableArrayEventArgs<IListBoxItem<T>>, action?: ObservableArrayAction) => void, action?: ObservableArrayAction): (value: IObservableArrayEventArgs<IListBoxItem<T>>, action?: ObservableArrayAction) => void;
    /**
     * Unsubscribe from changes in the underlying set of items.
     * @param observer the delegate that was used to subscribe.
     * @param action the action that was used to subsribe.
     */
    unsubscribe(observer: (value: IObservableArrayEventArgs<IListBoxItem<T>>, action?: ObservableArrayAction) => void, action?: ObservableArrayAction): void;
    /**
     * Set the text value currently typed in the EditableDropdown to see if an extra item needs to be added
     * to represent that value.  Only call this if allowFreeform is true.
     * @param value
     */
    setTextValue(value: string): void;
}
export declare const editableDropdownExtraItemClassName = "editable-dropdown-extra-item";
