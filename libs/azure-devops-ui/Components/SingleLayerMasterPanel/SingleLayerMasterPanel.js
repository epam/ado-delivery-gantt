import "../../CommonImports";
import "../../Core/core.css";
import "./SingleLayerMasterPanel.css";
import * as React from "react";
import { useObservable } from '../../Core/Observable';
import { TimerManagement } from '../../Core/TimerManagement';
import { Header, TitleSize } from '../../Header';
import { Intersection } from '../../Intersection';
import { Observer } from '../../Observer';
import { css } from '../../Util';
/**
 * Props-controlled implementation of MasterPanel for experiences that don't need the layering of MasterDetailsContext
 */
export var SingleLayerMasterPanel = function (props) {
    var className = props.className, renderContent = props.renderContent, renderHeader = props.renderHeader, renderSearch = props.renderSearch, _a = props.showOnSmallScreens, showOnSmallScreens = _a === void 0 ? false : _a;
    var _b = useObservable(false), isScrolled = _b[0], setIsScrolled = _b[1];
    var containerElement = React.useRef(null);
    var headerElement = React.useRef(null);
    var hiddenHeaderElement = React.useRef(null);
    var contentElement = React.useRef(null);
    var initialHeaderHeight = React.useRef(0);
    var scrolledHeaderHeight = React.useRef(0);
    var timerManagement = React.useRef(new TimerManagement());
    var blockingHeaderExpand = React.useRef(false);
    var lastBlockTimeoutId = React.useRef();
    var onContentScroll = function () {
        if (containerElement.current && contentElement.current) {
            var scrollTop = containerElement.current.scrollTop;
            if (isScrolled.value && !blockingHeaderExpand.current && scrollTop === 0) {
                setIsScrolled(false);
            }
            else if (!isScrolled.value &&
                // Detects thrashing: if the large header is bigger than the container AND
                // the small header is smaller than the container, we'll cause layout thrashing
                // If that check fails, we're good to go and can apply the scrolled style to the header
                !(initialHeaderHeight.current + contentElement.current.clientHeight > containerElement.current.clientHeight &&
                    scrolledHeaderHeight.current + contentElement.current.clientHeight < containerElement.current.clientHeight)) {
                blockingHeaderExpand.current = true;
                // This is done to prevent thrashing when the panel is only scrolled a little bit; the browser would reset scrollTop to 0, so we added a slight delay to allow users to scroll more smoothly
                lastBlockTimeoutId.current && timerManagement.current.clearTimeout(lastBlockTimeoutId.current);
                lastBlockTimeoutId.current = timerManagement.current.setTimeout(function () {
                    blockingHeaderExpand.current = false;
                    onContentScroll(); // Repeat process to verify
                }, 100);
                setIsScrolled(true);
            }
        }
    };
    var removeIds = function (element) {
        if (element) {
            element.id = "";
            if (element.hasChildNodes()) {
                var children = element.children;
                for (var i = 0; i < children.length; i++) {
                    removeIds(children.item(i));
                }
            }
        }
    };
    React.useEffect(function () {
        if (headerElement.current) {
            initialHeaderHeight.current = headerElement.current.clientHeight;
        }
        if (hiddenHeaderElement.current) {
            // fix an a11y issue caused by the hidden header causing duplicate ids
            removeIds(hiddenHeaderElement.current);
            scrolledHeaderHeight.current = hiddenHeaderElement.current.clientHeight;
        }
        document.addEventListener("resize", onContentScroll);
        return function () {
            document.removeEventListener("resize", onContentScroll);
            timerManagement.current.dispose();
        };
    }, []);
    return (React.createElement(Intersection, null,
        React.createElement("div", { className: css(className, "bolt-master-panel flex-column flex-noshrink scroll-auto", showOnSmallScreens && "show-on-small-screens"), onScroll: onContentScroll, ref: containerElement },
            renderHeader && (React.createElement(React.Fragment, null,
                React.createElement(Observer, { isScrolled: isScrolled }, function (observerProps) { return (React.createElement("div", { className: css("bolt-master-panel-header", renderSearch && "has-search", observerProps.isScrolled && "content-scrolled"), ref: headerElement }, renderHeader())); }),
                React.createElement("div", { "aria-hidden": "true", className: css("bolt-master-panel-header hide", renderSearch && "has-search", "content-scrolled"), ref: hiddenHeaderElement }, renderHeader()))),
            React.createElement("div", { className: "bolt-master-panel-content flex-column", ref: contentElement },
                renderSearch && React.createElement("div", { className: "bolt-master-panel-search" }, renderSearch()),
                renderContent && renderContent()))));
};
export var SingleLayerMasterPanelHeader = function (props) {
    var title = props.title, titleAriaLevel = props.titleAriaLevel, subTitle = props.subTitle, onBackButtonClick = props.onBackButtonClick;
    return (React.createElement(Header, { backButtonProps: onBackButtonClick
            ? {
                onClick: onBackButtonClick,
                subtle: true
            }
            : undefined, className: "bolt-master-panel-standard-header", description: subTitle, descriptionClassName: "bolt-master-panel-header-subtitle bolt-master-panel-header-secondary", title: title, titleAriaLevel: titleAriaLevel, titleClassName: "bolt-master-panel-header-title", titleSize: TitleSize.Large }));
};
