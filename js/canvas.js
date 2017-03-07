/**
 *  Entrance for canvas operation
 *  @module CrysyanCanvas
 *  @depend util.js
 */
(function($util) {
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
        if (ops.width !== 0)
            this.playCanvas.width = ops.width;
        if (ops.height !== 0)
            this.playCanvas.height = ops.height;

        this.drawingSurfaceImageData = null;
        // Background image information
        this.backgroudImage = {
            image: null,
            width: 0,
            height: 0
        };

        // An array that store the history imgdata which capture from canvas
        // for revoking and forward revoking.
        // The length should shorter than 'ops.historyListLen'.
        // Element,the most left of array, must be removed when array is full(length=='historyListLen')
        // when pushing element at the most right
        // The first frame is empty canvas
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
        saveForwardRevokeFirstFrame: function() {
            this.forwardRevokeImgDatas[0] = this.playContext.getImageData(0, 0, this.playCanvas.width, this.playCanvas.height);
        },
        // Revoke
        //  if length of list is zero ,return zero
        revoke: function() {
            if (this.revokeImgDatas.length <= 0)
                return 0;
            var drawingSurfaceImageData = this.revokeImgDatas.pop();
            this.forwardRevokeImgDatas.push(drawingSurfaceImageData);
            this.playContext.putImageData(drawingSurfaceImageData, 0, 0);
        },
        //  Forward revoke
        //  if length of list is zero ,return zero
        forwardRevoke: function() {
            if (this.forwardRevokeImgDatas.length <= 0)
                return 0;
            var drawingSurfaceImageData = this.forwardRevokeImgDatas.pop();
            this.revokeImgDatas.push(drawingSurfaceImageData);
            this.playContext.putImageData(drawingSurfaceImageData, 0, 0);
        },
        //
        clearCanvas: function() {
            this.playContext.clearRect(0, 0, this.playCanvas.width, this.playCanvas.height);
            if (this.backgroudImage.image !== null) {
                var image = this.backgroudImage.image;
                this.drawImage(image, (this.playCanvas.width - image.width) / 2, (this.playCanvas.height - image.height) / 2, image.width, image.height);
                return;
            }
        },
        /**
         *  The event coordinate point is transformed
         *  from window coordinate system to canvas coordinate system.
         * @param  {number} x  e.clientX
         * @param  {number} y  e.clientY
         */
        windowToCanvas: function(x, y) {
            var bbox = this.playCanvas.getBoundingClientRect();
            return {
                x: x - bbox.left,
                y: y - bbox.top
            };
            // return {
            //     x: x - bbox.left * (canvas.width / bbox.width),
            //     y: y - bbox.top * (canvas.height / bbox.height)
            // };
        },
        /**
         *
         * @param {String|File|Image|Blob} obj
         * @param mode
         */
        drawBackGroupWithImage: function(obj, mode) {
            if (typeof mode === "undefined") {
                //  image scaling mode
                //  if mode !=1 ,fulling mode
                //  default 1
                mode = 1;
            }
            var canvas = this;
            var image = new Image();
            // CORS settings attributes
            image.crossOrigin = 'Anonymous';
            image.onload = function () {
                canvas.backgroudImage.image = image;
                canvas.backgroudImage.width = canvas.playCanvas.width;
                canvas.backgroudImage.height = canvas.playCanvas.height;
                if (mode === 1) {
                    // Ratio of picture's and canvas's  width and height
                    var ivwr = image.width === 0 || canvas.playCanvas.width === 0 ? 0 : image.width / canvas.playCanvas.width;
                    var ivhr = image.height === 0 || canvas.playCanvas.height === 0 ? 0 : image.height / canvas.playCanvas.height;
                    if (image.width >= canvas.playCanvas.width && ivwr > ivhr) {
                        // Beyond the canvas's width
                        // zoom ratio
                        canvas.backgroudImage.height = canvas.playCanvas.height * (1 / ivwr).toFixed(2);
                    } else if (image.height >= canvas.playCanvas.height && (ivhr > ivwr)) {
                        // Beyond the canvas's height
                        // zoom ratio
                        canvas.backgroudImage.width = canvas.playCanvas.width * (1 / ivhr).toFixed(2);
                    }
                    image.width = canvas.backgroudImage.width;
                    image.height = canvas.backgroudImage.height;
                }else{
                    // if the width of image bigger than canvas's,will set to canvas's width
                    if (image.width >= canvas.backgroudImage.width) {
                        image.width = canvas.backgroudImage.width;
                    }
                    // if the height of image bigger than canvas's,will set to canvas's height
                    if (image.height >= canvas.backgroudImage.height) {
                        image.height = canvas.backgroudImage.height;
                    }
                }
                canvas.clearCanvas();
            };
            // image  the image object maybe come from parent's window.
            if (obj instanceof Image ||(parent&&parent.window&&obj instanceof parent.window.Image)||typeof obj.src!=="undefined") {
                image.src = obj.src;
                return;
            }
            // file the File|Blob object maybe come from parent's window.
            if (obj instanceof File
                || obj instanceof Blob
                ||(parent&&parent.window&&(obj instanceof parent.window.File||obj instanceof parent.window.Blob))) {
                var reader = new FileReader();
                reader.onload = function(event) {
                    image.src = event.target.result;
                };
                reader.readAsDataURL(file);
                return;
            }
            // dataUrl
            if (typeof obj === "string") {
                image.src = obj;
                return;
            }
            console.error("drawBackGroupWithImage:Obj is invalid parameter");
        },
        /**
         *  see context drawImage()
         * Example:
         * 1、Locate the image on the canvas:
         *    drawImageFile (imagefile: ?, dx: number, dy: number)
         *
         * 2、Locate the image on the canvas, and specify the width and height of the image:
         *    drawImageFile(imagefile,x,y,width,height);
         *
         * 3、Cut the image and locate the part on the canvas:
         *   drawImageFile(imagefile,sx,sy,swidth,sheight,x,y,width,height);
         */
        drawImageFile: function(file) {
            var canvas = this;
            var reader = new FileReader();
            reader.onload = function(event) {
                canvas.drawDataUrl(event.target.result);
            };
            reader.readAsDataURL(file);
        },
        /**
         *  draw image with dataUrl
         *
         * @param dataUrl
         */
        drawDataUrl: function(dataUrl) {
            var ctx = this.playContext;
            var image = new Image();
            // CORS settings attributes
            image.crossOrigin = 'Anonymous';
            image.onload = function() {
                arguments[0] = image;
                ctx.drawImage.apply(ctx, arguments);
            };
            image.src = dataUrl;
        },
        /**
         *  see context drawImage()
         * Example:
         * 1、Locate the image on the canvas:
         *    drawImage(image, dx, dy)
         *
         * 2、Locate the image on the canvas, and specify the width and height of the image:
         *    drawImage(image,x,y,width,height);
         *
         * 3、Cut the image and locate the part on the canvas:
         *   drawImage(image,sx,sy,swidth,sheight,x,y,width,height);
         */
        drawImage: function() {
            var ctx = this.playContext;
            ctx.drawImage.apply(ctx, arguments);
        },
        /**
         *@param {string} [type]
         *                            Indicating the image format. The default type is image/png.
         *@param {*} [encoderOptions]
         *                            A Number between 0 and 1 indicating image quality
         *                            if the requested type is image/jpeg or image/webp.If this argument is anything else,
         *                            the default value for image quality is used. The default value is 0.92.
         *                            Other arguments are ignored.
         *@return {string}
         */
        toDataURL: function(type, encoderOptions) {
            return this.playCanvas.toDataURL(type, encoderOptions);
        },

        /**
         * Covert the canvas to a Image object
         *
         * See toDataURL()
         *
         * @param callback  called in image.onload
         * @returns {Image}  image dom element
         */
        toImageEle: function(type, encoderOptions, callback) {
            var image = new Image();
            image.onload = function() {
                callback();
            };
            image.src = this.toDataURL(type, encoderOptions);
            return image;
        },
        /**
         *  Covert the canvas to a Blob object
         *  See toDataURL()
         * @return {Blob}
         */
        toBlob: function(type, encoderOptions) {
            //DataURL: 'data:text/plain;base64,YWFhYWFhYQ=='
            var arr = this.toDataURL(type, encoderOptions).split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], {
                type: mime
            });
        },
        /**
         * Save the canvas to a local png
         * download
         * @deprecated
         * @link http://weworkweplay.com/play/saving-html5-canvas-as-image/
         */
        saveAsLocalImagePng: function() {
            // here is the most important part because if you don't replace you will get a DOM 18 exception.
            var image = this.toDataURL("image/png").replace("image/png", "image/octet-stream;Content-Disposition:attachment;filename=foo.png");
            //var image = this.toDataURL("image/png").replace("image/png", "image/octet-stream");
            // it will save locally
            window.location.href = image;
        },

        //  add  event  to canvas
        addEvent: function(eventType, callback) {
            $util.addEvent(this.playCanvas, eventType, callback);
        },
        //
        mousedown: function (callback) {
            if (typeof callback !== "function") return;
            var canvas = this;
            var mousedown = function (e) {
                if (typeof e.type === "undefined") return;
                e.preventDefault();
                e.stopPropagation();
                // console.dir(e.type);
                // console.dir(e);
                // mouse event
                if (e.type === "mousedown") {
                }
                // touch event
                if (e.type === "touchstart") {
                    e = e.clientX ? e : e.touches.length ? e.touches[0] : {
                                clientX: 0,
                                clientY: 0
                            };
                }
                canvas.saveRevokeImgDatas();
                canvas.saveDrawingSurface();
                callback(e, canvas.windowToCanvas(e.clientX, e.clientY));
            };
            canvas.addEvent("mousedown", mousedown);
            //Register touch event's listener if it's supported.
            if ('createTouch' in document) {
                canvas.addEvent("touchstart", mousedown);
            }
        },
        //
        mousemove: function (callback) {
            if (typeof callback !== "function") return;
            var canvas = this;
            var mousemove = function (e) {
                if (typeof e.type === "undefined") return;
                e.preventDefault();
                e.stopPropagation();
                // console.dir(e.type);
                // console.dir(e);
                // mouse event
                if (e.type === "mousemove") {
                }
                // touch event
                if (e.type === "touchmove") {
                    e = e.clientX ? e : e.touches.length ? e.touches[0] : {
                                clientX: 0,
                                clientY: 0
                            };
                }
                callback(e, canvas.windowToCanvas(e.clientX, e.clientY));
            };
            canvas.addEvent("mousemove", mousemove);
            if ('createTouch' in document) {
                canvas.addEvent("touchmove", mousemove);
            }
        },
        //
        mouseup: function (callback) {
            if (typeof callback !== "function") return;
            var canvas = this;
            var mouseup = function (e) {
                if (typeof e.type === "undefined") return;
                e.preventDefault();
                e.stopPropagation();
                // console.dir(e.type);
                // console.dir(e);
                // mouse event
                if (e.type === "mouseup") {
                }
                // touch event
                if (e.type === "touchend") {
                    e = e.clientX ? e : e.touches.length ? e.touches[0] : e.changedTouches.length ? e.changedTouches[0] : null;
                    // if e is null ,do nothing
                    if (e === null) return;
                }
                callback(e, canvas.windowToCanvas(e.clientX, e.clientY));
                canvas.saveForwardRevokeFirstFrame();
            };
            canvas.addEvent("mouseup", mouseup);
            if ('createTouch' in document) {
                canvas.addEvent("touchend", mouseup);
            }
        }

    };
    CrysyanCanvas.prototype.constructor = CrysyanCanvas;
    // the default config for Canvas
    CrysyanCanvas.defaultOptions = {
        // px
        width: 0,
        height: 0,
        // id of canvas element
        canvasId: "canvas",
        // length of history 'revokeImgDatas' list
        historyListLen: 50
    };


    // export to window
    window.CrysyanCanvas = CrysyanCanvas;
})(CrysyanUtil);
