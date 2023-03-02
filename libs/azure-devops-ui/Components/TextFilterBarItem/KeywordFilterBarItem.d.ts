/// <reference types="react" />
import "../../CommonImports";
import "../../Core/core.css";
import { ITextFieldProps } from '../../TextField';
import { TextFilterBarItem } from "./TextFilterBarItem";
import { IInlineKeywordFilterBarItemProps } from "./TextFilterBarItem.Props";
export declare class KeywordFilterBarItem extends TextFilterBarItem {
    protected getExtraTextFieldProps(): Partial<ITextFieldProps>;
}
export declare const InlineKeywordFilterBarItem: (props: IInlineKeywordFilterBarItemProps) => JSX.Element;
