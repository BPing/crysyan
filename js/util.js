/**
 *  utility
 *      common method
 */
(function() {
    'use strict';
    var util = {
        /**
         *  add  event  to element(Adaptation)
         *  @param {String} eventType  type of event
         *  @param {Function} callback function for callback
         */
        addEvent: function(element, eventType, callback) {
            // if (eventType.split(' ').length > 1) {
            //     var events = eventType.split(' ');
            //     for (var i = 0; i < events; i++) {
            //         util.addEvent(element, events[i], callback);
            //     }
            //     return;
            // }
            if (element.addEventListener) {
                element.addEventListener(eventType, callback, !1);
            } else if (element.attachEvent) { // for IE
                element.attachEvent('on' + eventType, callback);
            } else {
                element['on' + eventType] = callback;
            }
            return this;
        },

        /**
         *  remove  event  from element(Adaptation)
         *  @param {string} eventType  type of event
         *  @param {function} callback function for callback
         */
        removeEvent: function(element, eventType, callback) {
            if (element.removeEventListener) {
                element.removeEventListener(eventType, callback, !1);
            } else if (element.detachEvent) { // for IE
                element.detachEvent('on' + eventType, callback);
            } else {
                element['on' + eventType] = null;
            }
            return this;
        },
        isIE: function() {
            if (navigator.appName === "Microsoft Internet Explorer") {
                return true;
            }
            return false;
        }

    };
    // clone
    function clone(obj) {
        // Handle the 3 simple types, and null or undefined
        if (null === obj || "object" !== typeof obj) {
            return obj;
        }
        var result;
        if (obj instanceof Array) {
            result = [];
        } else if (obj instanceof Object) {
            result = {};
        }
        for (var attr in obj) {
            // Recursive clone
            result[attr] = clone(obj[attr]);
        }
        return result;
    }

    util.clone = clone;
    // export to window
    window.CrysyanUtil = util;
})();
