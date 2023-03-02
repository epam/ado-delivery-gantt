import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import { IMeasureProps } from "./Measure.Props";
/**
 * Measures the child component; expects exactly one child
 * Use with caution; improper use can cause severe layout thrashing
 */
export declare class Measure extends React.Component<IMeasureProps> {
    private childRef;
    private lastWidth;
    private lastHeight;
    render(): React.DetailedReactHTMLElement<any, HTMLElement>;
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    private onResize;
}
