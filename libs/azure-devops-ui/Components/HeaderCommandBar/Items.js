import "../../CommonImports";
import "../../Core/core.css";
import "./HeaderCommandBar.css";
import * as Resources from '../../Resources.Page';
export function getFilterItem(onActivate, isFiltering, important, label) {
    if (important === void 0) { important = true; }
    if (label === void 0) { label = Resources.Filter; }
    return {
        ariaLabel: label,
        iconProps: getFilterItemIconProps(isFiltering),
        id: "filter",
        important: important,
        onActivate: onActivate,
        subtle: true,
        tooltipProps: { text: label }
    };
}
export function getFilterItemIconProps(isFiltering) {
    return {
        iconName: isFiltering ? "FilterSolid" : "Filter"
    };
}
export function getFullScreenItem(onActivate, fullscreen, important) {
    if (important === void 0) { important = true; }
    return {
        ariaLabel: fullscreen ? Resources.ExitFullScreen : Resources.EnterFullScreen,
        iconProps: {
            iconName: fullscreen ? "BackToWindow" : "FullScreen"
        },
        id: "fullscreen",
        important: important,
        onActivate: onActivate,
        subtle: true
    };
}
export function toggleFullScreen(newFullScreenState) {
    if (newFullScreenState) {
        document.body && document.body.classList.add("full-screen-mode");
    }
    else {
        document.body && document.body.classList.remove("full-screen-mode");
    }
}
