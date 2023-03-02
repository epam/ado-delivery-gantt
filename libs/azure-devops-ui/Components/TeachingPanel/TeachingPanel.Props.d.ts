export interface ITeachingSlideProps {
    /**
     * Title of the slide
     */
    title: string;
    /**
     * Description of the slide.
     */
    description: string;
    /**
     * Url path for the image to show.
     */
    slideImage?: string;
    /**
     * Alt text to describe the slide image.
     */
    imageAltText?: string;
}
export interface ITeachingPanelProps {
    /**
     * List of slides to show.
     */
    slides: ITeachingSlideProps[];
    /**
     * Callback when the panel is dismissed with the index of the slide that was shown when the panel was dismissed.
     */
    onDismiss?: (slideIndex: number) => void;
    /**
     * Content class name for teaching panel
     */
    className?: string;
}
