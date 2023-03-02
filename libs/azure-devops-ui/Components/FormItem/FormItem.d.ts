import "../../CommonImports";
import "../../Core/core.css";
import "./FormItem.css";
import * as React from "react";
import { IFormItemContext, IFormItemProps } from "./FormItem.Props";
export declare const FormItemContext: React.Context<IFormItemContext>;
export declare class FormItem extends React.Component<IFormItemProps> {
    private id;
    render(): JSX.Element;
}
