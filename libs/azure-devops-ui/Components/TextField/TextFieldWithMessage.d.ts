import "../../CommonImports";
import "../../Core/core.css";
import "./TextField.css";
import * as React from "react";
import { ITextField, ITextFieldWithMessageProps } from "./TextField.Props";
export declare class TextFieldWithMessage extends React.Component<ITextFieldWithMessageProps> implements ITextField {
    private descriptionId;
    private innerTextField;
    constructor(props: ITextFieldWithMessageProps);
    focus(): void;
    select: () => void;
    get selectionEnd(): number | null;
    get selectionStart(): number | null;
    setSelectionRange: (start: number, length: number) => void;
    render(): JSX.Element;
}
