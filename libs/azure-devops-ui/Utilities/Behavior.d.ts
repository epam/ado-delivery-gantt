import { IEventDispatch } from './Dispatch';
export interface IBehavior<P, C> {
    initialize?: (props: Readonly<P>, component: C, eventDispatch: IEventDispatch) => void;
    componentDidMount?: (props: Readonly<P>) => void;
    componentDidUpdate?: (props: Readonly<P>) => void;
    componentWillUnmount?: () => void;
}
