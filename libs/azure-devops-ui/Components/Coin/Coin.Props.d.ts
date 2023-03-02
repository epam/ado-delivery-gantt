/// <reference types="react" />
import { ITooltipProps } from '../../TooltipEx';
/**
 * Preset sizes for the Coin
 */
export declare enum CoinSize {
    size16 = 16,
    size20 = 20,
    size24 = 24,
    size32 = 32,
    size40 = 40,
    size72 = 72
}
/**
 * Props for Coin
 */
export interface ICoinProps {
    /**
     * Optional arial-label to specify for the coin.
     * Defaults to the displayName.
     */
    ariaLabel?: string;
    /**
     * Class name for the Coin
     */
    className?: string;
    /**
     * Name to display in the tooltip and use for initials for the coin
     */
    displayName: string;
    /**
     * Optional, if the coin is focusable.
     * @default false
     */
    dataIsFocusable?: boolean;
    /**
     * Optional, if the coin should be a tab stop
     * @default false
     */
    isTabStop?: boolean;
    /**
     * Optional, if the coin should be rendered as an image. The coin defaults to initials if this is not set.
     */
    imageUrl?: string;
    /**
     * Optional, alt text for the image if an image is provided.
     */
    imgAltText?: string;
    /**
     * Optional, size of the coin.
     */
    size?: CoinSize;
    /**
     * Custom tooltip props to be used for the tooltip in place of simply the display name. Null indicates that no tooltip should be used.
     */
    tooltipProps?: ITooltipProps | null;
    /**
     * Optional, callback when the coin is clicked.
     */
    onClick?: (ev?: React.MouseEvent<HTMLElement>) => void;
}
