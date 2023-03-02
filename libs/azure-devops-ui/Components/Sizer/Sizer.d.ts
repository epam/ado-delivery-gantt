import "../../CommonImports";
import "../../Core/core.css";
import "./Sizer.css";
import * as React from "react";
import { ISizedProps, ISizerProps } from "./Sizer.Props";
export interface ISizerState {
    showPortal: boolean;
}
export declare class Sizer extends React.Component<ISizerProps, ISizerState> {
    static defaultProps: Partial<ISizerProps>;
    private debouncedEnd;
    private lastLocation;
    private timerManagement;
    constructor(props: Readonly<ISizerProps>);
    state: {
        showPortal: boolean;
    };
    render(): JSX.Element | null;
    componentWillUnmount(): void;
    private onDragStart;
    private onMouseCapture;
    private getMouseLocation;
    private onKeyDown;
    private onSizeEnd;
    private onMouseDown;
    private updateSize;
    private onFocus;
}
/**
 * The Sized function is used to produce a div that has a fixed width or height
 * based on the orientation of the sized props. This is a basic component that
 * can be used with the Sizer to produce a basic splitter like UI.
 *
 * @param props properties to render the appropriate container element given the
 * props.
 */
export declare function Sized(props: ISizedProps & {
    children?: React.ReactNode;
}): JSX.Element;
