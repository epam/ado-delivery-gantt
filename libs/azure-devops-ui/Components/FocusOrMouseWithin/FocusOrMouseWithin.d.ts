import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import { IFocusWithin } from '../../FocusWithin';
import { IFocusOrMouseWithinProps } from "./FocusOrMouseWithin.Props";
import { IMouseWithin } from '../../MouseWithin';
export declare class FocusOrMouseWithin extends React.Component<IFocusOrMouseWithinProps> implements IFocusWithin, IMouseWithin {
    private mouseWithinRef;
    private focusWithinRef;
    render(): JSX.Element;
    hasFocus: () => boolean;
    hasMouse: () => boolean;
}
