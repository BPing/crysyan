(function ($widget, $util) {
    'use strict';
    var CrysyanPencilWidget = $widget.clone();
    var Pencil = CrysyanPencilWidget;

    Pencil.menu = null;

    Pencil.iconClick = function (ele, e) {
        var rect = ele.getBoundingClientRect();
        if (!Pencil.menu) {
            Pencil.menu = new Menu(Pencil);
        }
        Pencil.menu.display(rect);
    };

    Pencil.iconLeave = function (ele, e) {
        Pencil.menu.hide();
    };

    Pencil.config = {
        lineJoin: 'round',
        lineCap: 'round',
        lineWidth: 1,
        strokeStyle: '#000000',
        type: 0
    };

    Pencil.mouseDown = function (e, loc) {
        var pencil = this;
        var ctx = pencil.crysyanCanvas.playContext;
        pencil.menu.hide();
        ctx.save();
        pencil.setConfig();
    };

    Pencil.mouseMove = function (e, loc) {
        var pencil = this;
        if (!pencil.isDown) return;
        var ctx = pencil.crysyanCanvas.playContext;
        switch (pencil.config.type) {
            case 0:
            case "0":
                ctx.beginPath();
                drawFullLine(ctx, pencil.prePoint.loc.x, pencil.prePoint.loc.y, loc.x, loc.y);
                pencil.prePoint.e = e;
                pencil.prePoint.loc = loc;
                break;
            case 1 :
            case "1":
                pencil.crysyanCanvas.restoreDrawingSurface();
                drawFullLine(ctx, pencil.prePoint.loc.x, pencil.prePoint.loc.y, loc.x, loc.y);
                break;
            case 2 :
            case "2":
                pencil.crysyanCanvas.restoreDrawingSurface();
                ctx.beginPath();
                drawDashedLine(ctx, pencil.prePoint.loc.x, pencil.prePoint.loc.y, loc.x, loc.y, pencil.config.lineWidth * 2);
                ctx.closePath();
                break;
            default:

        }
        // ctx.closePath();
    };

    Pencil.mouseUp = function (e, loc) {
        var ctx = Pencil.crysyanCanvas.playContext;
        ctx.restore();
    };

    Pencil.setConfig = function () {
        var pencil = this;
        var ctx = pencil.crysyanCanvas.playContext;
        //  ctx.lineJoin = pencil.config.lineJoin;
        ctx.lineCap = pencil.config.lineCap;
        ctx.lineWidth = pencil.config.lineWidth;
        ctx.strokeStyle = pencil.config.strokeStyle;
    };

    /**
     *
     * @param pencil
     * @constructor
     */
    var Menu = function (pencil) {
        this.pencil = pencil;
        // this.isDisplay = false;
        this.menuEle = null;
    };

    Menu.prototype = {
        init: function () {
            this.menuEle = document.createElement("section");
            this.menuEle.setAttribute("id", "crysyan-pencil-menu");
            this.menuEle.setAttribute("class", "crysyan-second-toolbar");
            this.menuEle.style.display = "none";
            var menu = this;
            var config = this.pencil.config;
            var innerHtml = "<ul>";

            innerHtml = innerHtml.concat("<li type='margin-bottom: 10px;'><label for='crysyan-pencil-type'>line type:</label><select id='crysyan-pencil-type'>");
            var typeOps = ["default-line", "full-line", "dash-line"];
            for (var key in typeOps) {
                innerHtml = innerHtml.concat("<option value=\"", key, "\">", typeOps[key], "</option>");
            }
            innerHtml = innerHtml.concat("</select></li>");

            innerHtml = innerHtml.concat("<li type='margin-bottom: 10px;'><label for='crysyan-pencil-line-width'>line width:</label><select id='crysyan-pencil-line-width'>");
            var widthOps = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
            for (var key in widthOps) {
                innerHtml = innerHtml.concat("<option value=\"", widthOps[key], "\">", widthOps[key], "px</option>");
            }
            innerHtml = innerHtml.concat("</select></li>");
            innerHtml = innerHtml.concat("<li type='margin-bottom: 10px;'><label for='crysyan-pencil-color'>line color:</label><input id='crysyan-pencil-color' type='color' value='", config.strokeStyle, "'></li>");
            innerHtml = innerHtml.concat("<li id='crysan-pencil-done' class='crysan-btn-done'>Done</li>");
            innerHtml = innerHtml.concat("</ul>");
            this.menuEle.innerHTML = innerHtml;
            (document.getElementsByTagName("body").item(0) || document.documentElement).appendChild(this.menuEle);

            var lineTypeEle = findElement("crysyan-pencil-type");
            var lineWithEle = findElement("crysyan-pencil-line-width");
            var colorEle = findElement("crysyan-pencil-color");
            $util.addEvent(findElement("crysan-pencil-done"), "click", function () {
                config.type = lineTypeEle.value;
                config.lineWidth = lineWithEle.value;
                config.strokeStyle = colorEle.value;
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

    // find element by id
    function findElement(id) {
        return document.getElementById(id);
    }

    // draw full line
    function drawFullLine(context, x1, y1, x2, y2) {
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
    }

    // draw dashed line
    function drawDashedLine(context, x1, y1, x2, y2, dashLength) {
        dashLength = dashLength === undefined ? 2 : dashLength;

        var deltaX = x2 - x1;
        var deltaY = y2 - y1;
        var numDashes = Math.floor(
            Math.sqrt(deltaX * deltaX + deltaY * deltaY) / dashLength);

        for (var i = 0; i < numDashes; ++i) {
            context[i % 2 === 0 ? 'moveTo' : 'lineTo']
            (x1 + (deltaX / numDashes) * i, y1 + (deltaY / numDashes) * i);
        }

        context.stroke();
    }

    CrysyanPencilWidget.CrysyanWidgetType = "CrysyanPencilWidget";
    // export to window
    window.CrysyanPencilWidget = CrysyanPencilWidget;
})(CrysyanWidget, CrysyanUtil);
