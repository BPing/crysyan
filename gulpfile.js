var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var header = require('gulp-header');
var imagemin = require('gulp-imagemin');
var zip = require('gulp-zip');
var tar = require('gulp-tar');
var gzip = require('gulp-gzip');
var less = require('gulp-less');
var cleanCSS = require('gulp-clean-css');
var runSequence = require('gulp-sequence');
var replace = require('gulp-replace');
var distPath = "dist/crysyan/";
// using data from package.json
var pkg = require('./package.json');
var widgetsLoad = [];

var headTitle = ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @author <%= pkg.author %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''].join('\n');

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
        widgetPath+"shape.js",
        widgetPath+"undo.js", 
        widgetPath+"into-go.js",
        widgetPath+"clear.js"];
})();

gulp.task('clean-all', function () {
    return gulp.src([distPath + "*", distPath, "release/"])
        .pipe(clean())
        .pipe(plumber());
});

gulp.task('designer-minify', function () {
    return gulp.src(["js/crysyan-designer.js"])
        .pipe(replace('html/crysyan.html?config=', 'crysyan.html?config='))
        .pipe(plumber())
        .pipe(uglify())
        .pipe(plumber())
        .pipe(header(headTitle,{pkg:pkg}))
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

gulp.task('less', function () {
    return gulp.src('css/*.less')
        .pipe(less())
        .pipe(plumber())
        .pipe(gulp.dest('css/'));
});

gulp.task('minify-css',["less"], function () {
    return gulp.src('css/*.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
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
        .pipe(replace(' var widgetIconPath = "../img/";', ' var widgetIconPath = "img/";'))
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
    return gulp.src(["img/*","!img/bg-lesson-begin.jpg"])
        .pipe(imagemin())
        .pipe(plumber())
        .pipe(gulp.dest(distPath + "img/"));
});

gulp.task('html-replace-move', function () {
    return gulp.src(["html/*"])
        .pipe(replace('src="../js/crysyan.js"', 'src="crysyan-core-min.js"'))
        .pipe(plumber()) 
        .pipe(replace('href="../css/crysyan.css"', 'href="crysyan.css"'))
        .pipe(plumber())
        .pipe(gulp.dest(distPath));
});

gulp.task('demo-replace-move', function () {
    return gulp.src(["index.html"])
        .pipe(replace('src="js/crysyan-designer.js"', 'src="crysyan-designer-min.js"'))
        .pipe(plumber())
        .pipe(replace('../img/pencil.png"', 'img/pencil.png"'))
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
            "minify-css",
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

gulp.task('zip', function () {
    return gulp.src([distPath+'*', distPath+'**/*', "!"+distPath+'js'])
        .pipe(plumber())
        .pipe(zip('crysyan-' + pkg.version + '.zip'))
        .pipe(gulp.dest('release'));
});

gulp.task('tar.gz', function () {
    return gulp.src([distPath+'*', distPath+'**/*', "!"+distPath+'js'])
        .pipe(plumber())
        .pipe(tar('crysyan-' + pkg.version +'.tar'))
        .pipe(gzip())
        .pipe(gulp.dest('release'));

});

gulp.task('publish', ['build'], function (cb) {
    runSequence(["zip","tar.gz"], cb);
});

gulp.task('default', ["build"]);
