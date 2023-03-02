import "../../CommonImports";
import "../../Core/core.css";
import "./Menu.css";
import "./MenuButton.css";
import * as React from "react";
import { IExpandable } from '../../Expandable';
import { IFocusable } from '../../Utilities/Focus';
import { IMenuButtonProps } from "./MenuButton.Props";
export declare class MoreButton extends React.Component<IMenuButtonProps> implements IFocusable<{}>, IExpandable {
    private menuButton;
    render(): JSX.Element;
    expand: () => void;
    collapse: () => void;
    focus(): void;
}
