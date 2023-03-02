export function isCompleteIdentity(identity, checkMail) {
    if (!identity) {
        return false;
    }
    if (isGroup(identity)) {
        return identity.mail || identity.displayName;
    }
    if (isAadUser(identity) || isAdUser(identity)) {
        return !!((checkMail && identity.mail) ||
            identity.mailNickname ||
            identity.jobTitle ||
            identity.department ||
            identity.physicalDeliveryOfficeName ||
            identity.manager ||
            identity.surname ||
            identity.telephoneNumber);
    }
    else if (isVsdUser(identity)) {
        return !!identity.signInAddress;
    }
    else if (isWmdUser(identity)) {
        return !!(identity.scopeName || identity.signInAddress);
    }
    return false;
}
export function isAadUser(identity) {
    return !!identity && !!identity.originDirectory && identity.originDirectory.trim().toLowerCase() === "aad";
}
export function isAdUser(identity) {
    return !!identity && !!identity.originDirectory && identity.originDirectory.trim().toLowerCase() === "ad";
}
export function isGithubUser(identity) {
    return !!identity && !!identity.originDirectory && identity.originDirectory.trim().toLowerCase() === "github";
}
export function isGroup(identity) {
    return !!identity && !!identity.entityType && identity.entityType.trim().toLowerCase() === "group";
}
export function isVsdUser(identity) {
    return !!identity && !!identity.originDirectory && identity.originDirectory.trim().toLowerCase() === "vsd";
}
export function isWmdUser(identity) {
    return !!identity && !!identity.originDirectory && identity.originDirectory.trim().toLowerCase() === "wmd";
}
