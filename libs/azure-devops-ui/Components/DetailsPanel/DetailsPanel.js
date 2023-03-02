import "../../CommonImports";
import "../../Core/core.css";
import "./DetailsPanel.css";
import * as React from "react";
import { MasterDetailsContext } from '../../MasterDetailsContext';
import { Observer } from '../../Observer';
import { Surface, SurfaceBackground } from '../../Surface';
import { css } from '../../Util';
/**
 * A context-controlled detail area for the MasterDetails pattern
 * Render your own content instead of using this if you aren't using the context
 * and are using @see SingleLayerMasterPanel as your MasterPanel
 */
export var DetailsPanel = function (props) {
    var masterDetailsContext = React.useContext(MasterDetailsContext);
    return (React.createElement(Surface, { background: SurfaceBackground.neutral },
        React.createElement("div", { className: css(props.className, "bolt-details-panel flex-row flex-grow") },
            React.createElement(Observer, { masterDetailsLayer: masterDetailsContext.getCurrentLayer() }, function (observableProps) { return (React.createElement(Observer, { selectedItem: observableProps.masterDetailsLayer.selectedMasterItem, hideDetailsPanel: masterDetailsContext.hideDetailsPanel }, function (innerObservableProps) {
                return !innerObservableProps.hideDetailsPanel &&
                    observableProps.masterDetailsLayer.detailsContent.renderContent(innerObservableProps.selectedItem);
            })); }))));
};
