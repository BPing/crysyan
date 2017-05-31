(function ($widget, $util) {
    'use strict';
    var CrysyanTextWidget = $widget.clone();

    var Text = CrysyanTextWidget;

    Text.menu = null;
    Text.textCursor = null;
    Text.textInput = null;
    Text.drawingSurfaceImageData = null;

    // the style of font
    Text.fontSize = 12;
    Text.fontFamily = 'SimSun';
    Text.fontWeight = 'normal';
    Text.fontLineSpace = 'auto';
    Text.fontColor = 'black';

    Text.iconClick = function (ele, e) {

        Text.textCursor && Text.textCursor.clear();
        Text.textInput && Text.textInput.clear();

        var rect = ele.getBoundingClientRect();
        if (!Text.menu) {
            Text.menu = new Menu(Text);
        }
        Text.menu.display(rect);
        Text.saveDrawingSurface();
    };

    Text.iconLeave = function (ele, e) {
        Text.textCursor && Text.textCursor.clear();
        Text.textInput && Text.textInput.clear();
        Text.menu.hide();
    };
    Text.mouseDown = function (e, loc) {
        if (!Text.textCursor) {
            Text.textCursor = new TextCursor(Text, Text.fontColor);
            Text.textCursor.font = "你";
        }
        if (!Text.textInput) {
            Text.textInput = new TextInput(Text);
        }
        Text.textCursor.erase();
        Text.saveDrawingSurface();
        Text.restoreDrawingSurface();
        Text.setFontStyle();
        Text.textCursor.draw(loc.x, loc.y);
        Text.textInput.draw(e.clientX, e.clientY);
        Text.textCursor.blinkCursor(loc.x, loc.y);
    };

    /**
     *  set font
     */
    Text.setFontStyle = function () {
        Text.crysyanCanvas.playContext.font = Text.fontWeight + " "
            + (Text.fontSize + '').toLowerCase().replace('px', '') + 'px '
            + Text.fontFamily;
        Text.crysyanCanvas.playContext.fillStyle = Text.fontColor;
    };

    /**
     * write text to canvas
     *
     * @param text
     * @param width width of line
     * @param textLoc the start point of canvas to write text
     */
    Text.writeToCanvas = function (text, width, textLoc) {
        Text.setFontStyle();
        var context = Text.crysyanCanvas.playContext;
        Text.textCursor.clear();
        var zhWordWidth = context.measureText('你').width;
        var textArr = [];
        var lineStr = "";
        // the width of line ,if `lineWidth` bigger than width ,start another line
        var lineWidth = 0;
        for (var index = 0; index <= text.length; index++) {
            if (lineWidth >= width) {
                textArr.push(lineStr);
                lineStr = "";
                lineWidth = 0;
            }
            if (index >= text.length) {
                textArr.push(lineStr);
                break;
            }
            var char = text.charAt(index);
            lineWidth += context.measureText(char).width;
            lineStr += char;
        }
        var y = textLoc.y;
        for (var lineIndex = 0; lineIndex < textArr.length; lineIndex++) {
            context.fillText(textArr[lineIndex], textLoc.x, y, width);
            // if 'auto' the font line space equal to `zhWordWidth / 6`
            y += zhWordWidth + parseInt($util.isNumber(Text.fontLineSpace) ? Text.fontLineSpace : zhWordWidth / 5);
        }
        Text.textInput.clear();
    };

    Text.saveDrawingSurface = function () {
        Text.drawingSurfaceImageData = Text.crysyanCanvas.saveDrawingSurface();
    };

    Text.restoreDrawingSurface = function () {
        //Text.playCanvas.restoreDrawingSurface();
    };

// Cursor...............................................................................................................

    var TextCursor = function (text, fillStyle, width) {
        this.fillStyle = fillStyle || 'rgba(0, 0, 0, 0.7)';
        this.width = width || 2;
        this.left = 0;
        this.top = 0;
        this.blinkingInterval = null;
        this.blinking = true;
        this.font = "W";
        this.context = text.crysyanCanvas.playContext;
        this.text = text;
    };

    TextCursor.prototype = {
        getHeight: function () {
            var h = this.context.measureText(this.font).width;
            return h + h / 6;
        },
        createPath: function () {
            var context = this.context;
            context.beginPath();
            context.rect(this.left, this.top,
                this.width, this.getHeight(context));
        },

        draw: function (left, bottom) {
            var context = this.context;
            context.save();
            this.left = left;
            this.top = bottom - this.getHeight(context);

            this.createPath(context);

            context.fillStyle = this.text.fontColor || this.fillStyle;
            context.fill();

            context.restore();
        },
        erase: function () {
            var context = this.context;
            context.putImageData(this.text.drawingSurfaceImageData, 0, 0,
                this.left, this.top,
                this.width, this.getHeight(context));
        },

        clear: function () {
            this.blinking = false;
            clearInterval(this.blinkingInterval);
            this.erase();
        },

        blinkCursor: function (x, y) {
            var context = this.context;
            var cursor = this;
            cursor.blinking = true;
            clearInterval(this.blinkingInterval);
            this.blinkingInterval = setInterval(function (e) {
                cursor.erase();
                setTimeout(function (e) {
                    if (!cursor.blinking) {
                        cursor.erase();
                        return;
                    }
                    if (cursor.left == x &&
                        cursor.top + cursor.getHeight(context) == y) {
                        cursor.draw(x, y);
                    }
                }, 300);
            }, 1000);
        }
    };

// TextInput............................................................................................................

    var TextInput = function (text, width) {
        this.text = text;
        this.context = text.crysyanCanvas.playContext;
        this.textLoc = null;
        this.width = width || 30;
        this.style = "position:fixed;z-index:999;font-weight: normal;";
        this.element = null;
        this.canvasPosition = text.crysyanCanvas.canvasPosition();
    };

    TextInput.prototype = {
        init: function () {
            this.element = document.createElement("textarea");
            this.element.style = this.style;
            this.element.style.display = "none";
            this.setFontStyle();
            var textArea = this.element;
            var textInput = this;
            (document.getElementsByTagName("body").item(0) || document.documentElement).appendChild(this.element);
            // listen 'enter'
            $util.addEvent(this.element, 'keydown', function (e) {
                var theEvent = e || window.event;
                var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
                if (code === 13) {
                    //回车执行
                    Text.writeToCanvas(textArea.value, textArea.clientWidth, textInput.textLoc);
                }
            });
        },
        draw: function (left, top) {
            if (!this.element) {
                this.init();
            }
            left += this.text.textCursor.width;
            this.textLoc = this.text.crysyanCanvas.windowToCanvas(left, top);
            var style = this.element.style;
            style.display = "inline";
            // Not cover Cursor
            style.left = left + 4 + "px";
            style.top = top + 4 + "px";
            this.element.focus();
        },
        clear: function () {
            if (this.element) {
                this.element.parentNode && this.element.parentNode.removeChild(this.element);
                this.element = null;
            }
        },
        setFontStyle: function () {
            var style = this.element.style;
            style['font-family'] = this.text.fontFamily;
            style['font-weight'] = this.text.fontWeight;
            style['font-size'] = (this.text.fontSize + '').toLowerCase().replace('px', '') + 'px';
            style['color'] = this.text.fontColor;
        }
    };

// Menu.................................................................................................................

    var Menu = function (text) {
        this.text = text;
        // this.isDisplay = false;
        this.menuEle = null;
    };

    Menu.prototype = {
        init: function () {
            this.menuEle = document.createElement("section");
            this.menuEle.setAttribute("id", "crysyan-text-menu");
            this.menuEle.setAttribute("class", "crysyan-second-toolbar");
            this.menuEle.style.display = "none";
            var menu = this;
            var config = this.text;
            var innerHtml = "<ul>";

            innerHtml = innerHtml.concat("<li type='margin-bottom: 10px;'><label for='crysyan-font-size'>font-size:</label><select id='crysyan-font-size'>");
            var sizeOps = [
                "12px",
                "14px",
                "16px",
                '18px',
                '20px',
                '22px',
                '24px',
                '30px',
                '35px'
            ];
            for (var key in sizeOps) {
                innerHtml = innerHtml.concat("<option value=\"", sizeOps[key], "\">", sizeOps[key], "</option>");
            }
            innerHtml = innerHtml.concat("</select></li>");

            innerHtml = innerHtml.concat("<li type='margin-bottom: 10px;'><label for='crysyan-font-family'>font-family:</label><select id='crysyan-font-family'>");
            var familyOps = [
                "微软雅黑",
                "华文细黑",
                "宋体",
                "黑体",
                "方正姚体",
                "Arial",
                'Courier New',
                'Courier',
                'Helvetica',
                'monospace',
                'Times New Roman',
                'Times',
                'Verdana',
                'sans-serif',
                'serif'
            ];
            for (var key in familyOps) {
                innerHtml = innerHtml.concat("<option value=\"", familyOps[key], "\">", familyOps[key], "</option>");
            }
            innerHtml = innerHtml.concat("</select></li>");

            innerHtml = innerHtml.concat("<li type='margin-bottom: 10px;'><label for='crysyan-font-weight'>font-weight:</label><select id='crysyan-font-weight'>");
            var weightOps = [
                "normal",
                "bold",
                "bolder",
                'lighter',
                '100',
                '200',
                '300',
                '500',
                '600',
                '700',
                '800',
                '900'
            ];
            for (var key in weightOps) {
                innerHtml = innerHtml.concat("<option value=\"", weightOps[key], "\">", weightOps[key], "</option>");
            }
            innerHtml = innerHtml.concat("</select></li>");

            innerHtml = innerHtml.concat("<li type='margin-bottom: 10px;'><label for='crysyan-line-space'>line-space:</label><select id='crysyan-line-space'>");
            var spaceOps = [
                "auto",
                "2",
                "3",
                '4',
                '5',
                '6',
                '7',
                '8',
                '9',
                '10',
                '15',
                '20'
            ];
            for (var key in spaceOps) {
                innerHtml = innerHtml.concat("<option value=\"", spaceOps[key], "\">", spaceOps[key], "</option>");
            }
            innerHtml = innerHtml.concat("</select></li>");

            innerHtml = innerHtml.concat("<li type='margin-bottom: 10px;'><label for='crysyan-font-color'>font-color:</label><input id='crysyan-font-color' type='color' value='", config.fontColor, "'></li>");
            innerHtml = innerHtml.concat("<li id='crysyan-font-done' class='crysyan-btn-done'>Done</li>");
            innerHtml = innerHtml.concat("</ul>");
            this.menuEle.innerHTML = innerHtml;
            (document.getElementsByTagName("body").item(0) || document.documentElement).appendChild(this.menuEle);

            var fontSizeEle = $util.findElement("crysyan-font-size");
            var fontFamilyEle = $util.findElement("crysyan-font-family");
            var fontWeightEle = $util.findElement("crysyan-font-weight");
            var fontColorEle = $util.findElement("crysyan-font-color");
            var fontLineSpaceEle = $util.findElement("crysyan-line-space");
            $util.addEvent($util.findElement("crysyan-font-done"), "click", function () {
                config.fontSize = fontSizeEle.value;
                config.fontFamily = fontFamilyEle.value;
                config.fontColor = fontColorEle.value;
                config.fontWeight = fontWeightEle.value;
                config.fontLineSpace = fontLineSpaceEle.value;
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

    CrysyanTextWidget.CrysyanWidgetType = "CrysyanTextWidget";
    // export to window
    window.CrysyanTextWidget = CrysyanTextWidget;
})(CrysyanWidget, CrysyanUtil);
