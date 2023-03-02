import "../../CommonImports";
import "../../Core/core.css";
import "./Menu.css";
import "./MenuButton.css";
import * as React from "react";
import { IBehavior } from '../../Utilities/Behavior';
import { IEventDispatch } from '../../Utilities/Dispatch';
export declare class ContextMenuBehavior implements IBehavior<{}, {}> {
    private contextMenuHandler;
    private eventDispatch;
    constructor(contextMenuHandler: (event: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement>) => void);
    initialize: (props: any, component: any, eventDispatch: IEventDispatch) => void;
    private onContextMenu;
    componentWillUnmount(): void;
}
