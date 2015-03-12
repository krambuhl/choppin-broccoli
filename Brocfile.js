var mergeTrees = require('broccoli-merge-trees');
var pickFiles = require('broccoli-static-compiler');
var compileSass = require('broccoli-sass');
var autoprefixer = require('broccoli-autoprefixer');
var es6transpiler = require('broccoli-es6-transpiler');
var imagemin = require('broccoli-imagemin');
var browserify = require('broccoli-fast-browserify');
var renderHandlebars = require('broccoli-handlebars');
var svgstore = require("broccoli-svgstore");

var Handlebars = require('handlebars');
var layouts = require('handlebars-layouts');
var helpers = require('handlebars-helpers');

/*
  HTML
*/

var hbs = Handlebars.create();
layouts.register(hbs);
helpers.register(hbs, {});

var hbsRender = renderHandlebars('source/templates', ['pages/**/*.hbs'], {
  partials: 'source/templates/modules',
  handlebars: hbs
});

var html = pickFiles(hbsRender, {
  srcDir: 'pages',
  destDir: ''
});

/*
  Images
*/

var images = pickFiles('source', {
  srcDir: 'images',
  destDir: 'assets/images'
});

var minImg = imagemin(images);

/*
  SVGs
*/

var svgs = svgstore('source/svg', {
  outputFile: "/assets/icons.svg"
});

/*
  Javascript
*/

var es5ified = es6transpiler('source/scripts');
var scripts = browserify(es5ified, {
  bundles: {
    'assets/bundle.js': {
      entryPoints: ['./main.js']
    }
  },
  browserify: {
    debug: true
  }
});

/*
  CSS
*/

var sass = compileSass(['source/sass'], 'style.scss', 'assets/style.css');
var autopref = autoprefixer(sass, {
  sourcemap: true,
  browsers: ['> 1%', 'last 2 versions', 'Chrome 5', 'Firefox 6']
});


module.exports = mergeTrees([html, scripts, autopref, minImg, svgs]);