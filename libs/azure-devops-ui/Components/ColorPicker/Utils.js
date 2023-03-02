import { format } from '../../Core/Util/String';
import * as Resources from '../../Resources.Color';
import { ArrayItemProvider } from '../../Utilities/Provider';
/**
 * If a rule for the given color doesn't already exist, creates it.
 *
 * The rule will look like
 *  .color-dropdown.bg-[color] { background-color: #[color]; }
 *
 * Returns the classname to apply to the Dropdown.
 */
var ColorDropdownStyleSheetTitle = "colorDropdownStyles";
export function addColorClass(color) {
    color = color.replace("#", "");
    var styleSheet = getStyleSheet();
    var className = "bg-" + color;
    var selector = "." + className + " .bolt-dropdown-expandable-textfield-input";
    for (var i = 0; i < styleSheet.cssRules.length; i++) {
        if (styleSheet.cssRules[i].type === CSSRule.STYLE_RULE) {
            var rule = styleSheet.cssRules[i];
            if (rule.selectorText === selector) {
                // rule already exists
                return className;
            }
        }
    }
    styleSheet.insertRule(selector + " { background-color: #" + color + "; }");
    return className;
}
/**
 * Gets or creates a style sheet shared between all ColorDropdowns.
 */
export function getStyleSheet() {
    for (var i = 0; i < document.styleSheets.length; i++) {
        if (document.styleSheets[i].title === ColorDropdownStyleSheetTitle) {
            return document.styleSheets[i];
        }
    }
    var elem = document.createElement("style");
    elem.title = ColorDropdownStyleSheetTitle;
    // WebKit hack
    elem.appendChild(document.createTextNode(""));
    document.head.appendChild(elem);
    return elem.sheet;
}
var colorRows = [
    {
        cells: [
            { id: "222222", text: Resources.Black },
            { id: "292E6B", text: Resources.Blue },
            { id: "009CCC", text: Resources.Turquoise },
            { id: "00643A", text: Resources.Teal },
            { id: "339947", text: Resources.Green },
            { id: "FBBC3D", text: Resources.Yellow },
            { id: "DB552C", text: Resources.Orange },
            { id: "7F1725", text: Resources.Red },
            { id: "EC008C", text: Resources.Pink },
            { id: "5C197B", text: Resources.Purple },
            { id: "51399F", text: Resources.Indigo }
        ]
    },
    {
        cells: [
            { id: "444444", text: format(Resources.TenPercentLighterColor, Resources.Black.toLowerCase()) },
            { id: "1B478B", text: format(Resources.TenPercentLighterColor, Resources.Blue.toLowerCase()) },
            { id: "43B4D5", text: format(Resources.TenPercentLighterColor, Resources.Turquoise.toLowerCase()) },
            { id: "207752", text: format(Resources.TenPercentLighterColor, Resources.Teal.toLowerCase()) },
            { id: "60AF49", text: format(Resources.TenPercentLighterColor, Resources.Green.toLowerCase()) },
            { id: "FBD144", text: format(Resources.TenPercentLighterColor, Resources.Yellow.toLowerCase()) },
            { id: "E87025", text: format(Resources.TenPercentLighterColor, Resources.Orange.toLowerCase()) },
            { id: "B20B1E", text: format(Resources.TenPercentLighterColor, Resources.Red.toLowerCase()) },
            { id: "EF33A3", text: format(Resources.TenPercentLighterColor, Resources.Pink.toLowerCase()) },
            { id: "71338D", text: format(Resources.TenPercentLighterColor, Resources.Purple.toLowerCase()) },
            { id: "6951AA", text: format(Resources.TenPercentLighterColor, Resources.Indigo.toLowerCase()) }
        ]
    },
    {
        cells: [
            { id: "666666", text: format(Resources.TwentyPercentLighterColor, Resources.Black.toLowerCase()) },
            { id: "0D60AB", text: format(Resources.TwentyPercentLighterColor, Resources.Blue.toLowerCase()) },
            { id: "86CDDE", text: format(Resources.TwentyPercentLighterColor, Resources.Turquoise.toLowerCase()) },
            { id: "56987D", text: format(Resources.TwentyPercentLighterColor, Resources.Teal.toLowerCase()) },
            { id: "8DC54B", text: format(Resources.TwentyPercentLighterColor, Resources.Green.toLowerCase()) },
            { id: "FBE74B", text: format(Resources.TwentyPercentLighterColor, Resources.Yellow.toLowerCase()) },
            { id: "F58B1F", text: format(Resources.TwentyPercentLighterColor, Resources.Orange.toLowerCase()) },
            { id: "E60017", text: format(Resources.TwentyPercentLighterColor, Resources.Red.toLowerCase()) },
            { id: "F266BA", text: format(Resources.TwentyPercentLighterColor, Resources.Pink.toLowerCase()) },
            { id: "9260A1", text: format(Resources.TwentyPercentLighterColor, Resources.Purple.toLowerCase()) },
            { id: "8874C2", text: format(Resources.TwentyPercentLighterColor, Resources.Indigo.toLowerCase()) }
        ]
    },
    {
        cells: [
            { id: "888888", text: format(Resources.FortyPercentLighterColor, Resources.Black.toLowerCase()) },
            { id: "007ACC", text: format(Resources.FortyPercentLighterColor, Resources.Blue.toLowerCase()) },
            { id: "C9E7E7", text: format(Resources.FortyPercentLighterColor, Resources.Turquoise.toLowerCase()) },
            { id: "7CAF9A", text: format(Resources.FortyPercentLighterColor, Resources.Teal.toLowerCase()) },
            { id: "A8CE4B", text: format(Resources.FortyPercentLighterColor, Resources.Green.toLowerCase()) },
            { id: "FBFD52", text: format(Resources.FortyPercentLighterColor, Resources.Yellow.toLowerCase()) },
            { id: "F7A24B", text: format(Resources.FortyPercentLighterColor, Resources.Orange.toLowerCase()) },
            { id: "EB3345", text: format(Resources.FortyPercentLighterColor, Resources.Red.toLowerCase()) },
            { id: "F599D1", text: format(Resources.FortyPercentLighterColor, Resources.Pink.toLowerCase()) },
            { id: "AE88B9", text: format(Resources.FortyPercentLighterColor, Resources.Purple.toLowerCase()) },
            { id: "AA9CDF", text: format(Resources.FortyPercentLighterColor, Resources.Indigo.toLowerCase()) }
        ]
    },
    {
        cells: [
            { id: "AAAAAA", text: format(Resources.SixtyPercentLighterColor, Resources.Black.toLowerCase()) },
            { id: "3F9BD8", text: format(Resources.SixtyPercentLighterColor, Resources.Blue.toLowerCase()) },
            { id: "D6EDED", text: format(Resources.SixtyPercentLighterColor, Resources.Turquoise.toLowerCase()) },
            { id: "9CC3B2", text: format(Resources.SixtyPercentLighterColor, Resources.Teal.toLowerCase()) },
            { id: "C3D84C", text: format(Resources.SixtyPercentLighterColor, Resources.Green.toLowerCase()) },
            { id: "FCFD7D", text: format(Resources.SixtyPercentLighterColor, Resources.Yellow.toLowerCase()) },
            { id: "F9B978", text: format(Resources.SixtyPercentLighterColor, Resources.Orange.toLowerCase()) },
            { id: "F06673", text: format(Resources.SixtyPercentLighterColor, Resources.Red.toLowerCase()) },
            { id: "F9CCE8", text: format(Resources.SixtyPercentLighterColor, Resources.Pink.toLowerCase()) },
            { id: "C7ABD0", text: format(Resources.SixtyPercentLighterColor, Resources.Purple.toLowerCase()) },
            { id: "C0B6E9", text: format(Resources.SixtyPercentLighterColor, Resources.Indigo.toLowerCase()) }
        ]
    },
    {
        cells: [
            { id: "FFFFFF", text: format(Resources.White, Resources.White.toLowerCase()) },
            { id: "7FBCE5", text: format(Resources.EightyPercentLighterColor, Resources.Blue.toLowerCase()) },
            { id: "E4F3F3", text: format(Resources.EightyPercentLighterColor, Resources.Turquoise.toLowerCase()) },
            { id: "BFD8CD", text: format(Resources.EightyPercentLighterColor, Resources.Teal.toLowerCase()) },
            { id: "D7E587", text: format(Resources.EightyPercentLighterColor, Resources.Green.toLowerCase()) },
            { id: "FCFEA8", text: format(Resources.EightyPercentLighterColor, Resources.Yellow.toLowerCase()) },
            { id: "FBD0A5", text: format(Resources.EightyPercentLighterColor, Resources.Orange.toLowerCase()) },
            { id: "F599A2", text: format(Resources.EightyPercentLighterColor, Resources.Red.toLowerCase()) },
            { id: "FBDDEF", text: format(Resources.EightyPercentLighterColor, Resources.Pink.toLowerCase()) },
            { id: "E0CAE7", text: format(Resources.EightyPercentLighterColor, Resources.Purple.toLowerCase()) },
            { id: "DAD4F7", text: format(Resources.EightyPercentLighterColor, Resources.Indigo.toLowerCase()) }
        ]
    }
];
export var colorRowProvider = new ArrayItemProvider(colorRows);
export var colorItems = colorRows.reduce(function (acc, val) { return acc.concat(val.cells); }, []);
