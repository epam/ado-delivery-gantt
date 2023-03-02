import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import { IExpandable, IExpandableContainerProps, IExpandableProps } from "./Expandable.Props";
export interface IExpandableState {
    expanded: boolean;
}
export declare class Expandable extends React.Component<IExpandableProps, IExpandableState> implements IExpandable {
    static defaultProps: Readonly<Partial<IExpandableProps>>;
    private ignoreClick?;
    state: {
        expanded: boolean;
    };
    render(): JSX.Element;
    collapse: () => void;
    expand: () => void;
    private isExpandKey;
    private onClick;
    private onKeyDown;
    private onMouseDown;
}
/**
 * ExpandableContainer is a specialized form of Expandable and generally shouldn't be used.
 * It's main goal is to provider mouse enter/leave behavior for collapsing.
 *
 * @NOTE: This component MAY be deprecated in the future, use <Expandable /> instead.
 */
export declare class ExpandableContainer extends React.Component<IExpandableContainerProps> implements IExpandable {
    static contextType: React.Context<import("../FocusGroup/FocusGroup.Props").IFocusGroupContext>;
    static defaultProps: Readonly<Partial<IExpandableContainerProps>>;
    private element;
    private expandedOnHover;
    private expandable;
    private expandableId;
    render(): JSX.Element;
    collapse: () => void;
    expand: () => void;
    private onFocus;
    private onMouseEnter;
    private onMouseLeave;
    private renderCallout;
}
