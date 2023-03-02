import "../../CommonImports";
import "../../Core/core.css";
import "./Autocomplete.css";
import * as React from "react";
import { ISuggestionsProps } from "./Suggestions.Props";
interface ISuggestionState {
    isNewRowHovered?: boolean;
}
export declare class Suggestions extends React.Component<ISuggestionsProps, ISuggestionState> {
    private currentSelectedElementRef;
    private previousSelectedElement;
    constructor(props: ISuggestionsProps);
    render(): JSX.Element;
    componentDidUpdate(): void;
    private isNewRowSelected;
    private onHoverNewRowEnd;
    private onHoverNewRowStart;
    private onRenderAlreadyIncludedRow;
    private onRenderLoadingRow;
    private onRenderNewLabelRow;
    private onRenderSuggestionRow;
    private shouldDisplayColorPicker;
}
export {};
