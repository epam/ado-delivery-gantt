import { IReadonlyObservableValue, ObservableValue } from '../../Core/Observable';
export interface IProgressBarProps {
    /**
     * Optional className to apply to the progress bar container div.
     */
    className?: string;
    /**
     * Current value of the progress bar. This should be a number between 0 and maxValue.
     */
    currentValue: IReadonlyObservableValue<number> | number;
    /**
     * Max value the progress bar can reach.
     */
    maxValue: number;
    /**
     * Optional className to apply to the actual progress bar.
     */
    progressBarClassName?: string;
    /**
     * Duration of the transition in milliseconds
     * @default 150
     */
    transitionDuration?: number;
    /**
     * Optional aria-label for the progress bar
     */
    ariaLabel?: string;
}
export interface IIndeterminateProgressBarProps {
    /**
     * Optional className to apply to the progress bar container div.
     */
    className?: string;
    /**
     * Is the progress bar still loading.
     * undefined: The gray bar will appear, but the progress bar will not start increasing.
     * true: The grey bar will appear, a progress bar will slowly fill the width of the gray bar
     * false: The progress bar will be rendered the full width of the bar, loadingAnimationComplete will be called
     * when the animation is completed.
     */
    loading?: ObservableValue<boolean> | boolean;
    /**
     * Callback for when the animation is complete. This is usually used to unmount the control.
     */
    loadingAnimationComplete?: () => void;
    /**
     * Optional className to apply to the actual progress bar.
     */
    progressBarClassName?: string;
}
