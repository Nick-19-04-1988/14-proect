const gulp = require("gulp"),
    browserSync = require("browser-sync"),
    sass = require("gulp-sass")(require("sass")),
    sourcemap = require("gulp-sourcemaps"),
    cleanCSS = require("gulp-clean-css"),
    mediaQueries = require("gulp-group-css-media-queries"),
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    htmlMin = require("gulp-htmlmin"),
    imagemin = require("gulp-imagemin"),
    svgstore = require("gulp-svgstore"),
    cache = require("gulp-cache"),
    del = require("del"),
    rename = require("gulp-rename"),
    replace = require("gulp-replace"),
    cheerio = require("gulp-cheerio"),
    plumber = require("gulp-plumber"),
    newer = require("gulp-newer"),
    terser = require("gulp-terser");

gulp.task("browser-sync", function () {
    browserSync({
        server: {
            baseDir: "app",
        },
        notify: false,
    });
});

gulp.task("code", function () {
    return gulp.src("app/*.html").pipe(browserSync.reload({ stream: true }));
});

gulp.task("sass", function () {
    return gulp
        .src("app/sass/style.scss")
        .pipe(plumber())
        .pipe(sourcemap.init())
        .pipe(sass({ outputStyle: "expanded" }))
        .pipe(postcss([autoprefixer()]))
        .pipe(sourcemap.write("."))
        .pipe(gulp.dest("app/css"))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task("svg-sprite", function () {
    return gulp
        .src("app/img/icons/*.svg")
        .pipe(
            cheerio({
                run: ($) => {
                    $("[fill]").removeAttr("fill");
                },
                parserOptions: { xmlMode: true },
            }),
        )
        .pipe(
            svgstore({
                inlineSvg: true,
            }),
        )
        .pipe(rename("sprite.svg"))
        .pipe(gulp.dest("app/img"));
});

gulp.task("clean", function () {
    return del("dist");
});

gulp.task("css", function () {
    return gulp
        .src("app/sass/style.scss")
        .pipe(sass())
        .pipe(mediaQueries())
        .pipe(postcss([autoprefixer()]))
        .pipe(cleanCSS({ level: 2 }))
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest("dist/css"));
});

gulp.task("html", function () {
    return gulp
        .src("app/*.html")
        .pipe(newer("dist"))
        .pipe(replace("style.css", "style.min.css"))
        .pipe(
            htmlMin({
                collapseWhitespace: true,
                removeComments: true,
                removeEmptyAttributes: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
            }),
        )
        .pipe(gulp.dest("dist"));
});

gulp.task("optimize-images", function () {
    return gulp
        .src([
            "app/img/**/*.{png,jpg,svg}",
            "!app/img/sprite.svg",
            "!app/img/icons/*.svg",
        ])
        .pipe(newer("dist/img"))
        .pipe(
            cache(
                imagemin([
                    imagemin.mozjpeg({ progressive: true }),
                    imagemin.optipng({ optimizationLevel: 3 }),
                    imagemin.svgo(),
                ]),
                {
                    name: "image-cache",
                },
            ),
        )
        .pipe(gulp.dest("dist/img"));
});

gulp.task("svg-sprite-prod", function () {
    return gulp
        .src("app/img/icons/*.svg")
        .pipe(
            cheerio({
                run: ($) => {
                    $("[fill]").removeAttr("fill");
                },
                parserOptions: { xmlMode: true },
            }),
        )
        .pipe(
            svgstore({
                inlineSvg: true,
            }),
        )
        .pipe(rename("sprite.svg"))
        .pipe(gulp.dest("dist/img"));
});

gulp.task("copy-dist", function () {
    return gulp
        .src("app/fonts/**/*.*")
        .pipe(newer("dist/fonts"))
        .pipe(gulp.dest("dist/fonts"));
});

gulp.task("scripts", function () {
    return gulp
        .src("app/js/**/*.js")
        .pipe(plumber())
        .pipe(sourcemap.init())
        .pipe(terser())
        .pipe(sourcemap.write("."))
        .pipe(gulp.dest("dist/js"));
});

gulp.task("watch", function () {
    gulp.watch("app/sass/**/*.+(scss|sass)", gulp.parallel("sass"));
    gulp.watch("app/js/**/*.js", gulp.parallel("scripts"));
    gulp.watch("app/img/icons/*.svg", gulp.parallel("svg-sprite"));
    gulp.watch("app/*.html", gulp.parallel("code"));
});

gulp.task(
    "default",
    gulp.parallel("sass", "scripts", "svg-sprite", "browser-sync", "watch"),
); //  Запускаем задачи в режиме разработки командой gulp
gulp.task(
    "build",
    gulp.series(
        "clean",
        gulp.parallel(
            "css",
            "html",
            "scripts",
            "optimize-images",
            "svg-sprite-prod",
            "copy-dist",
        ),
    ),
); //  Собираем проект для продакшена командой gulp build
