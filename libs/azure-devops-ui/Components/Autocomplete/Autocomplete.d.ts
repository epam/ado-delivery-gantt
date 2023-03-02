import "../../CommonImports";
import "../../Core/core.css";
import "./Autocomplete.css";
import * as React from "react";
import { IAutocompleteProps } from "./Autocomplete.Props";
import { ILabelModel } from "../Label/Label.Props";
interface IAutocompleteState {
    currentSuggestionIndex: number;
    currentSuggestions: ILabelModel[];
    displayCallout: boolean;
    displayPlaceholderText: boolean;
    displayTypeAhead: boolean;
    isLoading: boolean;
}
export declare class Autocomplete extends React.Component<IAutocompleteProps, IAutocompleteState> {
    private static readonly DEFAULT_COLORS;
    private currentSelectedColorIndex;
    private loadingDelayTimeoutId;
    private inputRef;
    constructor(props: IAutocompleteProps);
    render(): JSX.Element;
    componentDidMount(): void;
    componentWillUnmount(): void;
    UNSAFE_componentWillReceiveProps(nextProps: IAutocompleteProps): void;
    focus(): void;
    private getTypeAheadValue;
    private isNewRowSelected;
    private onBlur;
    private onCheckForExactSuggestionMatches;
    private onFocus;
    private onInputChange;
    private onKeyDown;
    private onPipClick;
    private onNewLabelClick;
    private onSuggestionClick;
    private onValueChange;
    private submit;
}
export {};
