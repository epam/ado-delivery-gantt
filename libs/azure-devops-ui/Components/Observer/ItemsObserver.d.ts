import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import { IItemsObserverProps } from "./ItemsObserver.Props";
export declare class ItemsObserver<T> extends React.Component<IItemsObserverProps<T>> {
    componentDidMount(): void;
    render(): JSX.Element;
    private onItemsChanged;
}
