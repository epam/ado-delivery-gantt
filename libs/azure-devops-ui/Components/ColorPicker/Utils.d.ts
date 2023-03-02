import { IListBoxItem } from '../../ListBox';
import { ArrayItemProvider } from '../../Utilities/Provider';
export interface IColorPickerProps {
    ariaLabel: string;
    className?: string;
    color: string;
    disabled?: boolean;
    onColorSelected: (color: string) => void;
}
export interface IColorTableRow {
    cells: [IListBoxItem, IListBoxItem, IListBoxItem, IListBoxItem, IListBoxItem, IListBoxItem, IListBoxItem, IListBoxItem, IListBoxItem, IListBoxItem, IListBoxItem];
}
export declare function addColorClass(color?: string): string;
/**
 * Gets or creates a style sheet shared between all ColorDropdowns.
 */
export declare function getStyleSheet(): CSSStyleSheet;
export declare const colorRowProvider: ArrayItemProvider<IColorTableRow>;
export declare const colorItems: any[];
