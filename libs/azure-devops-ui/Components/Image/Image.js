import "../../CommonImports";
import "../../Core/core.css";
import "./Image.css";
import * as React from "react";
import { css } from '../../Util';
export function Image(props) {
    var shouldContainImage = props.containImage || props.width !== undefined || props.height !== undefined;
    var classNameOnImg = props.width === undefined && props.height === undefined;
    var image = (React.createElement("img", { alt: props.alt, className: css(classNameOnImg && props.className, "bolt-image flex-noshrink", shouldContainImage && "contain"), key: props.key, role: props.role, src: props.src }));
    if (props.width || props.height) {
        return (React.createElement("div", { className: css(!classNameOnImg && props.className, "bolt-image-wrapper"), style: { width: props.width, height: props.height } }, image));
    }
    else {
        return image;
    }
}
