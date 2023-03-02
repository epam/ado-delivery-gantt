import "../../CommonImports";
import "../../Core/core.css";
import "./Menu.css";
import "./MenuButton.css";
import * as React from "react";
import { ObservableValue } from '../../Core/Observable';
import { IContextualMenuProps, IMenu, IMenuGroup, IMenuItem, IMenuItemProps, IMenuProps } from "./Menu.Props";
export interface IMenuState {
    expandedIndex: ObservableValue<number>;
}
/**
 * Arrange the items into groups and put separators between them and headings above them as needed.
 *
 * @param items Menu items with optional order and groupKey properties
 * @param groupInfo Optional list of menu groups
 */
export declare function groupMenuItems(items: IMenuItem[], groupInfo?: IMenuGroup[]): IMenuItem[];
export declare class Menu extends React.Component<IMenuProps, IMenuState> implements IMenu {
    private containerElement;
    private itemProvider;
    constructor(props: Readonly<IMenuProps>);
    render(): JSX.Element;
    expandItem: (menuItem: IMenuItem | null, expanded: boolean) => void;
    focus: () => void;
    getParent: () => IMenu;
    onActivate: (menuItem: IMenuItem, event?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void;
    private renderList;
    private renderMenuItem;
}
export declare function MenuDivider(index: number, menuItem: IMenuItem): JSX.Element;
export declare function MenuHeader(index: number, menuItem: IMenuItem): JSX.Element;
export declare class MenuItem extends React.Component<IMenuItemProps> {
    private localKeyStroke;
    private expanded;
    private element;
    render(): JSX.Element;
    private handleClick;
    private onClick;
    private onDismissSubMenu;
    private onExpandedChange;
    private onFocus;
    private onKeyDown;
    private onKeyUp;
    private onMouseDown;
    private onMouseEnter;
    private onMouseLeave;
}
export declare class ContextualMenu extends React.Component<IContextualMenuProps> {
    private calloutRef;
    render(): JSX.Element;
    private onDismiss;
    private onKeyDown;
    private onActivate;
    private preprocessKeyStroke;
}
