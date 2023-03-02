import "../../CommonImports";
import "../../Core/core.css";
import "./Toast.css";
import * as React from "react";
import { ICancelablePromise } from '../../Core/Util/Promise';
import { IToastProps } from './Toast.Props';
export interface IToastState {
    callToActionWidth?: number;
    fadingOut: boolean;
}
export declare class Toast extends React.Component<IToastProps, IToastState> {
    private fadeOutPromise;
    private callToActionRef;
    constructor(props: IToastProps);
    fadeOut(): ICancelablePromise<void>;
    render(): JSX.Element;
    componentDidMount(): void;
    componentWillUnmount(): void;
    private onCallToActionClick;
    private onKeyboardShortcut;
    private onMeasureCallToAction;
}
