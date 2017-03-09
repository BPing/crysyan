(function ($widget) {
    'use strict';

    var ERASER_LINE_WIDTH = 1,
        ERASER_SHADOW_COLOR = 'rgb(0,0,0)',
        ERASER_SHADOW_STYLE = 'blue',
        ERASER_STROKE_STYLE = 'rgb(0,0,255)',
        ERASER_SHADOW_OFFSET = -5,
        ERASER_SHADOW_BLUR = 20;

    var CrysyanEraserWidget = $widget.clone();
    var eraser = CrysyanEraserWidget;
    eraser.eraserWidth = 25;
    // eraser.mouseDown = function(e, loc) {};
    eraser.mouseMove = function (e, loc) {
        if (!eraser.isDown) return;
        var ctx = eraser.crysyanCanvas.playContext;
        eraser.eraseLast(ctx);
        eraser.drawEraser(loc, ctx);
        eraser.prePiont.e = e;
        eraser.prePiont.loc = loc;
    };
    eraser.mouseUp = function (e, loc) {
        var ctx = eraser.crysyanCanvas.playContext;
        eraser.eraseLast(ctx);
    };
    //
    eraser.setDrawPathForEraser = function (loc, context) {
        context.beginPath();
        context.arc(loc.x, loc.y,
            eraser.eraserWidth / 2,
            0, Math.PI * 2, false);
        context.clip();
    };
    //
    eraser.setEraserAttributes = function (context) {
        context.lineWidth = ERASER_LINE_WIDTH;
        context.shadowColor = ERASER_SHADOW_STYLE;
        context.shadowOffsetX = ERASER_SHADOW_OFFSET;
        context.shadowOffsetY = ERASER_SHADOW_OFFSET;
        context.shadowBlur = ERASER_SHADOW_BLUR;
        context.strokeStyle = ERASER_STROKE_STYLE;
    };
    //
    eraser.eraseLast = function (context) {
        // clear
        context.save();
        context.beginPath();
        context.arc(eraser.prePiont.loc.x, eraser.prePiont.loc.y,
            eraser.eraserWidth / 2 + ERASER_LINE_WIDTH,
            0, Math.PI * 2, false);
        context.globalCompositeOperation="destination-out";
        // context.strokeStyle = "rgba(0, 0,0,0)";
        // context.fillStyle = "rgb(255, 255, 255)";
        // context.stroke();
        context.fill();
        context.restore();

        // draw backgroup Image
        context.save();
        context.beginPath();
        // Clear edge background color, so the radius of the circle 1 units bigger than the previous
        context.arc(eraser.prePiont.loc.x, eraser.prePiont.loc.y,
            eraser.eraserWidth / 2 + ERASER_LINE_WIDTH+1,
            0, Math.PI * 2, false);
        context.clip();
        eraser.crysyanCanvas.clearCanvasWithOnlyBackGroupImage();
        context.restore();
    };
    //
    eraser.drawEraser = function (loc, context) {
        context.save();
        eraser.setEraserAttributes(context);
        eraser.setDrawPathForEraser(loc, context);
        context.stroke();
        context.restore();
    };
    CrysyanEraserWidget.CrysyanWidgetType = "CrysyanEraserWidget";
    // export to window
    window.CrysyanEraserWidget = CrysyanEraserWidget;
})(CrysyanWidget);
