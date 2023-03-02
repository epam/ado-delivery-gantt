import { __assign } from "tslib";
/**
 * Handles an href and target being passed to an anchor, without a rel.
 */
export function getDefaultAnchorProps(anchorProps) {
    var modifiedAnchorProps;
    if (anchorProps) {
        var rel = anchorProps.rel;
        if (anchorProps.href && anchorProps.target && !rel) {
            rel = "noopener";
        }
        modifiedAnchorProps = {
            href: anchorProps.href,
            rel: rel,
            target: anchorProps.target
        };
    }
    return modifiedAnchorProps;
}
/**
 * Handles an href and target being passed to a link, without a rel.
 */
export function getDefaultLinkProps(linkProps) {
    if (!linkProps) {
        return getDefaultAnchorProps(linkProps);
    }
    return __assign(__assign({}, getDefaultAnchorProps(linkProps)), { disabled: linkProps.disabled, id: linkProps.id, onClick: linkProps.onClick, role: linkProps.role });
}
