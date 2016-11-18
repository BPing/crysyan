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
        ops =ops|| {};
        this.ops = {};
        this.ops.common = $.extend($defaultConfig.submit, ops.common || {});
        this.ops.submit = $.extend($defaultConfig.submit, ops.submit || {});
        this.ops.canvas = $.extend($defaultConfig.canvas, ops.canvas || {});
        this.ops.toolbar = $.extend($defaultConfig.toolbar, ops.toolbar || {});
        this.ops = $.extend(ops,  this.ops);

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
                innerHTML = innerHTML + " <li><img draggable=\"false\" width=\"" + view.ops.toolbar.widgetLength + "px\" height=\"" + view.ops.toolbar.widgetLength + "px\"  id=\"" + widgetExportVar.CrysyanWidgetType + " \" class=\"crysyan-widget-class\" src=\" " + widgetExportVar.icon + "  \"></li>";
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
