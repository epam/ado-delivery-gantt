import * as React from "react";
import * as ReactDOM from "react-dom";
/**
 * Copies the specified data to the clipboard in the TEXT format.
 *
 * @param data The data to copy.
 * @param onCopy Callback after a copy is completed
 */
export function copyToClipboard(data, onCopy) {
    if (data instanceof HTMLElement) {
        copy(data, onCopy);
    }
    else {
        var copyRoot_1 = document.createElement("div");
        // Make sure our element doesn't actually become visible to the user.
        copyRoot_1.classList.add("visually-hidden");
        copyRoot_1.setAttribute("aria-hidden", "true");
        copyRoot_1.setAttribute("role", "presentation");
        copyRoot_1.setAttribute("style", "{color: inherit; background-color: inherit;}");
        document.body.appendChild(copyRoot_1);
        // Render the contents to the new root node, once the component is mounted
        // call the copy method,
        var copyDiv = React.createElement("div", {
            ref: function (element) {
                if (element) {
                    // Execute the copy of the data from the mounted element
                    copy(element, onCopy);
                    // Unmount the element and ensure React is cleaned up after the ref call completes.
                    window.setTimeout(function () {
                        ReactDOM.unmountComponentAtNode(copyRoot_1);
                        document.body.removeChild(copyRoot_1);
                    }, 0);
                }
            },
            style: {
                whiteSpace: "pre",
                color: "inherit",
                backgroundColor: "inherit"
            }
        }, data);
        ReactDOM.render(copyDiv, copyRoot_1);
    }
}
function copy(element, onCopy) {
    var range = document.createRange();
    var sel = window.getSelection();
    sel.removeAllRanges();
    range.selectNodeContents(element);
    sel.addRange(range);
    document.execCommand("copy");
    sel.removeAllRanges();
    onCopy && onCopy();
}
