(function ($widget) {
    'use strict';
    var CrysyanTextWidget = $widget.clone();

    var Text = CrysyanTextWidget;

    Text.textCursor = null;
    Text.drawingSurfaceImageData = null;

    Text.iconClick = function (ele, e) {
        Text.saveDrawingSurface();
        if (!Text.textCursor) {
            Text.textCursor = new TextCursor(Text);
            Text.textCursor.font = "你";
        }
    };

    Text.iconLeave = function (ele, e) {
        Text.textCursor.clear();
    };
    Text.mouseDown = function (e, loc) {
        Text.textCursor.erase();
        Text.saveDrawingSurface();
        Text.restoreDrawingSurface();
        Text.textCursor.draw(loc.x, loc.y);
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

        clear:function () {
            this.erase();
            clearInterval(this.blinkingInterval);
        },

        blinkCursor: function (x, y) {
            var context = this.context;
            var cursor = this;
            clearInterval(this.blinkingInterval);
            this.blinkingInterval = setInterval(function (e) {
                cursor.erase();
                setTimeout(function (e) {
                    if (cursor.left == x &&
                        cursor.top + cursor.getHeight(context) == y) {
                        cursor.draw(x, y);
                    }
                }, 300);
            }, 1000);
        }
    };

// TextInput.........................................................

    var TextInput=function (text) {
        this.text=text;
    };


    CrysyanTextWidget.CrysyanWidgetType = "CrysyanTextWidget";
    // export to window
    window.CrysyanTextWidget = CrysyanTextWidget;
})(CrysyanWidget);
