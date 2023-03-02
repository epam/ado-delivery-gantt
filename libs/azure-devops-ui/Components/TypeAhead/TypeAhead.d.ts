import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import { ITypeAheadProps } from "./TypeAhead.Props";
import { ITextField } from "../TextField/TextField.Props";
export declare class TypeAhead extends React.Component<ITypeAheadProps> implements ITextField {
    private textFieldRef;
    private autofillEnabled;
    private subscribeAll;
    private unsubscribeAll;
    componentDidMount(): void;
    componentWillUnmount(): void;
    UNSAFE_componentWillReceiveProps(newProps: ITypeAheadProps): void;
    focus(): void;
    readonly select: () => void;
    get selectionEnd(): number | null;
    get selectionStart(): number | null;
    setSelectionRange(start: number, end: number, direction?: "forward" | "backward" | "none" | undefined): void;
    render(): JSX.Element;
    componentDidUpdate(): void;
    private onKeyDown;
}
