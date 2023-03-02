/// <reference types="react" />
import "../../CommonImports";
import "../../Core/core.css";
import "./ColorPicker.css";
import { IDropdownCalloutProps } from '../../Dropdown';
import { IColorPickerProps } from "./Utils";
export declare function ColorDropdown({ ariaLabel, className, color, disabled, onColorSelected }: IColorPickerProps): JSX.Element;
export declare function ColorDropdownCallout(props: IDropdownCalloutProps): JSX.Element;
