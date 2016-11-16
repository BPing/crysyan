# crysyan
a web drawing board with canvas

> home: [https://bping.github.io/crysyan/](https://bping.github.io/crysyan/)

# <a name="index"/>Index
* [Compatibility](#Compatibility)
* [Quick start](#Quick_start)
* [Directory](#Directory)
* [Version](#Version)
* [Build-in](#Version)
* [API Reference](#API)
* [Dependence](#Dependence)
* [Reference](#Reference)
* [**](#**)

# <a name="Quick_start"/>Quick start
* your.html
```html
<!--<script src="jquery-3.1.1.min.js"></script>-->
<div style="width:1000px; height:1000px;" class="crysyan-designer"></div>
<!-- include the crysyan-designer.js -->
<!--<script src="projectPath/crysyan-designer-min.js"></script>-->
<script src="projectPath/js/crysyan-designer.js"></script>
```
* your.js
```javascript
// jquery
$(".crysyan-designer").CrysyanDesigner({
    canvas: {
        // px
        width: 900,
        height: 500
    },
}, function(designer) {
    console.dir(designer);
});
//  another
// var designer=CrysyanDesigner({
//     canvas: {
//         // px
//         width: 900,
//         height: 500
//     },
//     toobar: {
//         length: 500
//     }
// }, function(designer) {
//     console.dir(designer);
// });
// designer.appendTo(document.getElementsByClassName("crysyan-designer"));
```

# <a name="Directory"/>Directory

     /            -->
      css/             --> css
      html/           --> view
      img/            --> used to place the tool icon file
      js/               -->  javascript file



# <a name="Compatibility"/>Compatibility

Is not very accurate, because it is estimated base on a variety of attribute , and not really completely tested.
But It can be a reference for you.

Feature | Chrome | Firefox |IE
--- | :----:| :----:| ---
Turn the canvas into a picture and save  | 4+	  | 3.6(1.9.2) | 9+
CORS enabled image   | 13+	  | (Gecko)8+ | No support
Record Canvas(video/webM)   | 30+	  | 30+ | No support

# <a name="Version"/>Version
* 0.0.9

> First

# <a name="Build-in"/>Build-in
## widgets
 You can use config for below widgets.
 Sets the widgets needed for a particular instance of a artboard.
```
config{
    toolbar: {
        widgets:
        ["CursorWidget",
        "PencilWidget",
        "EraserWidget",
        "ImageWidget",
        "UndoWidget",
        "IndoGoWidget",
        "ClearWidget"],
    }
    }
```

1. `pencil` --- `PencilWidget`   to write/draw shapes
2. `eraser` --- `EraserWidget`   to erase/clear specific portion of shapes
3. `image` ---  `ImageWidget`    add external images
4. `uodo` ---  `UndoWidget`      revoke history of canvas
5. `indo-go` --- `IndoGoWidget`  forward revoke history of canvas
6. `clear` --- `ClearWidget`     clear canvas

## gulp

1、First of all,you need install node.js and gulp and gulp's add-ons which used in gulpfile.js.

2、You can choose which widgets you need to include,in other word, widgets that you can provide to users.

Look `gulpfile.js` as follows:

```javascript
widgetPath="js/widget/";
    // widgetsLoad = [widgetPath+"*.js"]; or 
    widgetsLoad = [
        // widget's file name
        widgetPath+"cursor.js", 
        widgetPath+"pencil.js", 
        widgetPath+"eraser.js", 
        widgetPath+"image.js", 
        widgetPath+"undo.js", 
        widgetPath+"into-go.js",
        widgetPath+"clear.js"];
```

3、build.
```cmd
>gulp build
```
After build successfully.
You can find a 'crysyan' folder,the JS files under this folder have been compressed, which can be used in your project, under the 'dist' folder

Include in your html file Just like that:
```html
<!-- include the crysyan-designer-min.js.js -->
<!-- projectPath is the root of 'crysyan' folder -->
<script src="projectPath/crysyan-designer-min.js"></script>
```
`projectPath` is the root directory where the 'crysyan' project  is located.

# <a name="API"/>API Reference
*  **CrysyanDesigner**

### `appendTo`
CrysyanDesigner is a widget; that widget should be appended to a DOM object.
This method allows you pass `<body>` or any other HTMLDOMElement.

```javascript
designer.appendTo(document.body || document.documentElement);
```

The correct name for `appendTo` is: `append-iframe to target HTML-DOM-element`

### `destroy`
If you want to remove the widget from your HTMLDOMElement.

```javascript
designer.destroy();
```

### `getView`
 You can get a view `CrysyanView` instance from child `iframe`:

```javascript
designer.getView();
```

### `drawBackgroupWithImage`
  Draw a image on a canvas as background.

1、draw `DataUrl` :

recommended to replace by`#4`(`draw image-path`) 
```javascript
var dataurl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIr
GAAAADFBMVEVYWFhVVVUAAABUVFTqqlXjAAAAA3RSTlMxdACUjPeLAAAATElEQVR42u3SQQrAMAwDQSn
7/z+XFExTcOxroN3zgC4STecApy1gpP2gBgZXQMwKwJ23QITYACLlQBC9gAFNwJMXoJhVc7lBA/gsuAAr
EgqPcT12VgAAAABJRU5ErkJggg=="
designer.drawBackgroupWithImage(dataurl);
```

2、draw `Image` :
```javascript
var image=new Image()
image.src="imagePath";
designer.drawBackgroupWithImage(image);
```

3、draw `File` :
```javascript
var file=new File()
// do something
designer.drawBackgroupWithImage(file);
```

4、draw `image-path`：

Usually, you need to add "../../" in front of the relative directory to roll back to the root directory where the 'crysyan' project  is located
```javascript
designer.drawBackgroupWithImage("../../img/a.png");
```

### `toDataUrl`
Get data-URL of your drawings!

```javascript
window.open(designer.toDataURL('image/png'));
```

you can download the png:

> **Note:** focus on attribute  of `download` of  `<a>` tag

`html`:
```html
  <a  id="download-png" download="my-file-name.png">download png</a>
```

`javascript`
```javascript
$("#download-png").click(function () {
    document.getElementById("download-png").href=designer.toDataURL('image/png');
});
```

### `getCanvasRecorder`
Get `RecordRTC` of your drawings,which used to record canvas to video(video/webm).Does not supported in IE browser.

API of RecordRTC,see:[RecordRTC API Reference](http://recordrtc.org/RecordRTC.html)

`example:`

`html`:
```html
<button type="button" id="start-record">start-record</button>
<button  id="stop-record">stop-record</button>
<div id="videoTag" style="width:1000px; height:500px;">ddd</div>
```
`javascript`
```javascript
var recorder = designer.getCanvasRecorder();
$("#start-record").click(function () {
       console.log("recording");
       recorder.startRecording();
});
$("#stop-record").click(function () {
    console.log("stop");
    recorder.stopRecording(function() {
        var blob = recorder.getBlob();
        var video = document.createElement('video');
        video.src = URL.createObjectURL(blob);
        video.setAttribute('style', 'height: 100%; position: absolute; top:0; left:0;z-index:9999;width:100%;');
        document.body.appendChild(video);
        video.controls = true;
        video.play();
    });
});
```

### `iframe`
You can access designer iframe as following:

```javascript
designer.iframe.style.border = '5px solid red';

window.open(designer.iframe.src);
```

`designer.iframe` will be `null/undefined` until you call `appendTo`. So always use this code-block:

```javascript
if(!designer.iframe) {
    designer.appendTo(document.body);
}
designer.iframe.style.border = '5px solid red';
```
*  **Config**

The configuration of the entire project.
> **Note:**The unit of length is: px.
```javascript
var designer=CrysyanDesigner({
    ifrName:"",
    projectPath:"",
    isRecord:false,
    canvas: {
        // px
        width: 900,
        height: 500
    },
    toobar: {
        widgetLength: 50,
        widgets:
        [
        "CursorWidget",
        "PencilWidget",
        "EraserWidget",
        "ImageWidget",
        "UndoWidget",
        "IndoGoWidget",
        "ClearWidget"],
    }
    }
}, function(designer) {
    console.dir(designer);
});
```

### `ifrName`
Name of iframe.
You do not need to set this value if it is not necessary.
Normally, the default value is OK
### `projectPath`
Path of  crysyan project.
### `isRecord`
Whether to open the recording feature.Default:`false`.
### `canvas`
* `width`  

        Width of the  canvas.

* `height`

        Height of the bottom canvas

### `toolbar`
* `widgetLength`

        The length of each tool icon.
* `widgets`

        The widgets you want to use. see `build-in/widgets`.
        Normally, the default value is OK.

<h2 align="center">Add New Tools Widgets</h2>

## First Step
## Second Step
## Third Step

# <a name="Dependence"/>Dependence
* jQuery
* [RecordRTC](https://github.com/muaz-khan/WebRTC-Experiment/edit/master/RecordRTC/RecordRTC.js): Record Canvas2D.

# <a name="Reference"/>Reference
* [Canvas-Designer](https://github.com/muaz-khan/WebRTC-Experiment/tree/master/Canvas-Designer)
