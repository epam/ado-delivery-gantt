export interface IMeasureProps {
    /**
     * Event hook for window resize or render completion to allow measuring of the rendered child
     */
    onMeasure?: (newWidth: number, newHeight: number) => void;
}
