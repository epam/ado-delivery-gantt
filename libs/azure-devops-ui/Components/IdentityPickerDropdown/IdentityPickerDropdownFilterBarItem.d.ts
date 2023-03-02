/// <reference types="react" />
import "../../CommonImports";
import "../../Core/core.css";
import "./IdentityPickerDropdown.css";
import { FilterBarItem } from '../../FilterBarItem';
import { IFilterItemState } from '../../Utilities/Filter';
import { IIdentity } from "./SharedIdentityPicker.Props";
import { IIdentityPickerDropdownFilterBarItemProps, IIdentityPickerDropdownFilterBarItemState } from "./IdentityPickerDropdownFilterBarItem.Props";
export declare class IdentityPickerDropdownFilterBarItem extends FilterBarItem<IIdentity[], IIdentityPickerDropdownFilterBarItemProps, IIdentityPickerDropdownFilterBarItemState> {
    private selectedUser;
    private selectedUserFriendlyName;
    private areSuggestionsVisible;
    constructor(props: IIdentityPickerDropdownFilterBarItemProps);
    focus(): boolean;
    render(): JSX.Element;
    protected onFilterChanged: (filterState: IFilterItemState | null) => void;
    private onSuggestionsVisibleChanged;
    private onIdentityChanged;
    private setTextValue;
}
