export interface ThemeData {
    [themeVariable: string]: string;
}
/**
 * Takes CSS text with themeable property variables (like 'background: var(--background-color)') and
 * replaces the CSS variables with the values from the specified theme
 *
 * @param str
 * @param themeData
 */
export declare function expandThemeableProperties(str: string, themeData: ThemeData | undefined): string;
