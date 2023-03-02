/**
 * Takes CSS text with themeable property variables (like 'background: var(--background-color)') and
 * replaces the CSS variables with the values from the specified theme
 *
 * @param str
 * @param themeData
 */
export function expandThemeableProperties(str, themeData) {
    if (!themeData) {
        return str;
    }
    // Match a theme variable in the first capturing group
    var re = /var\(--([A-Z_-][A-Z0-9_-]*)\)/gim;
    var result;
    var replaced = str;
    while ((result = re.exec(str))) {
        if (result[1]) {
            replaced = replaced.replace(result[0], themeData[result[1]]);
        }
    }
    if (replaced === str) {
        return str;
    }
    else {
        return expandThemeableProperties(replaced, themeData);
    }
}
