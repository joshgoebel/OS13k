const { series, src, dest, parallel } = require('gulp');
var replace = require('gulp-replace');
var inject = require('gulp-inject');
var through = require('through2')
var gulpMerge = require('gulp-merge')
const merge2 = require('merge2')
var cssmin =    require('gulp-cssmin');
var gulpif = require("gulp-if")
const path = require('path');
var htmlmin =   require('gulp-htmlmin');

// The `clean` function is not exported so it can be considered a private task.
// It can still be used within the `series()` composition.
function clean(cb) {
  // body omitted
  cb();
}

var production = true

function javascript(cb) {
  return src("src/os.js")
    .pipe(dest("output"))
}

function css(cb) {
  return src("src/*.css")
    .pipe(gulpif(production, cssmin()))
    .pipe(dest("output"))
}

function html(cb) {
  let p = new Promise((resolve, reject) => {
    let styles, scripts;
    let files = {}
    merge2(css(), javascript().on("data", () => {}))
    // src("src/os.js")
    // .pipe(src("src/*.css"))
    // .on("end", function(){
    //   setTimeout(function() {}, 1000)
    //   console.log("end")
    // })
    .on("end", function(){
      // if (styles && scripts) resolve([styles, scripts])
      resolve(files)
    })
    .pipe(through.obj(function(file, enc, cb) {
      files[path.basename(file.path)] = file.contents.toString()
      console.log(file.path)
      if (file.path.endsWith(".js"))
        scripts = file.contents.toString()
      if (file.path.endsWith(".css"))
        styles = file.contents.toString()
      cb(null, file)
    }))


  })

  // let p = new Promise((resolve, reject) => {
  //   setTimeout(function() {
  //     resolve()
  //   }, 1000)

  // })

  p.then(function(files) {
    console.log(Object.keys(files))
    return src("src/base.html")
    .pipe(replace("<style></style>",function() {
      return `<style>${files["base.css"]}</style>`
    }))
    .pipe(replace("<style id=iframe></style>",function() {
      return `<style>${files["iframe.css"]}</style>`
    }))
    .pipe(replace(`<script src="os.js"></script>`,function() {
      return `<script>${files["os.js"]}</script>`
    }))
    .pipe(gulpif(production, htmlmin({
      collapseWhitespace: true,
      removeAttributeQuotes: true,
      removeComments: true,
    })))
    .pipe(dest("output"))
  })
  p.catch(function() {
    console.log("catch")
  })
  return p
}

let build = series(
  clean,
  parallel(
    css,
    javascript
    // series(jsTranspile, jsBundle)
  ),
  html,
  // parallel(cssMinify, jsMinify),
  // publish
);
exports.build = build
exports.default = series(build);