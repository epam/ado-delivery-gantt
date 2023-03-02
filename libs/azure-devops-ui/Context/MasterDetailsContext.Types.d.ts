/// <reference types="react" />
import { IObservableValue, IReadonlyObservableValue } from '../Core/Observable';
/**
 * Describes the state of the current Master panel
 */
export interface IMasterPanelContent<T, P> {
    /**
     * If true, doesn't display the back button for the current set of master-details
     * @default false
     */
    hideBackButton?: boolean;
    /**
     * Additional handler for back button click
     * Return false if you want to prevent a pop from the context
     */
    onBackButtonClick?: () => boolean;
    /**
     * Renders the content area of the MasterPanel
     * Your List/Tree goes here
     */
    renderContent?: (parentItem: P, selectedMasterItem: IObservableValue<T>) => JSX.Element;
    /**
     * For standard titles, mark the title element with "bolt-master-panel-header-title"
     * For standard subtitles, mark the subtitle element with "bolt-master-panel-header-subtitle bolt-master-panel-header-secondary"
     *
     * Mark all secondary elements with the css class "bolt-master-panel-header-secondary" so they are hidden on scroll
     * @see SimpleMasterDetailsHeader for a good basic implementation of title and subtitle
     */
    renderHeader?: (parentItem: P) => JSX.Element;
    /**
     * Optional renderer for any search functionality
     * Renders into a styled area that scrolls with the content
     */
    renderSearch?: (parentItem: P) => JSX.Element;
}
/**
 * Describes the state of the Detail Area
 */
export interface IDetailsAreaContent<T> {
    /**
     * Renderer for Detail Area content
     */
    renderContent: (detailItem: T) => JSX.Element;
}
/**
 * Describes the state of the current Master/Details View
 */
export interface IMasterDetailsContextLayer<T = any, P = any> {
    /**
     * When the user navigates to this layer, what should be read to the user.
     */
    ariaLabel?: string;
    /**
     * Information about Detail Area content
     */
    detailsContent: IDetailsAreaContent<T>;
    /**
     * Unique identifier for the layer
     */
    key: string;
    /**
     * Details about the Master Panel, including what to render etc.
     */
    masterPanelContent: IMasterPanelContent<T, P>;
    /**
     * Optional handler for when this item is removed from the top of the context stack, before rendering happens
     */
    onPopped?: (context: IMasterDetailsContext) => void;
    /**
     * Optional handler for logic that should happen when this is pushed to the context, before any rendering happens etc.
     * Includes things like inspecting page state to potentially push a sub-layer, etc.
     */
    onPushed?: (context: IMasterDetailsContext) => void;
    /**
     * Parent item for this layer; should be set when creating a child layer
     * @see createChildLayer
     */
    parentItem?: P;
    /**
     * Currently selected item in the Master portion of the view
     */
    selectedMasterItem: IObservableValue<T>;
}
/**
 * Allows interaction with a Master-Details pattern
 * Subscribe to the return value from @see getPayload to be notified of changes
 */
export interface IMasterDetailsContext {
    /**
     * Gets a reference to the relevant data for a Master Details view for purposes of subscribing to changes
     */
    getCurrentLayer: () => IReadonlyObservableValue<IMasterDetailsContextLayer>;
    /**
     * Gets the current stack of Layers the Context is managing
     */
    getStack: () => IMasterDetailsContextLayer[];
    /**
     * Whether or not the Details Panel is showing.  The Details Panel may be hidden on smaller screens
     * when the user needs to select an item from the Master Panel.
     */
    hideDetailsPanel: IReadonlyObservableValue<boolean>;
    /**
     * Removes and returns the current top layer of the Master Details view
     * Updates the payload to the new top layer
     */
    pop: () => IMasterDetailsContextLayer | undefined;
    /**
     * Pushes a new layer on top of the Master Details view and updates the payload accordingly
     */
    push: (newLayer: IMasterDetailsContextLayer) => void;
    /**
     * Set whether or not the Details Panel should be visible.  This is useful for small screens
     * when only the master or details panel can show at once.  The MasterPanel hides by default on smaller screens.
     * Hiding the Details Panel will cause the Master Panel to show.
     */
    setDetailsPanelVisbility: (visible: boolean) => void;
}
