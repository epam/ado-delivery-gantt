import "../../CommonImports";
import "../../Core/core.css";
import "./Button.css";
import "./ExpandableButton.css";
import * as React from "react";
import { IExpandable } from '../../Expandable';
import { IFocusable } from '../../Utilities/Focus';
import { IExpandableButtonProps } from "./ExpandableButton.Props";
export declare class ExpandableButton extends React.Component<IExpandableButtonProps> implements IExpandable, IFocusable<{}> {
    static defaultProps: Readonly<Partial<IExpandableButtonProps>>;
    private buttonElement;
    private containerElement;
    private dropdownId;
    private expandable;
    constructor(props: Readonly<IExpandableButtonProps>);
    render(): JSX.Element;
    collapse: () => void;
    expand: () => void;
    focus(): void;
    private renderCallout;
}
