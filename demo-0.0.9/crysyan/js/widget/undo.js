(function($widget) {
    'use strict';
    var CrysyanUndoWidget = $widget.clone();
    CrysyanUndoWidget.iconClick = function(ele, e) {
        console.log("UndoiconClick");
        CrysyanUndoWidget.crysyanCanvas.revoke();
    };
    CrysyanUndoWidget.CrysyanWidgetType = "CrysyanUndoWidget";
    // export to window
    window.CrysyanUndoWidget = CrysyanUndoWidget;
})(CrysyanWidget);
