/**
 * Maximum number of messages to have in the containers that announce() uses.
 */
var MaxAnnounceChildren = 1;
/**
 * Maximum number of containers for announce() to have per assertiveness level.
 */
var MaxAnnounceContainers = 10;
/**
 * Default number of milliseconds to wait before announcing the start of an operation.
 */
var DefaultAnnounceDelay = 1000;
/**
 * ID of the container for the announce() containers.
 */
var ParentContainerId = "utils-accessibility-announce";
var nextId = 0;
/**
 * Gets the parent container for all the announce containers.
 */
function getAnnounceContainer() {
    var container = document.getElementById(ParentContainerId);
    if (!container) {
        container = document.createElement("div");
        container.id = ParentContainerId;
        container.classList.add("visually-hidden");
        document.body.appendChild(container);
    }
    return container;
}
/**
 * Causes screen readers to read the given message.
 * @param message
 * @param assertive if true, the screen reader will read the announcement immediately, instead of waiting for "the next graceful opportunity"
 */
export function announce(message, assertive, pause) {
    if (assertive === void 0) { assertive = false; }
    if (pause === void 0) { pause = 100; }
    if (!message) {
        return;
    }
    var assertiveness = assertive ? "assertive" : "polite";
    var parentContainer = getAnnounceContainer();
    var containerList = parentContainer.getElementsByClassName(assertiveness);
    var container = (containerList.length > 0 ? containerList[containerList.length - 1] : null);
    if (!container || container.childElementCount >= MaxAnnounceChildren) {
        container = document.createElement("div");
        container.id = ParentContainerId + nextId++;
        container.setAttribute("aria-live", assertiveness);
        container.classList.add(assertiveness);
        container.setAttribute("aria-relevant", "additions");
        parentContainer.appendChild(container);
        // getElementsByClassName() returns a live list so the new container is already in this list
        if (containerList.length > MaxAnnounceContainers) {
            // remove old containers
            parentContainer.removeChild(containerList[0]);
        }
        window.setTimeout(function () {
            // live regions get announced on update not create, so wait a bit and then update
            announce(message, assertive);
        }, pause);
    }
    else {
        var child = document.createElement("p");
        child.textContent = message;
        container.appendChild(child);
        // toggling the visibility like this seems to help Edge
        container.style.visibility = "hidden";
        container.style.visibility = "visible";
    }
}
/**
 * Class for announcing, through a screen reader, when a single operation begins and ends. Supports
 * a delay before the starting announcement so that quick operations don't trigger announcements.
 *
 * To use, create a ProgressAnnouncer, and call completed()
 */
var ProgressAnnouncer = /** @class */ (function () {
    function ProgressAnnouncer(options) {
        this._startAnnounced = false;
        this._completed = false;
        this._options = options;
        this._start();
    }
    /**
     * Create a ProgressAnnouncer for a promise that will announce promise start and completion/rejection.
     * @param promise
     * @param options
     */
    ProgressAnnouncer.forPromise = function (promise, options) {
        var announcer = new ProgressAnnouncer(options);
        promise.then(function () {
            announcer.announceCompleted();
        }, function () {
            announcer.announceError();
        });
        return announcer;
    };
    /**
     * Call this method when the operation has completed. This will cause the end message to be
     * announced if the start message was announced.
     */
    ProgressAnnouncer.prototype.announceCompleted = function () {
        if (!this._completed) {
            this._completed = true;
            if (this._startAnnounced) {
                announce(this._options.announceEndMessage);
            }
        }
    };
    /**
     * Call this method if the operation completes with an error. This will cause the error message
     * to be announced regardless of whether or not the start message was announced.
     */
    ProgressAnnouncer.prototype.announceError = function () {
        if (!this._completed) {
            this._completed = true;
            announce(this._options.announceErrorMessage);
        }
    };
    /**
     * Call this method to stop any announcements from being made
     */
    ProgressAnnouncer.prototype.cancel = function () {
        this._completed = true;
    };
    ProgressAnnouncer.prototype._start = function () {
        var _this = this;
        // this._announceDelay = Utils_Core.delay(this, this._options.announceStartDelay !== undefined ? this._options.announceStartDelay : DefaultAnnounceDelay, () => {
        window.setTimeout(function () {
            if (!_this._completed) {
                announce(_this._options.announceStartMessage);
            }
            _this._startAnnounced = true;
        }, this._options.announceStartDelay !== undefined ? this._options.announceStartDelay : DefaultAnnounceDelay);
    };
    return ProgressAnnouncer;
}());
export { ProgressAnnouncer };
