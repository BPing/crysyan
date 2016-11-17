/**
 *  config
 */
(function() {

    //
    window.CrysyanWidgetConfig = {
        widgets: {
            CursorWidget: {
                // Variable name exported to window
                exportVar: "CrysyanCursorWidget",
                // Defined  file
                jsFile: "cursor.js",
                // Icon and Name of widget in toolbar
                icon: "cursor.png",
                name: "cursor"
            },
            PencilWidget: {
                exportVar: "CrysyanPencilWidget",
                jsFile: "pencil.js",
                // Icon and Name of widget in toolbar
                icon: "pencil.png",
                name: "pencil"
            },
            EraserWidget: {
                exportVar: "CrysyanEraserWidget",
                jsFile: "eraser.js",
                // Icon and Name of widget in toolbar
                icon: "eraser.png",
                name: "eraser"
            },
            ImageWidget: {
                exportVar: "CrysyanImageWidget",
                jsFile: "image.js",
                // Icon and Name of widget in toolbar
                icon: "image.png",
                name: "image"
            },
            UndoWidget: {
                exportVar: "CrysyanUndoWidget",
                jsFile: "undo.js",
                // Icon and Name of widget in toolbar
                icon: "undo.png",
                name: "undo"
            },
            IndoGoWidget: {
                exportVar: "CrysyanIndoGoWidget",
                jsFile: "into-go.js",
                // Icon and Name of widget in toolbar
                icon: "into-go.png",
                name: "into-go"
            },
            ClearWidget: {
                exportVar: "CrysyanClearWidget",
                jsFile: "clear.js",
                // Icon and Name of widget in toolbar
                icon: "clear.png",
                name: "clear"
            }
        }
    };

    //
    window.CrysyanDefaultConfig = {
        projectPath:"",
        isRecord:false,
        // default:empty string,load inner css.
        // if you not need load the css(include inner css).set the value of it to not string type
        cssFile:"",
        submit: {
            Id: "crysyan-submit",
            // function called after submit
            callback: function(crysyanCanvas,event){}
        },
        canvas: {
            canvasId: "crysyan-canvas",
            // px
            width: 900,
            height: 400
        },
        toolbar: {
            Id: "crysyan-toolbar",
            length:900,
            widgetLength:50,
            widgets: ["CursorWidget", "PencilWidget", "EraserWidget", "ImageWidget", "UndoWidget", "IndoGoWidget", "ClearWidget"],
        }
    };

})(window);
