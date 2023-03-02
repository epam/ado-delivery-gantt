import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import { IFocusZoneContext, IFocusZoneProps } from "./FocusZone.Props";
export interface IFocusZoneState {
    focuszoneId: string;
}
export declare const FocusZoneContext: React.Context<IFocusZoneContext>;
export declare class FocusZone extends React.Component<IFocusZoneProps, IFocusZoneState> {
    private lastFocusElement;
    private rootElements;
    constructor(props: Readonly<IFocusZoneProps>);
    render(): JSX.Element;
    componentDidMount(): void;
    private focusNextElement;
    private getFocusElements;
    /**
     * isFocusElement is used to determine whether or not an element should participate
     * in this focus zone.
     *
     * @param element HTML Element that you are testing as a valid focus element.
     *
     * @param customSelector A custom selector that is used to match elements with
     *  negative tabIndex. These wont match normally unless targetted by the custom
     *  selector.
     */
    private isFocusElement;
}
