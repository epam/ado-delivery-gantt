export interface IImageProps {
    /**
     * Optional alt text for the image
     */
    alt?: string;
    /**
     * Optional classname to add to the Image component.
     */
    className?: string;
    /**
     * Should the image be scaled down to fit the container?
     * If true, we'll scale the image down / up to fit the container width, maintaining aspect ratio
     * If width and height are both supplied, this will be overridden to true
     */
    containImage?: boolean;
    /**
     * Optional height; we'll emit a wrapper around the img tag
     */
    height?: number;
    /**
     * A unique identifier for this component.
     */
    key?: string;
    /**
     * Aria role to be applied to the img element
     */
    role?: string;
    /**
     * The url to use as the src of the <img> tag.
     */
    src: string;
    /**
     * Optional width; we'll emit a wrapper around the img tag
     */
    width?: number;
}
