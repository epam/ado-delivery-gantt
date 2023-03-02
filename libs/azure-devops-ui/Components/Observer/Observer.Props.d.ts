import * as React from "react";
import { IObservable, IObservableLikeArray, IObservableLikeValue, IReadonlyObservableArray, IReadonlyObservableValue } from '../../Core/Observable';
declare type ArrayMember<T> = T extends Array<infer U> ? U : never;
export declare type ObservedArgs<T> = T extends IObservable<infer U> ? U : never;
export interface IObservableExpression<T = any> {
    /**
     * Using an observableExpression you can sign up for an action instead of
     * all actions which is the default.
     */
    action?: string;
    /**
     * filter function that determines whether or not an action should affect
     * the state of the Observer.
     *
     * @param value The observable value that is being supplied for the action.
     * @param action The action that has taken place.
     *
     * @returns true if the Observer should setState, false if the change should
     * be ignored.
     */
    filter?: (value: ObservedArgs<T>, action: string) => boolean;
    /**
     * The observableValue is the value being observed. When actions are fired,
     * the filter is called and the results determine whether the component
     * changes state.
     */
    observableValue: T | IObservableLikeValue<T> | IObservableLikeArray<ArrayMember<T>>;
}
/** Extracts the observed type from an IReadonlyObservableValue or IReadonlyObservableArray */
declare type SimpleObserved<T> = T extends IReadonlyObservableArray<infer U> ? U[] : T extends IReadonlyObservableValue<infer V> ? V : T;
/** Extracts the observed type from an IObservableExpression or IReadonlyObservableValue or IReadonlyObservableArray */
export declare type Observed<T> = T extends IObservableExpression<infer W> ? SimpleObserved<W> : SimpleObserved<T>;
/** Converts all observable members of T to their observed type */
export declare type ObservedMembers<T> = {
    [P in keyof Omit<T, "children">]: Observed<T[P]>;
};
/** The child of an <Observer> element. */
export declare type ObserverChildFunction<TObservables> = (props: ObservedMembers<TObservables>) => React.ReactNode;
export declare type IObserverProps<TObservables> = TObservables & {
    /**
     * Called whenever componentDidUpdate is run by the Observer
     * (after subscriptions have been updated).
     * Useful in situations where you need to be notified when Observer updates
     * happen, but don't want to insert a new component just for the lifecycle methods.
     */
    onUpdate?: () => void;
    /**
     * All props that should be passed down to the child element.
     * These properties are IObservableLikeValues, meaning that if they are observable,
     * we will attempt to subscribe to their changes.
     */
    children: ObserverChildFunction<TObservables>;
};
export interface IUncheckedObserverProps {
    /**
     * Called whenever componentDidUpdate is run by the Observer
     * (after subscriptions have been updated).
     * Useful in situations where you need to be notified when Observer updates
     * happen, but don't want to insert a new component just for the lifecycle methods.
     */
    onUpdate?: () => void;
    /**
     * All props that should be passed down to the child element.
     * These properties are IObservableLikeValues, meaning that if they are observable,
     * we will attempt to subscribe to their changes.
     */
    [propName: string]: IObservableLikeValue<any> | IObservableExpression;
}
export {};
