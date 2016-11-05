/**
 *  Entrance for canvas operation
 *  @module CrysyanCanvas
 *  @depend util.js
 */
(function() {
    'use strict';
    /**
     * @class CrysyanCanvas
     *             You can take it as an canvas agent,
     *              because it has canvas document element and canvas' s 2d context instances.
     *  @param {object} ops  config for Canvas
     */
    function CrysyanCanvas(ops) {
        if (typeof ops !== 'object') {
            ops = {};
        }
        ops = $.extend(CrysyanCanvas.defaultOptions, ops);
        // canvas document element
        this.playCanvas = document.getElementById(ops.canvasId);
        // TODO:should throw an exception ?
        if (null === this.playCanvas)
            throw "can't get the Element by id:" + ops.canvasId;
        // 2d context to draw
        this.playContext = this.playCanvas.getContext("2d");
        this.playCanvas.width = ops.width;
        this.playCanvas.height = ops.height;

        this.drawingSurfaceImageData = null;

        // An array that store the history imgdata which capture from canvas
        // for revoking and forward revoking.
        // The length should shorter than 'ops.historyListLen'.
        // Element,the most left of array, must be removed when array is full(length=='historyListLen')
        // when pushing element at the most right
        this.revokeImgDatas = [];
        // An array that store the history imgdata which pop the most right element from 'revokeImgDatas'
        // for forward revoking.
        // It will be clear(length==0) when reediting after a history version of canvas's imgdata.
        this.forwardRevokeImgDatas = [];
        //  the most length of history 'revokeImgDatas' list
        this.historyListLen = ops.historyListLen;
    }

    CrysyanCanvas.prototype = {
        // Save e drawing surface
        saveDrawingSurface: function() {
            this.drawingSurfaceImageData = this.playContext.getImageData(0, 0,
                this.playCanvas.width,
                this.playCanvas.height);
        },
        // Restore drawing surface
        restoreDrawingSurface: function() {
            this.playContext.putImageData(this.drawingSurfaceImageData, 0, 0);
        },
        // save history ''drawingSurfaceImageData''
        saveRevokeImgDatas: function() {
            var drawingSurfaceImageData = this.playContext.getImageData(0, 0, this.playCanvas.width, this.playCanvas.height);
            if (this.revokeImgDatas.length >= this.historyListLen) {
                // If the length is longer than the maximum length of the configuration
                // Remove head element
                // Add new element at the end
                this.revokeImgDatas.shift();
                this.revokeImgDatas.push(drawingSurfaceImageData);
            } else {
                this.revokeImgDatas.push(drawingSurfaceImageData);
            }
            // clear the array
            this.forwardRevokeImgDatas = [];
        },
        // Revoke
        revoke: function() {
            var drawingSurfaceImageData = this.revokeImgDatas.pop();
            this.forwardRevokeImgDatas.push(drawingSurfaceImageData);
            this.playContext.putImageData(drawingSurfaceImageData, 0, 0);
        },
        //  Forward revoke
        forwardRevoke: function() {
            var drawingSurfaceImageData = this.forwardRevokeImgDatas.pop();
            this.revokeImgDatas.push(drawingSurfaceImageData);
            this.playContext.putImageData(drawingSurfaceImageData, 0, 0);
        },
        /**
         *  The event coordinate point is transformed
         *  from window coordinate system to canvas coordinate system.
         * @param  {number} x  e.clientX
         * @param  {number} y  e.clientY
         */
        windowToCanvas: function(x, y) {
            var bbox = canvas.getBoundingClientRect();
            return {
                x: x - bbox.left ,
                y: y - bbox.top
            };
            // return {
            //     x: x - bbox.left * (canvas.width / bbox.width),
            //     y: y - bbox.top * (canvas.height / bbox.height)
            // };
        },
        //  add  event  to canvas
        addEvent:function(eventType, callback){
                     CrysyanUtil.addEvent(this.playCanvas, eventType, callback);
        }
    };

    // the default config for Canvas
    CrysyanCanvas.defaultOptions = {
        // px
        width: 200,
        height: 150,
        // id of canvas element
        canvasId: "canvas",
        // length of history 'revokeImgDatas' list
        historyListLen: 10
    };


    // export to window
    window.CrysyanCanvas = CrysyanCanvas;
})();
