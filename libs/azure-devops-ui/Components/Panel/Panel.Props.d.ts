/// <reference types="react" />
import { IButtonProps } from '../../Button';
import { ContentSize } from '../../Callout';
import { TitleSize } from '../../Header';
import { IIconProps } from '../../Icon';
import { IPortalProps } from '../../Portal';
export interface IPanel {
    animateOut(): Promise<void>;
}
export declare enum PanelCloseButtonSize {
    small = 0,
    large = 1
}
export interface IPanelProps extends ICustomPanelProps {
    /**
     * If these props are provided, the panel's header will draw a back button before the panel
     * header's title. By default this will use a subtle button with the "Back" icon,
     * but these props can override those choices.
     */
    backButtonProps?: IButtonProps;
    /**
     * Optional, description of panel.
     */
    description?: string;
    /**
     * An optional list of props to render as Buttons in the footer.
     */
    footerButtonProps?: IButtonProps[];
    /**
     * Content to render while the panel is in a loading / working state.
     * Should typically be called with a <Spinner />:
     * overlayContent={<Spinner label="Run starting..." />}
     *
     * When this prop is defined, lightDismiss will be forced to false.
     */
    overlayContent?: React.ReactNode;
    /**
     * If the panel should show a separator between the header and the content
     * @default false
     */
    showSeparator?: boolean;
    /**
     * The panel title you want to display.
     */
    titleProps?: IPanelTitleProps;
}
export interface ICustomPanelProps {
    /**
     * Label used to describe the contents of the panel for aria enabled devices.
     */
    ariaLabel?: string;
    /**
     * Id of the element used to describe the contents of the panel for aria enabled devices.
     */
    ariaLabelledBy?: string;
    /**
     * This will dismiss the panel once it gets and then loses focus. Panels should
     * dismiss when they lose focus unless they are intended to be modeless UI.
     *
     * @default false
     */
    blurDismiss?: boolean;
    /**
     * css classname that shold be applied to the callout's root element.
     */
    calloutClassName?: string;
    /**
     * An optional className to pass to the root Panel element
     */
    className?: string;
    /**
     * CSS className that should be applied to the callout's content element.
     */
    contentClassName?: string;
    /**
     * Element selector of the first focusable element. If no selector is supplied a hidden
     * element will be created and focus given to the CommandBarFlyout through this element.
     */
    defaultActiveElement?: string | (() => string);
    /**
     * The panel will handle keyboard events and when the escape key is pressed the
     * panel will close if the the event hasnt had the defaultPrevented.
     *
     * @default true
     */
    escDismiss?: boolean;
    /**
     * DOM element id.
     */
    id?: string;
    /**
     * The panel element will trap mouse events and dismiss the panel when a click
     * occurs. This will prevent the events from being handled by the underlying
     * elements outside the panel's contents.
     *
     * @default true
     */
    lightDismiss?: boolean;
    /**
     * The panel element will be given a class that is a semi-transparency that helps
     * the user understand the user should focus on the panel and dismiss it before
     * interacting with the underlying document.
     *
     * @default true
     */
    modal?: boolean;
    /**
     * The delegate to handle dismissing the panel. This will be called when the user clicks the close button on the panel.
     */
    onDismiss: () => void;
    /**
     * The portalProps allow the caller to control how the Callout's portal are
     * configured. The default will create the portal as a full screen element
     * rooted in the body.
     */
    portalProps?: IPortalProps;
    /**
     * Size of the panel.
     * @default ContentSize.Medium
     */
    size?: ContentSize;
}
export interface IPanelHeaderProps {
    /**
     * If these props are provided, the panel's header will draw a back button before the panel
     * header's title. By default this will use a subtle button with the "Back" icon,
     * but these props can override those choices.
     */
    backButtonProps?: IButtonProps;
    /**
     * An optional className to pass to the Panel Header element
     */
    className?: string;
    /**
     * Size of the 'X' close button.
     * @default PanelCloseButtonSize.large
     */
    closeButtonSize?: PanelCloseButtonSize;
    /**
     * Optional, description of panel.
     */
    description?: React.ReactNode;
    /**
     * The delegate to handle dismissing the panel. This will be called when the user clicks the close button on the panel.
     */
    onDismiss: () => void;
    /**
     * If the header should show a close button.
     * @default: true
     */
    showCloseButton?: boolean;
    /**
     * If the panel should show a separator between the header and the content
     * @default false
     */
    showSeparator?: boolean;
    /**
     * The panel title you want to display.
     */
    titleProps?: IPanelTitleProps;
}
export interface IPanelOverlayProps {
    /**
     * Content to render while the panel is in a loading / working state.
     * Should typically be called with a <Spinner />:
     * overlayContent={<Spinner label="Run starting..." />}
     */
    overlayContent?: React.ReactNode;
}
export interface IPanelTitleProps {
    /**
     * An optional className to pass to the title
     */
    className?: string;
    /**
     * Optional icon props to pass to the title
     */
    iconProps?: IIconProps;
    /**
     * An optional id used for the title's text. Should only be used if there is a custom element
     * to use as the label for the panel.
     */
    id?: string;
    /**
     * Optional size to render the panel's title
     */
    size?: TitleSize;
    /**
     * Optional title to display for the panel
     */
    text?: string;
}
export interface IPanelCloseButtonProps {
    /**
     * An optional className to pass to the Panel's close button element
     */
    className?: string;
    /**
     * The delegate to handle dismissing the panel. This will be called when the user clicks the close button on the panel.
     */
    onDismiss: () => void;
    /**
     * Optional size to render the panel close button.
     * @default PanelCloseButtonSize.large
     */
    size?: PanelCloseButtonSize;
}
export interface IPanelContentProps {
    /**
     * An optional className to pass to the Panel's content element
     */
    className?: string;
}
export interface IPanelFooterProps {
    /**
     * An optional className to pass to the Panel's footer element
     */
    className?: string;
    /**
     * If the panel should show a separator between the content and the footer
     * @default false
     */
    showSeparator?: boolean;
    /**
     * An optional list of props to render as Buttons in the footer.
     */
    buttonProps?: IButtonProps[];
}
