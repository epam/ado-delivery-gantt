import { IIdentity } from "./SharedIdentityPicker.Props";
/**
 * If the identity is a scoped group (in the form: [scope name]\Group name), then return the separate
 * scope and friendly name pieces of the identity
 *
 * @param identity Identity to check
 */
export declare function getScopedGroupParts(identity: IIdentity): {
    scope: string;
    name: string;
} | undefined;
export declare function getSignInAddress(identity: IIdentity): string;
export declare function isUser(identity: IIdentity): boolean;
export declare function isGroup(identity: IIdentity): boolean;
export declare function isGithubUser(identity: IIdentity): boolean;
export declare function shouldShowIdentityCard(identity: IIdentity): boolean;
