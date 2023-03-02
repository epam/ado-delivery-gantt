/**
 * If the identity is a scoped group (in the form: [scope name]\Group name), then return the separate
 * scope and friendly name pieces of the identity
 *
 * @param identity Identity to check
 */
export function getScopedGroupParts(identity) {
    if (isGroup(identity)) {
        var name_1 = identity.displayName;
        if (name_1 && name_1[0] === "[") {
            var slashIndex = name_1.indexOf("]\\");
            if (slashIndex > 0) {
                return {
                    name: name_1.substr(slashIndex + 2),
                    scope: name_1.substr(0, slashIndex + 1)
                };
            }
        }
    }
    return undefined;
}
export function getSignInAddress(identity) {
    if (!identity) {
        return "";
    }
    if (isGithubUser(identity)) {
        return identity.mailNickname;
    }
    if (!identity.isHosted && identity.samAccountName && identity.samAccountName.trim()) {
        return (identity.scopeName && identity.scopeName.trim() ? identity.scopeName + "\\" : "") + identity.samAccountName;
    }
    return identity.signInAddress && identity.signInAddress.trim()
        ? identity.signInAddress
        : identity.mail && identity.mail.trim()
            ? identity.mail
            : identity.mailNickname && identity.mailNickname.trim()
                ? identity.mailNickname
                : "";
}
export function isUser(identity) {
    return identity && identity.entityType && identity.entityType.toLocaleLowerCase() === "user";
}
export function isGroup(identity) {
    return identity && identity.entityType && identity.entityType.toLocaleLowerCase() === "group";
}
export function isGithubUser(identity) {
    return identity && identity.entityType && identity.originDirectory.toLocaleLowerCase() === "github";
}
export function shouldShowIdentityCard(identity) {
    return identity && (isUser(identity) || isGroup(identity) || isGithubUser(identity));
}
