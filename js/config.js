/**
 *  config
 */
(function () {

    var widgetBasePath="widget/";

    //
    window.CrysyanWidgetConfig={
        basePath: widgetBasePath,
        widgets:{
            CursorWidget:{
                // Variable name exported to window
                exportVar:"CrysyanCursorWidget",
                // Defined  file
                jsFile:"cursor.js",
                // Icon and Name of widget in toolbar
                icon:"",
                name:""
            },
           PencilWidget:{
                exportVar:"CrysyanPencilWidget",
                jsFile:"pencil.js",
                // Icon and Name of widget in toolbar
                icon:"",
                name:""
            }
        }
    };

    //
    window.CrysyanDefaultConfig={
        canvas:{
            // px
            width: 900,
            height: 400
        },
        widgets:["CursorWidget","PencilWidget"]
    }
})();