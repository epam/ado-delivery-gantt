import "../../CommonImports";
import "../../Core/core.css";
import "./RadioButton.css";
import * as React from "react";
import { IFocusable } from '../../Utilities/Focus';
import { IRadioButtonGroup, IRadioButtonGroupProps, IRadioButtonProps } from "./RadioButton.Props";
export interface IRadioButtonGroupContext {
    onSelect: (buttonId: string) => void;
    registerId: (safeId: string, id: string) => void;
    selectedButtonId?: string;
}
export declare const RadioButtonGroupContext: React.Context<IRadioButtonGroupContext>;
export declare class RadioButtonGroup extends React.Component<IRadioButtonGroupProps> implements IRadioButtonGroup, IFocusable<{}> {
    static defaultProps: IRadioButtonGroupProps;
    private focusGroupContext;
    private idMap;
    render(): JSX.Element;
    focus(): void;
    private onChange;
    private getFirstButtonId;
    private postProcessKeystroke;
    private registerId;
}
export declare class RadioButton extends React.Component<IRadioButtonProps> implements IFocusable<{}> {
    private radioButtonInternal;
    render(): JSX.Element;
    focus(): void;
}
