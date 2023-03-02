import { __assign, __extends } from "tslib";
import "../../CommonImports";
import "../../Core/core.css";
import "./IdentityCard.css";
/**
 * The IdentityCard is intended to show contact and organization information for an identity.
 * You may pass the entity directly or you may pass a unique attribute (e.g. uniqueName, entityID, signInAddress) as a prop.
 *
 */
import * as React from "react";
import { CardType } from "./IdentityCard.Props";
import { IdentityCardContent } from "./IdentityCardContent";
import * as Utils from "./IdentityCardIdentityUtils";
var IdentityCard = /** @class */ (function (_super) {
    __extends(IdentityCard, _super);
    function IdentityCard(props) {
        var _this = _super.call(this, props) || this;
        _this.calloutRef = React.createRef();
        _this.onDismissCallback = function () {
            _this.props.onDismissCallback && _this.props.onDismissCallback();
        };
        // Handle going back
        _this.headerOnClickHandler = function () {
            if (_this.state.dataState.previousDataState) {
                _this.setState({
                    dataState: _this.state.dataState.previousDataState,
                    working: false
                });
            }
            else if (_this.props.initialHeader && _this.props.initialHeader.onClickFunction) {
                _this.props.initialHeader.onClickFunction();
            }
        };
        _this.onShowContactCard = function () {
            var newDataState = __assign(__assign({}, _this.state.dataState), { previousDataState: _this.state.dataState, cardType: CardType.Contact, header: _this.state.dataState.identity });
            _this.setState({
                dataState: newDataState
            });
        };
        _this.onShowOrganizationCard = function () {
            // Do not handle click event if working
            if (_this.state.working || _this.dismissed) {
                return;
            }
            var currentDataState = _this.state.dataState;
            if (currentDataState.isGroup) {
                // Only make the call if we don't have the data already
                var currentDataState_1 = _this.state.dataState;
                var newDataState = __assign(__assign({}, currentDataState_1), { cardType: CardType.Organization, header: currentDataState_1.identity, previousDataState: currentDataState_1 });
                _this.setState({
                    dataState: newDataState
                });
                if (!currentDataState_1.successors || currentDataState_1.successors.length <= 1) {
                    _this.setState({
                        working: true
                    });
                    _this.resolveIdentity(newDataState, _this.props.onRequestConnectionInformation(currentDataState_1.identity));
                }
            }
            else if (currentDataState.managerList && currentDataState.managerList.length <= 1) {
                // Only make the call if we don't have the data already
                var currentDataState_2 = _this.state.dataState;
                var newDataState = __assign(__assign({}, currentDataState_2), { cardType: CardType.Organization, header: currentDataState_2.identity, previousDataState: currentDataState_2 });
                _this.setState({
                    dataState: newDataState,
                    working: true
                });
                _this.resolveIdentity(newDataState, _this.props.onRequestConnectionInformation(currentDataState_2.identity, true));
            }
            else {
                // Already have the data so we can present
                var currentDataState_3 = _this.state.dataState;
                var newDataState = __assign(__assign({}, currentDataState_3), { cardType: CardType.Organization, header: currentDataState_3.identity, previousDataState: currentDataState_3 });
                _this.setState({
                    dataState: newDataState,
                    working: false
                });
            }
        };
        // Handle entity click
        _this.onClickEntity = function (identity) {
            // Do not handle click event if working
            if (_this.state.working) {
                return;
            }
            var currentDataState = _this.state.dataState;
            var newDataState = {
                identity: identity,
                cardType: CardType.Default,
                header: currentDataState.identity,
                isGroup: Utils.isGroup(currentDataState.identity),
                directReportList: [],
                managerList: [],
                previousDataState: currentDataState,
                displayName: identity.displayName,
                imageUrl: identity.image,
                email: identity.mail
            };
            _this.setState({
                dataState: newDataState,
                working: true
            });
            // API call to get identity
            _this.getIdentityByUniqueAttribute(identity);
        };
        _this.updateConnections = function (dataState, connections) {
            // Don't call if the component is unmounted.
            if (_this.dismissed) {
                return;
            }
            // ensure we haven't attempted to update which card we were in before the callback happens.
            if (_this.state.dataState && dataState.identity === _this.state.dataState.identity) {
                _this.setState({
                    dataState: __assign(__assign({}, _this.state.dataState), { managerList: connections.managers && connections.managers.reverse(), directReportList: connections.directReports, successors: connections.successors }),
                    working: false
                });
            }
        };
        _this.updateEntity = function (identity) {
            if (!identity) {
                // The identity could not be found
                _this.setState({
                    working: false
                });
                return;
            }
            if (!Utils.isCompleteIdentity(identity, true)) {
                // The identity was found but doesn't have enough info to display
                _this.setState({
                    working: false,
                    showUnknownUser: true
                });
                return;
            }
            var requireConnections = (Utils.isGroup(identity) && (!_this.state.dataState.successors || _this.state.dataState.successors.length <= 0)) ||
                Utils.isAadUser(identity) ||
                Utils.isAdUser(identity);
            var imageUrl = _this.props.imageUrl ? _this.props.imageUrl : identity.image;
            // Update data state and working state (visible state updated later)
            var newDataState = __assign(__assign({}, _this.state.dataState), { identity: identity, displayName: identity.displayName, imageUrl: imageUrl, isGroup: Utils.isGroup(identity) });
            // Check for authenticated users. For authenticated users, go on to make the connections call. For non-authenticated users, stop the calls and load the card with images.
            if (requireConnections) {
                _this.setState({ dataState: newDataState, working: false });
                _this.resolveIdentity(newDataState, _this.props.onRequestConnectionInformation(newDataState.identity));
            }
            else {
                _this.setState({ dataState: newDataState, working: false });
            }
        };
        // Setup state data and history
        var initialDataState = {
            identity: props.identity,
            managerList: undefined,
            directReportList: undefined,
            previousDataState: undefined,
            cardType: CardType.Default,
            header: props.initialHeader ? props.initialHeader.identity : undefined,
            displayName: props.displayName,
            imageUrl: props.imageUrl,
            email: _this.getEmail(),
            isGroup: Utils.isGroup(props.identity)
        };
        var moreWorkNeeded = true;
        if (!props.identity && !props.uniqueAttribute && props.displayName) {
            // All we have is displayName and may be imageUrl. Simply go ahead and setup the state for displaying the card without any identity call.
            initialDataState.identity = {
                entityId: "",
                entityType: "user",
                originDirectory: "vsd",
                originId: "",
                displayName: props.displayName,
                image: props.imageUrl,
                signInAddress: initialDataState.email
            };
            moreWorkNeeded = false;
        }
        _this.state = {
            dataState: initialDataState,
            showUnknownUser: false,
            working: moreWorkNeeded
        };
        return _this;
    }
    IdentityCard.prototype.componentDidMount = function () {
        if (this.state.working) {
            this.setupInitialData(this.props.uniqueAttribute);
        }
    };
    IdentityCard.prototype.componentDidUpdate = function () {
        // If the content was updated, we may need to update the callout so it is positioned correctly.
        this.calloutRef.current && !this.state.working && this.calloutRef.current.updateLayout();
    };
    IdentityCard.prototype.componentWillUnmount = function () {
        this.dismissed = true;
    };
    // Render
    IdentityCard.prototype.render = function () {
        return this.props.uniqueAttribute || this.props.identity || this.props.displayName ? (React.createElement(IdentityCardContent, __assign({}, this.props, { dataProps: this.state.dataState, onClickEntity: this.onClickEntity, onDismissCallback: this.onDismissCallback, onShowContactCard: this.onShowContactCard, onShowOrganizationCard: this.onShowOrganizationCard, working: this.state.working, onHeaderClick: this.headerOnClickHandler, calloutRef: this.calloutRef, showUnknownUser: this.state.showUnknownUser }))) : null;
    };
    // Helper method to get initial data (which includes only direct manager)
    IdentityCard.prototype.setupInitialData = function (uniqueAttribute) {
        var dataState = this.state.dataState;
        if (!dataState.identity && uniqueAttribute) {
            // Get identity first, then get connections in callback
            this.getIdentityByUniqueAttribute(uniqueAttribute);
        }
        else if (dataState.identity && !Utils.isCompleteIdentity(dataState.identity)) {
            // Seems to be cached, refetch identity by unique attribute (entityId)
            this.getIdentityByUniqueAttribute(dataState.identity);
        }
        else {
            if (Utils.isGroup(dataState.identity) && dataState.successors && dataState.successors.length > 0) {
                this.resolveIdentity(dataState, { successors: dataState.successors });
            }
            else {
                this.resolveIdentity(dataState, this.props.onRequestConnectionInformation(dataState.identity));
            }
        }
    };
    // Helper method to get identity information given an entity ID
    IdentityCard.prototype.resolveIdentity = function (dataState, identity) {
        var _this = this;
        var identityAsEntity = identity;
        var identityAsPromiseLike = identity;
        if (identityAsPromiseLike && identityAsPromiseLike.then) {
            identityAsPromiseLike.then(function (connections) {
                _this.updateConnections(dataState, connections);
            });
        }
        else if (identityAsEntity) {
            this.updateConnections(dataState, identityAsEntity);
        }
    };
    // Helper method to get identity information given an entity ID
    IdentityCard.prototype.resolveIEntity = function (identity) {
        var _this = this;
        var identityAsEntity = identity;
        var identityAsPromiseLike = identity;
        if (identityAsPromiseLike && identityAsPromiseLike.then) {
            identityAsPromiseLike.then(function (connections) {
                _this.updateEntity(connections);
            });
        }
        else {
            this.updateEntity(identityAsEntity);
        }
    };
    // Helper method to get identity information given an entity ID
    IdentityCard.prototype.getIdentityByUniqueAttribute = function (identifier) {
        var uniqueAttribute;
        if (typeof identifier == "string") {
            uniqueAttribute = identifier;
        }
        else if (Utils.isGroup(identifier) || Utils.isAadUser(identifier) || Utils.isAdUser(identifier)) {
            uniqueAttribute = identifier.entityId;
        }
        else {
            uniqueAttribute = identifier.signInAddress ? identifier.signInAddress : ""; // VSD users (MSA accounts)
        }
        this.resolveIEntity(this.props.getEntityFromUniqueAttribute(uniqueAttribute));
    };
    IdentityCard.prototype.getEmail = function () {
        if (this.props.identity) {
            // This is for displaying a fall back card when identities search doesn't fetch any identity
            if ((Utils.isAadUser(this.props.identity) || Utils.isAdUser(this.props.identity)) && this.props.identity.mail) {
                return this.props.identity.mail;
            }
            else if (this.props.identity && this.props.identity.signInAddress) {
                return this.props.identity.signInAddress;
            }
            else if (this.props.identity && this.props.identity.mail) {
                return this.props.identity.mail;
            }
            else if (this.props.uniqueAttribute) {
                // Check if uniqueAttribute is an email
                var parts = this.props.uniqueAttribute.split("@");
                if (parts.length === 2 && parts[0].length >= 1 && parts[1].length >= 3) {
                    var domainParts = parts[1].split(".");
                    if (domainParts.length > 1) {
                        return this.props.uniqueAttribute;
                    }
                }
            }
        }
        return "";
    };
    return IdentityCard;
}(React.Component));
export { IdentityCard };
