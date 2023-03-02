import "../../CommonImports";
import "../../Core/core.css";
import "./Page.css";
import * as React from "react";
import { IPageProps } from "./Page.Props";
/**
 * Component for stitching together the various components that make a up a page.
 * Renders all children in a column-based flexbox.
 * If passed an observable selected tab id and contributed tab providers, will
 * wrap with a TabProvider component to provide context to consuming children.
 */
export declare class Page extends React.Component<IPageProps> {
    render(): JSX.Element;
}
