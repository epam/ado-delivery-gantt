/// <reference types="react" />
import { IReadonlyObservableValue } from '../../Core/Observable';
import { IColor } from '../../Utilities/Color';
import { ILabelModel } from "../Label/Label.Props";
export interface ISuggestionsProps {
    /**
     * Observable for the current selected color
     */
    currentSelectedColorIndex: number | IReadonlyObservableValue<number>;
    /**
     * The currently selected index
     */
    currentSelectedIndex: number;
    /**
     * Display the color picker or the "New Label" row?
     * @default false
     */
    disableColorPicker?: boolean;
    /**
     * Is the current search text already in the parent group?
     */
    isCurrentInputAlreadyInGroup: boolean;
    /**
     * Are we currently loading items?
     */
    isLoading: boolean;
    /**
     * Optional: Text to be displayed when suggestion is already in group
     * @default "This label is already included"
     */
    inputAlreadyInGroupText?: string;
    /**
     * Optional handler that will be called when the component updates
     * Used to check for duplicates in the parent
     * Leave undefined if you want to be able to add duplicates
     */
    onCheckForExactMatch?: (suggestions: ILabelModel[]) => boolean;
    /**
     * Optional event handler for when a color pip is clicked, enhanced with relevant data
     */
    onColorPipClick?: (event: React.MouseEvent<HTMLDivElement>, color: IColor, index: number) => void;
    /**
     * Optional event handler for when the New Label row is clicked; only used in colorless mode
     * Color picker will display when New Label row is hovered by default, so this isn't necessary unless it's disabled
     */
    onNewLabelClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
    /**
     * Optional event handler for when a suggestion in the list is clicked
     */
    onSuggestionClick?: (event: React.MouseEvent<HTMLDivElement>, labelModel: ILabelModel) => void;
    /**
     * Currently suggested Labels
     */
    suggestedItems: ILabelModel[];
    /**
     * Color picker colors
     * @default []
     */
    swatchPickerColors?: IColor[];
}
