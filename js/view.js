/**
 *   View of canvas
 *  @module
 *  @depend util.js;canvas.js;widget.js;widget/*.js
 */
(function($defaultConfig, $widgetConfig) {
    'use strict';
    /**
     *      view
     * @param {[object]} ops config
     */
    function CrysyanView(ops) {
        if (typeof ops !== 'object') {
            ops = {};
        }
        this.ops = $.extend($defaultConfig, ops);
        this.crysyanCanvas = new CrysyanCanvas(this.ops.canvas);
        this.toolbarElement = document.getElementById(this.ops.toolbar.Id);
        console.dir(this);
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

    CrysyanView.prototype = {
        //
        handleWidget: function() {
            var view = this;
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
                    this.widgetEventMap[widgetExportVar.CrysyanWidgetType] = widgetExportVar;
                    // widget view
                    //  id must be equal to 'CrysyanWidgetType'
                    innerHTML = innerHTML + " <li><img id=\"" + widgetExportVar.CrysyanWidgetType + " \" class=\"crysyan-widget-class\" src=\" " + widgetExportVar.icon + "  \"></li>";
                }
                // set flag
                handledWidgetsMap[widget] = 1;
            }
            innerHTML += "</ul>";
            this.toolbarElement.innerHTML = innerHTML;
            // default selected widget
            this.widgetSelected = "CrysyanCursorWidget";
            //  Set click event
            //  Error ,'Don't make functions within a loop' ,detected by jslint can be ignored.
            $(".crysyan-widget-class").each(function() {
                var ele = $(this);
                //  id is equal to 'CrysyanWidgetType'
                var widgetSelected = ele.attr("id").replace(/\s+/g, "");
                var clickFunc = function(e) {
                    if (widgetSelected !== "CrysyanUndoWidget" && widgetSelected !== "CrysyanIndoGoWidget" && widgetSelected !== "CrysyanClearWidget") {
                        $(".widget-selected-shape").each(function() {
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
        },
        //
        // called after the 'handleWidget'
        handleCanvas: function() {
            var view = this;
            view.crysyanCanvas.mousedown(function(e, loc) {
                console.log("mousedown");
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
                console.log("mouseup");
                if (view.widgetEventMap.hasOwnProperty(view.widgetSelected)) {
                    var widgetInstance = view.widgetEventMap[view.widgetSelected];
                    widgetInstance.isDown = false;
                    widgetInstance.mouseUp(e, loc);
                }
            });
        }
    };
    CrysyanView.prototype.constructor = CrysyanView;
    window.CrysyanView = CrysyanView;

})(CrysyanDefaultConfig, CrysyanWidgetConfig);
