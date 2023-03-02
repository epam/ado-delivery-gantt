import "../../CommonImports";
import "../../Core/core.css";
import "./EditableDropdown.css";
import * as React from "react";
import { IExpandable } from '../../Expandable';
import { IFocusable } from '../../Utilities/Focus';
import { IEditableDropdownProps } from "./EditableDropdown.Props";
export declare class EditableDropdown<T = {}> extends React.Component<IEditableDropdownProps<T>> implements IExpandable, IFocusable<{}> {
    private text;
    private selectedText;
    private dropdown;
    constructor(props: IEditableDropdownProps<T>);
    collapse: () => void;
    expand: () => void;
    focus(): void;
    render(): JSX.Element;
    private onExpand;
    private onTextChange;
    private onValueChange;
}
