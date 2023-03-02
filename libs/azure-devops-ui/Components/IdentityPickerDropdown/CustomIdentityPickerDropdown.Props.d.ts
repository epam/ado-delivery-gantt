import { IReadonlyObservableValue } from '../../Core/Observable';
import { ISharedIdentityPickerProps } from "./SharedIdentityPicker.Props";
export interface ICustomIdentityPickerDropdownProps extends ISharedIdentityPickerProps {
    /**
     * boolean if the suggestions list is opened or not. This prop is 100% controlled
     * by the consumer. onSuggestionsVisibleChanged must also be implemented in order to
     * work properly. If this value is a an boolean, the prop must be
     * updated to cause the IdentityPicker to re-render. If this value is an
     * ObservableValue, then changing its value will cause the IdentityPicker
     * to re-render.
     */
    suggestionsVisible: IReadonlyObservableValue<boolean> | boolean;
    /**
     * Called when the value of the input/textarea changes. This can happen when a user types or a new identity is selected.
     * The consumer is responsible to update the textValue property accordingly.
     */
    onInputChange: (value: string) => void;
    /**
     * Called when the control is attempting to show or hide the suggestions list.
     * The consumer is responsible to update the suggestionsVisible
     */
    onSuggestionsVisibleChanged: (shouldDisplay: boolean) => void;
    /**
     * Identity value of the selected persona This prop is 100% controlled
     * by the consumer. onChange must also be implemented in order to
     * work properly. If this value is a an identity, the prop must be
     * updated to cause the IdentityPicker to re-render. If this value is an
     * ObservableValue, then changing its value will cause the IdentityPicker
     * to re-render. The textValue may also need to be updated when you change
     * this to show the selected users display name
     */
    textValue: IReadonlyObservableValue<string> | string;
}
