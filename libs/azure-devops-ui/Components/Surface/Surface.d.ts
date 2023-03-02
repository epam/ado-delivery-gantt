import "../../CommonImports";
import "../../Core/core.css";
import "./Surface.css";
import * as React from "react";
import { ISurfaceContext, ISurfaceProps } from "./Surface.Props";
export declare const SurfaceContext: React.Context<ISurfaceContext>;
export declare const Surface: (props: ISurfaceProps & Readonly<{
    children?: React.ReactNode;
}>) => JSX.Element;
