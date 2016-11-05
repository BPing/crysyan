(function() {
    'use strict';
    var CrysyanCursorWidget = CrysyanWidget.clone();

    CrysyanCursorWidget.mousedown = function(e, loc) {

    };
    CrysyanCursorWidget.mousemove = function(e, loc) {

    };
    CrysyanCursorWidget.mouseup = function(e, loc) {

    };

    CrysyanCursorWidget.CrysyanWidgetType = "CrysyanCursorWidget";
    // export to window
    window.CrysyanCursorWidget = CrysyanCursorWidget;
})();
