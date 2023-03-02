import { IReadonlyObservableValue } from '../../Core/Observable';
import { ITooltipProps } from '../../TooltipEx';
export interface IRadioButtonGroup {
    /**
     * Sets focus to the RadioButtonGroup.
     */
    focus(): void;
}
/**
 * Which direction the radio button group arranges its children.
 */
export declare enum RadioButtonGroupDirection {
    Horizontal = 1,
    Vertical = 2
}
export interface IRadioButtonGroupProps {
    /**
     * Optional class name to add to the radio button group element.
     */
    className?: string;
    /**
     * The id of the button that should be focused by default.
     */
    defaultButtonId?: string;
    /**
     * Set to true if you don't want the radio button group's focus managed by a FocusZone.
     */
    excludeFocusZone?: boolean;
    /**
     * Optional class name to add to the radio button group children container.
     */
    groupClassName?: string;
    /**
     * Optional id of the checkbox group element.
     */
    id?: string;
    /**
     * Callback called when a new button is selected.
     */
    onSelect?: (buttonId: string) => void;
    /**
     * The id of the currently selected radio button.
     */
    selectedButtonId?: IReadonlyObservableValue<string> | string;
    /**
     * Text to display above the radio group.
     */
    text?: string;
    /**
     * Specifies the direction that the radio button children are layed out.
     * @default RadioButtonGroupDirection.Vertical
     */
    direction?: RadioButtonGroupDirection;
}
export interface IRadioButtonProps {
    /**
     * Id of another element which labels this one for screen reader users. Only use if custom rendering the label
     * with children. Otherwise, this will automatically get set to the id of the text serving as the label.
     */
    ariaLabelledBy?: string;
    /**
     * Id of another element which describes this one for screen reader users.
     */
    ariaDescribedBy?: string;
    /**
     * Optional class name to add to the radio button element.
     */
    className?: string;
    /**
     * If true, the button cannot be interacted with.
     */
    disabled?: boolean;
    /**
     * Set to true if you don't want the radio button's focus managed by a FocusZone.
     */
    excludeFocusZone?: boolean;
    /**
     * Set to true to omit setting the tab index.
     */
    excludeTabStop?: boolean;
    /**
     * id of the radio button.
     */
    id: string;
    /**
     * Optional aria role.
     * @default radio
     */
    role?: string;
    /**
     * Text to display next to the radio button.
     * For custom rendering the label of the radio button (to support two lines of text, etc.), pass
     * children to the <RadioButton> and use the bolt-radio-button-label className. Make sure to set
     * the ariaLabelledBy prop to the id of the element containing your label. E.g.
     *
     *  <RadioButton ariaLabelledBy={myId}>
     *      <div className="bolt-radio-button-label" id={getSafeId(myId)}>
     *          {label-text}
     *          <span className="sub-text-class">{sub-text}</span>
     *      </div>
     *  <RadioButton>
     */
    text?: string;
    /**
     * Optional tooltip to show when the radio button is hovered.
     */
    tooltipProps?: ITooltipProps;
}
