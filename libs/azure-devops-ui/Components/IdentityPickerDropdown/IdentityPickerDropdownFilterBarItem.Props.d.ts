import { ObservableValue } from '../../Core/Observable';
import { IFilterBarItemProps, IFilterBarItemState } from '../../FilterBarItem';
import { IIdentityPickerProps } from "../IdentityPicker/IdentityPicker.Props";
import { IIdentity } from "./SharedIdentityPicker.Props";
import { ISharedIdentityPickerProps } from "./SharedIdentityPicker.Props";
export interface IIdentityPickerDropdownFilterBarItemState extends IFilterBarItemState<IIdentity[]> {
}
export interface IIdentityPickerDropdownFilterBarItemProps extends IFilterBarItemProps, Pick<IIdentityPickerProps, "pickerProvider">, Pick<ISharedIdentityPickerProps, "className" | "editPlaceholder" | "resolveUnrecognizedIdentity"> {
    /**
     * Text value for initial identity for filter item
     */
    initialTextValue?: string | ObservableValue<string | undefined>;
    /**
     * Initial identity for filter item
     */
    initialValue?: IIdentity | ObservableValue<IIdentity | undefined>;
}
