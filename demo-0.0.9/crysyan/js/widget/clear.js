(function($widget) {
    'use strict';
    var CrysyanClearWidget = $widget.clone();
    CrysyanClearWidget.iconClick = function(ele, e) {
        this.crysyanCanvas.clearCanvas();
    };
    CrysyanClearWidget.CrysyanWidgetType = "CrysyanClearWidget";
    // export to window
    window.CrysyanClearWidget = CrysyanClearWidget;
})(CrysyanWidget);
