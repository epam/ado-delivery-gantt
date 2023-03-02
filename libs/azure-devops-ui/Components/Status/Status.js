import "../../CommonImports";
import "../../Core/core.css";
import "./Status.css";
import * as React from "react";
import { Tooltip } from '../../TooltipEx';
import { css, getSafeId } from '../../Util';
import { StatusSize } from "../../Components/Status/Status.Props";
var xlViewBoxSize = "0 0 32 32";
var mViewBoxSize = "0 0 16 16";
var sViewBoxSize = "0 0 12 12";
var statusId = 1;
/**
 * Meant to be used in conjunction with the Statuses object:
 *
 * <Status {...Statuses.Success} size={StatusSize.m} />
 * <Status {...Statuses.Success} ariaLabel="Success" size={StatusSize.m} />
 * <Status {...Statuses.Success} size={StatusSize.l} text="Something important" />
 */
export function Status(props) {
    var animated = props.animated, ariaLabel = props.ariaLabel, className = props.className, color = props.color, onRenderIcon = props.onRenderIcon, text = props.text, tooltipContent = props.tooltipContent;
    var size = props.size === undefined ? StatusSize.xl : props.size;
    if (text) {
        return (React.createElement(Tooltip, { renderContent: tooltipContent },
            React.createElement("div", { "aria-label": text, className: css("bolt-status-extended flex-row flex-center", color, className, size === StatusSize.xl && "xl") },
                onRenderIcon(css("bolt-status", color), size, animated),
                React.createElement("span", { className: css("bolt-status-text", size !== StatusSize.l ? "font-size-mm xl" : "font-size", color === "neutral" && "bolt-status-text-extra-padding") }, text))));
    }
    else {
        return onRenderIcon(css("bolt-status flex-noshrink", color, className), size, animated, ariaLabel);
    }
}
function Success(props) {
    switch (props.size) {
        case StatusSize.xl:
        case StatusSize.l: {
            return (React.createElement(Svg, { ariaLabel: props.ariaLabel, className: props.className, size: props.size, viewBox: xlViewBoxSize },
                React.createElement("circle", { cx: "16", cy: "16", r: "16" }),
                React.createElement("path", { d: "M12.799 20.83l-.005-.003L9.94 17.97a1.5 1.5 0 1 1 2.121-2.12l1.8 1.798 6.209-6.21a1.5 1.5 0 1 1 2.12 2.122l-7.264 7.264-.005.006a1.5 1.5 0 0 1-2.121 0z", fill: "#fff" })));
        }
        case StatusSize.m: {
            return (React.createElement(Svg, { ariaLabel: props.ariaLabel, className: props.className, size: props.size, viewBox: mViewBoxSize },
                React.createElement("circle", { cx: "8", cy: "8", r: "8" }),
                React.createElement("path", { d: "M6.062 11.144l-.003-.002-1.784-1.785A.937.937 0 1 1 5.6 8.031l1.125 1.124 3.88-3.88A.937.937 0 1 1 11.931 6.6l-4.54 4.54-.004.004a.938.938 0 0 1-1.325 0z", fill: "#fff" })));
        }
        case StatusSize.s:
        default: {
            return (React.createElement(Svg, { ariaLabel: props.ariaLabel, className: props.className, size: props.size, viewBox: sViewBoxSize },
                React.createElement("circle", { cx: "6", cy: "6", r: "6" }),
                React.createElement("path", { d: "M4.74 8.19l-.002-.002-1.29-1.29a.677.677 0 1 1 .958-.957l.813.812 2.804-2.805a.678.678 0 0 1 .959.958L5.7 8.188l-.002.002a.678.678 0 0 1-.958 0z", fill: "#fff" })));
        }
    }
}
function Failed(props) {
    switch (props.size) {
        case StatusSize.xl:
        case StatusSize.l: {
            return (React.createElement(Svg, { ariaLabel: props.ariaLabel, className: props.className, size: props.size, viewBox: xlViewBoxSize },
                React.createElement("circle", { cx: "16", cy: "16", r: "16" }),
                React.createElement("path", { d: "M21.99 9.99a1.5 1.5 0 0 0-2.122 0L16 13.856 12.132 9.99a1.5 1.5 0 0 0-2.121 2.122l3.868 3.868-3.89 3.889a1.5 1.5 0 0 0 2.122 2.121L16 18.1l3.89 3.89a1.5 1.5 0 0 0 2.12-2.122l-3.889-3.89 3.868-3.867a1.5 1.5 0 0 0 0-2.122z", fill: "#fff" })));
        }
        case StatusSize.m: {
            return (React.createElement(Svg, { ariaLabel: props.ariaLabel, className: props.className, size: props.size, viewBox: mViewBoxSize },
                React.createElement("circle", { cx: "8", cy: "8", r: "8" }),
                React.createElement("path", { d: "M10.984 5.004a.9.9 0 0 1 0 1.272L9.27 7.99l1.74 1.741a.9.9 0 1 1-1.272 1.273l-1.74-1.741-1.742 1.74a.9.9 0 1 1-1.272-1.272l1.74-1.74-1.713-1.714a.9.9 0 0 1 1.273-1.273l1.713 1.713 1.714-1.713a.9.9 0 0 1 1.273 0z", fill: "#fff" })));
        }
        case StatusSize.s:
        default: {
            return (React.createElement(Svg, { ariaLabel: props.ariaLabel, className: props.className, size: props.size, viewBox: sViewBoxSize },
                React.createElement("circle", { cx: "6", cy: "6", r: "6" }),
                React.createElement("path", { d: "M3.64 3.64a.75.75 0 0 1 1.06 0l1.294 1.294L7.288 3.64a.75.75 0 0 1 1.06 1.06L7.056 5.994l1.292 1.292a.75.75 0 0 1-1.06 1.06l-1.295-1.29-1.291 1.291a.75.75 0 1 1-1.06-1.06l1.292-1.293L3.64 4.7a.75.75 0 0 1 0-1.06z", fill: "#fff" })));
        }
    }
}
function Warning(props) {
    switch (props.size) {
        case StatusSize.xl:
        case StatusSize.l: {
            return (React.createElement(Svg, { ariaLabel: props.ariaLabel, className: props.className, size: props.size, viewBox: xlViewBoxSize },
                React.createElement("circle", { cx: "16", cy: "16", r: "16" }),
                React.createElement("path", { d: "M16 7a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-3 0v-9A1.5 1.5 0 0 1 16 7zm-1.5 16a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0z", fill: "#fff" })));
        }
        case StatusSize.m: {
            return (React.createElement(Svg, { ariaLabel: props.ariaLabel, className: props.className, size: props.size, viewBox: mViewBoxSize },
                React.createElement("circle", { cx: "8", cy: "8", r: "8" }),
                React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8.91 3.9a.9.9 0 0 0-1.8 0v4.7a.9.9 0 1 0 1.8 0V3.9zm-.95 8.65a.9.9 0 1 0 0-1.8.9.9 0 0 0 0 1.8z", fill: "#fff" })));
        }
        case StatusSize.s:
        default: {
            return (React.createElement(Svg, { ariaLabel: props.ariaLabel, className: props.className, size: props.size, viewBox: sViewBoxSize },
                React.createElement("circle", { cx: "6", cy: "6", r: "6" }),
                React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M6.75 2.75a.75.75 0 1 0-1.5 0v3.5a.75.75 0 1 0 1.5 0v-3.5zM6 9.5A.75.75 0 1 0 6 8a.75.75 0 0 0 0 1.5z", fill: "#fff" })));
        }
    }
}
function Running(props) {
    var className = css(props.className, props.animated !== false ? (props.size === StatusSize.s ? "small-animate" : "animate") : "");
    switch (props.size) {
        case StatusSize.xl:
        case StatusSize.l: {
            return (React.createElement(Svg, { ariaLabel: props.ariaLabel, className: className, size: props.size, viewBox: xlViewBoxSize },
                React.createElement("circle", { cx: "16", cy: "16", r: "16" }),
                React.createElement("path", { d: "M23 16c0 .325-.022.645-.065.959-.07.509.137 1.031.582 1.289.622.36 1.42.058 1.545-.65a9.204 9.204 0 0 0-6.27-10.367c-.664-.21-1.292.324-1.292 1.02 0 .532.374.982.873 1.162A7.003 7.003 0 0 1 23 16zM9 16a7.003 7.003 0 0 1 4.627-6.587c.5-.18.873-.63.873-1.161 0-.697-.628-1.232-1.292-1.02a9.204 9.204 0 0 0-6.27 10.367c.124.707.924 1.008 1.545.649.445-.258.652-.78.582-1.29A7.062 7.062 0 0 1 9 16zm7 7a6.975 6.975 0 0 0 4.728-1.838c.403-.37.999-.484 1.472-.21.586.339.744 1.121.261 1.597A9.17 9.17 0 0 1 16 25.2a9.17 9.17 0 0 1-6.461-2.65c-.482-.477-.325-1.26.261-1.599.473-.273 1.069-.159 1.472.21A6.975 6.975 0 0 0 16 23z", fill: "#fff" })));
        }
        case StatusSize.m: {
            return (React.createElement(Svg, { ariaLabel: props.ariaLabel, className: className, size: props.size, viewBox: mViewBoxSize },
                React.createElement("circle", { cx: "8", cy: "8", r: "8" }),
                React.createElement("path", { d: "M4.75 8a3.25 3.25 0 0 1 1.917-2.965c.33-.148.583-.453.583-.814 0-.479-.432-.848-.881-.683A4.752 4.752 0 0 0 3.29 8.62c.064.49.616.697 1.043.45.303-.175.443-.528.423-.877A3.304 3.304 0 0 1 4.75 8zm6.5 0c0 .065-.002.13-.006.194-.02.349.12.702.422.877.428.247.98.04 1.044-.45a4.752 4.752 0 0 0-3.078-5.084c-.45-.164-.882.205-.882.684 0 .36.253.666.583.814A3.25 3.25 0 0 1 11.25 8zM8 11.25c.758 0 1.455-.26 2.008-.694.293-.23.696-.31 1.019-.123.402.233.51.77.167 1.083A4.733 4.733 0 0 1 8 12.75c-1.23 0-2.35-.467-3.194-1.234-.344-.312-.235-.85.168-1.083.322-.186.725-.108 1.018.123.553.435 1.25.694 2.008.694z", fill: "#fff" })));
        }
        case StatusSize.s:
        default: {
            return (React.createElement(Svg, { ariaLabel: props.ariaLabel, className: className, size: props.size, viewBox: sViewBoxSize },
                React.createElement("circle", { cx: "6", cy: "6", r: "6" }),
                React.createElement("path", { d: "M7.768 4.232a2.5 2.5 0 0 1 .63 2.477c-.081.276-.042.586.161.79.295.294.79.243.94-.145a3.75 3.75 0 0 0-4.853-4.852c-.388.15-.439.644-.144.939.203.203.513.242.79.161a2.5 2.5 0 0 1 2.476.63zm-4.42 4.42a3.75 3.75 0 0 1-.846-4.006c.15-.388.644-.439.939-.145.203.204.242.514.161.79A2.5 2.5 0 0 0 6.71 8.398c.276-.081.586-.042.79.161.294.295.243.79-.145.94a3.75 3.75 0 0 1-4.006-.847z", fill: "#fff" })));
        }
    }
}
function Waiting(props) {
    switch (props.size) {
        case StatusSize.xl:
        case StatusSize.l: {
            return (React.createElement(Svg, { ariaLabel: props.ariaLabel, className: props.className, size: props.size, viewBox: xlViewBoxSize },
                React.createElement("circle", { cx: "16", cy: "16", r: "16" }),
                React.createElement("path", { d: "M16 7a1.5 1.5 0 0 1 1.5 1.5v7.377l4.026 4.027a1.5 1.5 0 0 1-2.12 2.121l-4.428-4.427A1.496 1.496 0 0 1 14.5 16.5v-8A1.5 1.5 0 0 1 16 7z", fill: "#fff" })));
        }
        case StatusSize.m: {
            return (React.createElement(Svg, { ariaLabel: props.ariaLabel, className: props.className, size: props.size, viewBox: mViewBoxSize },
                React.createElement("circle", { cx: "8", cy: "8", r: "8" }),
                React.createElement("path", { d: "M8 3.5a.9.9 0 0 1 .9.9v3.325l2.002 2.001A.9.9 0 1 1 9.629 11L7.408 8.778A.898.898 0 0 1 7.1 8.1V4.4a.9.9 0 0 1 .9-.9z", fill: "#fff" })));
        }
        case StatusSize.s:
        default: {
            return (React.createElement(Svg, { ariaLabel: props.ariaLabel, className: props.className, size: props.size, viewBox: sViewBoxSize },
                React.createElement("circle", { cx: "6", cy: "6", r: "6" }),
                React.createElement("path", { d: "M6 2.6a.75.75 0 0 1 .75.75v2.439L8.122 7.16a.75.75 0 1 1-1.06 1.06L5.487 6.648A.747.747 0 0 1 5.25 6.1V3.35A.75.75 0 0 1 6 2.6z", fill: "#fff" })));
        }
    }
}
function Queued(props) {
    switch (props.size) {
        case StatusSize.xl:
        case StatusSize.l: {
            return (React.createElement(Svg, { ariaLabel: props.ariaLabel, className: props.className, size: props.size, viewBox: xlViewBoxSize },
                React.createElement("circle", { cx: "16", cy: "16", r: "15", fill: "#fff" }),
                React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M16 32c8.836 0 16-7.163 16-16S24.836 0 16 0 0 7.163 0 16s7.164 16 16 16zm0-2c7.732 0 14-6.268 14-14S23.732 2 16 2 2 8.268 2 16s6.268 14 14 14z" })));
        }
        case StatusSize.m: {
            return (React.createElement(Svg, { ariaLabel: props.ariaLabel, className: props.className, size: props.size, viewBox: mViewBoxSize },
                React.createElement("circle", { cx: "8", cy: "8", r: "7", fill: "#fff" }),
                React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm0-1.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13z" })));
        }
        case StatusSize.s:
        default: {
            return (React.createElement(Svg, { ariaLabel: props.ariaLabel, className: props.className, size: props.size, viewBox: sViewBoxSize },
                React.createElement("circle", { cx: "6", cy: "6", r: "5", fill: "#fff" }),
                React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M6 12A6 6 0 1 0 6 0a6 6 0 0 0 0 12zm0-1.25a4.75 4.75 0 1 0 0-9.5 4.75 4.75 0 0 0 0 9.5z" })));
        }
    }
}
function Canceled(props) {
    switch (props.size) {
        case StatusSize.xl:
        case StatusSize.l: {
            return (React.createElement(Svg, { ariaLabel: props.ariaLabel, className: props.className, size: props.size, viewBox: xlViewBoxSize },
                React.createElement("circle", { cx: "16", cy: "16", r: "15", fill: "#fff" }),
                React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M32 16c0 8.837-7.163 16-16 16S0 24.837 0 16 7.163 0 16 0s16 7.163 16 16zm-2 0c0 7.732-6.268 14-14 14S2 23.732 2 16 8.268 2 16 2s14 6.268 14 14zm-17.618-5.81a1.5 1.5 0 1 0-2.121 2.12l9.192 9.193a1.5 1.5 0 1 0 2.121-2.121l-9.192-9.193z" })));
        }
        case StatusSize.m: {
            return (React.createElement(Svg, { ariaLabel: props.ariaLabel, className: props.className, size: props.size, viewBox: mViewBoxSize },
                React.createElement("circle", { cx: "8", cy: "8", r: "7", fill: "#fff" }),
                React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-1.5 0a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0zM6.41 5.124a.9.9 0 1 0-1.274 1.272l4.385 4.385a.9.9 0 1 0 1.272-1.273L6.41 5.124z" })));
        }
        case StatusSize.s:
        default: {
            return (React.createElement(Svg, { ariaLabel: props.ariaLabel, className: props.className, size: props.size, viewBox: sViewBoxSize },
                React.createElement("circle", { cx: "6", cy: "6", r: "5", fill: "#fff" }),
                React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12 6A6 6 0 1 1 0 6a6 6 0 0 1 12 0zm-1.25 0a4.75 4.75 0 1 1-9.5 0 4.75 4.75 0 0 1 9.5 0zM4.941 3.89a.75.75 0 0 0-1.06 1.06l3.182 3.182a.75.75 0 1 0 1.06-1.06L4.941 3.89z" })));
        }
    }
}
function Skipped(props) {
    switch (props.size) {
        case StatusSize.xl:
        case StatusSize.l: {
            return (React.createElement(Svg, { ariaLabel: props.ariaLabel, className: props.className, size: props.size, viewBox: xlViewBoxSize },
                React.createElement("circle", { cx: "16", cy: "16", r: "15", fill: "#fff" }),
                React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M32 16c0 8.837-7.163 16-16 16S0 24.837 0 16 7.163 0 16 0s16 7.163 16 16zm-2 0c0 7.732-6.268 14-14 14S2 23.732 2 16 8.268 2 16 2s14 6.268 14 14zM13.44 8.94a1.5 1.5 0 0 1 2.12 0l5.88 5.878A1.5 1.5 0 0 1 21.874 16c.034.423-.11.858-.434 1.182l-5.88 5.879a1.5 1.5 0 1 1-2.12-2.122L18.379 16l-4.94-4.94a1.5 1.5 0 0 1 0-2.12z" })));
        }
        case StatusSize.m: {
            return (React.createElement(Svg, { ariaLabel: props.ariaLabel, className: props.className, size: props.size, viewBox: mViewBoxSize },
                React.createElement("circle", { cx: "8", cy: "8", r: "7", fill: "#fff" }),
                React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-1.5 0a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0zM6.752 4.372a.861.861 0 0 1 1.218 0l3.005 3.005a.86.86 0 0 1 .252.62.859.859 0 0 1-.252.626L7.97 11.628a.861.861 0 1 1-1.218-1.218L9.162 8l-2.41-2.41a.861.861 0 0 1 0-1.218z" })));
        }
        case StatusSize.s:
        default: {
            return (React.createElement(Svg, { ariaLabel: props.ariaLabel, className: props.className, size: props.size, viewBox: sViewBoxSize },
                React.createElement("circle", { cx: "6", cy: "6", r: "5", fill: "#fff" }),
                React.createElement("path", { fillRule: "evenodd", clipRule: "evenodd", d: "M12 6A6 6 0 1 1 0 6a6 6 0 0 1 12 0zm-1.25 0a4.75 4.75 0 1 1-9.5 0 4.75 4.75 0 0 1 9.5 0zM4.97 3.47a.75.75 0 0 1 1.06 0l1.94 1.94c.162.16.234.378.217.59a.748.748 0 0 1-.217.59L6.03 8.53a.75.75 0 0 1-1.06-1.06L6.44 6 4.97 4.53a.75.75 0 0 1 0-1.06z" })));
        }
    }
}
function Svg(props) {
    var role = props.ariaLabel ? "img" : "presentation";
    var descId = props.ariaLabel ? getSafeId("status-" + statusId++ + "-desc") : undefined;
    return (React.createElement("svg", { "aria-labelledby": descId, className: props.className, height: props.size, role: role, viewBox: props.viewBox, width: props.size, xmlns: "http://www.w3.org/2000/svg" },
        props.ariaLabel && React.createElement("desc", { id: descId }, props.ariaLabel),
        props.children));
}
export var Statuses = {
    Success: {
        color: "success",
        onRenderIcon: function (className, size, animated, ariaLabel) { return Success({ ariaLabel: ariaLabel, className: className, size: size }); }
    },
    Failed: {
        color: "failed",
        onRenderIcon: function (className, size, animated, ariaLabel) { return Failed({ ariaLabel: ariaLabel, className: className, size: size }); }
    },
    Warning: {
        color: "warning",
        onRenderIcon: function (className, size, animated, ariaLabel) { return Warning({ ariaLabel: ariaLabel, className: className, size: size }); }
    },
    Information: {
        color: "active",
        onRenderIcon: function (className, size, animated, ariaLabel) {
            return Warning({ ariaLabel: ariaLabel, className: css("rotate", className), size: size });
        }
    },
    Running: {
        color: "active",
        onRenderIcon: function (className, size, animated, ariaLabel) {
            return Running({ animated: animated, ariaLabel: ariaLabel, className: className, size: size });
        }
    },
    Waiting: {
        color: "active",
        onRenderIcon: function (className, size, animated, ariaLabel) { return Waiting({ ariaLabel: ariaLabel, className: className, size: size }); }
    },
    Queued: {
        color: "neutral",
        onRenderIcon: function (className, size, animated, ariaLabel) { return Queued({ ariaLabel: ariaLabel, className: className, size: size }); }
    },
    Canceled: {
        color: "neutral",
        onRenderIcon: function (className, size, animated, ariaLabel) { return Canceled({ ariaLabel: ariaLabel, className: className, size: size }); }
    },
    Skipped: {
        color: "neutral",
        onRenderIcon: function (className, size, animated, ariaLabel) { return Skipped({ ariaLabel: ariaLabel, className: className, size: size }); }
    }
};
