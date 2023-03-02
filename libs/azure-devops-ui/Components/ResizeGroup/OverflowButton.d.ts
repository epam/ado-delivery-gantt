import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import { IButtonProps } from "../Button/Button.Props";
import { IFocusable } from '../../Utilities/Focus';
export declare class OverflowButton extends React.Component<IButtonProps> implements IFocusable<{}> {
    private moreButton;
    render(): JSX.Element;
    focus(): void;
}
