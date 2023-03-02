export function darken(color, darkenFactor) {
    var darkenMultiplier = 1 - darkenFactor;
    return {
        red: color.red * darkenMultiplier,
        green: color.green * darkenMultiplier,
        blue: color.blue * darkenMultiplier
    };
}
export function getColorString(color) {
    return "rgb(" + color.red + ", " + color.green + ", " + color.blue + ")";
}
export function isDark(color) {
    var luminance = color.red * 0.299 + color.green * 0.587 + color.blue * 0.114;
    return luminance <= 128;
}
export function rgbToHex(color) {
    return ("#" + rgbValueToString(color.red) + rgbValueToString(color.green) + rgbValueToString(color.blue)).toUpperCase();
}
/**
 * Convert a hex color to numeric r g b value
 * @param color Color in format #aabbcc
 */
export function hexToRgb(color) {
    if (color.length !== 7 || color[0] !== "#") {
        throw new Error("Expected color in format #AABBCC");
    }
    return {
        red: parseInt(color.substr(1, 2), 16),
        green: parseInt(color.substr(3, 2), 16),
        blue: parseInt(color.substr(5, 2), 16)
    };
}
export function generateRandomColor() {
    var blue = Math.floor(Math.random() * 256);
    var green = Math.floor(Math.random() * 256);
    var red = Math.floor(Math.random() * 256);
    return { red: red, blue: blue, green: green };
}
export function generateRandomColorHex() {
    return rgbToHex(generateRandomColor());
}
export function parseColor(hexString) {
    if (!hexString) {
        return undefined;
    }
    var color = undefined;
    if (hexString.length === 7) {
        try {
            color = hexToRgb(hexString);
        }
        catch (ex) {
            console.log(ex);
            // swallow the exception
        }
    }
    return color;
}
var hexRegex = new RegExp("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$");
export function testForHexString(hexString) {
    return hexString.match(hexRegex);
}
function rgbValueToString(colorCoord) {
    var hexColor = colorCoord.toString(16);
    if (hexColor.length === 1) {
        hexColor = "0" + hexColor;
    }
    return hexColor;
}
