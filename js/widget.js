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
        prePoint: {
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

        iconLeave:function(ele, e) {},

        //  clone widget
        //  another child widget  call this function to  clone  'CaysyanWidget'
        clone: function() {
            return $util.clone(this);
        }
    };
    // export to window
    window.CrysyanWidget = CrysyanWidget;
})(CrysyanUtil);
