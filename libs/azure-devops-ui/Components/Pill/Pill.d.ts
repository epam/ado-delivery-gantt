import "../../CommonImports";
import "../../Core/core.css";
import "./Pill.css";
import * as React from "react";
import { IPillProps } from "./Pill.Props";
export interface IPillState {
    isHoveringPrimaryElement: boolean;
}
export declare class Pill extends React.Component<IPillProps, IPillState> {
    private static getColorStyle;
    private static getSizeClass;
    private static getVariantClass;
    static getDerivedStateFromProps(props: IPillProps, state: IPillState): IPillState;
    constructor(props: IPillProps);
    render(): JSX.Element;
    private getChildText;
    private onKeyDown;
    private onMouseEnter;
    /**
     * onMouseLeaveButton fires first; if it leaves the container too
     * onMouseLeave will setState again, which will prevent weird behavior
     */
    private onMouseLeave;
    private onMouseLeaveButton;
    private onMouseOverButton;
}
