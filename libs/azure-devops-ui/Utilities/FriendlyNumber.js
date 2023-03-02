import { format } from '../Core/Util/String';
import * as Resources from '../Resources.Core';
/**
 * Gets a friendly display value like "15K+" for a given numerical
 * value like 15217.
 *
 * @param value The numerical value to convert to a friendlier text string
 */
export function getFriendlyDisplayValue(value) {
    var displayValue = "";
    var negative = false;
    if (isNaN(value)) {
        return "";
    }
    if (value < 0) {
        negative = true;
        value = -value;
    }
    value = Math.floor(value);
    if (value < 1000) {
        displayValue = value.toString();
    }
    else if (value < 1000000) {
        displayValue = format(Resources.FriendlyNumberThousandsFormat, Math.floor(value / 1000));
    }
    else if (value < 1000000000) {
        displayValue = format(Resources.FriendlyNumberMillionsFormat, Math.floor(value / 1000000));
    }
    else {
        displayValue = format(Resources.FriendlyNumberBillionsFormat, Math.floor(value / 1000000000));
    }
    return (negative && value > 0 ? "-" : "") + displayValue;
}
