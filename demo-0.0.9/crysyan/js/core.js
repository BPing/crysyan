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
        if (null === obj || "object" != typeof obj) {
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

/**
 *  config
 */
(function() {

    //
    window.CrysyanWidgetConfig = {
        widgets: {
            CursorWidget: {
                // Variable name exported to window
                exportVar: "CrysyanCursorWidget",
                // Defined  file
                jsFile: "cursor.js",
                // Icon and Name of widget in toolbar
                icon: "cursor.png",
                name: "cursor"
            },
            PencilWidget: {
                exportVar: "CrysyanPencilWidget",
                jsFile: "pencil.js",
                // Icon and Name of widget in toolbar
                icon: "pencil.png",
                name: "pencil"
            },
            EraserWidget: {
                exportVar: "CrysyanEraserWidget",
                jsFile: "eraser.js",
                // Icon and Name of widget in toolbar
                icon: "eraser.png",
                name: "eraser"
            },
            ImageWidget: {
                exportVar: "CrysyanImageWidget",
                jsFile: "image.js",
                // Icon and Name of widget in toolbar
                icon: "image.png",
                name: "image"
            },
            UndoWidget: {
                exportVar: "CrysyanUndoWidget",
                jsFile: "undo.js",
                // Icon and Name of widget in toolbar
                icon: "undo.png",
                name: "undo"
            },
            IndoGoWidget: {
                exportVar: "CrysyanIndoGoWidget",
                jsFile: "into-go.js",
                // Icon and Name of widget in toolbar
                icon: "into-go.png",
                name: "into-go"
            },
            ClearWidget: {
                exportVar: "CrysyanClearWidget",
                jsFile: "clear.js",
                // Icon and Name of widget in toolbar
                icon: "clear.png",
                name: "clear"
            }
        }
    };

    //
    window.CrysyanDefaultConfig = {
       common:{
                 projectPath:""
       },
        submit: {
            Id: "crysyan-submit",
            // function called after submit
            callback: function(crysyanCanvas,event){}
        },
        canvas: {
            canvasId: "crysyan-canvas",
            // px
            width: 900,
            height: 400
        },
        toolbar: {
            Id: "crysyan-toolbar",
            length:900,
            widgetLength:50,
            widgets: ["CursorWidget", "PencilWidget", "EraserWidget", "ImageWidget", "UndoWidget", "IndoGoWidget", "ClearWidget"],
        }
    };
    
})(window);

/**
 *   Base struct of widget
 *  @module CaysyanWidget
 */
(function($util) {
    'use strict';
    /**
     *   Base struct of widget
     *          another child widget must be cloned and extended from 'CrysyanWidget',
     *          in other words,'CrysyanWidget'  is parent of other widget
     */
    var CrysyanWidget = {
        // Identifier of widget
        // must unique
        id: "widget-id",

        // Icon and Name of widget in toolbar
        icon: "widget-icon",
        name: "widget-name",

        //   Call method ,'hasOwnProperty()'' ,to judge whether the type of object  is "CrysyanWidgetType" or not
        //   example:
        //              obj.hasOwnProperty("CrysyanWidgetType")===true
        // must unique
        CrysyanWidgetType: "CrysyanWidget",

        // canvas
        crysyanCanvas: null,

        // pre-event attribute
        prePiont: {
            //  event
            e: null,
            // the coordinates on the canvas of event
            loc: null
        },
        // if mouse down
        isDown: false,

        /**
         *  the widget's handler for mouse event
         *        overwrited by child widget
         * @param  {object} e   event
         * @param  {object} loc  the coordinates on the canvas of event
         */
        mouseDown: function(e, loc) {},
        mouseUp: function(e, loc) {},
        mouseMove: function(e, loc) {},
        /**
         *
         * @param  {[type]} ele [description]
         * @param  {object} e   event
         */
        iconClick: function(ele, e) {},

        //  clone widget
        //  another child widget  call this function to  clone  'CaysyanWidget'
        clone: function() {
            return $util.clone(this);
        }
    };
    // export to window
    window.CrysyanWidget = CrysyanWidget;
})(CrysyanUtil);

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
        drawBackgroupWithImage: function(obj, mode) {
            if (typeof mode === "undefined") {
                //  image scaling mode
                //  if mode !=1 ,fulling mode
                //  default 1
                mode = 1;
            }
            var canvas = this;
            var image = new Image();
            image.onload = function() {
                canvas.backgroudImage.image = image;
                canvas.backgroudImage.width = canvas.playCanvas.width;
                canvas.backgroudImage.height = canvas.playCanvas.height;
                if (mode === 1) {
                    // Ratio of picture's and canvas's  width and height
                    var ivwr = image.width === 0 || canvas.playCanvas.width === 0 ? 0 : image.width / canvas.playCanvas.width;
                    var ivhr = image.height === 0 || canvas.playCanvas.height === 0 ? 0 : image.height / canvas.playCanvas.height;
                    if (image.width >= canvas.playCanvas.width && ivwr > ivhr) {
                        // Beyond the canvas's width
                        //zoom ratio
                        canvas.backgroudImage.height = image.height * ivwr;
                    } else if (image.height >= canvas.playCanvas.heigh && (ivhr > ivwr)) {
                        // Beyond the canvas's height
                        //zoom ratio
                        canvas.backgroudImage.width = image.width * ivhr;
                    }
                }
                canvas.clearCanvas();
            };
            // image
            if (obj instanceof Image) {
                image.src = obj.src;
                return;
            }
            // file
            if (obj instanceof File) {
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
            }
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
        mousedown: function(callback) {
            if (typeof callback !== "function") return;
            var canvas = this;
            canvas.addEvent("mousedown", function(e) {
                e.preventDefault();
                canvas.saveRevokeImgDatas();
                callback(e, canvas.windowToCanvas(e.clientX, e.clientY));
            });
        },
        //
        mousemove: function(callback) {
            if (typeof callback !== "function") return;
            var canvas = this;
            canvas.addEvent("mousemove", function(e) {
                e.preventDefault();
                callback(e, canvas.windowToCanvas(e.clientX, e.clientY));
            });
        },
        //
        mouseup: function(callback) {
            if (typeof callback !== "function") return;
            var canvas = this;
            canvas.addEvent("mouseup", function(e) {
                e.preventDefault();
                callback(e, canvas.windowToCanvas(e.clientX, e.clientY));
                canvas.saveForwardRevokeFirstFrame();
            });
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

/**
 *   View of canvas
 *  @module
 *  @depend util.js;canvas.js;widget.js;widget/*.js
 */
(function($defaultConfig, $widgetConfig, $util) {
    'use strict';
    /**
     *      view
     * @param {[object]} ops config
     */
    function CrysyanView(ops) {
        if (typeof ops !== 'object') {
            ops = {};
        }
        this.ops = {};
        this.ops.common = $.extend($defaultConfig.submit, ops.common || {});
        this.ops.submit = $.extend($defaultConfig.submit, ops.submit || {});
        this.ops.canvas = $.extend($defaultConfig.canvas, ops.canvas || {});
        this.ops.toolbar = $.extend($defaultConfig.toolbar, ops.toolbar || {});

        this.crysyanCanvas = new CrysyanCanvas(this.ops.canvas);
        this.toolbarElement = document.getElementById(this.ops.toolbar.Id);
        this.submitElement = document.getElementById(this.ops.submit.Id);
        //  console.dir(this);
        if (this.toolbarElement === null)
            throw "can't get the Element by id:" + this.ops.toolbar.Id;
        // the type of widget that has been selected now
        // 'CrysyanWidgetType'
        this.widgetSelected = "";
        // widgets' event
        //  example
        //         this.widgetEventMap[widgetExportVar.CrysyanWidgetType] = widgetExportVar
        this.widgetEventMap = {};
    }

    // Record the widget which has been handled
    var handledWidgetsMap = {};
    //
    var handleWidget = function(view) {
        var widgets = view.ops.toolbar.widgets;
        var configWidgets = $widgetConfig.widgets;
        var innerHTML = "<ul id=\"widgets-list\" class=\"ul-widget-list \">";
        for (var index = 0; index < widgets.length; index++) {
            var widget = widgets[index];
            if (handledWidgetsMap.hasOwnProperty(widget)) {
                continue;
            }
            if (!configWidgets.hasOwnProperty(widget) || !window.hasOwnProperty(configWidgets[widget].exportVar)) {
                console.error("widget: '" + widget + "'does not exist");
                continue;
            }
            var widgetExportVar = window[configWidgets[widget].exportVar];
            widgetExportVar.icon = configWidgets[widget].icon;
            widgetExportVar.crysyanCanvas = view.crysyanCanvas;
            if (widgetExportVar.hasOwnProperty("CrysyanWidgetType")) {
                // handle event
                view.widgetEventMap[widgetExportVar.CrysyanWidgetType] = widgetExportVar;
                // widget view
                //  id must be equal to 'CrysyanWidgetType'
                innerHTML = innerHTML + " <li><img  width=\"" + view.ops.toolbar.widgetLength + "px\" height=\"" + view.ops.toolbar.widgetLength + "px\"  id=\"" + widgetExportVar.CrysyanWidgetType + " \" class=\"crysyan-widget-class\" src=\" " + widgetExportVar.icon + "  \"></li>";
            }
            // set flag
            handledWidgetsMap[widget] = 1;
        }
        innerHTML += "</ul>";
        view.toolbarElement.innerHTML = innerHTML;
        // default selected widget
        view.widgetSelected = "CrysyanCursorWidget";
        //  Set click event
        //  Error ,'Don't make functions within a loop' ,detected by jslint can be ignored.
        $(".crysyan-widget-class", document).each(function() {
            var ele = $(this);
            //  id is equal to 'CrysyanWidgetType'
            var widgetSelected = ele.attr("id").replace(/\s+/g, "");
            var clickFunc = function(e) {
                if (widgetSelected !== "CrysyanUndoWidget" && widgetSelected !== "CrysyanIndoGoWidget" && widgetSelected !== "CrysyanClearWidget") {
                    $(".widget-selected-shape", document).each(function() {
                        $(this).removeClass("widget-selected-shape");
                    });
                    ele.addClass("widget-selected-shape");
                    view.widgetSelected = widgetSelected;
                }
                //console.log(view.widgetSelected);
                // call the click event if is exist
                if (view.widgetEventMap.hasOwnProperty(widgetSelected)) {
                    view.widgetEventMap[widgetSelected].iconClick(ele, e);
                }
            };
            ele.click(clickFunc);
        });
    };
    //
    // called after the 'handleWidget'
    var handleCanvas = function(view) {
        view.crysyanCanvas.mousedown(function(e, loc) {
            // console.log("mousedown");
            if (view.widgetEventMap.hasOwnProperty(view.widgetSelected)) {
                var widgetInstance = view.widgetEventMap[view.widgetSelected];
                widgetInstance.isDown = true;
                widgetInstance.prePiont.e = e;
                widgetInstance.prePiont.loc = loc;
                widgetInstance.mouseDown(e, loc);
            }
        });
        view.crysyanCanvas.mousemove(function(e, loc) {
            if (view.widgetEventMap.hasOwnProperty(view.widgetSelected)) {
                view.widgetEventMap[view.widgetSelected].mouseMove(e, loc);
            }
        });
        view.crysyanCanvas.mouseup(function(e, loc) {
            // console.log("mouseup");
            if (view.widgetEventMap.hasOwnProperty(view.widgetSelected)) {
                var widgetInstance = view.widgetEventMap[view.widgetSelected];
                widgetInstance.isDown = false;
                widgetInstance.mouseUp(e, loc);
            }
        });
    };

    CrysyanView.prototype = {
        init: function() {
            var view = this;
            handleWidget(view);
            handleCanvas(view);
            if (view.submitElement !== null) {
                $util.addEvent(view.submitElement, "click", function(e) {
                    view.ops.submit.callback(view.crysyanCanvas, e);
                });
            }
            return this;
        },
        // reset callback of submit action
        setSubmitCallback: function(callback) {
            if (typeof callback === "function")
                this.ops.submit.callback = callback;
        },
    };
    CrysyanView.prototype.constructor = CrysyanView;
    window.CrysyanView = CrysyanView;

})(CrysyanDefaultConfig, CrysyanWidgetConfig, CrysyanUtil);
