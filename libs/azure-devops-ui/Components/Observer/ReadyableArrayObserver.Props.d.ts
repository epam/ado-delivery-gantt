/// <reference types="react" />
import { IReadyableReadonlyObservableArray } from '../../Core/Observable';
export interface IReadyableArrayObserverProps<T> {
    /**
     * The readyable array to observe. This component will use the ready value of this array to
     * listen for changes and call the appropriate render method.
     */
    data: IReadyableReadonlyObservableArray<T>;
    /**
     * This function will be called with the data once it is ready, as long as data exists.
     */
    dataComponent: (data: T[]) => JSX.Element | null;
    /**
     * This function will be called if the data is not ready.
     */
    loadingComponent?: () => JSX.Element | null;
    /**
     * Callback that is called once the data is ready. This can be during componentDidMount if
     * the component has data at the first render pass. Or it will be called from an onUpdate call
     * from the underlying Observer, once the data is ready.
     */
    onReady?: () => void;
    /**
     * This function will be called if the data is ready, but there is no data.
     */
    zeroDataComponent?: () => JSX.Element | null;
}
