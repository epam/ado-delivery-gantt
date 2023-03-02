/// <reference types="react" />
import { ICancelablePromise } from '../../Core/Util/Promise';
export interface IToast {
    fadeOut(): ICancelablePromise<void>;
}
export interface IToastProps {
    /**
     * Optional text for the Call to Action
     */
    callToAction?: string;
    /**
     * Optional class name for the root toast element
     */
    className?: string;
    /**
     * Message to display on the Toast
     */
    message: string;
    /**
     * Optional handler for when the Call to Action is clicked
     */
    onCallToActionClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
}
