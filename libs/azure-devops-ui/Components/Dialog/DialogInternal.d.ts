import "../../CommonImports";
import "../../Core/core.css";
import "./Dialog.css";
import * as React from "react";
import { IDialogProps } from './Dialog.Props';
export declare class DialogInternal extends React.Component<IDialogProps> {
    static defaultProps: {
        showCloseButton: boolean;
    };
    private dialogId;
    render(): JSX.Element;
}
