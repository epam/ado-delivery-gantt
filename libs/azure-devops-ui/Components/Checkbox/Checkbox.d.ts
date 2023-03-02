import "../../CommonImports";
import "../../Core/core.css";
import "./Checkbox.css";
import * as React from "react";
import { IFocusable } from '../../Utilities/Focus';
import { ICheckboxProps, ITriStateCheckboxProps } from "./Checkbox.Props";
export declare class TriStateCheckbox<T extends ITriStateCheckboxProps> extends React.Component<T> implements IFocusable<{}> {
    static contextType: React.Context<import("../FocusGroup/FocusGroup.Props").IFocusGroupContext>;
    private checkboxElement;
    private labelId;
    private animationClassName;
    constructor(props: Readonly<T>);
    render(): JSX.Element;
    componentDidMount(): void;
    focus(): void;
    private onClick;
    private onFocus;
    private onKeyDown;
    private onChange;
}
export declare class Checkbox extends TriStateCheckbox<ICheckboxProps> {
    static defaultProps: ICheckboxProps;
}
