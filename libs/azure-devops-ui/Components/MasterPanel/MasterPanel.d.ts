import "../../CommonImports";
import "../../Core/core.css";
import * as React from "react";
import { IMasterPanelHeaderProps, IMasterPanelProps } from "./MasterPanel.Props";
/**
 * Context-controlled implementation of MasterDetails MasterPanel that allows for arbitrary layers of drill-down
 * If you don't need drill-down behavior, @see SingleLayerMasterPanel instead
 */
export declare const MasterPanel: React.FunctionComponent<IMasterPanelProps>;
export declare const MasterPanelHeader: React.FunctionComponent<IMasterPanelHeaderProps>;
