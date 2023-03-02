/// <reference types="react" />
import { ExpandableButton, IExpandableButtonProps } from '../../Button';
import { RenderCalloutFunction } from '../../Expandable';
import { ExpandableTextField, IExpandableTextFieldProps } from '../../ExpandableTextField';
import { IListSelection } from '../../List';
import { IListBoxItem } from '../../ListBox';
export interface IDropdownExpandableProps<T = {}> {
    /**
     * Adds aria-label to the Expandable element.
     */
    ariaLabel?: string;
    /**
     * Adds aria-labelled-by to the Expandable element.
     */
    ariaLabelledBy?: string;
    /**
     * Supply autoSelect to select all the text in the input when the textfield gets
     * focus. This is useful if you want the user to copy the text, or replace the text
     * upon typing instead of changing the current value.
     */
    autoSelect?: boolean;
    /**
     * ClassName to pass to the Expandable.
     */
    className?: string;
    /**
     * Ref to pass to the expandable's container element.
     */
    containerRef?: React.RefObject<HTMLDivElement>;
    /**
     * Set to true to make the expandable disabled.
     */
    disabled?: boolean;
    /**
     * A custom way to force single-select options in a multi-select selection.
     */
    enforceSingleSelect?: boolean;
    /**
     * The element should not be tabable but still should be able to receieve focus.
     */
    excludeTabStop?: boolean;
    /**
     * A ref to forward to the expandable.
     */
    expandableRef: React.RefObject<ExpandableButton | ExpandableTextField>;
    /**
     * Id to be applied to the expandable's input  element.
     */
    inputId?: string;
    /**
     * The set of items passed to the Dropdown.
     */
    items: IListBoxItem<T>[];
    /**
     * Optional callback to call when the dropdown is collapsed.
     */
    onCollapse?: () => void;
    /**
     * Optional callback to call when the dropdown is expanded.
     */
    onExpand?: () => void;
    /**
     * Text to show within the DropdownExpandable when there is no selected value.
     */
    placeholder?: string;
    /**
     * A function which renders the dropdown's callout.
     */
    renderCallout: RenderCalloutFunction;
    /**
     * Renderer for selected items.
     */
    renderSelectedItems: (selection: IListSelection, items: IListBoxItem<T>[]) => JSX.Element | string;
    /**
     * Indicates whether dropdown is required or not.
     * @default false.
     */
    required?: boolean;
    /**
     * The selection object used by the Dropdown.
     */
    selection: IListSelection;
    /**
     * Used to show prefix icons. Not use unless expandable is expandabletextfield
     */
    showPrefix?: boolean;
}
export interface IDropdownExpandableButtonProps extends IDropdownExpandableProps, IExpandableButtonProps {
    children?: React.ReactNode;
}
export interface IDropdownExpandableTextFieldProps extends IDropdownExpandableProps, IExpandableTextFieldProps {
    /**
     * If the list item has an icon show the icon as the prefix icon in the text field.
     *
     * @default true
     */
    showPrefix?: boolean;
}
