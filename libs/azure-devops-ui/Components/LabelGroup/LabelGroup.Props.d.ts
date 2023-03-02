/// <reference types="react" />
import { ILabelModel } from "../Label/Label.Props";
import { IColor } from '../../Utilities/Color';
import { IReadonlyObservableArray } from '../../Core/Observable';
export declare enum WrappingBehavior {
    freeFlow = 0,
    oneLine = 1
}
export interface ILabelGroupProps {
    /**
     * Optional className to emit on the root element
     */
    className?: string;
    /**
     * The default child of the group
     * @default label-0
     */
    defaultFocusElementId?: string;
    /**
     * Optional flag to disable mouse focus on labels, eg. clicking on them won't move focus to them
     * Keyboard focus will still work
     * Defaults to true for non-editable groups; false for editable groups
     */
    disableMouseFocusOnLabels?: boolean;
    /**
     * Optional flag to enable hover styles on labels in this group
     * Defaults to false for non-editable groups; true for editable groups
     */
    enableHoverStyles?: boolean;
    /**
     * Should we fade out the rightmost edge of the control for overflow purposes?
     * Will render the fade-out if the control overflows or not
     * No effect on FreeFlow groups; OneLine only
     * @default false
     */
    fadeOutOverflow?: boolean;
    /**
     * Optional id for the span that will contain the actual labels
     */
    id?: string;
    /**
     * Labels to render within the group
     */
    labelProps: ILabelModel[] | IReadonlyObservableArray<ILabelModel>;
    /**
     * onClick for an arbitrary label, passes back the Key and the label's position in the group
     */
    onLabelClick?: (event: React.MouseEvent<HTMLDivElement>, labelModel: ILabelModel, index: number) => void;
    /**
     * onKeyDown for an arbitrary label, passes back the Key and the label's position in the group
     */
    onLabelKeyDown?: (event: React.KeyboardEvent<HTMLDivElement>, labelModel: ILabelModel, index: number) => void;
    /**
     * onMouseDown for an arbitrary label
     */
    onLabelMouseDown?: (event: React.MouseEvent<HTMLDivElement>, labelModel: ILabelModel, index: number) => void;
    /**
     * Optional observable array that can be used to control what labels are Selected within the control
     */
    selectedLabelContents?: string[] | IReadonlyObservableArray<string>;
    /**
     * Optional title to render
     */
    title?: string;
    /**
     * Describes how to wrap the content
     * @default OneLine
     */
    wrappingBehavior?: WrappingBehavior;
}
export interface IEditableLabelGroupProps extends ILabelGroupProps {
    /**
     * Optional button text
     * @default "Add label"
     */
    addButtonText?: string;
    /**
     * Optional custom colors; default palatte will be used if none provided
     */
    customColors?: IColor[];
    /**
     * Optional flag to disable color picker for new labels
     */
    disableColorPicker?: boolean;
    /**
     * Optional: Text to be shown when user attempts to add a duplicate label
     */
    duplicateLabelText?: string;
    /**
     * Autocomplete and autosuggest retrieval function
     * Optional; will only render color swatch picker
     * if no suggestions are provided, none will be displayed
     */
    getSuggestedLabels?: (inputContent: string) => ILabelModel[] | PromiseLike<ILabelModel[]>;
    /**
     * Custom handler for blur events
     */
    onBlur?: () => void;
    /**
     * Handler for when labels are to be removed from the group
     * Group will not update the observableArray itself; you may specify your own deletion lifecycle
     */
    onLabelRemove?: (labelModel: ILabelModel) => void;
    /**
     * Handler for created labels
     * Group will not update the observableArray itself; you may specify your own creation lifecycle
     */
    onLabelSubmit?: (labelModel: ILabelModel) => void;
    /**
     * Overrides some internal padding that allows the control to reserve as much space as it needs
     * Setting this will cause the control to change size as it enters / exits Edit mode
     * @default false
     */
    shrinkToContents?: boolean;
    /**
     * Override the default zero-data experience with a blank one
     * @default false
     */
    useBlankZeroData?: boolean;
    /**
     * Optional placeholder text to be shown inside autocomplete control
     * @default "Type a label to add"
     */
    watermark?: string;
}
