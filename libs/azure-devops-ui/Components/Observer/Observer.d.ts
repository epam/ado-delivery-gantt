import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import { IObserverProps, IUncheckedObserverProps } from "./Observer.Props";
export interface IObserverState<TProps> {
    values: {
        [propName: string]: any;
    };
    oldProps: Partial<TProps>;
}
/**
 * Handles subscription to properties that are IObservableValues, so that components don't have to handle on their own.
 *
 * Usage:
 *
 * <Observer myObservableValue={observableValue}>
 *     <MyComponent myObservableValue='' />
 * </Observer>
 *
 * Your component will get re-rendered with the new value of myObservableValue whenever that value changes.
 * Additionally, any additional props set on the Observer will also get passed down.
 */
declare class ObserverBase<TProps extends {
    onUpdate?: () => void;
}> extends React.Component<TProps, IObserverState<TProps>> {
    static getDerivedStateFromProps<TProps>(props: Readonly<TProps>, state: Readonly<IObserverState<TProps>>): Partial<IObserverState<TProps>>;
    private subscribedProps;
    private subscriptions;
    constructor(props: Readonly<TProps>);
    render(): JSX.Element;
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    subscribe(propName: string, props: TProps): void;
    unsubscribe(propName: string, props: TProps): void;
    private updateSubscriptionsAndStateAfterRender;
    private onValueChanged;
}
/**
 * Handles subscription to properties that are IObservableValues, so that components don't have to handle on their own.
 *
 * Usage:
 *
 * <Observer myObservableValue={observableValue}>
 *     {(props: {myObservableValue: string}) =>
 *         <MyComponent myObservableValue={props.myObservableValue} />
 *     }
 * </Observer>
 *
 * Your component will get re-rendered with the new value of myObservableValue whenever that value changes.
 */
export declare class Observer<TObservables> extends ObserverBase<IObserverProps<TObservables>> {
}
/**
 * UncheckedObserver is like Observer, except that it performs less (no) typechecking on the child observer function,
 * and allows child React elements.
 *
 * Usage:
 *
 * <Observer myObservableValue={observableValue}>
 *     {(props: {myObservableValue: string}) =>
 *         <MyComponent myObservableValue={props.myObservableValue} />
 *     }
 * </Observer>
 *
 * -or-
 *
 * <Observer myObservableValue={observableValue}>
 *     <MyComponent myObservableValue='' />
 * </Observer>
 *
 * Your component will get re-rendered with the new value of myObservableValue whenever that value changes.
 * Additionally, any additional props set on the Observer will also get passed down.
 */
export declare class UncheckedObserver extends ObserverBase<IUncheckedObserverProps> {
}
export {};
