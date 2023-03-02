import "../../CommonImports";
import "../../Core/core.css";
import "./TeachingBubble.css";
import * as React from "react";
import { ITeachingBubble, ICustomTeachingBubbleProps, TeachingBubbleCornerPlacement } from "./TeachingBubble.Props";
import { IOrigin } from '../../Utilities/Position';
/**
 * Used to manage animations and content during animations.
 */
export interface ICustomTeachingBubbleState {
    anchorElement: HTMLElement;
    anchorOrigin: IOrigin;
    children?: React.ReactNode;
    cornerPlacement?: TeachingBubbleCornerPlacement;
    fadingOut?: boolean;
    newPosition?: boolean;
}
export declare class CustomTeachingBubble extends React.Component<ICustomTeachingBubbleProps, ICustomTeachingBubbleState> implements ITeachingBubble {
    static getDerivedStateFromProps(props: Readonly<ICustomTeachingBubbleProps>, state: Readonly<ICustomTeachingBubbleState>): {
        newPosition: boolean;
        anchorElement: HTMLElement;
        anchorOrigin: IOrigin;
        children?: React.ReactNode;
        cornerPlacement?: TeachingBubbleCornerPlacement;
        fadingOut?: boolean;
    } | {
        children: any;
        cornerPlacement: TeachingBubbleCornerPlacement;
    };
    constructor(props: ICustomTeachingBubbleProps);
    render(): JSX.Element;
    dismiss: () => void;
    private onAnimationEnd;
    private getCalloutOrigin;
    private getBeakClassName;
}
