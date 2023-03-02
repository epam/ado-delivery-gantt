/// <reference types="react" />
import { IReadonlyObservableArray } from '../../Core/Observable';
import { IButtonProps } from '../../Button';
import { IHeaderCommandBarItem } from '../../HeaderCommandBar';
import { IIconProps } from '../../Icon';
export interface IHeader {
}
export declare enum TitleSize {
    Medium = 0,
    Large = 1,
    Small = 2
}
/**
 * Item determining the new look of a Command Bar item for a certain breakpoint.
 */
export interface IHeaderBreakpointCommandItem {
    /**
     * Icon of the Command Bar item to be displayed on the certain breakpoint.
     * Specify undefined to make icon hidden.
     */
    iconProps?: IIconProps;
    /**
     * Id of the Command Bar item specified for the Header.
     */
    id: string;
    /**
     * Importance of the Command Bar item to be displayed on the certain breakpoint.
     * Not specifying important will let Header itself decide when to display items
     * in the overflow area.
     *
     * If full control is needed to display items in the overflow area, specify important
     * for each Command Bar item no matter they change between breakpoints or not.
     */
    important?: boolean;
    /**
     * Text of the Command Bar item to be displayed on the certain breakpoint.
     * Specify undefined to make text hidden.
     */
    text?: string;
}
/**
 * An IHeaderBreakpoint is used to define the visibility of the header items
 * when the specified breakpoint is reached.
 */
export interface IHeaderBreakpoint {
    /**
     * The header is defined with series of breakpoints. Each of the breakpoints
     * will have a mappings for the specified Command Bar items.
     *
     * If a Command Bar item is not changed for any of the breakpoints, then it is not
     * necessary to include it in the commandBarItems list. However, all the properties
     * (id, text, iconProps, important) need to be specified for a Command Bar item, if
     * it changes between breakpoints to have correct visibility for that item.
     */
    breakpoint: number;
    /**
     * List of Command Bar items, which will have a change for this particular breakpoint.
     * Id property needs to match the id from the commandBarItems of the Header in order to
     * get a Command Bar item's visibility updated for a certain breakpoint.
     */
    commandBarItems?: IHeaderBreakpointCommandItem[];
}
export interface ICustomHeaderProps {
    /**
     * An optional className to pass to the root Header element
     */
    className?: string;
    /**
     * Whether or not to show a separator after the Header
     * @default false
     */
    separator?: boolean;
}
export interface IHeaderDescriptionProps {
    /**
     * An optional className to pass to the description element
     */
    className?: string;
    /**
     * An optional id used for the descriptions's text. Can be used in conjunction with aria-describedby.
     * getSafeId() will be called on this value.
     */
    id?: string;
}
export interface IHeaderBackButtonProps {
    /**
     * If these props are provided, the Header will draw a back button before the
     * header's title. By default this will use a subtle button with the "Back" icon,
     * but these props can override those choices.
     */
    buttonProps: IButtonProps;
}
export interface IHeaderIconProps {
    /**
     * An optional className to pass to the icon element
     */
    className?: string;
    /**
     * Props to render for the icon.
     */
    iconProps: IIconProps;
    /**
     * Applies appropriate font size and padding for the icon.
     */
    titleSize?: TitleSize;
}
export interface IHeaderTitleProps {
    /**
     * An optional aria level to pass to the title element
     */
    ariaLevel?: number;
    /**
     * An optional className to pass to the title element
     */
    className?: string;
    /**
     * An optional id used for the title's text. Can be used in conjunction with aria-labelledby.
     * getSafeId() will be called on this value.
     */
    id?: string;
    /**
     * Applies appropriate font size and padding for text.
     */
    titleSize?: TitleSize;
}
export interface IHeaderTitleAreaProps {
    /**
     * An optional className to pass to the title area element
     */
    className?: string;
}
export interface IHeaderTitleRowProps {
    /**
     * An optional className to pass to the title row element
     */
    className?: string;
}
export interface IHeaderProps extends ICustomHeaderProps {
    /**
     * If these props are provided, the Header will draw a back button before the
     * header's title. By default this will use a subtle button with the "Back" icon,
     * but these props can override those choices.
     */
    backButtonProps?: IButtonProps;
    /**
     * How many buttons to show in the HeaderCommandBar if there is room.  The rest will be sent to overflow if they are not marked as important.
     */
    buttonCount?: number;
    /**
     * Optional className to pass to the command bar rendered in the Header.
     */
    commandBarClassName?: string;
    /**
     * Optional className to pass to the Header's content element.
     */
    contentClassName?: string;
    /**
     * Items to display in the far-right Command Bar
     * Should influence page-wide state
     */
    commandBarItems?: IReadonlyObservableArray<IHeaderCommandBarItem> | IHeaderCommandBarItem[];
    /**
     * Optional id to assign to the more button within the HeaderCommandBar.
     */
    commandBarMoreButtonId?: string;
    /**
     * Secondary text to display in the header, below the title
     */
    description?: React.ReactNode;
    /**
     * Optional className to pass to the description in the Header
     */
    descriptionClassName?: string;
    /**
     * An optional id used for the descriptions's text. Can be used in conjunction with aria-describedby.
     * getSafeId() will be called on this value.
     */
    descriptionId?: string;
    /**
     * A header can be defined with a set of breakpoints. These breakpoints will be used to control
     * the visibility of the Command Bar items as the space available to the header changes.
     */
    headerBreakpoints?: IHeaderBreakpoint[];
    /**
     * Primary text to display in the header
     */
    title?: React.ReactNode;
    /**
     * Optional aria level to pass to the title in the Header
     */
    titleAriaLevel?: number;
    /**
     * Optional className to pass to the title in the Header
     */
    titleClassName?: string;
    /**
     * Props to render the large Title Icon to the left of the Title and Description elements
     */
    titleIconProps?: IIconProps;
    /**
     * An optional id used for the title's text. Can be used in conjunction with aria-labelledby.
     * getSafeId() will be called on this value after it is passed to the <HeaderTitle />
     */
    titleId?: string;
    /**
     * Applies appropriate font size and padding for title text.
     */
    titleSize?: TitleSize;
    /**
     * Optional boolean to keep icons for header bar but expand to have text for overflow menu
     */
    useAriaLabelForOverflow?: boolean;
}
