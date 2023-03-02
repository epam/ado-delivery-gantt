import * as React from "react";
import { IExpandableSharedProps, RenderCalloutFunction } from '../../Expandable';
import { ITextFieldProps } from '../../TextField';
import { IOffset, IOrigin, IPoint } from '../../Utilities/Position';
export interface IExpandableTextFieldProps extends IExpandableSharedProps, ITextFieldProps {
    /**
     * Element the dropdown should open relative to, if the dropdown shouldn't
     * open relative to the button itself.
     */
    anchorElement?: HTMLElement;
    /**
     * Offset from the anchor element or point for the dropdown.
     */
    anchorOffset?: IOffset;
    /**
     * Location on the anchor element the dropdown should be relative to.
     */
    anchorOrigin?: IOrigin;
    /**
     * anchorPoint can be supplied if the dropdown should open at a fixed
     * point instead of relative to the button.
     */
    anchorPoint?: IPoint;
    /**
     * Set to true to dismiss the callout when focus leaves the TextField.
     */
    blurDismiss?: boolean;
    /**
     * Ref to pass to the container element.
     */
    containerRef?: React.RefObject<HTMLDivElement>;
    /**
     * Optional Id that should be used on the dropdown to uniquely identify
     * this element.
     */
    dropdownId?: string;
    /**
     * Location on the dropdown to make relative to the button location.
     */
    dropdownOrigin?: IOrigin;
    /**
     * Whether or not textField is editable and should be treated like a combobox.
     */
    editable?: boolean;
    /**
     * If hideDropdownIcon is supplied the button acts as a dropdown button
     * without showing the dropdown arrows.
     */
    hideDropdownIcon?: boolean;
    /**
     * Method used to create the callout.
     */
    renderCallout: RenderCalloutFunction;
}
