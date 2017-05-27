(function ($widget, $util) {
    'use strict';
    var CrysyanTextWidget = $widget.clone();

    var Text = CrysyanTextWidget;

    Text.textCursor = null;
    Text.textInput = null;
    Text.drawingSurfaceImageData = null;

    Text.iconClick = function (ele, e) {
        Text.saveDrawingSurface();
        if (!Text.textCursor) {
            Text.textCursor = new TextCursor(Text);
            Text.textCursor.font = "你";
        }

        if (!Text.textInput) {
            Text.textInput = new TextInput(Text);
        }
    };

    Text.iconLeave = function (ele, e) {
        Text.textCursor.clear();
        Text.textInput.clear();
    };
    Text.mouseDown = function (e, loc) {
        Text.textCursor.erase();
        Text.saveDrawingSurface();
        Text.restoreDrawingSurface();
        Text.textCursor.draw(loc.x, loc.y);
        Text.textInput.draw(e.clientX, e.clientY);
        Text.textCursor.blinkCursor(loc.x, loc.y);
    };

    // Text.mouseMove = function (e, loc) {
    //
    // };
    // Text.mouseUp = function (e, loc) {
    //
    // };

    Text.saveDrawingSurface = function () {
        Text.drawingSurfaceImageData = Text.crysyanCanvas.saveDrawingSurface();
    };

    Text.restoreDrawingSurface = function () {
        //Text.playCanvas.restoreDrawingSurface();
    };

// Cursor.........................................................

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

            context.fillStyle = this.fillStyle;
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

// TextInput.........................................................

    var TextInput = function (text, width) {
        this.text = text;
        this.context = text.crysyanCanvas.playContext;
        this.textLoc = null;
        this.width = width || 30;
        this.fontSize = "";
        this.fontStyle = "";
        this.style = "position:fixed;z-index:999;font-weight: bold;";
        this.element = null;
        this.canvasPosition = text.crysyanCanvas.canvasPosition();
    };

    TextInput.prototype = {
        init: function () {
            this.element = document.createElement("textarea");
            this.element.style = this.style;
            this.element.style.display = "none";
            var textArea = this.element;
            var textInput = this;
            (document.getElementsByTagName("body").item(0) || document.documentElement).appendChild(this.element);
            this.element.onresize = function () {
                console.dir(textArea.style);
                var style = textArea.style;
                if (style.left + style.width > textInput.canvasPosition.bottom) {
                    style.width = textInput.canvasPosition.bottom - style.left;
                }
            };

            this.element.onkeydown = function (e) {
                var theEvent = e || window.event;
                var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
                if (code === 13) {
                    //回车执行
                    textInput.text.textCursor.clear();
                    var wordWidth = textInput.context.measureText('你').width;
                    var lineSize = textArea.clientWidth / wordWidth;
                    var y = textInput.textLoc.y;
                    for (var index = 0; index < textArea.value.length;) {
                        textInput.context.fillText(textArea.value.substr(index * lineSize, lineSize), textInput.textLoc.x, y, textArea.clientWidth);
                        index += 1;
                        y += wordWidth + wordWidth / 6;
                    }
                    textInput.text.textInput.clear();
                }
            };
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
        }

    };

    CrysyanTextWidget.CrysyanWidgetType = "CrysyanTextWidget";
    // export to window
    window.CrysyanTextWidget = CrysyanTextWidget;
})(CrysyanWidget, CrysyanUtil);
