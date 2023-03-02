import { IAnchorProps, ILinkProps } from "./Link.Props";
/**
 * Handles an href and target being passed to an anchor, without a rel.
 */
export declare function getDefaultAnchorProps(anchorProps: IAnchorProps | undefined): IAnchorProps | undefined;
/**
 * Handles an href and target being passed to a link, without a rel.
 */
export declare function getDefaultLinkProps(linkProps: ILinkProps | undefined): ILinkProps | undefined;
