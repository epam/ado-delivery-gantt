/**
 * IPortalProperties are used to initialize an Portal component. They allow you to control
 * where the portal is hosted.
 */
export interface IPortalProps {
    /**
     * Optional className to add to the root of the portal.
     */
    className?: string;
    /**
     * Optional className to add to the portal host.
     */
    parentClassName?: string;
    /**
     * Optional selector for the parentElement that will contain the portal tree.
     */
    portalSelector?: string;
    /**
     * Optional parentElement that will contain the portal tree.
     */
    portalElement?: HTMLElement;
}
