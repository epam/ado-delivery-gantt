import "../../CommonImports";
import "../../Core/core.css";
import "./Panel.css";
import * as React from "react";
import { ICustomPanelProps, IPanel } from './Panel.Props';
interface ICustomPanelState {
    isDisplayed: boolean;
}
export declare class CustomPanel extends React.Component<ICustomPanelProps, ICustomPanelState> implements IPanel {
    static defaultProps: {
        escDismiss: boolean;
        lightDismiss: boolean;
        modal: boolean;
    };
    static contextType: React.Context<import("../../Core/Util/Screen").IScreenContext>;
    private calloutContentRef;
    constructor(props: ICustomPanelProps);
    render(): JSX.Element;
    animateOut(): Promise<void>;
    private defaultActiveElement;
}
export {};
