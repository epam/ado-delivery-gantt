import "../../CommonImports";
import "../../Core/core.css";
import "./SuggestionsList.css";
import * as React from "react";
import { ISuggestionItemProps, ISuggestionsListProps } from "./SuggestionsList.Props";
export declare class SuggestionsItem<T> extends React.Component<ISuggestionItemProps<T>> {
    render(): JSX.Element;
    private onSuggestionClicked;
}
export declare class SuggestionsList<T> extends React.Component<ISuggestionsListProps<T>> {
    protected scrollableRegion: React.RefObject<HTMLDivElement>;
    protected selectedElement: React.RefObject<HTMLDivElement>;
    private currentSelectedElement;
    render(): JSX.Element;
    componentDidMount(): void;
    componentDidUpdate(): void;
    private noResults;
    private renderSuggestions;
    private onBlur;
    private onFocus;
    private scrollSelected;
}
