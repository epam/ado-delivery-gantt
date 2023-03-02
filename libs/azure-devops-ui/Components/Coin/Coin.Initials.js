var COIN_COLOR_BLUE = { red: 79, green: 107, blue: 237 }; // Blue10
var COIN_COLOR_PALETTE = [
    { red: 117, green: 11, blue: 28 },
    { red: 164, green: 38, blue: 44 },
    { red: 209, green: 52, blue: 56 },
    { red: 202, green: 80, blue: 16 },
    { red: 152, green: 111, blue: 11 },
    { red: 73, green: 130, blue: 5 },
    { red: 11, green: 106, blue: 11 },
    { red: 3, green: 131, blue: 135 },
    { red: 0, green: 91, blue: 112 },
    { red: 0, green: 120, blue: 212 },
    COIN_COLOR_BLUE,
    { red: 92, green: 46, blue: 145 },
    { red: 135, green: 100, blue: 184 },
    { red: 136, green: 23, blue: 152 },
    { red: 194, green: 57, blue: 179 },
    { red: 227, green: 0, blue: 140 },
    { red: 142, green: 86, blue: 46 },
    { red: 122, green: 117, blue: 116 },
    { red: 105, green: 121, blue: 126 } //  Gray20
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
        return COIN_COLOR_BLUE;
    }
    var hashCode = 0;
    for (var i = displayName.length - 1; i >= 0; i--) {
        var ch = displayName.charCodeAt(i);
        var shift = i % 8;
        // tslint:disable-next-line:no-bitwise
        hashCode ^= (ch << shift) + (ch >> (8 - shift));
    }
    return COIN_COLOR_PALETTE[hashCode % COIN_COLOR_PALETTE.length];
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
