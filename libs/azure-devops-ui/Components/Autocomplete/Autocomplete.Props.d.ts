/// <reference types="react" />
import { IReadonlyObservableValue } from '../../Core/Observable';
import { IColor } from '../../Utilities/Color';
import { ILabelModel } from "../Label/Label.Props";
export interface IAutocompleteProps {
    /**
     * Aria hint to describe the element
     */
    ariaDescribedBy?: string;
    /**
     * Optional css class to be emitted to the editable input element child of the Autocomplete
     */
    className?: string;
    /**
     * Custom colors to use
     * @default vss-palette
     */
    customColors?: IColor[];
    /**
     * Display the color picker or the "New Label" row?
     * @default false
     */
    disableColorPicker?: boolean;
    /**
     * Optional event to handle checking if the value is in the parent group
     */
    onCheckForDuplicateInParent?: (currentInput: string) => boolean;
    /**
     * Optional: Text to be shown if the value is in the parent group
     */
    onDuplicateInParentText?: string;
    /**
     * Optional event to handle onFocus
     */
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
    /**
     * Optional event to handle changes to the input value
     */
    onInputValueChange?: (newValue: string) => void;
    /**
     * Optional event to handle keyDown events within the editable input child of the Autocomplete
     */
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
    /**
     * Optional event to handle submission of the Autocomplete
     */
    onSubmit?: (labelModel: ILabelModel) => void;
    /**
     * Optional placeholder text
     */
    placeholder?: string;
    /**
     * Suggestion provider that the Autocomplete will use to generate suggestions
     */
    suggestionProvider: (content: string) => PromiseLike<ILabelModel[]>;
    /**
     * Optional observable to allow components to be notified of changes to values
     */
    value?: string | IReadonlyObservableValue<string>;
}
