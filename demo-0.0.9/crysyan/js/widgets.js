(function($widget) {
    'use strict';
    var CrysyanCursorWidget = $widget.clone();

    CrysyanCursorWidget.mouseDown = function(e, loc) {

    };
    CrysyanCursorWidget.mouseMove = function(e, loc) {

    };
    CrysyanCursorWidget.mouseUp = function(e, loc) {

    };

    CrysyanCursorWidget.CrysyanWidgetType = "CrysyanCursorWidget";
    // export to window
    window.CrysyanCursorWidget = CrysyanCursorWidget;
})(CrysyanWidget);

(function($widget) {
    'use strict';
    var CrysyanPencilWidget = $widget.clone();
    var pencil = CrysyanPencilWidget;
    pencil.mouseDown = function(e, loc) {
    };
    pencil.mouseMove = function(e, loc) {
       var pencil=this;
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
       var pencil=this;
        pencil.isDown = false;
    };

    CrysyanPencilWidget.CrysyanWidgetType = "CrysyanPencilWidget";
    // export to window
    window.CrysyanPencilWidget = CrysyanPencilWidget;
})(CrysyanWidget);

(function($widget) {
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
    eraser.mouseMove = function(e, loc) {
        if (!eraser.isDown) return;
        var ctx = eraser.crysyanCanvas.playContext;
        eraser.eraseLast(ctx);
        eraser.drawEraser(loc, ctx);
        eraser.prePiont.e = e;
        eraser.prePiont.loc = loc;
    };
    eraser.mouseUp = function(e, loc) {
        var ctx = eraser.crysyanCanvas.playContext;
        eraser.eraseLast(ctx);
    };
    //
    eraser.setDrawPathForEraser = function(loc, context) {
        context.beginPath();
        context.arc(loc.x, loc.y,
            eraser.eraserWidth / 2,
            0, Math.PI * 2, false);
        context.clip();
    };
    //
    eraser.setErasePathForEraser = function(context) {
        context.beginPath();
        context.arc(eraser.prePiont.loc.x, eraser.prePiont.loc.y,
            eraser.eraserWidth / 2 + ERASER_LINE_WIDTH,
            0, Math.PI * 2, false);
        context.clip();
    };
    //
    eraser.setEraserAttributes = function(context) {
        context.lineWidth = ERASER_LINE_WIDTH;
        context.shadowColor = ERASER_SHADOW_STYLE;
        context.shadowOffsetX = ERASER_SHADOW_OFFSET;
        context.shadowOffsetY = ERASER_SHADOW_OFFSET;
        context.shadowBlur = ERASER_SHADOW_BLUR;
        context.strokeStyle = ERASER_STROKE_STYLE;
    };
    //
    eraser.eraseLast = function(context) {
        var last = eraser.prePiont.loc;
        var radio = eraser.eraserWidth / 2 + ERASER_LINE_WIDTH;
        context.save();
        eraser.setErasePathForEraser(context);
        eraser.crysyanCanvas.clearCanvas();
        context.restore();
    };
    //
    eraser.drawEraser = function(loc, context) {
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

(function($widget, $util) {
    'use strict';
    var CrysyanImageWidget = $widget.clone();
    var image = CrysyanImageWidget;
    image.mouseDown = function(e, loc) {
        image.crysyanCanvas.saveDrawingSurface();
    };
    image.mouseMove = function(e, loc) {
        if (!image.isDown) return;
        image.crysyanCanvas.restoreDrawingSurface();
        image.drawImage(image.crysyanCanvas.playContext, loc);
    };
    image.mouseUp = function(e, loc) {
        if (!image.isDown) return;
        image.crysyanCanvas.restoreDrawingSurface();
        image.drawImage(image.crysyanCanvas.playContext, loc);
    };
    //
    image.iconClick = function(ele, e) {
        image.selectFile(function(file) {
            if (!file) return;
            image.fileReader(file);
        }, false);
    };

    image.drawImage = function(context, loc) {
        var preloc = image.prePiont.loc;
        if (!image.imageHandler.image || (loc.x - preloc.x) === 0) {
            return;
        }
        context.drawImage(image.imageHandler.image, preloc.x, preloc.y, loc.x - preloc.x, loc.y - preloc.y);
    };
    //
    image.imageHandler = {
        image: null,
        isLoad: false,
        imgSrc: ""
    };
    image.selectFile = function(callback, multiple) {
        var file = document.createElement('input');
        file.type = 'file';
        if (multiple) {
            file.multiple = true;
        }
        file.onchange = function() {
            if (multiple) {
                if (!file.files.length) {
                    console.error('No file selected.');
                    return;
                }
                callback(file.files);
                return;
            }
            if (!file.files[0]) {
                console.error('No file selected.');
                return;
            }
            callback(file.files[0]);
            file.parentNode.removeChild(file);
        };
        file.style.display = 'none';
        (document.body || document.documentElement).appendChild(file);
        image.fireClickEvent(file);
    };

    image.fireClickEvent = function(element) {
        if (!$util.isIE()) {
            // not IE, as  FF
            var evt = document.createEvent("MouseEvent");
            evt.initEvent("click", true, true);
            // not  supported  by edge
            // var evt = new window.MouseEvent('click', {
            //     view: window,
            //     bubbles: true,
            //     cancelable: true,
            //     button: 0,
            //     buttons: 0,
            //     mozInputSource: 1
            // });
            var fired = element.dispatchEvent(evt);
        } else {
            element.click();
        }
    };
    //
    image.fileReader = function(file) {
        var reader = new FileReader();
        reader.onload = function(event) {
            image.imageHandler.image = new Image();
            image.imageHandler.isLoad = false;
            image.imageHandler.image.onload = function() {
                image.imageHandler.isLoad = true;
            };
            image.imageHandler.image.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    CrysyanImageWidget.CrysyanWidgetType = "CrysyanImageWidget";
    // export to window
    window.CrysyanImageWidget = CrysyanImageWidget;
})(CrysyanWidget, CrysyanUtil);

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
