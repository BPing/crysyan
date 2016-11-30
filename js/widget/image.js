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
        var preloc = image.prePoint.loc;
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
