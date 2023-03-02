import "../../CommonImports";
import "../../Core/core.css";
import "./Dialog.css";
import * as React from "react";
import { ContentJustification, ContentLocation } from '../../Callout';
import { ICustomDialogProps } from './Dialog.Props';
interface ICustomDialogState {
    width?: number;
    height?: number;
}
export declare class CustomDialog extends React.Component<ICustomDialogProps, ICustomDialogState> {
    static defaultProps: {
        contentJustification: ContentJustification;
        contentLocation: ContentLocation;
        escDismiss: boolean;
        lightDismiss: boolean;
        enterPrimary: boolean;
    };
    constructor(props: ICustomDialogProps);
    static contextType: React.Context<import("../../Core/Util/Screen").IScreenContext>;
    private events;
    private contentRef;
    private anchorX;
    private anchorY;
    private currentHeight;
    private currentWidth;
    render(): JSX.Element;
    private onGripperKeyDown;
    private onGripperMouseDown;
    private onGripperDown;
    private onGripperMouseMove;
    private handleDragEvent;
    private onGripperMouseUp;
    private attachMouseWindowEvents;
    private detachMouseWindowEvents;
    private onKeyDown;
}
export {};
