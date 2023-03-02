import { ISharedIdentityPickerProps } from "./SharedIdentityPicker.Props";
export interface IIdentityPickerDropdownProps extends ISharedIdentityPickerProps {
    /**
     * Called when the control is attempting to show or hide the suggestions list.
     */
    onSuggestionsVisibleChanged?: (suggestsionsVisible: boolean) => void;
}
