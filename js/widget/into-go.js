(function($widget) {
    'use strict';
    var CrysyanIndoGoWidget = $widget.clone();

    CrysyanIndoGoWidget.iconClick = function(e, loc) {
        CrysyanUndoWidget.crysyanCanvas.forwardRevoke();
    };

    CrysyanIndoGoWidget.CrysyanWidgetType = "CrysyanIndoGoWidget";
    // export to window
    window.CrysyanIndoGoWidget = CrysyanIndoGoWidget;
})(CrysyanWidget);
