import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import { IEditableLabelGroupProps } from "./LabelGroup.Props";
interface IEditableLabelGroupState {
    isInEditMode: boolean;
}
export declare class EditableLabelGroup extends React.Component<IEditableLabelGroupProps, IEditableLabelGroupState> {
    private static editableGroupCount;
    private autocompleteRef;
    private autocompleteValue;
    private focusOutTimeoutId;
    private groupId;
    private isMouseDownEventHandled;
    private labelGroupRef;
    private renderTitleIconFlag;
    private selectedLabelContents;
    constructor(props: IEditableLabelGroupProps);
    render(): JSX.Element;
    componentWillUnmount(): void;
    focus(): void;
    private filterLabelModelAgainstContents;
    private onAddButtonClicked;
    private onAutocompleteFocus;
    private onAutocompleteValueChange;
    private onBlur;
    private onCheckForDuplicates;
    private onFocus;
    private onGetSuggestions;
    private onInnerMouseDOwn;
    private onInputKeyDown;
    private onInputSubmit;
    private onLabelKeyDown;
    private onLabelMouseDown;
    private onOuterMouseDown;
    private onWrapperKeyDown;
    private removeLabel;
}
export {};
