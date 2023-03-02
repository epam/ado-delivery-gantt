var PERSONA_COLOR_BLUE = { red: 37, green: 116, blue: 204 };
/**
 * Colors added here should be checked via running FastPass before commiting.
 *
 * @see https://accessibilityinsights.io/
 */
var PERSONA_COLOR_PALETTE = [
    { red: 104, green: 123, blue: 33 },
    { red: 76, green: 119, blue: 168 },
    { red: 177, green: 87, blue: 144 },
    { red: 0, green: 133, blue: 0 },
    { red: 30, green: 113, blue: 69 },
    { red: 217, green: 0, blue: 128 },
    { red: 126, green: 56, blue: 120 },
    { red: 96, green: 60, blue: 186 },
    { red: 98, green: 113, blue: 171 },
    { red: 0, green: 130, blue: 129 },
    PERSONA_COLOR_BLUE,
    { red: 43, green: 87, blue: 151 },
    { red: 196, green: 74, blue: 38 },
    { red: 185, green: 29, blue: 71 } // Dark Red
];
// Char.IsLetter ranges
var LETTERS = [
    "[\u0030-\u0039]",
    "[\u0041-\u005A]",
    "[\u0400-\u042F]",
    "[\u0061-\u007A]",
    "[\u03AC-\u03CE]",
    "[\u01C5]",
    "[\u1FFC]",
    "[\u02B0-\u02C1]",
    "[\u1D2C-\u1D61]",
    "[\u05D0-\u05EA]",
    "[\u0621-\u063A]",
    "[\u4E00-\u9FC3]",
    "[\u00C0-\u00FF]",
    "[\u0100-\u017F]",
    "[\u0180-\u024F]" // LATIN-1 EXTENDED-B
];
var LETTERS_REGEX = LETTERS.join("|");
export function getInitialsColorFromName(displayName) {
    if (!displayName) {
        return PERSONA_COLOR_BLUE;
    }
    var hashCode = 0;
    for (var i = displayName.length - 1; i >= 0; i--) {
        var ch = displayName.charCodeAt(i);
        var shift = i % 8;
        // tslint:disable-next-line:no-bitwise
        hashCode ^= (ch << shift) + (ch >> (8 - shift));
    }
    return PERSONA_COLOR_PALETTE[hashCode % PERSONA_COLOR_PALETTE.length];
}
export function getInitialsFromName(displayName) {
    if (!displayName) {
        return "";
    }
    var segments = displayName.split(" ").filter(function (x) { return x !== ""; });
    if (segments.length === 0) {
        return "";
    }
    var firstNameInitial = "";
    var lastNameInitial = "";
    segments.forEach(function (segment) {
        if (segment[0].match(LETTERS_REGEX)) {
            if (firstNameInitial.length === 0) {
                firstNameInitial = segment[0];
            }
            else {
                lastNameInitial = segment[0];
            }
        }
    });
    return firstNameInitial.concat(lastNameInitial).toUpperCase();
}
