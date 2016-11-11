# crysyan
a web drawing board with canvas 

> home: [https://bping.github.io/crysyan/](https://bping.github.io/crysyan/)

# Quick start
* your.html
```html
<!--<script src="jquery-3.1.1.min.js"></script>-->
<div style="width:1000px; height:1000px;" class="crysyan-designer"></div>
<!-- include the crysyan-designer.js -->
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
    toobar: {
        length: 500
    }
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

# API Reference
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
  
draw `DataUrl` :
```javascript
var dataurl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIr
GAAAADFBMVEVYWFhVVVUAAABUVFTqqlXjAAAAA3RSTlMxdACUjPeLAAAATElEQVR42u3SQQrAMAwDQSn
7/z+XFExTcOxroN3zgC4STecApy1gpP2gBgZXQMwKwJ23QITYACLlQBC9gAFNwJMXoJhVc7lBA/gsuAAr
EgqPcT12VgAAAABJRU5ErkJggg=="
designer.drawBackgroupWithImage(dataurl);
```

draw `Image` :
```javascript
var image=new Image()
image.src="imagePath";
designer.drawBackgroupWithImage(image);
```

draw `File` :
```javascript
var file=new File()
// do something
designer.drawBackgroupWithImage(file);
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


# Dependence
* jQuery

# Compatibility
* turn the canvas into a picture and save  `IE9+, Chrome4+,Firefox3.6(1.9.2)`

# Reference
* [Canvas-Designer](https://github.com/muaz-khan/WebRTC-Experiment/tree/master/Canvas-Designer)
