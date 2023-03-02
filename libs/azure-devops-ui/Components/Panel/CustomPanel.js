import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./Panel.css";
import * as React from "react";
import { ScreenContext, ScreenSize } from '../../Core/Util/Screen';
import { Callout, ContentJustification, ContentLocation, ContentOrientation, ContentSize } from '../../Callout';
import { FocusZoneKeyStroke } from '../../FocusZone';
import { Observer } from '../../Observer';
import { Spacing, Surface, SurfaceContext } from '../../Surface';
import { css, KeyCode } from '../../Util';
var CustomPanel = /** @class */ (function (_super) {
    __extends(CustomPanel, _super);
    function CustomPanel(props) {
        var _this = _super.call(this, props) || this;
        _this.calloutContentRef = React.createRef();
        _this.defaultActiveElement = function () {
            // We don't ever want the Panel to set focus to the body, so if the defaultActiveElement
            // prop that is provided cannot be found, instead use the panel's default focus element.
            var defaultActiveElement = _this.props.defaultActiveElement;
            var selector = typeof defaultActiveElement === "function" ? defaultActiveElement() : defaultActiveElement;
            if (selector && _this.calloutContentRef.current) {
                var matches = _this.calloutContentRef.current.querySelectorAll(selector);
                if (matches && matches.length) {
                    return selector;
                }
            }
            return ".bolt-panel-focus-element";
        };
        // TODO: Change to false in M150
        _this.state = {
            isDisplayed: true
        };
        return _this;
    }
    CustomPanel.prototype.render = function () {
        var _this = this;
        var _a = this.props, ariaLabel = _a.ariaLabel, ariaLabelledBy = _a.ariaLabelledBy, blurDismiss = _a.blurDismiss, calloutClassName = _a.calloutClassName, children = _a.children, className = _a.className, contentClassName = _a.contentClassName, escDismiss = _a.escDismiss, id = _a.id, lightDismiss = _a.lightDismiss, modal = _a.modal, onDismiss = _a.onDismiss, portalProps = _a.portalProps, _b = _a.size, size = _b === void 0 ? ContentSize.Medium : _b;
        var isDisplayed = this.state.isDisplayed;
        return (React.createElement(Observer, { size: this.context.size }, function (props) {
            var fullscreen = props.size === ScreenSize.xsmall;
            return (React.createElement(Callout, { ariaLabel: ariaLabel, ariaLabelledBy: ariaLabelledBy, blurDismiss: blurDismiss, className: css("bolt-panel", calloutClassName, isDisplayed === false && "no-events"), contentClassName: css(contentClassName, "bolt-panel-callout-content scroll-auto", isDisplayed ? "in" : "out", fullscreen ? "bolt-panel-fullscreen absolute-fill" : "relative"), contentJustification: ContentJustification.Stretch, contentLocation: ContentLocation.End, contentOrientation: ContentOrientation.Column, contentRef: _this.calloutContentRef, contentShadow: true, contentSize: fullscreen ? undefined : size, escDismiss: escDismiss, id: id, focuszoneProps: {
                    circularNavigation: true,
                    defaultActiveElement: _this.defaultActiveElement,
                    focusOnMount: true,
                    handleTabKey: true,
                    includeDefaults: true,
                    postprocessKeyStroke: function (event) {
                        // We want to prevent moving outside the panel if there are no focusable elements in the panel.
                        event.which === KeyCode.tab && event.preventDefault();
                        return FocusZoneKeyStroke.IgnoreParents;
                    }
                }, lightDismiss: lightDismiss && isDisplayed !== false, modal: modal && isDisplayed !== false, onDismiss: onDismiss, portalProps: portalProps },
                React.createElement(SurfaceContext.Consumer, null, function (surfaceContext) { return (React.createElement(Surface, __assign({}, surfaceContext, { spacing: Spacing.default }),
                    React.createElement("div", { className: css(className, "bolt-panel-root flex-column flex-grow scroll-auto") },
                        React.createElement("div", { className: "bolt-panel-focus-element no-outline", tabIndex: -1 }),
                        children))); })));
        }));
    };
    // TODO: Uncomment in M150
    /* public componentDidMount() {
        setTimeout(() => {
            this.setState({ isDisplayed: true });
        }, 0);
    }

    public componentWillUnmount() {
        if(false) {
            if(this.state.isDisplayed === true) {
                console.error("Panel was unmounted while still displayed; call animateOut first and unmount after the returned promise resolves");
            }
        }
    } */
    CustomPanel.prototype.animateOut = function () {
        return Promise.resolve();
        // TODO: Uncomment in M150
        /* return new Promise(resolve => {
            this.setState({ isDisplayed: false });

            setTimeout(() => {
                resolve();
            }, 200);
        }); */
    };
    CustomPanel.defaultProps = {
        escDismiss: true,
        lightDismiss: true,
        modal: true
    };
    CustomPanel.contextType = ScreenContext;
    return CustomPanel;
}(React.Component));
export { CustomPanel };
