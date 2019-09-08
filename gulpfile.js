const { src, dest, series, watch } = require('gulp');
const minifyInline = require('gulp-minify-inline');
const htmlmin = require('gulp-htmlmin');
const terser = require('gulp-terser');
const rev = require('gulp-rev');
const revRewrite = require('gulp-rev-rewrite');
const cleanCSS = require('gulp-clean-css');
const inlinesource = require('gulp-inline-source');
const sass = require('gulp-sass');
const path = require('path');


function sassTransform() {
  return src('assets/**/*.scss')
    .pipe(sass({
      includePaths: [
        path.join(__dirname, '_sass'),
        path.join(__dirname, 'node_modules/normalize-scss/sass'),
      ]
    }))
    .pipe(dest('_site/assets'))
}

function htmlMinifyInline() {
  return src('_site/**/*.html')
    .pipe(htmlmin(
      {
        collapseWhitespace: true,
        removeComments: true
      }
    ))
    .pipe(
      minifyInline()
    )
    .pipe(dest('_site'))
};

function jsMinify() {
  return src('_site/**/*.js')
    .pipe(terser())
    .pipe(dest('_site'))
}

function cssMinify() {
  return src('_site/**/*.css')
  .pipe(cleanCSS())
  .pipe(dest('_site'))
}

function revision() {
  return src('_site/assets/**/*.{css,js}')
    .pipe(rev())
    .pipe(dest('_site/assets'))
    .pipe(rev.manifest())
    .pipe(dest('_site/assets'));
}

function rewrite() {
  const manifest = src('_site/assets/rev-manifest.json');

  return src('_site/**/*.html')
    .pipe(revRewrite({ manifest }))
    .pipe(dest('_site'));
}

function inlineSource() {
  return src('_site/**/*.html')
  .pipe(inlinesource({
    rootpath: path.join(__dirname, '_site')
  }))
  .pipe(dest('_site'))
}

function build() {
  return series(
    sassTransform,
    htmlMinifyInline,
    jsMinify,
    cssMinify,
    inlineSource,
    revision,
    rewrite
  )
}
exports.watch = function() {
  watch(['_site/**/*.*', '!_site/**/*.css'], sassTransform);
};

exports.default = series(
  sassTransform,
  htmlMinifyInline,
  jsMinify,
  cssMinify,
  inlineSource,
  revision,
  rewrite
);
