import "../../CommonImports";
import "../../Core/core.css";
import "./TeachingPanel.css";
import * as React from "react";
import { ITeachingPanelProps } from "./TeachingPanel.Props";
interface ITeachingPanelState {
    slideIndex: number;
    shouldShow: boolean;
}
export declare class TeachingPanel extends React.Component<ITeachingPanelProps, ITeachingPanelState> {
    private nextButton;
    constructor(props: ITeachingPanelProps);
    render(): JSX.Element;
    private _onPanelClose;
    private _onNextPressed;
    private _onBackPressed;
    private _renderPanel;
}
export {};
