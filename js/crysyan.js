/**
 *  @module
 */
(function ($load) {
    'use strict';

    var jsLoadCache = [];

    /**
     * Simple dynamically load JS file in serial
     *
     * @param {Array|string} filePaths  the path of js file
     * @param {function} callback  will be called  after all file be completely loaded
     */
    function requireSeries(filePaths, callback) {
        var headElement = document.getElementsByTagName("head").item(0) || document.documentElement;

        if (typeof filePaths === "string") {
            filePaths = [filePaths];
        }
        if (typeof filePaths !== "object") {
            return;
        }
        var recursiveLoad = function (i) {
            if (i >= filePaths.length && typeof callback === "function") {
                callback();
                return
            }
            var script = document.createElement("script");
            script.src = filePaths[i];
            script.type = "text/javascript";
            script.onload = script.onreadystatechange = function () {
                // !/*@cc_on!@*/0 not IE
                if (!/*@cc_on!@*/0 || this.readyState == "loaded" || this.readyState == "complete") {
                    // remove the 'script' tag  after loading the js file is complete
                    this.onload = this.onreadystatechange = null;
                    this.parentNode.removeChild(this);
                    if (i < filePaths.length) {
                        recursiveLoad(i + 1);
                    }
                }
            };
            headElement.appendChild(script);
        };
        recursiveLoad(0);
    }

    //
    var init = function () {
        alert("successfully load");
    };
    if ($load) {
        // load file（Pseudo module）
        var baseLoadPath = "";
        requireSeries([
            baseLoadPath + "util.js",
            baseLoadPath + "config.js",
            baseLoadPath + "widget.js",
            baseLoadPath + "canvas.js",
            baseLoadPath + "view.js"
        ], init);
    } else {

    }

})(true);
