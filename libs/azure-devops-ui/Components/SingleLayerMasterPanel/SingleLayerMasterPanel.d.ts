import "../../CommonImports";
import "../../Core/core.css";
import "./SingleLayerMasterPanel.css";
import * as React from "react";
import { ISingleLayerMasterPanelHeaderProps, ISingleLayerMasterPanelProps } from "./SingleLayerMasterPanel.Props";
/**
 * Props-controlled implementation of MasterPanel for experiences that don't need the layering of MasterDetailsContext
 */
export declare const SingleLayerMasterPanel: React.FunctionComponent<ISingleLayerMasterPanelProps>;
export declare const SingleLayerMasterPanelHeader: React.FunctionComponent<ISingleLayerMasterPanelHeaderProps>;
