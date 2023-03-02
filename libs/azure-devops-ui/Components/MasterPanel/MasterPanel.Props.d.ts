/// <reference types="react" />
import { IMasterDetailsContextLayer } from '../../Context/MasterDetailsContext.Types';
export interface IMasterPanelProps {
    /**
     * Optional className to emit onto the root MasterPanel element
     */
    className?: string;
    /**
     * Set to true to always show the master panel on small screens.  By default the master panel will hide,
     * and the details panel can be replaced with a fullscreen master panel by calling
     * masterPanelContext.setDetailsPanelVisibility(false)
     * @default false
     */
    showOnSmallScreens?: boolean;
}
export interface IMasterPanelInternalProps extends IMasterPanelProps {
    /**
     * Current master details context layer.
     */
    layer: IMasterDetailsContextLayer<any>;
}
export interface IMasterPanelHeaderProps {
    /**
     * Optional subtitle text
     */
    subTitle?: React.ReactNode;
    /**
     * Title text to display
     */
    title: string;
    /**
     * Optional number to specify the aria level.  Defaults to 1.
     */
    titleAriaLevel?: number;
}
