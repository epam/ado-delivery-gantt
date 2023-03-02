import { IObservableLikeValue } from '../../Core/Observable';
export interface IConditionalChildrenProps {
    /**
     * Whether to apply a not operator to the result of the renderChildren value
     * @default false
     */
    inverse?: boolean;
    /**
     * Whether or not to show the children of this component.
     * If Observable, will subscribe and re-render on change notifications.
     */
    renderChildren: IObservableLikeValue<boolean | undefined>;
}
