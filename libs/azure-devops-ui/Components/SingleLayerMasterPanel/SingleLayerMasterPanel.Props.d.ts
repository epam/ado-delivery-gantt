/// <reference types="react" />
import { IMasterPanelHeaderProps, IMasterPanelProps } from "../MasterPanel/MasterPanel.Props";
export interface ISingleLayerMasterPanelProps extends IMasterPanelProps {
    /**
     * Ref to the scrolling content div; avoid using if possible
     */
    contentRef?: React.Ref<HTMLDivElement>;
    /**
     * Renders the content area of the MasterPanel
     * Your List/Tree goes here
     */
    renderContent?: () => JSX.Element;
    /**
     * For standard titles, mark the title element with "bolt-master-panel-header-title"
     * For standard subtitles, mark the subtitle element with "bolt-master-panel-header-subtitle bolt-master-panel-header-secondary"
     *
     * Mark all secondary elements with the css class "bolt-master-panel-header-secondary" so they are hidden on scroll
     * @see SimpleMasterDetailsHeader for a good basic implementation of title and subtitle
     */
    renderHeader?: () => JSX.Element;
    /**
     * Optional renderer for any search functionality
     * Renders into a styled area that scrolls with the content
     */
    renderSearch?: () => JSX.Element;
}
export interface ISingleLayerMasterPanelHeaderProps extends IMasterPanelHeaderProps {
    /**
     * Handler for when back button is clicked
     */
    onBackButtonClick?: () => void;
}
