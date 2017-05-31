(function ($widget, $util) {
    'use strict';

    var ERASER_LINE_WIDTH = 1,
        ERASER_SHADOW_COLOR = 'rgb(0,0,0)',
        ERASER_SHADOW_STYLE = 'blue',
        ERASER_STROKE_STYLE = 'rgb(0,0,255)',
        ERASER_SHADOW_OFFSET = -5,
        ERASER_SHADOW_BLUR = 20;

    var CrysyanEraserWidget = $widget.clone();
    var eraser = CrysyanEraserWidget;
    // when shapeType is 'path',it doesn't work.
    eraser.eraserWidth = 15;
    // 0:square ,1:circular, 2:path
    eraser.shapeType = 0;
    eraser.menu = null;

    eraser.iconClick = function (ele, e) {
        var rect = ele.getBoundingClientRect();
        if (!eraser.menu) {
            eraser.menu = new Menu(eraser);
        }
        eraser.menu.display(rect);
    };

    eraser.iconLeave = function (ele, e) {
        eraser.menu.hide();
    };


    eraser.mouseDown = function (e, loc) {
        eraser.menu.hide();
        var ctx = eraser.crysyanCanvas.playContext;
        switch (eraser.shapeType) {
            case 0:
            case "0":
            case 1:
            case "1":
                break;
            case 2 :
            case "2":
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(loc.x, loc.y);
                break;
        }
    };
    eraser.mouseMove = function (e, loc) {
        if (!eraser.isDown) return;
        var ctx = eraser.crysyanCanvas.playContext;
        switch (eraser.shapeType) {
            case 0:
            case "0":
            case 1:
            case "1":
                eraser.eraseLast(ctx, eraser.shapeType);
                eraser.drawEraser(loc, ctx, eraser.shapeType);
                break;
            case 2 :
            case "2":
                ctx.lineTo(loc.x, loc.y);
                ctx.stroke();
                break;
        }
        eraser.prePoint.e = e;
        eraser.prePoint.loc = loc;

    };
    eraser.mouseUp = function () {
        var ctx = eraser.crysyanCanvas.playContext;
        switch (eraser.shapeType) {
            case 0:
            case "0":
            case 1:
            case "1":
                eraser.eraseLast(ctx, eraser.shapeType);
                break;
            case 2 :
            case "2":
                ctx.closePath();
                ctx.clip();
                eraser.crysyanCanvas.restoreDrawingSurface();
                eraser.crysyanCanvas.clearCanvas();
                ctx.restore();
                break;
        }
    };
    //
    eraser.setDrawPathForEraser = function (loc, context, shape) {
        context.beginPath();
        if (shape === "0" || shape === 0) {
            context.arc(loc.x, loc.y,
                eraser.eraserWidth / 2,
                0, Math.PI * 2, false);
        } else if (shape === "1" || shape === 1) {
            context.rect(loc.x - eraser.eraserWidth / 2, loc.y - eraser.eraserWidth / 2, eraser.eraserWidth, eraser.eraserWidth)
        }
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
    eraser.eraseLast = function (context, shape) {
        if (shape === "0" || shape === 0) {//circle
            // draw background color
            context.save();
            context.beginPath();
            context.arc(eraser.prePoint.loc.x, eraser.prePoint.loc.y,
                eraser.eraserWidth / 2 + ERASER_LINE_WIDTH,
                0, Math.PI * 2, false);
            context.fillStyle = eraser.crysyanCanvas.backgroudColor;
            context.fill();
            context.restore();

            // draw background Image
            context.save();
            context.beginPath();
            // Clear edge background color, so the radius of the circle 1 units bigger than the previous
            context.arc(eraser.prePoint.loc.x, eraser.prePoint.loc.y,
                eraser.eraserWidth / 2 + ERASER_LINE_WIDTH + 1,
                0, Math.PI * 2, false);

        } else if (shape === "1" || shape === 1) {//square
            // draw background color
            context.save();
            context.beginPath();
            context.rect(eraser.prePoint.loc.x - (eraser.eraserWidth / 2) - ERASER_LINE_WIDTH,
                eraser.prePoint.loc.y - (eraser.eraserWidth / 2) - ERASER_LINE_WIDTH,
                (eraser.eraserWidth / 1) + ERASER_LINE_WIDTH, (eraser.eraserWidth / 1) + ERASER_LINE_WIDTH + 1);
            context.fillStyle = eraser.crysyanCanvas.backgroudColor;
            context.fill();
            context.restore();

            // draw background Image
            context.save();
            context.beginPath();
            // Clear edge background color, so the width of the square 2 units bigger than the previous
            context.rect(eraser.prePoint.loc.x - (eraser.eraserWidth / 2) - ERASER_LINE_WIDTH - 1,
                eraser.prePoint.loc.y - (eraser.eraserWidth / 2) - ERASER_LINE_WIDTH - 1,
                (eraser.eraserWidth / 1) + ERASER_LINE_WIDTH + 1, (eraser.eraserWidth / 1) + ERASER_LINE_WIDTH + 3);
        }
        context.clip();
        eraser.crysyanCanvas.clearCanvasWithOnlyBackGroundImage();
        context.restore();
    };
    //
    eraser.drawEraser = function (loc, context, shape) {
        context.save();
        eraser.setEraserAttributes(context, shape);
        eraser.setDrawPathForEraser(loc, context, shape);
        context.stroke();
        context.restore();
    };


    /**
     *
     * @param eraser
     * @constructor
     */
    var Menu = function (eraser) {
        this.eraser = eraser;
        // this.isDisplay = false;
        this.menuEle = null;
    };

    Menu.prototype = {
        init: function () {
            this.menuEle = document.createElement("section");
            this.menuEle.setAttribute("id", "crysyan-pencil-menu");
            this.menuEle.setAttribute("class", "crysyan-second-toolbar");
            this.menuEle.style.display = "none";
            var innerHtml = "<ul>";

            innerHtml = innerHtml.concat("<li type='margin-bottom: 10px;'><label for='crysyan-eraser-shape'>shape:</label><select id='crysyan-eraser-shape'>");
            var shapeOps = ["Circular", "Square", "Path"];
            for (var key in shapeOps) {
                innerHtml = innerHtml.concat("<option value=\"", key, "\">", shapeOps[key], "</option>");
            }
            innerHtml = innerHtml.concat("</select></li>");

            innerHtml = innerHtml.concat("<li type='margin-bottom: 10px;'><label for='crysyan-eraser-diameter'>diameter:</label><select id='crysyan-eraser-diameter'>");
            var widthOps = ["15", "25", "35", "45", "55"];
            for (var key in widthOps) {
                innerHtml = innerHtml.concat("<option value=\"", widthOps[key], "\">", widthOps[key], "px</option>");
            }
            innerHtml = innerHtml.concat("</select></li>");
            innerHtml = innerHtml.concat("<li id='crysyan-eraser-done' class='crysyan-btn-done'>Done</li>");
            innerHtml = innerHtml.concat("</ul>");
            this.menuEle.innerHTML = innerHtml;
            (document.getElementsByTagName("body").item(0) || document.documentElement).appendChild(this.menuEle);

            var menu = this;
            var eraser = this.eraser;
            var eraserShapeEle = findElement("crysyan-eraser-shape");
            var eraserWithEle = findElement("crysyan-eraser-diameter");
            $util.addEvent(findElement("crysyan-eraser-done"), "click", function () {
                eraser.eraserWidth = eraserWithEle.value;
                eraser.shapeType = eraserShapeEle.value;
                menu.hide();
            })
        },
        display: function (rect) {
            if (!this.menuEle) {
                this.init();
            }
            var style = this.menuEle.style;
            this.top = rect.top - 80;
            this.left = rect.left - 10;
            style.display = "inline";
            style.top = this.top + "px";
            style.left = this.left + "px";
        },
        hide: function () {
            var style = this.menuEle.style;
            style.display = "none";
        }
    };

    function findElement(id) {
        return document.getElementById(id);
    }

    CrysyanEraserWidget.CrysyanWidgetType = "CrysyanEraserWidget";
    // export to window
    window.CrysyanEraserWidget = CrysyanEraserWidget;
})(CrysyanWidget, CrysyanUtil);
