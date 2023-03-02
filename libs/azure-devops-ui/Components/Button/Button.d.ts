import "../../CommonImports";
import "../../Core/core.css";
import "./Button.css";
import "./ExpandableButton.css";
import * as React from "react";
import { IFocusable } from '../../Utilities/Focus';
import { IButtonProps } from "./Button.Props";
export declare class Button extends React.Component<IButtonProps> implements IFocusable<{}> {
    static contextType: React.Context<import("../FocusGroup/FocusGroup.Props").IFocusGroupContext>;
    private buttonElement;
    render(): JSX.Element;
    focus(): void;
    private onClick;
    private onFocus;
    private onKeyDown;
    private onMouseDown;
    private onMouseLeave;
    private onMouseOver;
}
