import { __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./FilterBar.css";
import * as React from "react";
import * as Utils_Accessibility from '../../Core/Util/Accessibility';
import { format } from '../../Core/Util/String';
import { Button } from '../../Button';
import * as Resources from '../../Resources.FilterBar';
import { SurfaceBackground, SurfaceContext } from '../../Surface';
import { css, getSafeId } from '../../Util';
import { FILTER_APPLIED_EVENT, FILTER_CHANGE_EVENT } from '../../Utilities/Filter';
var idCount = 0;
var FilterBar = /** @class */ (function (_super) {
    __extends(FilterBar, _super);
    function FilterBar(props) {
        var _this = _super.call(this, props) || this;
        _this._firstChildIsKeywordItem = false;
        _this._prevContainerWidth = 0;
        _this._id = getSafeId("filter-bar-" + idCount++);
        _this._onResize = function () {
            if (!_this._resizeTimeout) {
                _this._resizeTimeout = setTimeout(function () {
                    _this._resizeTimeout = null;
                    if (_this._isMounted) {
                        var containerIsGrowing = _this._prevContainerWidth < _this._filterBarElement.clientWidth;
                        var shouldHidePlaceholderLabels = _this.state.shouldHidePlaceholderLabels && containerIsGrowing ? false : _this.state.shouldHidePlaceholderLabels;
                        var shouldHaveMaxItemWidth = _this.state.shouldHaveMaxItemWidth && containerIsGrowing ? false : _this.state.shouldHaveMaxItemWidth;
                        _this._prevContainerWidth = _this._filterBarElement.clientWidth;
                        _this.setState({ filtersToShowStopIndex: FilterBar.RENDER_EVERYTHING, shouldHidePlaceholderLabels: shouldHidePlaceholderLabels, shouldHaveMaxItemWidth: shouldHaveMaxItemWidth });
                    }
                }, 100);
            }
        };
        _this._onPageLeft = function () {
            _this._hasMadeVisibleFilterAnnouncement = false;
            var startIndex = _this._startingFilterIndices.pop() || 0;
            _this._hasPagedLeft = true;
            _this.setState({ filtersToShowStartIndex: startIndex, filtersToShowStopIndex: FilterBar.RENDER_EVERYTHING });
        };
        _this._onPageRight = function () {
            _this._hasMadeVisibleFilterAnnouncement = false;
            _this._startingFilterIndices.push(_this.state.filtersToShowStartIndex);
            _this._hasPagedRight = true;
            _this.setState({ filtersToShowStartIndex: _this.state.filtersToShowStopIndex, filtersToShowStopIndex: FilterBar.RENDER_EVERYTHING });
        };
        _this._calculateFiltersToShowStopIndex = function () {
            var totalWidth = _this._rightElement.clientWidth;
            for (var i = 0; i < _this._childrenContainerElements.length; i++) {
                var elem = _this._childrenContainerElements[i];
                var elemWidth = elem.clientWidth + parseFloat(window.getComputedStyle(elem).marginRight);
                totalWidth += elemWidth;
                if (totalWidth > _this._filterBarElement.clientWidth) {
                    // Make sure we show at least one filter.
                    var endIndex = _this.state.filtersToShowStartIndex + i;
                    return endIndex > _this.state.filtersToShowStartIndex ? endIndex : _this.state.filtersToShowStartIndex + 1;
                }
            }
            return _this.state.filtersToShowStartIndex + _this._childrenContainerElements.length;
        };
        _this._onFilterChanged = function (changedState) {
            _this.setState({
                hasChangesToApply: _this.props.filter.hasChangesToApply(),
                hasChangesToReset: _this.props.filter.hasChangesToReset(),
                filtersToShowStopIndex: FilterBar.RENDER_EVERYTHING,
                shouldHidePlaceholderLabels: false
            });
        };
        _this._onFilterApplied = function (changedState) {
            _this.setState({
                hasChangesToApply: _this.props.filter.hasChangesToApply()
            });
        };
        _this._onClearAndDismiss = function () {
            if (_this.props.filter.hasChangesToReset()) {
                _this.props.filter.reset();
            }
            if (_this.props.onDismissClicked) {
                _this.props.onDismissClicked();
            }
            _this.focus();
        };
        _this._onApplyChanges = function () {
            _this.props.filter.applyChanges();
            _this.focus();
        };
        if (!props.filter) {
            throw new Error("Cannot create a FilterBar without a filter prop.");
        }
        _this._startingFilterIndices = [];
        _this._hasMadeVisibleFilterAnnouncement = false;
        _this._isMounted = false;
        _this.state = {
            hasChangesToReset: props.filter.hasChangesToReset(),
            hasChangesToApply: props.filter.hasChangesToApply(),
            filtersToShowStartIndex: 0,
            filtersToShowStopIndex: FilterBar.RENDER_EVERYTHING,
            shouldHidePlaceholderLabels: false,
            shouldHaveMaxItemWidth: false
        };
        return _this;
    }
    FilterBar.prototype.focus = function () {
        if (this._filterItemRefs && this._filterItemRefs.length > 0) {
            this._filterItemRefs[0].focus();
        }
    };
    FilterBar.prototype.forceUpdate = function () {
        _super.prototype.forceUpdate.call(this);
        if (this._filterItemRefs) {
            this._filterItemRefs.forEach(function (filterItem) { return filterItem.forceUpdate(); });
        }
    };
    FilterBar.prototype.componentDidMount = function () {
        this.props.filter && this.props.filter.subscribe(this._onFilterChanged, FILTER_CHANGE_EVENT);
        this.props.filter && this.props.filter.subscribe(this._onFilterApplied, FILTER_APPLIED_EVENT);
        window.addEventListener("resize", this._onResize);
        var stopIndex = this._calculateFiltersToShowStopIndex();
        if (stopIndex < React.Children.toArray(this.props.children).length - 1) {
            this.setState({ shouldHidePlaceholderLabels: true });
        }
        else {
            this.setState({ filtersToShowStopIndex: stopIndex });
        }
        this._isMounted = true;
        if (this.props.onMounted) {
            this.props.onMounted(this);
        }
    };
    FilterBar.prototype.UNSAFE_componentWillReceiveProps = function (nextProps) {
        // Bug#1284606 Checking our child components to see if we actually changed
        // the contents of the filter bar so we can know if we want to reload tabbing
        // and adjust how we're drawing out child components
        var currentKeys = this.getChildKeysAsString(this.props);
        var newKeys = this.getChildKeysAsString(nextProps);
        if (currentKeys !== newKeys) {
            // Bug#1284606 Triggers a full re-render in the event we changed the child elements
            this.setState({
                hasChangesToApply: nextProps.filter.hasChangesToApply(),
                hasChangesToReset: nextProps.filter.hasChangesToReset(),
                filtersToShowStartIndex: 0,
                filtersToShowStopIndex: FilterBar.RENDER_EVERYTHING
            });
        }
        else {
            // Normal prop updates, triggered when child components update as well
            this.setState({
                hasChangesToApply: nextProps.filter.hasChangesToApply(),
                hasChangesToReset: nextProps.filter.hasChangesToReset()
            });
        }
    };
    FilterBar.prototype.componentWillUnmount = function () {
        this.props.filter && this.props.filter.unsubscribe(this._onFilterChanged, FILTER_CHANGE_EVENT);
        this.props.filter && this.props.filter.unsubscribe(this._onFilterApplied, FILTER_APPLIED_EVENT);
        window.removeEventListener("resize", this._onResize);
        this._isMounted = false;
    };
    FilterBar.prototype.componentDidUpdate = function () {
        if (this.props.onRenderComplete) {
            this.props.onRenderComplete();
        }
        if (this._hasPagedLeft && this.state.filtersToShowStopIndex > 0) {
            if (this.state.filtersToShowStartIndex == 0) {
                this._nextButtonElem && this._nextButtonElem.focus();
            }
            this._hasPagedLeft = false;
        }
        if (this.state.filtersToShowStopIndex < 0) {
            var filtersToShowStopIndex = this._calculateFiltersToShowStopIndex();
            var allFiltersFit = filtersToShowStopIndex === React.Children.toArray(this.props.children).length;
            if (!allFiltersFit && !this.state.shouldHidePlaceholderLabels) {
                this.setState({ shouldHidePlaceholderLabels: true });
            }
            else if (!allFiltersFit && !this.state.shouldHaveMaxItemWidth) {
                this.setState({ shouldHaveMaxItemWidth: true });
            }
            else {
                if (this._hasPagedRight && filtersToShowStopIndex === this.state.filtersToShowStartIndex + this._childrenContainerElements.length) {
                    this._prevButtonElem && this._prevButtonElem.focus();
                }
                this.setState({ filtersToShowStopIndex: filtersToShowStopIndex });
                this._hasPagedRight = false;
            }
        }
        else if (!this._hasMadeVisibleFilterAnnouncement) {
            Utils_Accessibility.announce(format(Resources.AnnonuceVisibleFilters, this.state.filtersToShowStartIndex + 1, this.state.filtersToShowStopIndex), false);
            this._hasMadeVisibleFilterAnnouncement = true;
        }
        if (this._prevContainerWidth != this._filterBarElement.clientWidth) {
            this._onResize();
        }
    };
    FilterBar.prototype.render = function () {
        var _this = this;
        var _a = this.props, children = _a.children, filter = _a.filter, className = _a.className, onDismissClicked = _a.onDismissClicked;
        var _b = this.state, hasChangesToApply = _b.hasChangesToApply, hasChangesToReset = _b.hasChangesToReset, filtersToShowStopIndex = _b.filtersToShowStopIndex, filtersToShowStartIndex = _b.filtersToShowStartIndex, shouldHaveMaxItemWidth = _b.shouldHaveMaxItemWidth, shouldHidePlaceholderLabels = _b.shouldHidePlaceholderLabels;
        this._filterItemRefs = [];
        this._childrenContainerElements = [];
        var isFirstChild = true;
        var isKeywordPresent = false;
        this._firstChildIsKeywordItem = false;
        var childrenWithProps = React.Children.map(children, function (child) {
            if (child === null) {
                return null;
            }
            var containerClassName = "vss-FilterBar--item";
            var childElement = child;
            if (childElement.props.isTextItem && !isKeywordPresent) {
                _this._firstChildIsKeywordItem = isFirstChild;
                isKeywordPresent = true;
                containerClassName = css(containerClassName, "vss-FilterBar--item-keyword-container");
            }
            else if (shouldHaveMaxItemWidth) {
                containerClassName = css(containerClassName, "max-width-small");
            }
            isFirstChild = false;
            var childWithProps = React.cloneElement(childElement, {
                filter: childElement.props.filter || filter,
                ref: function (elem) {
                    if (elem) {
                        _this._filterItemRefs.push(elem);
                    }
                },
                hideSelectedItemIcon: true,
                showPlaceholderAsLabel: !shouldHidePlaceholderLabels && childElement.props.showPlaceholderAsLabel
            });
            return (React.createElement("div", { className: containerClassName, ref: function (elem) {
                    if (elem) {
                        _this._childrenContainerElements.push(elem);
                    }
                } }, childWithProps));
        });
        var canPageRight = filtersToShowStopIndex < childrenWithProps.length;
        var canPageLeft = filtersToShowStartIndex > 0;
        if (canPageRight || canPageLeft) {
            var endIndex = filtersToShowStopIndex > 0 ? filtersToShowStopIndex : childrenWithProps.length;
            childrenWithProps = childrenWithProps.slice(filtersToShowStartIndex, endIndex);
        }
        var clearLabel = onDismissClicked ? Resources.ClearAndDismissFilterBarLinkLabel : Resources.ClearFilterBarLinkLabel;
        return (React.createElement(SurfaceContext.Consumer, null, function (surfaceContext) { return (React.createElement("div", { className: css(className, "vss-FilterBar", surfaceContext.background === SurfaceBackground.neutral && "bolt-filterbar-white depth-8 no-v-margin"), role: "search", id: _this._id },
            React.createElement("div", { className: css("vss-FilterBar--list", (!_this._firstChildIsKeywordItem || filtersToShowStartIndex > 0) && "justify-right"), ref: function (elem) {
                    _this._filterBarElement = elem;
                } },
                childrenWithProps,
                React.createElement("div", { className: "vss-FilterBar--right-items", ref: function (elem) {
                        _this._rightElement = elem;
                    } },
                    (canPageLeft || canPageRight) && (React.createElement("div", { className: "vss-FilterBar--page-button-container" },
                        React.createElement(Button, { className: "filter-bar-button  vss-FilterBar-page-button", ref: function (elem) {
                                _this._prevButtonElem = elem;
                            }, onClick: _this._onPageLeft, disabled: !canPageLeft, ariaLabel: Resources.FilterPageLeftAriaLabel, iconProps: { iconName: "ChevronLeftMed" } }),
                        React.createElement(Button, { className: "filter-bar-button vss-FilterBar-page-button", ref: function (elem) {
                                _this._nextButtonElem = elem;
                            }, onClick: _this._onPageRight, disabled: !canPageRight, ariaLabel: Resources.FilterPageRightAriaLabel, iconProps: { iconName: "ChevronRightMed" } }))),
                    !_this.props.hideClearAction && (React.createElement("div", { className: "vss-FilterBar--action vss-FilterBar--action-clear" },
                        React.createElement(Button, { ariaLabel: clearLabel, className: "filter-bar-button", disabled: !hasChangesToReset && !onDismissClicked, iconProps: { iconName: "Cancel" }, onClick: _this._onClearAndDismiss, subtle: true, tooltipProps: { text: clearLabel } }))),
                    filter.usesApplyMode() && (React.createElement("div", { className: "vss-FilterBar--action vss-FilterBar--action-apply" },
                        React.createElement(Button, { className: "filter-bar-button", disabled: !hasChangesToApply, onClick: _this._onApplyChanges, iconProps: { iconName: "CheckMark" } }, Resources.ApplyChangesFilterBarText))))))); }));
    };
    FilterBar.prototype.getChildKeysAsString = function (props) {
        var childKeys = (props.children &&
            React.Children.map(props.children, function (child) {
                if (child === null) {
                    return null;
                }
                var childAsFilterBarItem = child;
                // If the child isn't able to be cast properly, just note that it exists
                // it's infeasible to get a unique identifier from an arbitrary, possibly stateful component
                // That said, we DO want to at least count these elements instead of excluding them
                // so we aren't filtering them out
                if (childAsFilterBarItem === undefined) {
                    return "";
                }
                return childAsFilterBarItem.props.filterItemKey;
            })) ||
            [];
        return JSON.stringify(childKeys);
    };
    FilterBar.RENDER_EVERYTHING = -1;
    return FilterBar;
}(React.Component));
export { FilterBar };
