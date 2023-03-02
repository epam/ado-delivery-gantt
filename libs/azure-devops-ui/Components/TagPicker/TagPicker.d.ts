import "../../CommonImports";
import "../../Core/core.css";
import "./TagPicker.css";
import * as React from "react";
import { IFocusable } from '../../Utilities/Focus';
import { ITagPickerProps } from "./TagPicker.Props";
interface ITagPickerState {
    width: number;
}
export declare class TagPicker<T> extends React.Component<ITagPickerProps<T>, ITagPickerState> implements IFocusable<{}> {
    static defaultProps: {
        onSearchChangedDebounceWait: number;
    };
    private inputElement;
    private outerElement;
    private textValue;
    private suggestionsVisible;
    private selectedIndex;
    private selectableTags;
    private timerManagement;
    private updateIndexTimer;
    constructor(props: ITagPickerProps<T>);
    render(): JSX.Element;
    componentDidMount(): void;
    clearTagPicker: () => void;
    suggestionsLoaded: () => boolean;
    focus(): void;
    private createGenericItem;
    private onBlur;
    private onFocus;
    private onOuterKeyDown;
    private onKeyDown;
    private onInputClick;
    private onInputChange;
    private onResolveInput;
    private onTagClicked;
    private onTagRemoved;
    private onTagPickerSizeChanged;
    private completeSuggestion;
    private onSuggestionClick;
    private addItem;
    private focusInput;
    private onSuggestionsDismiss;
    private indexOfTag;
}
export {};
