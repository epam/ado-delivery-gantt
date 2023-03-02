import { ITextFieldProps } from "../TextField/TextField.Props";
import { IReadonlyObservableValue } from '../../Core/Observable';
export interface ITypeAheadProps extends ITextFieldProps {
    /**
     * Handles AutoComplete input (tab)
     */
    onAutoComplete?: (suggestedValue: string) => void;
    /**
     * Suggested value to display and tab-complete
     */
    suggestedValue?: IReadonlyObservableValue<string> | string;
}
