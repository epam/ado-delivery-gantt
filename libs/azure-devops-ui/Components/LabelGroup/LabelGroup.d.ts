import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import { ILabelGroupProps } from "./LabelGroup.Props";
export declare class LabelGroup extends React.Component<ILabelGroupProps> {
    private contentSelectionMap;
    private labelReferences;
    constructor(props: ILabelGroupProps);
    focusLabel(index: number): void;
    render(): JSX.Element;
    private buildContentSelectionMap;
    private onLabelMouseDown;
    private onLabelsChanged;
    private onSelectedKeysChanged;
    private updateKeySelectionMap;
}
