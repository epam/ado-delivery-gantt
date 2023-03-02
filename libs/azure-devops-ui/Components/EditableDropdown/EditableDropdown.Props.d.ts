/// <reference types="react" />
import { IReadonlyObservableArray, IReadonlyObservableValue } from '../../Core/Observable';
import { IDropdownProps } from '../../Dropdown';
import { IListBoxItem } from '../../ListBox';
import { IFilterResults } from "../Dropdown/Dropdown.Props";
export interface IEditableDropdownProps<T = {}> extends Pick<IDropdownProps<T>, "actions" | "ariaLabel" | "ariaLabelledBy" | "autoSelect" | "calloutContentClassName" | "className" | "columns" | "disabled" | "filterByText" | "filterItem" | "filterThrottleWait" | "getUnselectableRanges" | "inputId" | "items" | "onCollapse" | "onExpand" | "onToggle" | "placeholder" | "noItemsText" | "renderCallout" | "renderExpandable" | "renderItem" | "selection" | "showTree" | "minCalloutWidth"> {
    /**
     * Set to true to disable the ability to fully clear the text box value
     *
     * @default true
     */
    allowClear?: boolean;
    /**
     * Set to true to allow selecting values that aren't in the list of items.
     */
    allowFreeform?: boolean;
    /**
     * Set to true to allow users to highlight currently selected item (selected text will be passed as text box value instead of placeholder)
     */
    allowTextSelection?: boolean;
    /**
     * When true (the default) any entered text (in freeform mode) is accepted
     * on blur or escape. If false, the user must explicitly press the enter key
     * to accept a freeform value.
     *
     * @default true
     */
    autoAccept?: boolean;
    /**
     * Custom function to filter items based on the given filter text
     *
     * @param filterText The text to filter the items by
     */
    filterItems?: (filterText: string, items: IListBoxItem<T>[]) => IFilterResults<T>;
    /**
     * Custom function which determines if a given item should be focused after filtering
     */
    filterMatchedItem?: (item: IListBoxItem<T>) => boolean;
    /**
     * Items should be supplied as an ObservableArray if they will be changing.
     */
    items: IReadonlyObservableArray<IListBoxItem<T>> | IListBoxItem<T>[] | string[];
    /**
     * Called when the value of the input changes.
     */
    onTextChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | React.SyntheticEvent<HTMLElement> | null, value?: string) => void;
    /**
     * Called when a new value is selected.  Selection happens on click, enter, or tab, or when the dropdown closes if allowFreeform is true.
     */
    onValueChange?: (value?: IListBoxItem<T>) => void;
    /**
     * The selected text is shown in the input with a placeholder-like behavior.  It will default to the text of the selected item in items.
     */
    selectedText?: IReadonlyObservableValue<string> | string;
    /**
     * The text value passed to the ExpandableTextField.
     */
    text?: IReadonlyObservableValue<string> | string;
}
