var EventGroup = /** @class */ (function () {
    function EventGroup(parent) {
        this.id = EventGroup.uniqueId++;
        this.isDisposed = false;
        this.parent = parent;
        this.eventRecords = [];
    }
    EventGroup.raise = function (target, eventName, eventArgs, bubbleEvent) {
        var returnValue;
        if (EventGroup.isElement(target)) {
            var event_1 = document.createEvent("HTMLEvents");
            event_1.initEvent(eventName, bubbleEvent || false, true);
            Object.assign(event_1, eventArgs);
        }
        else {
            while (target && returnValue !== false) {
                var events = target.__events__;
                var eventRecords = events ? events[eventName] : null;
                if (eventRecords) {
                    for (var id in eventRecords) {
                        if (eventRecords.hasOwnProperty(id)) {
                            var eventRecordList = eventRecords[id];
                            for (var listIndex = 0; returnValue !== false && listIndex < eventRecordList.length; listIndex++) {
                                var record = eventRecordList[listIndex];
                                if (record.objectCallback) {
                                    returnValue = record.objectCallback.call(record.parent, eventArgs);
                                }
                            }
                        }
                    }
                }
                target = bubbleEvent ? target.parent : null;
            }
        }
        return returnValue;
    };
    EventGroup.isElement = function (target) {
        return !!target && (!!target.addEventListener || (typeof HTMLElement !== "undefined" && target instanceof HTMLElement));
    };
    EventGroup.prototype.dispose = function () {
        if (!this.isDisposed) {
            this.isDisposed = true;
            this.off();
            this.parent = null;
        }
    };
    EventGroup.prototype.on = function (target, eventName, callback) {
        var _this = this;
        if (eventName.indexOf(",") > -1) {
            var events = eventName.split(/[,]+/);
            for (var event_2 in events) {
                this.on(target, event_2, callback);
            }
        }
        else {
            var parent_1 = this.parent;
            var eventRecord = {
                target: target,
                eventName: eventName,
                parent: parent_1,
                callback: callback
            };
            if (!target.__events__) {
                target.__events__ = {};
            }
            var events = target.__events__;
            if (!events[eventName]) {
                events[eventName] = {};
            }
            if (!events[eventName][this.id]) {
                events[eventName][this.id] = [];
            }
            events[eventName][this.id].push(eventRecord);
            if (EventGroup.isElement(target)) {
                var processElementEvent = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    if (_this.isDisposed) {
                        return;
                    }
                    var result = callback.apply(parent_1, args);
                    if (result === false && args[0]) {
                        var e = args[0];
                        e.preventDefault && e.preventDefault();
                        e.stopPropagation && e.stopPropagation();
                        e.cancelBubble = true;
                    }
                    return result;
                };
                eventRecord.elementCallback = processElementEvent;
                if (target.addEventListener) {
                    target.addEventListener(eventName, processElementEvent);
                }
            }
            else {
                var processObjectEvent = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    if (_this.isDisposed) {
                        return;
                    }
                    return callback.apply(parent_1, args);
                };
                eventRecord.objectCallback = processObjectEvent;
            }
            this.eventRecords.push(eventRecord);
        }
    };
    EventGroup.prototype.off = function (target, eventName, callback) {
        // For instead of foreach
        for (var i = 0; i < this.eventRecords.length; i++) {
            var eventRecord = this.eventRecords[i];
            if ((!target || target === eventRecord.target) &&
                (!eventName || eventName === eventRecord.eventName) &&
                (!callback || callback === eventRecord.callback)) {
                var events = eventRecord.target.__events__;
                var targetArrayLookup = events[eventRecord.eventName];
                var targetArray = targetArrayLookup ? targetArrayLookup[this.id] : null;
                if (targetArray) {
                    if (targetArray.length === 1 || !callback) {
                        delete events[eventRecord.eventName][this.id];
                    }
                    else {
                        targetArray.splice(targetArray.indexOf(eventRecord), 1);
                    }
                    // If there's no more event IDs attached, remove the eventName
                    if (Object.keys(events[eventRecord.eventName]).length === 0) {
                        delete events[eventRecord.eventName];
                    }
                }
                if (eventRecord.elementCallback) {
                    eventRecord.target.removeEventListener(eventRecord.eventName, eventRecord.elementCallback, eventRecord.options);
                }
                this.eventRecords.splice(i--, 1);
            }
        }
    };
    EventGroup.prototype.raise = function (eventName, eventArgs, bubbleEvent) {
        return EventGroup.raise(this.parent, eventName, eventArgs, bubbleEvent);
    };
    EventGroup.uniqueId = 0;
    return EventGroup;
}());
export { EventGroup };
