import * as React from "react";
import { IReadonlyObservableValue } from '../../Core/Observable';
import { IIconProps } from '../../Icon';
import { ITooltipProps } from '../../TooltipEx';
/**
 * Defines how the TextField is styled
 */
export declare enum TextFieldStyle {
    /**
     * Rendered closer to a typical <input />
     */
    normal = 0,
    /**
     * Rendered with no border and a non-white background
     */
    inline = 1
}
/**
 * Defines how the focus treatment should be rendered for the TextField.
 */
export declare enum TextFieldFocusTreatmentBehavior {
    /**
     * Focus treatment will appear when the TextField has focus via mouse or keyboard
     */
    all = 0,
    /**
     * Focus treatment will only appear when the TextField has focus via keyboard
     */
    keyboardOnly = 1,
    /**
     * Focus treatment will never appear (used within FilterBar)
     */
    none = 2
}
export declare enum TextFieldWidth {
    /**
     * No width property is added to the TextField, it will grow to fill its container.
     */
    auto = "auto",
    /**
     * A standard width of 296px is set for the TextField
     */
    standard = "bolt-textfield-default-width",
    /**
     * Width for the TextField when it is used inline within a TabBar
     */
    tabBar = "bolt-textfield-inline-tabbar-width"
}
export interface ITextField {
    /**
     * Gets the end position or offset of a text selection.
     */
    readonly selectionEnd: number | null;
    /**
     * Gets the starting position or offset of a text selection.
     */
    readonly selectionStart: number | null;
    /**
     * Sets focus on the TextField if it's currently mounted
     */
    focus(): void;
    /**
     * Selects content in the text field.
     */
    select(): void;
    /**
     * Sets the currently selected values in the TextField if it's currently mounted
     */
    setSelectionRange(start: number, end: number, direction?: "forward" | "backward" | "none" | undefined): void;
}
export interface ITextFieldProps {
    /**
     * Whether or not the input can be activated. Text will not be selectable and a cursor: pointer
     * will be used.
     * @default false
     */
    activatable?: boolean;
    /**
     * aria-activedescendant on the input/textfield
     */
    ariaActiveDescendant?: string;
    /**
     * aria-autocomplete on the input/textfield
     */
    ariaAutoComplete?: "none" | "list" | "inline" | "both";
    /**
     * aria-controls on the input/textfield
     */
    ariaControls?: string;
    /**
     * aria-describedby on the input/textfield
     */
    ariaDescribedBy?: string;
    /**
     * aria-expanded on the input/textfield
     */
    ariaExpanded?: boolean;
    /**
     * aria-hasPopup on the input/textfield
     */
    ariaHasPopup?: boolean | "menu" | "listbox" | "tree" | "grid" | "dialog";
    /**
     * aria-invalid on the input/textfield
     */
    ariaInvalid?: boolean;
    /**
     * aria-label on the input/textfield
     */
    ariaLabel?: string;
    /**
     * aria-labelledby on the input/textfield
     */
    ariaLabelledBy?: string;
    /**
     * aria-roledescription on the input/textfield
     */
    ariaRoleDescription?: string;
    /**
     * Adjust the textfield height as the contents change.
     * @default false.
     */
    autoAdjustHeight?: boolean;
    /**
     * Should the input tag have autocomplete enabled. Ignored if multiline is set to true.
     * @default false.
     */
    autoComplete?: boolean;
    /**
     * autoFocus on the input/textfield
     */
    autoFocus?: boolean;
    /**
     * Supply autoSelect to select all the text in the input when the textfield gets
     * focus. This is useful if you want the user to copy the text, or replace the text
     * upon typing instead of changing the current value.
     */
    autoSelect?: boolean;
    /**
     * Classname passed to the TextField.
     */
    className?: string;
    /**
     * ClassName to pass to the element containing the TextField and description.
     */
    containerClassName?: string;
    /**
     * Indicates that the element is disabled - influences styling,
     * aria-disabled, and disabled on the input/textarea
     */
    disabled?: boolean;
    /**
     * Set to true if you don't want focus managed by a FocusZone.
     */
    excludeFocusZone?: boolean;
    /**
     * Set to true if you don't want the textfield to be tabbable.
     */
    excludeTabStop?: boolean;
    /**
     * Indicates how we should apply the focus treatment to the
     * TextField. Default is to show the focus treatment when focused via keyboard or mouse.
     * TextFields that do not wish to have focus treatment (e.g. in the filter bar) should use "none"
     *
     * @default TextFieldFocusTreatmentBehavior.all
     */
    focusTreatment?: TextFieldFocusTreatmentBehavior;
    /**
     * Classname passed to the input/textarea element
     */
    inputClassName?: string;
    /**
     * Optional ref to get passed to the input element
     */
    inputElement?: React.RefObject<HTMLTextAreaElement & HTMLInputElement>;
    /**
     * id to pass to the input element.
     */
    inputId?: string;
    /**
     * type that is passed to the <input> element, e.g. password, number, etc.
     * See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types for a full list
     *
     * @default text
     */
    inputType?: "password" | "text" | "button" | "number";
    /**
     * Label to be rendered before the TextField. Will be wrapped in a
     * <label> element and wired up with the appropriate aria attributes.
     */
    label?: React.ReactNode;
    /**
     * maxLength on the input/textarea
     */
    maxLength?: number;
    /**
     * The maximum width in px that the textfield will grow to.
     */
    maxWidth?: number;
    /**
     * If true, uses a textarea instead of an input element
     */
    multiline?: boolean;
    /**
     * placeholder on the input/textarea
     */
    placeholder?: string;
    /**
     * Props for the icon to be rendered before the input/textarea
     */
    prefixIconProps?: IIconProps;
    /**
     * Optional, if the TextField should be read only
     * @default false
     */
    readOnly?: boolean;
    /**
     * If the TextField is required before submitting data to a form.
     * @default false
     */
    required?: boolean;
    /**
     * If the text area should be resizable. Only used if multiline is true.
     * @default true if the TextField is multiline.
     */
    resizable?: boolean;
    /**
     * Optional role to use in the TextField
     */
    role?: string;
    /**
     * Optional number of rows the text area should have. Only used if multiline is set to true.
     */
    rows?: number;
    /**
     * Optional if the element
     * @default undefined which will default to the browser's default for the input and textarea tags
     */
    spellCheck?: boolean;
    /**
     * Changes visual appearance of TextField. Use TextFieldStyle.inline to style as an inline text field.
     * @default TextFieldStyle.normal
     */
    style?: TextFieldStyle;
    /**
     * Props for the icon to be rendered after the input/textarea
     */
    suffixIconProps?: IIconProps;
    /**
     * Sets the tabindex on the input/textarea element.
     */
    tabIndex?: number;
    /**
     * Text value of the input/textarea. This prop is 100% controlled
     * by the consumer. onChange must also be implemented in order to
     * work properly. If this value is a raw string, the prop must be
     * updated to cause the TextField to re-render. If this value is an
     * ObservableValue, then changing its value will cause the TextField
     * to re-render.
     */
    value?: IReadonlyObservableValue<string | undefined> | string;
    /**
     * Sets the width of the TextField
     * @default auto
     */
    width?: TextFieldWidth;
    /**
     * Called when blur event is fired by the input/textarea
     */
    onBlur?: () => void;
    /**
     * Called when the value of the input/textarea changes.
     */
    onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, value: string) => void;
    /**
     * Called when the element is clicked
     */
    onClick?: (event: React.MouseEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    /**
     * Called when the focus event is fired by the input/textarea
     */
    onFocus?: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    /**
     * Called when the key down event is fired by the input/textarea.
     */
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    /**
     * Called when the key press event is fired by the input/textarea.
     */
    onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    /**
     * Called when the key press event is fired by the input/textarea.
     */
    onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onPaste?: (event: React.ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    /**
     * Optional tooltip to show when the button is hovered.
     */
    tooltipProps?: ITooltipProps;
}
export interface ITextFieldWithMessageProps {
    /**
     * Classname passed to the root element of the component
     */
    className?: string;
    /**
     * An optional message to display with the textfield
     */
    message?: IReadonlyObservableValue<string> | string;
    /**
     * Classname passed to the element containing the message
     */
    messageClassName?: string;
    /**
     * Props provided to the TextField rendered by this component
     */
    textFieldProps: ITextFieldProps;
    /**
     * Whether or not the message is considered an error message - will add
     * appropriate classNames to TextField, message, as well as aria properties.
     */
    error?: IReadonlyObservableValue<boolean> | boolean;
}
