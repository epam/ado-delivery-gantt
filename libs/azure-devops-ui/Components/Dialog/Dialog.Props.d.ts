import { IButtonProps } from '../../Button';
import { ICalloutProps } from '../../Callout';
import { IPanelTitleProps } from '../../Panel';
export interface ICustomDialogProps extends Pick<ICalloutProps, "ariaDescribedBy" | "ariaLabel" | "ariaLabelledBy" | "blurDismiss" | "contentJustification" | "contentLocation" | "contentSize" | "escDismiss" | "id" | "lightDismiss" | "modal" | "role"> {
    /**
     * CSS className that should be applied to the top level callout element.
     */
    calloutClassName?: string;
    /**
     * CSS className that should be applied to the callout's content element.
     */
    calloutContentClassName?: string;
    /**
     * An optional className to pass to the root dialog element.
     */
    className?: string;
    /**
     * Element selector of the first focusable element. If no selector is supplied, a hidden
     * element will be created and focus given to the CommandBarFlyout through this element.
     */
    defaultActiveElement?: string | (() => string);
    /**
     * Aria-label for the default focusable element if defaultActiveElement isn't provided.
     */
    defaultFocusableElementAriaLabel?: string;
    /**
     * Method that is called when the dialog is dismissed.
     */
    onDismiss: () => void;
    /**
     * If set, the content of the dialog will be overlaid with a transparent div with a spinner.
     */
    overlay?: {
        spinnerLabel?: string;
        spinnerAriaLabel?: string;
    };
    /**
     * If true, the dialog will have a gripper in the corner that can be used to resize.
     */
    resizable?: boolean;
    /**
     * The dialog will handle keyboard events and when the enter key is pressed the
     * dialog will behave as if the primary key was pressed if the event
     * hasnt had the defaultPrevented.
     */
    enterPrimary?: boolean;
    /**
     * Primary button props.
     */
    primaryButtonProps?: IButtonProps;
    /**
     * If true, while tabbing through dialog elements if ends up on input element than text
     * will be selected automatically. This is a default input behavior.
     */
    selectInputTextOnFocus?: boolean;
}
export interface IDialogProps extends ICustomDialogProps {
    /**
     * An optional list of props to render as buttons in the footer.
     */
    footerButtonProps?: IButtonProps[];
    /**
     * Properties to configure how the dialog title looks.
     */
    titleProps: IPanelTitleProps;
    /**
     * Shows a close button in the top right corner of the dialog. Using a cancel button in
     * the footer or lightDismiss are preferred over this.
     */
    showCloseButton?: boolean;
}
export declare type ICornerDialogProps = Pick<IDialogProps, Exclude<keyof IDialogProps, "contentJustification" | "contentLocation" | "escDismiss" | "lightDismiss" | "modal" | "showCloseButton">>;
