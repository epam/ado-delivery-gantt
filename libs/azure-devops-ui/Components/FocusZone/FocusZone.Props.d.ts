/// <reference types="react" />
import { IFocusGroupProps, FocusGroup } from '../../FocusGroup';
/**
 * Which direction focus moves within a FocusZone
 */
export declare enum FocusZoneDirection {
    Horizontal = 1,
    Vertical = 2
}
/**
 * The preprocessKeyStroke method can return one of the following values
 * to modify how the current and parent focus zones treat the keystroke.
 */
export declare enum FocusZoneKeyStroke {
    /**
     * Dont alter the keystroke in any way.
     */
    IgnoreNone = 1,
    /**
     * All parent focus zones should ignore the keystroke, but it should be
     * processed normally by the current focuszone.
     */
    IgnoreParents = 2,
    /**
     * All focuszones that receive the keystroke should ignore it.
     */
    IgnoreAll = 3
}
/**
 * IFocusZoneContext is avaialble through the FocusZone Consumer.
 */
export interface IFocusZoneContext {
    /**
     * The focuszoneId of the current context should be added to elements through
     * the data-focuszone property for elements that are focusable and should
     * particpate in the focuszone handling.
     */
    focuszoneId?: string;
    /**
     * The direction of the current context.
     */
    direction?: FocusZoneDirection;
}
export interface IFocusZoneProps {
    /**
     * Clicks on the currently focused element when Enter is pressed if true
     * @default false
     */
    activateOnEnter?: boolean;
    /**
     * If set to true, focus will move out of inputs / text areas when at the
     * start or end of their content
     * @default false
     */
    allowArrowOutOfInputs?: boolean;
    /**
     * If set to true, focus will be able to move from the last element to the
     * first or vice versa.
     */
    circularNavigation?: boolean;
    /**
     * A selector for the element to receive focus when the FocusZone mounts.
     */
    defaultActiveElement?: string | (() => string);
    /**
     * The direction that focus moves within the FocusZone. This can be left
     * unsupplied if the FocusZone is using the handleTabKey to navigate the
     * FocusZone exclusively.
     */
    direction?: FocusZoneDirection;
    /**
     * When set to true, the FocusZone will stop managing focus.
     */
    disabled?: boolean;
    /**
     * If provided, will wrap the FocusZone in a FocusGroup to handle
     * tracking the focused items within the FocusZone.
     */
    focusGroupProps?: IFocusGroupProps & {
        ref?: React.Ref<FocusGroup>;
    };
    /**
     * Whether the FocusZone should focus a default element when it mounts or not.
     */
    focusOnMount?: boolean;
    /**
     * When handleTabKey is set to true, the tab and shift/tab keys will act as
     * focuszone navigation keys. NOTE: When the focus zone is set in circular
     * navigation mode, the user wont be able to get focus out of the zone without
     * using the mouse or some other method to move the focus.
     */
    handleTabKey?: boolean;
    /**
     * The focuszone can include all items that are tab stops by default within
     * the focus zone. This is not the default, and the focus zone will only
     * pick up components marked with the focuszone id. This is used to support
     * embedded focus zones.
     */
    includeDefaults?: boolean;
    /**
     * This allows the consumer to intercept keystrokes after they are processed
     * by the focus zone and may prevent this focus zone's parents from acting
     * on the keystroke.
     *
     * This wont effect preventDefault.
     */
    postprocessKeyStroke?: (event: React.KeyboardEvent<HTMLElement>) => FocusZoneKeyStroke;
    /**
     * This allows the consumer to intercept keystrokes before they are processed
     * by the focus zone and may prevent this focus zone or it parents from acting on
     * the keystroke.
     *
     * This wont effect preventDefault.
     */
    preprocessKeyStroke?: (event: React.KeyboardEvent<HTMLElement>) => FocusZoneKeyStroke;
    /**
     * When set to true, prevents scroll after focus on specific element
     * @default false
     */
    preventScrollOnFocus?: boolean;
    /**
     * If the caller knows that all elements of thie focus zone will be visible.
     * This means they will not have display: none or visibility: hidden css attributes
     * they we can skip this validation.
     *
     * This should be used with care, it will ensure there is not style recalculations
     * done during focus evaluation, but this will break the focus zone if hidden
     * elements exist in the zone.
     *
     * @default false
     */
    skipHiddenCheck?: boolean;
    /**
     * When true if keyboard controlled focus ends up on a focusable input element than input text is selected automatically
     * so user could replace or delete it's content immidiately.
     *
     * Consider making it a default behavior, since it's a default behavior for input elements.
     *
     * @default false
     */
    selectInputTextOnFocus?: boolean;
}
