import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import { IResponsiveLayoutProps } from "./ResponsiveLayout.Props";
/**
 * The ResponsiveLayout component is used to create a container that responds to
 * its size. Children of the layout container element will be shown or hidden
 * based on the amount of space available. The client creates the ResponsiveLayout
 * around the element that should be managed.
 *
 * The children of the layout container MUST map one element per child. This allows
 * the ResponsiveLayout to map visibility of the component to its relative DOM
 * element. The child MAY be a component and is not required to be a direct DOM
 * element. The child component MUST result in one root DOM element.
 */
export declare class ResponsiveLayout extends React.Component<IResponsiveLayoutProps> {
    /**
     * Details about each of the children in the responsive layout.
     */
    private childDetails?;
    /**
     * All components within the responsiveLayout MUST specific a unique key. The
     * key should follow the same rules as a standard React key. If the component
     * fundamentally changes the key should change along with it.
     */
    private childKeys;
    /**
     * ref to the container element used by the responsive layout. The direct children
     * are the elements that are responsive.
     */
    private containerRef;
    /**
     * Number of hidden components in the layout.
     */
    private hiddenCount;
    /**
     * Timeout used to notify callers about changes to the visible elements.
     */
    private layoutTimeout;
    render(): JSX.Element | null;
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    resetLayout(): void;
    private updateLayout;
}
