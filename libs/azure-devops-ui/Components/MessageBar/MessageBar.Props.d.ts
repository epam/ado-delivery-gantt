import { IButtonProps } from '../../Button';
import { IIconProps } from '../../Icon';
/**
 * Used to regulate the MessageBar's background color and default icon
 */
export declare enum MessageBarSeverity {
    Info = "Info",
    Warning = "Warning",
    Error = "Error",
    Success = "Success"
}
export interface IMessageBarProps {
    /**
     * Optional props for custom buttons
     */
    buttonProps?: IButtonProps[];
    /**
     * Optional custom class name
     */
    className?: string;
    /**
     * Optional override icon props
     * Default value depends on @see severity
     */
    iconProps?: IIconProps;
    /**
     * Optional class name for the message container
     */
    messageClassName?: string;
    /**
     * Optional handler for any dismissal of the button
     */
    onDismiss?: () => void;
    /**
     * Severity for the MessageBar - regulates color and default icon
     * @default Info
     */
    severity?: MessageBarSeverity;
}
