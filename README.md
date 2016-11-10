# crysyan
a web drawing board with canvas 
[https://bping.github.io/crysyan/](https://bping.github.io/crysyan/)

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

# Dependence
* jQuery

# Compatibility
* turn the canvas into a picture and save  `IE9+, Chrome4+,Firefox3.6(1.9.2)`

# Reference
* [Canvas-Designer](https://github.com/muaz-khan/WebRTC-Experiment/tree/master/Canvas-Designer)
