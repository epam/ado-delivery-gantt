import * as React from "react";
import { KeyCode } from '../../Util';
import { IOffset, IOrigin, IPoint } from '../../Utilities/Position';
export interface IExpandableSharedProps {
    /**
     * If true, the button cannot be interacted with.
     */
    disabled?: boolean;
    /**
     * The key used to expand the components callout.
     *
     * @default KeyCode.DownArrow
     */
    expandKey?: KeyCode | KeyCode[];
    /**
     * Optional callback to call when the dropdown is collapsed.
     */
    onCollapse?: () => void;
    /**
     * Optional callback to call when the dropdown is expanded.
     */
    onExpand?: () => void;
}
export interface IExpandableProps extends IExpandableSharedProps {
    /**
     * renderCallout is called when the component is expanded. This should return
     * the elements needed to render the appropriate callout.
     * If this prop is not passed, then the consumer is responsible for rendering the callout.
     * This is used in cases where the consumer wants to own the callout, so that the same
     * element can be used for mouseEnter/mouseLeave as for the expandable props, but have also
     * have the callout be a child of a MouseWithin.
     */
    renderCallout?: () => JSX.Element;
}
export interface IExpandableContainerProps extends IExpandableSharedProps {
    /**
     * aria-label that can be added to the container
     */
    ariaLabel?: string;
    /**
     * css class that is added to the div that is produced.
     */
    className?: string;
    /**
     * The collapseDelay is used in conjunction with the expandOnHover to determine
     * how long the mouse must be out of the expandable to collapse. This only applies
     * if the expandable was expanded due to hover. The collapseDelay is defined in
     * milliseconds.
     *
     * @default 250
     */
    collapseDelay?: number;
    /**
     * Set to true if you don't want the the focus of the div that is produced to be managed by a FocusZone.
     */
    excludeFocusZone?: boolean;
    /**
     * Set to true if you don't want the div that is produced to be tabbable - a child will need to be tabbable.
     */
    excludeTabStop?: boolean;
    /**
     * Id that is used in the aria-controls attribute. This should line up with
     * the id rendered into the expandable when a callout is rendered.
     */
    expandableId?: string;
    /**
     * The expandDelay is used in conjunction with the expandOnHover to determine
     * how long the mouse must be over the expandable to expand. The expandDelay is
     * defined in milliseconds.
     *
     * @default 250
     */
    expandDelay?: number;
    /**
     * If expandOnHover controls whether or not the expandable element is shown
     * when the mouse hovers over the element.
     *
     * @default false
     */
    expandOnHover?: boolean;
    /**
     * id that will be placed on the expandable id element.
     */
    id?: string;
    /**
     * renderCallout is called when the component is expanded. This should return
     * the elements needed to render the appropriate callout.
     */
    renderCallout: (expandable: IExpandable, id: string, element: HTMLElement) => JSX.Element;
    /**
     * Optional aria role.
     */
    role?: string;
    /**
     * Sets the tabindex on the callout element.
     */
    tabIndex?: number;
}
/**
 * An IExpandable component supports an expande and collapsed state.
 */
export interface IExpandable {
    /**
     * Collapsing the component will remove any callout's that are rendered when the
     * component is expanded.
     */
    collapse: () => void;
    /**
     * Expanding the component will render any callout's assocaited with the expandable
     * component.
     */
    expand: () => void;
}
export interface IExpandableChildProps {
    expanded: boolean;
    onClick: (event: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void;
    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
    onMouseDown: (event: React.MouseEvent<HTMLElement>) => void;
}
export declare type RenderCalloutFunction = (dropdown: IExpandable, dropdownId: string, anchorElement?: HTMLElement, anchorOffset?: IOffset, anchorOrigin?: IOrigin, anchorPoint?: IPoint, dropdownOrigin?: IOrigin) => JSX.Element;
