import "../../CommonImports";
import "../../Core/core.css";
import "./Label.css";
import * as React from "react";
import { ILabelProps } from "./Label.Props";
import { IColor } from '../../Utilities/Color';
interface ILabelState {
    isHovered: boolean;
}
export declare class Label extends React.Component<ILabelProps, ILabelState> {
    static readonly DEFAULT_COLOR: IColor;
    static contextType: React.Context<import("../FocusGroup/FocusGroup.Props").IFocusGroupContext>;
    private rootRef;
    constructor(props: ILabelProps);
    render(): JSX.Element;
    focus(): void;
    private getStyle;
    private isDark;
    private onBlur;
    private onFocus;
    private onHoverStart;
    private onHoverEnd;
}
export {};
