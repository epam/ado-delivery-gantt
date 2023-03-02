/// <reference types="react" />
/**
 * Class to provide identity information to the VssPersona component.
 *
 * This interface is still in flux and should not be implemented outside of VssPreview.
 */
export interface IIdentityDetailsProvider {
    /**
     * Return a URL to a profile image suitable for display at size pixels.
     */
    getIdentityImageUrl(size: number): string | undefined;
    /**
     * Gets the user's displayname.
     */
    getDisplayName(): string | undefined;
    /**
     * (optional) Render an element to display on delayed hover of the VssPersona
     * e.g. a profile card or tooltip containing the full display name
     */
    onRenderPersonaCard?(image: HTMLElement, onDismiss: () => void): JSX.Element;
}
/**
 * Preset sizes for VssPersonas
 */
export declare type VssPersonaSize = "extra-extra-small" | "extra-small" | "extra-small-plus" | "small" | "small-plus" | "medium" | "medium-plus" | "large" | "extra-large" | "extra-extra-large";
/**
 * Props for VssPersona
 */
export interface IVssPersonaProps {
    /**
     * aria-label to be used for the VssPersona. If this prop is undefined, the component will automatically include an aria-label
     * based on the display name. A value of null indicates that no ariaLabel should be added. The use case for this is a situation
     * where the display name is also in the DOM - which could cause screen readers to read the name multiple times.
     */
    ariaLabel?: string | null;
    className?: string;
    cssClass?: string;
    /** Size of image to display. Use VssPersonaSize presets. */
    size?: VssPersonaSize;
    /** Provides information about an identity. */
    identityDetailsProvider?: IIdentityDetailsProvider;
    /** If true, do not show persona card on hover */
    suppressPersonaCard?: boolean;
    /** Set when VssPersona is within a focus zone **/
    dataIsFocusable?: boolean;
    /** Set when VssPersona is a tab stop but not in focus zone **/
    isTabStop?: boolean;
    /** Alternate text for VSSPersona image to display when image load does not succeed **/
    imgAltText?: string;
    /** Optional callback on image load error **/
    onImageError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
    /** Optional callback on image load error **/
    showInitialsOnImageError?: boolean;
    /** Optional, if provided the image url for the Icon. Used if identityDetailsProvider is not set **/
    imageUrl?: string;
    /** Optional, if provided the name to generate the tooltip and initials to use for the persona coin. Used if identityDetailsProvider is not set **/
    displayName?: string;
}
