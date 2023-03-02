import { IIconProps } from '../../Icon';
import { IButtonProps } from '../../Button';
/**
 * Used to regulate the MessageBar's background color and default icon
 */
export declare enum MessageCardSeverity {
    Info = "Info",
    Warning = "Warning",
    Error = "Error"
}
export interface IMessageCardProps {
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
     * Optional class name to emit onto the internal message bar
     */
    messageBarClassName?: string;
    /**
     * Optional handler for any dismissal of the button
     */
    onDismiss?: () => void;
    /**
     * Severity for the MessageBar - regulates color and default icon
     * @default Info
     */
    severity?: MessageCardSeverity;
}
