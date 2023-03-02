/**
 * Defines how spacing should be applied to the children of a container.
 */
export declare enum Spacing {
    condensed = 0,
    default = 1,
    relaxed = 2
}
export declare enum SurfaceBackground {
    normal = 0,
    neutral = 1,
    callout = 2
}
export interface ISurfaceContext {
    /**
     * Specifies the background color of the surface onto which a component will be
     * rendered. This allows components which consume the context to decide if anything
     * about their rendering needs to be changed.
     *
     * @default SurfaceBackground.normal
     */
    background: SurfaceBackground;
    /**
     * Class name that should be applied to achieve the horizontal spacing desired by the
     * spacing prop for the context. This provides a standard mapping of spacing value =>
     * className. If a component consuming the context wants different behavior based on
     * the spacing value, it can choose to not apply this className, and provide different style.
     */
    horizontalClassName?: string;
    /**
     * Specifies the spacing the container should use.
     * This allows components which consume the context to decide if anything
     * about their rendering needs to be changed.
     *
     * @default undefined - let the component decide how spacing should be applied.
     */
    spacing?: Spacing;
    /**
     * Class name that should be applied to achieve the vertical spacing desired by the
     * spacing prop for the context. This provides a standard mapping of spacing value =>
     * className. If a component consuming the context wants different behavior based on
     * the spacing value, it can choose to not apply this className, and provide different style.
     */
    verticalClassName?: string;
}
export interface ISurfaceProps {
    /**
     * Specifies the semantic background color of the surface.
     *
     * @default SurfaceBackground.normal
     */
    background: SurfaceBackground;
    /**
     * Specifies the spacing the container should use.
     * This allows components which consume the context to decide if anything
     * about their rendering needs to be changed.
     *
     * @default undefined - let the component decide how spacing should be applied.
     */
    spacing?: Spacing;
}
