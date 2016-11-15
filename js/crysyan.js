/**
 *  @module Crysyan-Core
 */
(function($load) {
    'use strict';
    if (typeof $load==="undefined") $load=true;
    // jquery
    if (!window.$) {
        var jQuery = window.parent.$ || window.jQuery;
        if (!jQuery) {
            throw new Error("Crysyan requires 'jQuery'");
        } else {
            window.$ = jQuery;
        }
    }
    var jsLoadCache = [];
    // map to Cache  the view instances
    var viewCacheMap = {};
   // Parameters parsed from href
    var hrefRequestArgs = {};

    /**
     * Simple dynamically load JS file in serial
     *
     * @param {Array|string} filePaths  the path of js file
     * @param {function} callback  will be called  after all files been completely loaded
     */
    function requireSeries(filePaths, callback) {
        var headElement = document.getElementsByTagName("head").item(0) || document.documentElement;
        if (typeof filePaths === "string") {
            filePaths = [filePaths];
        }
        if (typeof filePaths !== "object") {
            return;
        }
        var recursiveLoad = function(i) {
            if (i >= filePaths.length) {
                if (typeof callback === "function") callback();
                return;
            }
            // if the file has been loaded
            // if (jsLoadCache.hasOwnProperty(filePaths[i])) {
            //     recursiveLoad(i + 1);
            // }
            var script = document.createElement("script");
            script.src = filePaths[i];
            script.type = "text/javascript";
            script.onload = script.onreadystatechange = function() {
                // !/*@cc_on!@*/0 not IE
                if (! /*@cc_on!@*/ 0 || this.readyState == "loaded" || this.readyState == "complete") {
                    // remove the 'script' tag  after loading the js file is complete
                    this.onload = this.onreadystatechange = null;
                    this.parentNode.removeChild(this);
                    // jsLoadCache[filePaths[i]] = 1;
                    if (i < filePaths.length) {
                        recursiveLoad(i + 1);
                    }
                }
            };
            headElement.appendChild(script);
        };
        recursiveLoad(0);
    }

    (function getRequest() {
        // get from URL string after '?'
        var url = decodeURI(location.search);
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                hrefRequestArgs[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
            }
        }
    })();
    //
    var widgetinit = function(callback) {
        var widgetBasePath = "../js/widget/";
        var widgetIconPath = "../img/";
        var widgetsLoad = [];
        var widgets = CrysyanWidgetConfig.widgets;
        for (var attr in widgets) {
            if (widgets[attr].hasOwnProperty("jsFile") && typeof widgets[attr].jsFile === "string" && widgets[attr].jsFile !== "") {
                widgetsLoad.push(widgetBasePath + widgets[attr].jsFile);
            }
            if (widgets[attr].hasOwnProperty("icon")) {
                widgets[attr].icon = widgetIconPath + widgets[attr].icon;
            }
        }
        if ($load) {
            requireSeries(widgetsLoad, callback);
        } else {
            callback();
        }
    };
    //
    var init = function() {
        widgetinit(function() {
            var config = JSON.parse(hrefRequestArgs.config);
            var view = new CrysyanView(config).init();
            viewCacheMap["default"] = view;
        });
    };
    if ($load) {
        // load file（Pseudo module）
        var baseLoadPath = "../js/";
        requireSeries([
            baseLoadPath + "util.js",
            baseLoadPath + "config.js",
            baseLoadPath + "widget.js",
            baseLoadPath + "canvas.js",
            baseLoadPath + "view.js",
        ], init);
    } else {
        init();
    }
    var Crysyan = {
        getView: function(name) {
            if (typeof name === "undefined" || name === "") name = "default";
            return viewCacheMap[name];
        }
    };
    window.Crysyan = Crysyan;
})(typeof CrysyanFlag==="undefined"? true:CrysyanFlag);
