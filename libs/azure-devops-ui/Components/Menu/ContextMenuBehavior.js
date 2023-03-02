import "../../CommonImports";
import "../../Core/core.css";
import "./Menu.css";
import "./MenuButton.css";
var ContextMenuBehavior = /** @class */ (function () {
    function ContextMenuBehavior(contextMenuHandler) {
        var _this = this;
        this.initialize = function (props, component, eventDispatch) {
            _this.eventDispatch = eventDispatch;
            _this.eventDispatch.addEventListener("contextmenu", _this.onContextMenu);
        };
        this.onContextMenu = function (event) {
            _this.contextMenuHandler(event);
        };
        this.contextMenuHandler = contextMenuHandler;
    }
    ContextMenuBehavior.prototype.componentWillUnmount = function () {
        var _a;
        (_a = this.eventDispatch) === null || _a === void 0 ? void 0 : _a.removeEventListener("contextmenu", this.onContextMenu);
    };
    return ContextMenuBehavior;
}());
export { ContextMenuBehavior };
