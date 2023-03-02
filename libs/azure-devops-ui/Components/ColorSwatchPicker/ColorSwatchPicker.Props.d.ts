/// <reference types="react" />
import { IColor } from '../../Utilities/Color';
import { IReadonlyObservableValue } from '../../Core/Observable';
export interface IColorSwatchPickerProps {
    /**
     * Colors to render into the swatch picker as pips
     */
    colors: IColor[];
    /**
     * Currently selected pip
     */
    selectedIndex?: number | IReadonlyObservableValue<number>;
    /**
     * Optional custom class name to emit
     */
    className?: string;
    /**
     * Enhanced onClick handler for an arbitrary pip
     * Passes back relevant data
     */
    onPipClick?: (event: React.MouseEvent<HTMLDivElement>, color: IColor, index: number) => void;
}
