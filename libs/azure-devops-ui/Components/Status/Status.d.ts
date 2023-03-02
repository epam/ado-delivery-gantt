/// <reference types="react" />
import "../../CommonImports";
import "../../Core/core.css";
import "./Status.css";
import { IStatusProps } from "./Status.Props";
/**
 * Meant to be used in conjunction with the Statuses object:
 *
 * <Status {...Statuses.Success} size={StatusSize.m} />
 * <Status {...Statuses.Success} ariaLabel="Success" size={StatusSize.m} />
 * <Status {...Statuses.Success} size={StatusSize.l} text="Something important" />
 */
export declare function Status(props: Readonly<IStatusProps>): JSX.Element;
export declare type StatusType = "Success" | "Failed" | "Warning" | "Information" | "Running" | "Waiting" | "Queued" | "Canceled" | "Skipped";
export declare const Statuses: {
    [key in StatusType]: IStatusProps;
};
