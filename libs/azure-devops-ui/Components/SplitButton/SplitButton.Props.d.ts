/// <reference types="react" />
import { Expandable } from '../../Expandable';
import { Button, IButtonProps } from '../../Button';
import { IMenuButtonProps } from '../../Menu';
export interface ISplitButtonProps {
    /**
     * Props to pass to the main button of the split button.
     *
     * Primary, Disabled, and Subtle props are overriden by Split button props
     */
    buttonProps: IButtonProps;
    /**
     *  Ref of the main button
     */
    buttonRef?: string | ((instance: Button | null) => void) | React.RefObject<Button>;
    /**
     * Css class(es) to be added to the split button
     */
    className?: string;
    /**
     * Set to true if both buttons should be disabled.
     */
    disabled?: boolean;
    /**
     * Ref of the expandable object
     */
    expandableRef?: React.RefObject<Expandable>;
    /**
     * Props to pass to the dropdown button of the split button.
     *
     * Primary, Disabled, and Subtle props are overriden by Split button props
     */
    menuButtonProps: IMenuButtonProps;
    /**
     *
     */
    renderCallout?: () => JSX.Element;
    /**
     * Set to true if both buttons should be styled with the primary style.
     */
    primary?: boolean;
    /**
     * Set to true if both buttons should be styled with the subtle style.
     */
    subtle?: boolean;
}
