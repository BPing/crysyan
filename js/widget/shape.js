(function ($widget, $util) {
    'use strict';
    var CrysyanShapeWidget = $widget.clone();
    var Shape = CrysyanShapeWidget;

    // 0:Triangle, 1:Rect ,2:Circular,
    Shape.shapeType = 0;
    // 01:stroke, 10:fill
    Shape.depictType = 1;
    
    
    Shape.lineWidth = 1;
    Shape.strokeStyle ='#000000';
    Shape.fillStyle ='#000000';
    Shape.depictType = 1;

    Shape.menu = false;


    Shape.setConfig = function () {
        var ctx = Shape.crysyanCanvas.playContext;
        //  ctx.lineJoin = pencil.config.lineJoin;
        ctx.lineWidth = Shape.lineWidth;
        ctx.strokeStyle = Shape.strokeStyle;
        ctx.fillStyle = Shape.fillStyle;
    };

    Shape.iconClick = function (ele, e) {
        var rect = ele.getBoundingClientRect();
        if (!Shape.menu) {
            Shape.menu = new Menu(Shape);
        }
        Shape.menu.display(rect);
    };
    //
    Shape.iconLeave = function (ele, e) {
        Shape.menu.hide();
    };

    Shape.mouseDown = function(e, loc) {
        Shape.menu.hide();
    };
    Shape.mouseMove = function (e, loc) {
        if (!Shape.isDown) return;
        Shape.drawShape(e, loc);
    };
    Shape.mouseUp = function (e, loc) {
        Shape.drawShape(e, loc)
    };

    Shape.drawShape = function (e, loc) {
        var ctx = Shape.crysyanCanvas.playContext;
        Shape.crysyanCanvas.restoreDrawingSurface();
        var prePoint = Shape.prePoint.loc;
        ctx.save();
        Shape.setConfig();
        ctx.beginPath();
        switch (Shape.shapeType) {
            case 0:
            case "0":
                var x = loc.x - prePoint.x;
                ctx.moveTo(prePoint.x, prePoint.y);
                ctx.lineTo(loc.x, loc.y);
                ctx.lineTo(loc.x - 2 * x, loc.y);
                break;
            case 1:
            case "1":
                ctx.rect(prePoint.x, prePoint.y, loc.x - prePoint.x, loc.y - prePoint.y);
                break;
            case 2 :
            case "2":
                var x = loc.x - prePoint.x;
                var y = loc.y - prePoint.y;
                ctx.arc(prePoint.x, prePoint.y,
                    Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)),
                    0, Math.PI * 2, false);
                break;
        }
        ctx.closePath();
        if ((Shape.depictType & 1) !== 0)
            ctx.stroke();
        if ((Shape.depictType & 2) !== 0)
            ctx.fill();
        ctx.restore();
    };


    var Menu = function (shape) {
        this.shape = shape;
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

            innerHtml = innerHtml.concat("<li type='margin-bottom: 10px;'><label for='crysyan-shape-type'>shape:</label><select id='crysyan-shape-type'>");
            var shapeOps = ["Triangle", "Rect", "Circular"];
            for (var key in shapeOps) {
                innerHtml = innerHtml.concat("<option value=\"", key, "\">", shapeOps[key], "</option>");
            }
            innerHtml = innerHtml.concat("</select></li>");

            innerHtml = innerHtml.concat("<li type='margin-bottom: 10px;'><label for='crysyan-depict-type'>draw:</label><select id='crysyan-depict-type'>");
            var depictOps = {1:"stroke", 2:"fill", 3:"stroke&fill"};
            for (var key in depictOps) {
                innerHtml = innerHtml.concat("<option value=\"", key,"\">", depictOps[key], "</option>");
            }
            innerHtml = innerHtml.concat("</select></li>");


            innerHtml = innerHtml.concat("<li type='margin-bottom: 10px;'><label for='crysyan-shape-stroke-color'>stroke color:</label><input id='crysyan-shape-stroke-color' type='color' value='", this.shape.strokeStyle, "'></li>");

            innerHtml = innerHtml.concat("<li type='margin-bottom: 10px;'><label for='crysyan-shape-fill-color'>fill color:</label><input id='crysyan-shape-fill-color' type='color' value='", this.shape.fillStyle, "'></li>");


            innerHtml = innerHtml.concat("<li id='crysan-shape-done' class='crysan-btn-done'>Done</li>");
            innerHtml = innerHtml.concat("</ul>");
            this.menuEle.innerHTML = innerHtml;
            (document.getElementsByTagName("body").item(0) || document.documentElement).appendChild(this.menuEle);

            var menu = this;
            var shape = this.shape;
            var shapeOpsEle = findElement("crysyan-shape-type");
            var depictOpsEle = findElement("crysyan-depict-type");
            var fillColorEle = findElement("crysyan-shape-fill-color");
            var strokeColorEle = findElement("crysyan-shape-stroke-color");
            $util.addEvent(findElement("crysan-shape-done"), "click", function () {
                shape.shapeType = shapeOpsEle.value;
                shape.fillStyle = fillColorEle.value;
                shape.strokeStyle = strokeColorEle.value;
                shape.depictType=parseInt(depictOpsEle.value);
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

    Shape.CrysyanWidgetType = "CrysyanShapeWidget";
    // export to window
    window.CrysyanShapeWidget = CrysyanShapeWidget;
})(CrysyanWidget, CrysyanUtil);