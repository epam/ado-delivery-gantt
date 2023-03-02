import "../../CommonImports";
import "../../Core/core.css";
import "./IdentityCard.css";
import * as React from "react";
import { Icon } from '../../Icon';
import { Link } from '../../Link';
export var CardContactLine = function (props) {
    return (React.createElement("div", { className: "bolt-identity-default-card-contact-line-wrapper flex-row" },
        React.createElement(Icon, { iconName: props.iconName, className: "bolt-identity-default-card-contact-line-label font-size" }),
        props.link && (React.createElement(Link, { className: "flex-row text-ellipsis", href: props.link }, props.content)),
        !props.link && React.createElement("span", { className: "bolt-identity-default-card-contact-line-no-link text-ellipsis" }, props.content)));
};
