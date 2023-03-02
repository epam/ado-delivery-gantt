import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import { IIntersectionProps } from "./Intersection.Props";
export interface IIntersectionContext {
    readonly rootMargin: number;
    readonly root: HTMLElement;
    observe: (element: HTMLElement) => void;
    register: (callback: IntersectionObserverCallback) => void;
    unobserve: (element: HTMLElement) => void;
    unregister: (callback: IntersectionObserverCallback) => void;
}
declare class IntersectionContextImpl implements IIntersectionContext {
    private callbacks;
    private observer?;
    private pending;
    rootMargin: number;
    root: HTMLElement;
    connect(root: HTMLElement, rootMargin?: number, threshold?: number[]): void;
    disconnect(): void;
    observe(element: HTMLElement): void;
    onIntersect: (entries: IntersectionObserverEntry[]) => void;
    register(callback: IntersectionObserverCallback): void;
    unobserve(element: HTMLElement): void;
    unregister(callback: IntersectionObserverCallback): void;
}
export declare const IntersectionContext: React.Context<IIntersectionContext>;
/**
 * The Intersection is used to observe the changes of visibility in the children
 * of the rootElement. It also will notify the caller when the rootElement is
 * scrolled. It will pass an empty array of entries in the scorlling case.
 */
export declare class Intersection extends React.Component<IIntersectionProps, IIntersectionContext> {
    private externalElement;
    private mergedRef;
    private rootElement;
    state: IntersectionContextImpl;
    render(): JSX.Element;
    componentDidMount(): void;
    componentWillUnmount(): void;
    private onScroll;
}
export {};
