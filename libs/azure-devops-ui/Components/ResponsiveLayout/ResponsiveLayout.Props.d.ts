/**
 * The response layout can be used to adjust the children based on either a horizonal or
 * vertical layout but not both at the same time.
 */
export declare enum ResponsiveOrientation {
    /**
     * Components are measured by width and adjusted based on the the width of the parent
     * element.
     */
    Horizontal = 0,
    /**
     * Components are measure by height and adjusted based on the height of the parent
     * element.
     */
    Vertical = 1
}
/**
 * Set of properties used to create a ResponsiveLayout component.
 */
export interface IResponsiveLayoutProps {
    /**
     * The set of components that are responsive in priority order. Not all child indexes
     * need to be listed, only the ones that should be responsive.
     */
    responsiveChildren: number[];
    /**
     * Some components (like fillers) can be excluded from the layouts size calculations.
     * This is useful when a component has no effective impact on the size of the parent element.
     */
    ignoredChildren?: number[];
    /**
     * onLayoutChange is called when the responsive container is sized and one of the children
     * is affected by the size change.
     *
     * @param hiddenCount - The number of currently hidden components in the layout.
     */
    onLayoutChange?: (hiddenCount: number) => void;
    /**
     * Orientation of the responsiveness for the component. Defaults to Horizontal.
     */
    orientation?: ResponsiveOrientation;
}
