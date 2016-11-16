var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var header = require('gulp-header');
var imagemin = require('gulp-imagemin');
var zip = require('gulp-zip');
// var debug = require('gulp-debug');
var runSequence = require('gulp-sequence');
var replace = require('gulp-replace');
var distPath = "dist/crysyan/";
var version = "0.1";
var widgetsLoad = [];

(function () {
    // var widgetConfig= require('js/config.js');
    // var widgetBasePath = "js/widget/";
    // var widgets = widgetConfig.CrysyanWidgetConfig.widgets;
    // for (var attr in widgets) {
    //     if (widgets[attr].hasOwnProperty("jsFile") && typeof widgets[attr].jsFile === "string" && widgets[attr].jsFile !== "") {
    //         widgetsLoad.push(widgetBasePath + widgets[attr].jsFile);
    //     }
    // }
    widgetPath="js/widget/";
    // widgetsLoad = [widgetPath+"*.js"]; or 
    widgetsLoad = [
        widgetPath+"cursor.js", 
        widgetPath+"pencil.js", 
        widgetPath+"eraser.js", 
        widgetPath+"image.js", 
        widgetPath+"undo.js", 
        widgetPath+"into-go.js",
        widgetPath+"clear.js"];
})();

gulp.task('clean-all', function () {
    return gulp.src([distPath + "*", distPath, "release/", "release/*"])
        .pipe(clean())
        .pipe(plumber());
});

gulp.task('designer-minify', function () {
    return gulp.src(["js/crysyan-designer.js"])
        .pipe(replace('html/crysyan.html?config=', 'crysyan.html?config='))
        .pipe(plumber())
        .pipe(uglify())
        .pipe(plumber())
        .pipe(rename({suffix: '-min'}))
        .pipe(gulp.dest(distPath));
});

gulp.task('RecordRTC-minify', function () {
    return gulp.src(["js/ext/RecordRTC.js"])
        .pipe(uglify())
        .pipe(plumber())
        .pipe(gulp.dest(distPath));
});

gulp.task('widgets-concat', function () {
    return gulp.src(widgetsLoad)
        .pipe(concat("widgets.js"))
        .pipe(plumber())
        .pipe(gulp.dest(distPath + "js/"));
});

gulp.task('core-concat', function () {
    return gulp.src(["js/util.js", "js/config.js", "js/widget.js", "js/canvas.js", "js/view.js"])
        .pipe(concat("core.js"))
        .pipe(plumber())
        .pipe(gulp.dest(distPath + "js/"));
});

gulp.task('core-header', function () {
    return gulp.src(["js/crysyan.js"])
        .pipe(header('var CrysyanFlag=false;'))
        .pipe(plumber())
        .pipe(replace('../js/ext/RecordRTC.js', 'RecordRTC.js'))
        .pipe(plumber())
        .pipe(gulp.dest(distPath + "js/"));
});

gulp.task('core-widgets-concat-minify', ["widgets-concat", "core-concat",'core-header'], function () {
    return gulp.src([distPath + "js/core.js", distPath + "js/widgets.js",distPath + "js/crysyan.js"])
        .pipe(concat("crysyan-core-min.js"))
        .pipe(plumber())
        .pipe(gulp.dest(distPath))
        .pipe(uglify())
        .pipe(plumber())
        .pipe(gulp.dest(distPath));
});

gulp.task('imagemin', function () {
    return gulp.src(["img/*"])
        .pipe(imagemin())
        .pipe(plumber())
        .pipe(gulp.dest(distPath + "img/"));
});

gulp.task('html-replace-move', function () {
    return gulp.src(["html/*"])
        .pipe(replace('src="../js/crysyan.js"', 'src="crysyan-core-min.js"'))
        .pipe(plumber())
        .pipe(gulp.dest(distPath));
});

gulp.task('demo-replace-move', function () {
    return gulp.src(["index.html"])
        .pipe(replace('src="js/crysyan-designer.js"', 'src="crysyan-designer-min.js"'))
        .pipe(plumber())
        .pipe(rename({prefix: 'demo-'}))
        .pipe(gulp.dest(distPath));
});

gulp.task('guidance-move', function () {
    return gulp.src(["guidance.md"])
        .pipe(gulp.dest(distPath));
});

gulp.task('building', ['clean-all'], function (cb) {
    runSequence(
           ["designer-minify",
            "RecordRTC-minify",
            "core-widgets-concat-minify",
            "imagemin",
            "html-replace-move",
            "guidance-move",
            "demo-replace-move"], cb);
});

gulp.task('after-building-clean', ['building'], function () {
    return gulp.src([distPath+'js'])
        .pipe(clean())
        .pipe(plumber());
});

gulp.task('build', ['building','after-building-clean']);

gulp.task('publish', ['build'], function () {
    return gulp.src([distPath+'*', distPath+'**/*', "!"+distPath+'js'])
        .pipe(plumber())
        .pipe(zip('crysyan-' + version + '.zip'))
        .pipe(gulp.dest('release'));
});

gulp.task('default', ["build"]);
