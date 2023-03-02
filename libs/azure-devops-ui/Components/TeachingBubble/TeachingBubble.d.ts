import "../../CommonImports";
import "../../Core/core.css";
import "./TeachingBubble.css";
import * as React from "react";
import { ITeachingBubbleProps, ITeachingBubble } from "./TeachingBubble.Props";
export declare class TeachingBubble extends React.Component<ITeachingBubbleProps> implements ITeachingBubble {
    private readonly customBubble;
    private bubbleId;
    render(): JSX.Element;
    private getContent;
    private getButtons;
    private setFocus;
    dismiss: () => void;
}
