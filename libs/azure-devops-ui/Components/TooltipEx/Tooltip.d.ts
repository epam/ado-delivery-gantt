import "../../CommonImports";
import "../../Core/core.css";
import "./Tooltip.css";
import * as React from "react";
import { IOffset, IOrigin, IPoint } from '../../Utilities/Position';
import { ITooltipProps } from "./Tooltip.Props";
export declare enum TooltipStatus {
    hidden = 0,
    visible = 1,
    fadingout = 2
}
export interface ITooltipState {
    anchorElement?: HTMLElement;
    anchorOffset?: IOffset;
    anchorOrigin?: IOrigin;
    anchorPoint?: IPoint;
    innerText?: string;
    tooltipStatus: TooltipStatus;
    tooltipOrigin?: IOrigin;
}
export declare class Tooltip extends React.Component<ITooltipProps, ITooltipState> {
    static defaultProps: {
        delayMs: number;
        showOnFocus: boolean;
    };
    private contentRef;
    private tooltipId;
    private focus;
    private mouse;
    private overflowDetected;
    constructor(props: Readonly<ITooltipProps>);
    render(): JSX.Element;
    componentWillUnmount(): void;
    private showTooltip;
    private closeTooltip;
    private onKeyDown;
    private onAnimationEnd;
    private getDismissStatus;
    private shouldShowTooltip;
}
