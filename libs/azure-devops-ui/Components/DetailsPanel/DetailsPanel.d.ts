import "../../CommonImports";
import "../../Core/core.css";
import "./DetailsPanel.css";
import * as React from "react";
import { IDetailsPanelProps } from "./DetailsPanel.Props";
/**
 * A context-controlled detail area for the MasterDetails pattern
 * Render your own content instead of using this if you aren't using the context
 * and are using @see SingleLayerMasterPanel as your MasterPanel
 */
export declare const DetailsPanel: React.FunctionComponent<IDetailsPanelProps>;
