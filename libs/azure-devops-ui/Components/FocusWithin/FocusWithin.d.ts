import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import { IFocusWithin, IFocusWithinProps } from "./FocusWithin.Props";
export declare class FocusWithin extends React.Component<IFocusWithinProps> implements IFocusWithin {
    static defaultProps: {
        updateStateOnFocusChange: boolean;
    };
    private parentFocusWithin;
    private blurTimeout;
    private focusCount;
    private focus;
    render(): JSX.Element;
    /**
     * componentWillUnmount is used to cleanup the component state.
     *
     * @NOTE: The main thing we need to deal with is when this component is unmounted
     * while it has focus. We need to get this FocusWithin and all of its parents state
     * updated since focus will move directly to the body without a blur event.
     */
    componentWillUnmount(): void;
    /**
     * hasFocus returns true if the focus is contained within the focus component
     * hierarchy. This includes portals, the element may or may not
     * be a direct descendant of the focus component in the DOM structure.
     */
    hasFocus(): boolean;
    /**
     * onBlur method that should be attached to the onBlur handler of the
     * continers root element.
     */
    private onBlur;
    /**
     * onFocus method that should be attached to the onFocus handler of the
     * continer's root element.
     */
    private onFocus;
    /**
     * When the focusWithin unmounts we need to determine if we currently have focus.
     * If we do, focus will be moved silently to the body. We need to cleanup the
     * focusWithin's that are affected by this silent change.
     */
    private unmountWithFocus;
}
