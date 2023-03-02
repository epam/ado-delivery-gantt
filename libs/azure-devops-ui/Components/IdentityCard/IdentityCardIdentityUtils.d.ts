import { IIdentity } from "../Persona/Persona.Props";
export declare function isCompleteIdentity(identity: IIdentity | undefined, checkMail?: boolean): string | boolean;
export declare function isAadUser(identity: IIdentity | undefined): boolean;
export declare function isAdUser(identity: IIdentity | undefined): boolean;
export declare function isGithubUser(identity: IIdentity | undefined): boolean;
export declare function isGroup(identity: IIdentity | undefined): boolean;
export declare function isVsdUser(identity: IIdentity | undefined): boolean;
export declare function isWmdUser(identity: IIdentity | undefined): boolean;
