/// <reference types="react" />
import { IObservableArray, ObservableValue } from '../../Core/Observable';
import { IHeaderBreakpoint, TitleSize } from '../../Header';
import { IHeaderCommandBarItem } from '../../HeaderCommandBar';
import { IIconProps } from '../../Icon';
export interface ICardProps extends ICustomCardProps {
    /**
     * Set to true to be able to collapse the Card's contents with a button.
     * @default false
     */
    collapsible?: boolean;
    /**
     * Set to true to collapse the card, hiding the contents.
     * @default false
     */
    collapsed?: boolean | ObservableValue<boolean>;
    /**
     * Props to forward to the content of the Card
     */
    contentProps?: ICardContentProps;
    /**
     * Card header can be defined with a set of breakpoints. These breakpoints will be used to control
     * the visibility of the Command Bar items as the space available to Card header changes.
     */
    headerBreakpoints?: IHeaderBreakpoint[];
    /**
     * An optional className to pass to the card's header. If there is
     * a table after the header, then "no-v-padding" should be passed here
     * in order to remove the bottom padding that the header renders by default.
     */
    headerClassName?: string;
    /**
     * Optional commands to render in the Card's header
     */
    headerCommandBarItems?: IObservableArray<IHeaderCommandBarItem> | IHeaderCommandBarItem[];
    /**
     * Props to forward to the description of the Card's Header
     */
    headerDescriptionProps?: ICardHeaderDescriptionProps;
    /**
     * Icon props to forward to the Card's Header
     */
    headerIconProps?: IIconProps;
    /**
     * Callback for when the collapse button is clicked.
     */
    onCollapseClick?: (event: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement>) => void;
    /**
     * Optional function to render a custom header.
     */
    renderHeader?: () => JSX.Element;
    /**
     * Props to forward to the title of the Card's Header
     */
    titleProps?: ICardTitleProps;
}
export interface ICardContentProps {
    /**
     * An optional className to pass to the card content
     */
    className?: string;
    /**
     * Indicates the consumer does not want any horizontal padding.
     *
     * @default true
     */
    contentPadding?: boolean;
}
export interface ICardFooterProps {
    /**
     * An optional className to pass to the card footer
     */
    className?: string;
}
export interface ICardHeaderDescriptionProps {
    /**
     * An optional className to pass to the card header's description
     */
    className?: string;
    /**
     * Optional description to display for the card
     */
    text?: React.ReactNode;
}
export interface ICardTitleProps {
    /**
     * An optional aria level to the title
     */
    ariaLevel?: number;
    /**
     * An optional className to pass to the title
     */
    className?: string;
    /**
     * Optional id to pass to the card title
     */
    id?: string;
    /**
     * Optional size to render the card's title
     */
    size?: TitleSize;
    /**
     * Optional title to display for the card
     */
    text?: string;
}
export interface ICustomCardProps {
    /**
     * An optional className to pass to the card container element
     */
    className?: string;
}
