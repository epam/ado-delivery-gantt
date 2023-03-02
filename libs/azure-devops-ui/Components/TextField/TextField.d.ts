import "../../CommonImports";
import "../../Core/core.css";
import "./TextField.css";
import * as React from "react";
import { ITextField, ITextFieldProps } from "./TextField.Props";
export declare class TextField extends React.Component<ITextFieldProps> implements ITextField {
    private inputId;
    inputElement: React.RefObject<HTMLInputElement & HTMLTextAreaElement>;
    constructor(props: ITextFieldProps);
    focus(): void;
    readonly select: () => void;
    get selectionEnd(): number | null;
    get selectionStart(): number | null;
    setSelectionRange(start: number, end: number, direction?: "forward" | "backward" | "none" | undefined): void;
    render(): JSX.Element;
}
