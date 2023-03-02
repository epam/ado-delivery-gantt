import { __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./TeachingPanel.css";
import * as React from "react";
import { Button } from '../../Button';
import { Callout, ContentJustification, ContentLocation, ContentOrientation } from '../../Callout';
import { FocusZone } from '../../FocusZone';
import { Tooltip } from '../../TooltipEx';
import { css } from '../../Util';
import * as Resources from '../../Resources.TeachingPanel';
var TeachingPanel = /** @class */ (function (_super) {
    __extends(TeachingPanel, _super);
    function TeachingPanel(props) {
        var _this = _super.call(this, props) || this;
        _this.nextButton = React.createRef();
        _this._onPanelClose = function () {
            _this.setState({ shouldShow: false });
            _this.props.onDismiss && _this.props.onDismiss(_this.state.slideIndex);
        };
        _this._onNextPressed = function () {
            if (_this.state.slideIndex + 1 === _this.props.slides.length) {
                _this._onPanelClose();
            }
            else {
                _this.setState({ slideIndex: _this.state.slideIndex + 1 });
            }
        };
        _this._onBackPressed = function () {
            if (_this.state.slideIndex > 0) {
                // If we are on the second slide before moveing to the first slide, set
                // focus to the next button, otherwise focus is lost.
                if (_this.state.slideIndex === 1 && _this.nextButton.current) {
                    _this.nextButton.current.focus();
                }
                _this.setState({ slideIndex: _this.state.slideIndex - 1 });
            }
        };
        _this._renderPanel = function () {
            var _a;
            var currentSlide = _this.props.slides[_this.state.slideIndex];
            var firstSlide = _this.state.slideIndex === 0;
            var lastSlide = _this.state.slideIndex + 1 === _this.props.slides.length;
            if (!currentSlide) {
                return null;
            }
            return (React.createElement(Callout, { className: "bolt-teaching-panel-layer", contentClassName: ((_a = _this.props.className) !== null && _a !== void 0 ? _a : "bolt-teaching-panel") + " depth-16", contentJustification: ContentJustification.Center, contentLocation: ContentLocation.Center, contentOrientation: ContentOrientation.Column, contentShadow: true, escDismiss: true, lightDismiss: true, modal: true, onDismiss: _this._onPanelClose },
                React.createElement(FocusZone, { circularNavigation: true, defaultActiveElement: ".bolt-teaching-panel-next", focusOnMount: true, handleTabKey: true },
                    React.createElement("div", { className: "bolt-teaching-panel-container flex-grow flex-column scroll-hidden" },
                        React.createElement("div", { className: "bolt-teaching-panel-visual flex-row flex-noshrink" },
                            React.createElement("img", { className: "bolt-teaching-panel-image flex-row", src: currentSlide.slideImage, alt: currentSlide.imageAltText }),
                            React.createElement(Button, { subtle: true, className: "bolt-teaching-pane-close-button", ariaLabel: Resources.Close, iconProps: { iconName: "Cancel" }, onClick: _this._onPanelClose })),
                        React.createElement("div", { className: "bolt-teaching-panel-description flex-column flex-grow padding-16 rhythm-vertical-16 scroll-hidden" },
                            React.createElement(Tooltip, { overflowOnly: true },
                                React.createElement("span", { className: "bolt-teaching-panel-header title-m text-ellipsis flex-noshrink" }, currentSlide.title)),
                            React.createElement("span", { className: "bolt-teaching-panel-text flex-grow body-l v-scroll-auto custom-scrollbar", dangerouslySetInnerHTML: { __html: currentSlide.description } }),
                            React.createElement("div", { className: "bolt-teaching-panel-buttons flex-row relative" },
                                React.createElement(Button, { text: Resources.Back, onClick: _this._onBackPressed, className: css("bolt-teaching-panel-back", firstSlide && "first-slide"), disabled: _this.state.slideIndex <= 0 }),
                                React.createElement(Button, { ref: _this.nextButton, primary: true, text: lastSlide ? Resources.Done : Resources.Next, onClick: _this._onNextPressed, className: "bolt-teaching-panel-next" }),
                                React.createElement("div", { className: "bolt-teaching-panel-progress flex-row flex-grow flex-center justify-center rhythm-horizontal-8 absolute-fill" }, _this.props.slides.map(function (item, index) {
                                    return (React.createElement("div", { key: "progress-" + index, className: css("bolt-teaching-panel-progress-circle", _this.state.slideIndex === index && "current") }));
                                }))))))));
        };
        _this.state = {
            slideIndex: 0,
            shouldShow: true
        };
        return _this;
    }
    TeachingPanel.prototype.render = function () {
        return this.state.shouldShow ? this._renderPanel() : null;
    };
    return TeachingPanel;
}(React.Component));
export { TeachingPanel };
