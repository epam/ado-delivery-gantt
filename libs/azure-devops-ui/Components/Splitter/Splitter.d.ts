import "../../CommonImports";
import "../../Core/core.css";
import "./Splitter.css";
import * as React from "react";
import { ISplitterProps, SplitterDirection, SplitterElementPosition } from "./Splitter.Props";
export declare class Splitter extends React.Component<ISplitterProps> {
    protected static defaultProps: {
        fixedElement: SplitterElementPosition;
        splitterDirection: SplitterDirection;
    };
    /**
     *  The position where the drag started
     */
    private _dragAnchorPos;
    /**
     *  The size of the fixed element before the drag started
     */
    private _previousFixedSize;
    private _fixedRef;
    private _splitterContainer;
    private _cachedNearElement;
    private _cachedFarElement;
    private events;
    private uncontrolledFixedSize;
    private placeholderPosition;
    private fixedPaneId;
    constructor(props: ISplitterProps, context: any);
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
    private collapse;
    private expand;
    /**
     *  Renders the first child
     */
    private _renderNearElement;
    /**
     *  Renders the last child. If there are 0-1 children, will render a flexible pane
     */
    private _renderFarElement;
    /**
     *  Render the fixed pane, with size determined by state
     */
    private _renderFixedPane;
    private getCollapsedButtonIconName;
    /**
     *  Render the flexible pane
     */
    private _renderFlexiblePane;
    /**
     *  Render the divider
     */
    private _renderDivider;
    /**
     *  Render the placeholder if the user is dragging
     */
    private _renderDragPlaceHolder;
    /**
     *  Keyboard handler for the divider
     */
    private _onDividerKeyDown;
    /**
     * Fired when the user mouses down on the divider
     * If there is a fixed pane, records its initial size, and attaches mouse move and mouse up events to the window
     */
    private _onDividerMouseDown;
    /**
     * Fired when the user touches down on the divider
     * If there is a fixed pane, records its initial size, and attaches mouse move and mouse up events to the window
     */
    private _onDividerTouchDown;
    private _onDividerDown;
    /**
     * Fired when the user moves their mouse, after having moused down on the divider
     * Computes the new location of the placeholder
     * @param event
     */
    private _onDividerMouseMove;
    /**
     * Fired when the user moves their mouse, after having moused down on the divider
     * Computes the new location of the placeholder
     * @param event
     */
    private _onDividerTouchMove;
    /**
     * Computes the new location of the placeholder based on the mouse event.
     * @param event
     */
    private _handleDragEvent;
    /**
     * Fired when the user releases their mouse, after having moused down on the divider
     * Updates the size of the fixed pane, and stops the drag
     * Removes window events
     */
    private _onDividerMouseUp;
    /**
     * Fired when the user releases their touch, after having touched down on the divider
     * Updates the size of the fixed pane, and stops the drag
     * Removes window events
     */
    private _onDividerTouchEnd;
    private _onDividerEnd;
    private _setFixedSize;
    /**
     * Move the divider in a near or far direction
     * @param direction The Direction
     */
    private _moveDivider;
    /** Attaches mouse events to the window */
    private _attachMouseWindowEvents;
    /** Detaches mouse events to the window */
    private _detachMouseWindowEvents;
    /** Attaches touch events to the window */
    private _attachTouchWindowEvents;
    /** Detaches touch events to the window */
    private _detachTouchWindowEvents;
    /**
     * Get a X/Y position of a mouse event, relative to the splitter container and depending on the splitter direction
     * The position will be bounded within the splitter container and the min/max widths of the fixed panel
     * @param event
     */
    private _getEventBoundedClientPos;
    /**
     * Given a position relative to the window, get a position relative to the splitter container and depending on the splitter direction
     * The position will be bounded within the splitter container and the min/max widths of the fixed panel
     * @param clientPos The position relative to the window
     * @param props The props to use
     */
    private _getBoundedClientPos;
    /**
     * Compute the allowable pixel value bounds for the splitter
     * @param props The props to use
     */
    private _getSplitterBoundaries;
    /**
     * Gets a new width from the initial size, a delta, and splitter props
     *
     * @param initialSize The initial width
     * @param delta The new position minus the drag anchor
     * @param props The splitter props to use
     */
    private _getNewFixedSize;
    private isCollapsed;
    /**
     * Indicates if a drag operation is in process
     */
    private _isDragging;
    /**
     * Get the size (width or height) of an element, based on the splitter direction
     * @param element The element
     */
    private _getElementSize;
    /**
     * Get the start position (left or top) of an element, based on the splitter direction
     * @param element The element
     */
    private _getElementStartPos;
    private _fireWindowResize;
}
