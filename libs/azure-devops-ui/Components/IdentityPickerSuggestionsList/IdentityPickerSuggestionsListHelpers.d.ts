/// <reference types="react" />
import "../../CommonImports";
import "../../Core/core.css";
import "./IdentityPickerSuggestionsList.css";
import { IIdentity } from "../IdentityPickerDropdown/SharedIdentityPicker.Props";
import { IIdentitySuggestionItemProps } from "./IdentityPickerSuggestionsList.Props";
export declare const renderNoIdentitiesFound: () => JSX.Element;
/**
 * Called when the user removes a previously selected person
 */
export declare const renderSuggestionItem: (suggestion: IIdentitySuggestionItemProps, onOpenPersonaCard?: (identity: IIdentity) => void, renderCustomIdentitySuggestion?: (identity: IIdentity) => JSX.Element) => JSX.Element;
