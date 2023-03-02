import "../../CommonImports";
import "../../Core/core.css";
import "./HeaderCommandBar.css";
import * as React from "react";
import { ICustomHeaderCommandBarProps, IHeaderCommandBar } from "./HeaderCommandBar.Props";
/**
 * Renders children in a FocusZone and ButtonGroup. This should be used directly only
 * if you need to render custom content that does not map to an IHeaderCommandBarItem.
 *
 * This component will always render all of its children - the logic for which items live
 * in the ... button and which items are always shown is only in the HeaderCommandBar. It is assumed
 * that if you are custom rendering the header command bar, that you are responsible for putting
 * the items correctly into the menu button.
 */
export declare class CustomHeaderCommandBar extends React.Component<ICustomHeaderCommandBarProps> implements IHeaderCommandBar {
    render(): JSX.Element;
}
