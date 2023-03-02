/// <reference types="react" />
import { IColor } from '../../Utilities/Color';
export interface IColorPipProps {
    /**
     * Optional class name
     */
    className?: string;
    /**
     * Color to use to render
     * Optional because you may want to override in CSS
     */
    color?: IColor;
    /**
     * If true, emits a "selected" class
     */
    isSelected?: boolean;
    /**
     * onClick for the pip, enhanced with color data
     */
    onClick?: (event: React.MouseEvent<HTMLDivElement>, color: IColor) => void;
}
