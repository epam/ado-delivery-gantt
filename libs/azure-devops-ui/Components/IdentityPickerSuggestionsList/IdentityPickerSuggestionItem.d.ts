import "../../CommonImports";
import "../../Core/core.css";
import "./IdentityPickerSuggestionsList.css";
import * as React from "react";
import { IFocusable } from '../../Utilities/Focus';
import { IIdentitySuggestionItemProps } from "./IdentityPickerSuggestionsList.Props";
export declare class IdentityPickerSuggestionItem extends React.Component<IIdentitySuggestionItemProps> implements IFocusable<{}> {
    private contactCardButtonRef;
    render(): JSX.Element;
    focus(): void;
}
