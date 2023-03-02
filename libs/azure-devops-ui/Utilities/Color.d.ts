/**
 * We deliberately don't support alpha here, as things that declare and render
 * their own colors won't know about the theme and could cause usability issues
 */
export interface IColor {
    /**
     * Red coordinate: 0-255
     */
    red: number;
    /**
     * Blue coordinate: 0-255
     */
    blue: number;
    /**
     * Green coordinate: 0-255
     */
    green: number;
    /**
     * Optional color name; may or may not be used by various controls
     */
    name?: string;
}
export declare function darken(color: IColor, darkenFactor: number): IColor;
export declare function getColorString(color: IColor): string;
export declare function isDark(color: IColor): boolean;
export declare function rgbToHex(color: IColor): string;
/**
 * Convert a hex color to numeric r g b value
 * @param color Color in format #aabbcc
 */
export declare function hexToRgb(color: string): IColor;
export declare function generateRandomColor(): IColor;
export declare function generateRandomColorHex(): string;
export declare function parseColor(hexString?: string): IColor | undefined;
export declare function testForHexString(hexString: string): RegExpMatchArray;
