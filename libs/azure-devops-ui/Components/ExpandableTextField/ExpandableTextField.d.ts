import "../../CommonImports";
import "../../Core/core.css";
import "./ExpandableTextField.css";
import * as React from "react";
import { IExpandable } from '../../Expandable';
import { IFocusable } from '../../Utilities/Focus';
import { IExpandableTextFieldProps } from "./ExpandableTextField.Props";
export declare class ExpandableTextField extends React.Component<IExpandableTextFieldProps> implements IExpandable, IFocusable<{}> {
    static defaultProps: Readonly<Partial<IExpandableTextFieldProps>>;
    private textFieldElement;
    private containerElement;
    private dropdownId;
    private expandable;
    constructor(props: Readonly<IExpandableTextFieldProps>);
    render(): JSX.Element;
    collapse: () => void;
    expand: () => void;
    focus(): void;
    select(): void;
    private renderCallout;
}
