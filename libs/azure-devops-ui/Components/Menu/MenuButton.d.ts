import "../../CommonImports";
import "../../Core/core.css";
import "./Menu.css";
import "./MenuButton.css";
import * as React from "react";
import { IExpandable } from '../../Expandable';
import { IFocusable } from '../../Utilities/Focus';
import { IMenuButtonProps } from "./MenuButton.Props";
export interface IMenuButtonState {
    id: string;
}
export declare class MenuButton extends React.Component<IMenuButtonProps, IMenuButtonState> implements IFocusable<{}>, IExpandable {
    private dropdownButton;
    constructor(props: Readonly<IMenuButtonProps>);
    expand: () => void;
    collapse: () => void;
    render(): JSX.Element;
    focus(): void;
    private renderMenu;
}
