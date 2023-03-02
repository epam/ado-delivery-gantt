/// <reference types="react" />
/**
 * Copies the specified data to the clipboard in the TEXT format.
 *
 * @param data The data to copy.
 * @param onCopy Callback after a copy is completed
 */
export declare function copyToClipboard(data: string | JSX.Element | HTMLElement, onCopy?: () => void): void;
