import "../../CommonImports";
import "../../Core/core.css";
import "./Toggle.css";
import * as React from "react";
import { IFocusable } from '../../Utilities/Focus';
import { IToggleProps } from "./Toggle.Props";
export declare class Toggle extends React.Component<IToggleProps> implements IFocusable<{}> {
    static contextType: React.Context<import("../FocusGroup/FocusGroup.Props").IFocusGroupContext>;
    private toggleElement;
    private labelId;
    render(): JSX.Element;
    focus(): void;
    private onClick;
    private onFocus;
    private onKeyDown;
}
