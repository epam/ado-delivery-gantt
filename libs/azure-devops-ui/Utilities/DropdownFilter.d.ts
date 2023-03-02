import { IListBoxItem } from '../ListBox';
import { IFilter } from './Filter';
import { ISelectionRange } from './Selection';
export declare function updateFilterToSelection<T>(values: ISelectionRange[], items: IListBoxItem<T>[], filter: IFilter, filterItemKey: string): void;
