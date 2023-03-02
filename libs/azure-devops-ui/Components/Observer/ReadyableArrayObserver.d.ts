import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import { IReadyableArrayObserverProps } from "./ReadyableArrayObserver.Props";
export declare class ReadyableArrayObserver<T> extends React.Component<IReadyableArrayObserverProps<T>> {
    private loaded;
    render(): JSX.Element;
    componentDidUpdate(prevProps: IReadyableArrayObserverProps<T>): void;
    componentDidMount(): void;
    private handleLoaded;
}
