import { __assign } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import { MasterDetailsContext } from '../../MasterDetailsContext';
import { Observer } from '../../Observer';
import { Surface, SurfaceBackground } from '../../Surface';
import { css } from '../../Util';
import { SingleLayerMasterPanel, SingleLayerMasterPanelHeader } from "../SingleLayerMasterPanel/SingleLayerMasterPanel";
import * as Utils_Accessibility from '../../Core/Util/Accessibility';
/**
 * Context-controlled implementation of MasterDetails MasterPanel that allows for arbitrary layers of drill-down
 * If you don't need drill-down behavior, @see SingleLayerMasterPanel instead
 */
export var MasterPanel = function (props) {
    var className = props.className, showOnSmallScreens = props.showOnSmallScreens;
    var contentElement = React.useRef(null);
    var masterDetailsContext = React.useContext(MasterDetailsContext);
    return (React.createElement(Surface, { background: SurfaceBackground.neutral },
        React.createElement(Observer, { masterDetailsLayer: masterDetailsContext.getCurrentLayer(), hideDetailsPanel: masterDetailsContext.hideDetailsPanel }, function (observerProps) {
            return (React.createElement(MasterPanelInternal, { className: css(className, observerProps.hideDetailsPanel && "full-screen"), layer: observerProps.masterDetailsLayer, showOnSmallScreens: showOnSmallScreens || observerProps.hideDetailsPanel }));
        })));
};
var MasterPanelInternal = function (props) {
    var className = props.className, layer = props.layer, showOnSmallScreens = props.showOnSmallScreens;
    var tabStop = React.createRef();
    var firstUpdate = React.useRef(true);
    React.useEffect(function () {
        // don't set focus on first update
        if (firstUpdate.current) {
            firstUpdate.current = false;
        }
        else {
            tabStop.current && tabStop.current.focus();
            Utils_Accessibility.announce(layer.ariaLabel);
        }
    }, [props.layer]);
    var masterPanelDetails = layer.masterPanelContent;
    var parentItem = layer.parentItem;
    var selectedItemObservable = layer.selectedMasterItem;
    var renderHeader = masterPanelDetails.renderHeader
        ? function () {
            return masterPanelDetails.renderHeader(parentItem);
        }
        : undefined;
    var renderSearch = masterPanelDetails.renderSearch
        ? function () {
            return masterPanelDetails.renderSearch(parentItem);
        }
        : undefined;
    var renderContent = masterPanelDetails.renderContent
        ? function () {
            return masterPanelDetails.renderContent(parentItem, selectedItemObservable);
        }
        : undefined;
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { ref: tabStop, tabIndex: -1 }),
        React.createElement(SingleLayerMasterPanel, { className: className, key: "master-panel-" + layer.key, renderContent: renderContent, renderHeader: renderHeader, renderSearch: renderSearch, showOnSmallScreens: showOnSmallScreens })));
};
export var MasterPanelHeader = function (props) {
    var masterDetailsContext = React.useContext(MasterDetailsContext);
    var masterPanelDetails = masterDetailsContext.getCurrentLayer().value.masterPanelContent;
    var onBackClick = function () {
        var shouldPop = masterPanelDetails.onBackButtonClick && masterPanelDetails.onBackButtonClick();
        if (shouldPop !== false) {
            masterDetailsContext.pop();
        }
    };
    return React.createElement(SingleLayerMasterPanelHeader, __assign({}, props, { onBackButtonClick: masterPanelDetails.hideBackButton !== false ? undefined : onBackClick }));
};
