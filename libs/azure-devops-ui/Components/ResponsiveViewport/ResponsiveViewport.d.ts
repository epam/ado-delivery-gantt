import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import { IBreakPoint, IResponsiveViewportProps, IResponsiveViewport } from "./ResponsiveViewport.Props";
export interface IResponsiveWrapperState<T extends IBreakPoint = IBreakPoint> {
    /** Currently active breakpoints */
    activeBreakpoints: T[];
}
export declare class ResponsiveViewport<T extends IBreakPoint = IBreakPoint> extends React.Component<IResponsiveViewportProps<T>, IResponsiveWrapperState<T>> implements IResponsiveViewport {
    private _element;
    private events;
    private timers;
    constructor(props: IResponsiveViewportProps<T>);
    componentDidMount(): void;
    componentWillUnmount(): void;
    shouldComponentUpdate(newProps: IResponsiveViewportProps<T>, newState: IResponsiveWrapperState<T>): boolean;
    render(): React.DetailedReactHTMLElement<{
        className: string;
        ref: (element: HTMLElement) => void;
    }, HTMLElement>;
    measure(): void;
    private _onAsyncResize;
    private _resize;
    private _getActiveBreakpoints;
    private _resolveElement;
}
