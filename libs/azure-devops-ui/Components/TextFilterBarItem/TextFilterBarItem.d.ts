/// <reference types="react" />
import "../../CommonImports";
import "../../Core/core.css";
import { FilterBarItem, IFilterBarItemState } from '../../FilterBarItem';
import { ITextFieldProps } from '../../TextField';
import { ITextFilterBarProps } from "./TextFilterBarItem.Props";
export interface ITextFilterBarItemState extends IFilterBarItemState<string> {
}
export declare class TextFilterBarItem extends FilterBarItem<string, ITextFilterBarProps, ITextFilterBarItemState> {
    protected static defaultProps: {
        isTextItem: boolean;
    };
    private textField;
    focus(): void;
    render(): JSX.Element;
    protected overflowDetected(anchorElement: HTMLInputElement): boolean;
    protected getExtraTextFieldProps(): Partial<ITextFieldProps> | null;
    protected getThrottleWait(): number;
    private onClickClearButton;
    private onTextChanged;
    private onKeyDown;
}
