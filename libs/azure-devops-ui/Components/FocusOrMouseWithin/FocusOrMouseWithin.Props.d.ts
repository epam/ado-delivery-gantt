import * as React from "react";
import { IFocusWithinStatus } from '../../FocusWithin';
import { IMouseWithinStatus } from '../../MouseWithin';
export interface IFocusOrMouseWithinProps {
    onFocus?: (event: React.FocusEvent<HTMLElement>) => void;
    onBlur?: () => void;
    onMouseEnter?: (event: React.MouseEvent<HTMLElement>) => void;
    onMouseLeave?: (event: React.MouseEvent<HTMLElement>) => void;
}
export interface IFocusOrMouseWithinStatus extends IFocusWithinStatus, IMouseWithinStatus {
}
