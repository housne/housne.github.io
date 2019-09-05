const { src, dest, series } = require('gulp');
const minifyInline = require('gulp-minify-inline');
const htmlmin = require('gulp-htmlmin');
const terser = require('gulp-terser');
const rev = require('gulp-rev');
const revRewrite = require('gulp-rev-rewrite');
const cleanCSS = require('gulp-clean-css');

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

exports.htmlMinifyInline = htmlMinifyInline;
exports.jsMinify = jsMinify;
exports.default = series(revision, rewrite, htmlMinifyInline, jsMinify, cssMinify);
