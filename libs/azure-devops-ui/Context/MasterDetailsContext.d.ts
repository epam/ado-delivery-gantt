import * as React from "react";
import { IObservableValue, IReadonlyObservableValue, ObservableValue } from '../Core/Observable';
import { IItemProvider } from '../Utilities/Provider';
import { ISelection } from '../Utilities/Selection';
import { IDetailsAreaContent, IMasterDetailsContext, IMasterDetailsContextLayer, IMasterPanelContent } from "./MasterDetailsContext.Types";
export declare class BaseMasterDetailsContext implements IMasterDetailsContext {
    private readonly onExit;
    private readonly payload;
    private readonly payloadStack;
    hideDetailsPanel: ObservableValue<boolean>;
    constructor(initialLayer: IMasterDetailsContextLayer, onExit: () => void);
    getCurrentLayer: () => IReadonlyObservableValue<IMasterDetailsContextLayer<any, any>>;
    getStack: () => IMasterDetailsContextLayer<any, any>[];
    push: (newLayer: IMasterDetailsContextLayer) => void;
    pop: () => IMasterDetailsContextLayer<any, any>;
    setDetailsPanelVisbility: (visible: boolean) => void;
}
export declare const MasterDetailsContext: React.Context<IMasterDetailsContext>;
/**
 * Binds a selection, for things like Tree and List, to an Observable (usually IMasterDetailsLayer.selectedMasterItem)
 * When selection changes, it will update the observable
 * Will set selection to current payload item if it exists; works nicely with createChildPayload when drilling down
 * Supports single-select only
 */
export declare function bindSelectionToObservable<T>(selection: ISelection, itemProvider: IItemProvider<T>, observable: IObservableValue<T>): void;
/**
 * Creates a layer that's a logical child of an existing layer
 * Useful for drill-down scenarios
 * Ensures correct typing of the child layer for common scenarios
 * @param key Unique identifier for the child layer
 * @param masterPanelDetails Master panel details for the child layer
 * @param detailsContent Detail rendering info for the child layer
 * @param initialSelectedItem Usually the clicked item from your current layer's detail view
 * @param parentLayer The parent layer, usually the currently displayed layer
 */
export declare function createChildLayer<T, P>(key: string, masterPanelDetails: IMasterPanelContent<T, P>, detailsContent: IDetailsAreaContent<T>, initialSelectedItem: T, parentLayer: IMasterDetailsContextLayer<P, any>, onPushed?: (context: IMasterDetailsContext) => void, ariaLabel?: string): IMasterDetailsContextLayer<T, P>;
