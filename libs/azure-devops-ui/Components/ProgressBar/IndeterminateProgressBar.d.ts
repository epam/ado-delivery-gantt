import "../../CommonImports";
import "../../Core/core.css";
import "./ProgressBar.css";
import * as React from "react";
import { IIndeterminateProgressBarProps } from "./ProgressBar.Props";
interface ProgressState {
    progress: number;
}
export declare class IndeterminateProgressBar extends React.PureComponent<IIndeterminateProgressBarProps, ProgressState> {
    private get transitionDuration();
    private timerManagement;
    private transitionDurations;
    constructor(props: IIndeterminateProgressBarProps);
    render(): JSX.Element;
    componentDidMount(): void;
    componentDidUpdate(prevProps: IIndeterminateProgressBarProps): void;
    componentWillUnmount(): void;
    private randomize25;
    private randomize75;
    private asymptoticApproach;
    private scheduleUpdate;
    private done;
    private increment;
    private reset;
    private shouldRun;
    private updateProgress;
}
export {};
