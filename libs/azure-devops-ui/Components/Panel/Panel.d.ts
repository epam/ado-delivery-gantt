import "../../CommonImports";
import "../../Core/core.css";
import "./Panel.css";
import * as React from "react";
import { IPanelProps, IPanel } from './Panel.Props';
export declare class Panel extends React.Component<IPanelProps> implements IPanel {
    private readonly customPanelRef;
    private panelId;
    render(): JSX.Element;
    animateOut(): Promise<void>;
}
