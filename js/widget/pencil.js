(function($widget) {
    'use strict';
    var CrysyanPencilWidget = $widget.clone();
    var pencil = CrysyanPencilWidget;
    pencil.mouseDown = function(e, loc) {
    };
    pencil.mouseMove = function(e, loc) {
        if (!pencil.isDown) return;
        var ctx = pencil.crysyanCanvas.playContext;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(pencil.prePiont.loc.x, pencil.prePiont.loc.y);
        ctx.lineTo(loc.x, loc.y);
        ctx.stroke();
        pencil.prePiont.e = e;
        pencil.prePiont.loc = loc;
        ctx.restore();
    };
    pencil.mouseUp = function(e, loc) {
        pencil.isDown = false;
    };

    CrysyanPencilWidget.CrysyanWidgetType = "CrysyanPencilWidget";
    // export to window
    window.CrysyanPencilWidget = CrysyanPencilWidget;
})(CrysyanWidget);
