/// <reference types="react" />
import { IFocusZoneProps } from '../../FocusZone';
import { IPortalProps } from '../../Portal';
import { IOffset, IOrigin, IPoint } from '../../Utilities/Position';
export declare enum ContentJustification {
    Start = 0,
    Center = 1,
    End = 2,
    Stretch = 3
}
export declare enum ContentLocation {
    Start = 0,
    Center = 1,
    End = 2
}
export declare enum ContentOrientation {
    Column = 0,
    Row = 1
}
export declare enum ContentSize {
    Small = 0,
    Medium = 1,
    Large = 2,
    Auto = 3,
    ExtraLarge = 4
}
/**
 * ICallout represents the public API that is exposed by the Callout component.
 * If a ref is requested, the ICallout interface should be used.
 */
export interface ICallout {
    /**
     * updateLayout can be called to force the callout to recompute its position
     * and location if it is using a relative layout. This means that contentLocation
     * was not specified, and instead an element or point was used to position it.
     */
    updateLayout: () => void;
}
/**
 * ICalloutProps is used to define a component that is detached from the DOM tree
 * the component is created within. It uses a React.Portal to ensure that messages
 * still flow through the component hierarchy.
 *
 * The properties of the callout are designed to position the element in the page
 * since the element in the DOM is not relative to the element we want it to still
 * propagate events through the React Component tree.
 *
 * The callout has two distinct layout modes:
 *  1) Absolute or Element relative position - For this you used anchorElement or
 *      anchorPoint for the basis of the callout.
 *
 *  2) Window relative position - For this you use callout content properties, like
 *      contentJustification, contentLocation, contentOrientation, and contentSize.
 *
 *      You dont need to supply them all, for example if you want to it auto size
 *      just dont pass a contentSize and it will take on the size of the layout.
 */
export interface ICalloutProps {
    /**
     * If the callout is being positioned relative to an existing element in the DOM
     * the relative element should be supplied as the anchorElement.
     * (anchorOrigin should be supplied with anchorElement)
     */
    anchorElement?: HTMLElement;
    /**
     * anchorOffset is used to shift the location of the callout from the defined
     * location by a fixed amount. An example might be the tooltip callout defaults
     * to an anchorOffset of { x: 8 y: 8 } from the mouse position.
     */
    anchorOffset?: IOffset;
    /**
     * When an anchorElement is supplied the anchorOrigin is used to describe the
     * relative location of the callout with respect to the anchorElement. A common
     * example here is a dropdown button aligns the callout to the bottom-right of
     * the button.
     */
    anchorOrigin?: IOrigin;
    /**
     * Instead of using an anchorElement to position the callout, if can be positioned
     * based on a fixed location. The anchorPoint defines the fixed position for the
     * anchor.
     */
    anchorPoint?: IPoint;
    /**
     * Id of another element which describes this one for screen reader users.
     */
    ariaDescribedBy?: string;
    /**
     * ariaLabel allows the root element to describe the elements contents to assistive
     * technology.
     */
    ariaLabel?: string;
    /**
     * Id of another element which labels this one for screen reader users.
     * Defaults to this checkbox's label element.
     */
    ariaLabelledBy?: string;
    /**
     * This will dismiss the callout once it gets and then loses focus. Callouts should
     * dismiss when they lose focus unless they are intended to be modeless UI.
     *
     * @default false
     */
    blurDismiss?: boolean;
    /**
     * calloutOrigin works in conjunction with the other position styles;
     * anchorElement, anchorOffset, anchorOrigin, anchorPoint. After determining the
     * location based on the anchor properties the position of the callout is applied.
     *
     * Example: Again the DropDownButton uses anchorOrigin -> Bottom, right with no offset.
     * This means the anchorPoint will be the bottom right of the button. The calloutOrigin
     * is defined as top, right. This will position the top, right corner of the callout
     * on the bottom right of the button.
     */
    calloutOrigin?: IOrigin;
    /**
     * Optional CSS className to apply to the callout element.
     */
    className?: string;
    /**
     * Optional CSS className to apply to the content element of the callout.
     */
    contentClassName?: string;
    /**
     * Optional ref to be passed to the top level callout element.
     */
    contentRef?: React.RefObject<HTMLDivElement>;
    /**
     * Justification of the callout content within the callout. This defaults to auto
     * layout and will take on the content size. This ONLY applies to window relative
     * layouts, use contentLocation to use this.
     */
    contentJustification?: ContentJustification;
    /**
     * This needs to be supplied for a window relative layout. Otherwise the anchorElement
     * is used as the location basis.
     */
    contentLocation?: ContentLocation;
    /**
     * Orientation of the callout, is this a column or a row. This ONLY applies to window relative
     * layouts, use contentLocation to use this.
     */
    contentOrientation?: ContentOrientation;
    /**
     * Should the callout have the standard callout shadow.
     */
    contentShadow?: boolean;
    /**
     * If supplied there are a set of well-known fixed size callout's designed to keep
     * things like panels and other types of information using a consistent layout.
     * This ONLY applies to window relative layouts, use contentLocation to use this.
     * This should be supplied when you are following a standard UI model size.
     */
    contentSize?: ContentSize;
    /**
     * The callout will handle keyboard events and when the escape key is pressed the
     * callout will close if the the event hasnt had the defaultPrevented.
     */
    escDismiss?: boolean;
    /**
     * fixedLayout is used to determine whether or not the callout should be moved
     * based on visibility. if fixedLayout is set to true the callout wont be moved.
     */
    fixedLayout?: boolean;
    /**
     * focuszoneProps allows the caller to manage the how the elements in the callout
     * content are rendered.
     */
    focuszoneProps?: IFocusZoneProps | null;
    /**
     * Optional height to use for a custom size.
     */
    height?: number;
    /**
     * If the id supplied, this id will be added to the callout element as the DOM
     * id attribute.
     */
    id?: string;
    /**
     * The callout element will trap mouse events and dismiss the callout when a click
     * occurs. This will prevent the events from being handled by the underlying
     * elements outside the callout's contents.
     */
    lightDismiss?: boolean;
    /**
     * The callout element will be given a class that is a semi-transparency that helps
     * the user understand the user should focus on the callout and dismiss it before
     * interacting with the underlying document.
     */
    modal?: boolean;
    /**
     * Callback for when an animation on the Callout element ends.
     * Useful when the callout hide/show is animated and the caller wants to know when it completes.
     */
    onAnimationEnd?: (event: React.AnimationEvent<HTMLDivElement>) => void;
    /**
     * Method that is called when the callout is dismissed.
     */
    onDismiss?: () => void;
    /**
     * Callback for when the mouse enters the callout.
     */
    onMouseEnter?: (event: React.MouseEvent<HTMLElement>) => void;
    /**
     * Callback for when the mouse leaves the callout.
     */
    onMouseLeave?: (event: React.MouseEvent<HTMLElement>) => void;
    /**
     * Callback for when a key is pressed down.
     */
    onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;
    /**
     * The portalProps allow the caller to control how the Callout's portal are
     * configured. The default will create the portal as a full screen element
     * rooted in the body.
     */
    portalProps?: IPortalProps;
    /**
     * role is used to define the assistive usage of this callout. The default is
     * "dialog", but can be overriden with this property.
     */
    role?: string;
    /**
     * If updateLayout is set to true, the component is re-laid out each time new props
     * are passed in. If not the callout's layout is not updated.
     *
     * @default false
     */
    updateLayout?: boolean;
    /**
     * This will dismiss the callout if viewport changes such as a scroll or a resize
     * @default true
     */
    viewportChangeDismiss?: boolean;
    /**
     * Optional width to use for a custom size.
     */
    width?: number;
}
