'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _postcss = require('postcss');

var _postcss2 = _interopRequireDefault(_postcss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ant
var ant = _postcss2.default.plugin('postcss-ant', function () {
  return function (css, result) {
    // Set root
    var root = _postcss2.default.parse(css);

    // Stash atRule gutter (global gutter) for later.
    var globalGutter = '';
    root.walkAtRules(function (rule) {
      if (rule.name === 'ant-gutter') {
        globalGutter = rule.params;
      }
    });

    css.walkDecls(function (decl) {
      // If declaration's value begins with `ant(`.
      if (decl.value.match(/^ant\(/)) {
        var _ret = function () {
          // Section: Define gutter by specificity.
          // Set default gutter size.
          var gutter = '30px';

          // Set as local gutter if it exists. No need to set global gutter if local is set.
          if (decl.value.match(/,/)) {
            gutter = decl.value.split(/,/)[1];
            gutter = gutter.split(/\)\[/)[0].trim();
            // Set global gutter to whatever the atRule gutter was earlier.
          } else if (globalGutter.length) {
            gutter = globalGutter;
          }

          // Set gutter to false if it doesn't exist, this lets us do things like `if (gut) ...`.
          if (parseInt(gutter, 10) === 0) {
            gutter = false;
          }

          // Section: Get the sizes and put them in an array.
          // If no local gutter, just grab the string between `ant(` and `)[`.
          var sizes = '';

          // If there is no local gutter, grab sizes string and convert to array.
          if (!decl.value.match(/,/)) {
            // Grab everything after `ant(`.
            sizes = decl.value.split(/^ant\(/)[1];
            // Grab everything before `)[`. This should leave a string of space separated sizes.
            sizes = sizes.split(/\)\[/)[0].trim();
            // If local gutter, grab the string between `ant(` and the comma, then convert to array.
          } else {
            // Grab everything after `ant(`.
            sizes = decl.value.split(/^ant\(/)[1];
            // Drop the local gutter.
            sizes = sizes.split(/,/)[0].trim();
          }

          // Convert sizes string to an array.
          sizes = sizes.split(' ');

          // Section: Grab the index.
          var index = parseInt(decl.value.match(/\[(.*)\]/)[1].trim(), 10) - 1;

          // Sort sizes
          var units = /em|ex|%|px|cm|mm|in|pt|pc|ch|rem|vh|vw|vmin|vmax/;
          var fixedArr = [];
          var fracArr = [];
          var numAuto = 0;
          sizes.forEach(function (size) {
            if (size) {
              if (size.match(units)) {
                fixedArr.push(size);
              } else if (size.match(/\/|\./)) {
                fracArr.push(size);
              } else if (size.match(/auto/)) {
                numAuto += 1;
              }
            }
          });

          var numFixed = fixedArr.length;
          var sumFixed = '';
          if (numFixed === 1) {
            sumFixed = '' + fixedArr.join(' + ');
          } else if (numFixed > 1) {
            sumFixed = '(' + fixedArr.join(' + ') + ')';
          } else {
            sumFixed = 0;
          }

          var numFrac = fracArr.length;
          var sumFrac = '';
          if (numFrac > 0) {
            sumFrac = '(' + fracArr.join(' + ') + ')';
          } else {
            sumFrac = 0;
          }

          // Alias sizes[index] to val because it's shorter.
          var val = sizes[index];

          // val is a fixed number, we don't need to go any further.
          if (val.match(units)) {
            decl.value = sizes[index];
            return {
              v: void 0
            };
          }

          // Section: Conditional Math Hell -- Abandon all hope, ye who enter here...

          // val is a fraction
          if (val.match(/\/|\./)) {
            // fraction(s) only
            if (numFrac > 0 && numFixed === 0 && numAuto === 0) {
              if (gutter) {
                decl.value = 'calc(100% * ' + val + ' - (' + gutter + ' - ' + gutter + ' * ' + val + '))';
                return {
                  v: void 0
                };
              } else {
                decl.value = 'calc(100% * ' + val + ')';
                return {
                  v: void 0
                };
              }
            }

            // fraction(s) and fixed number(s) only
            if (numFrac > 0 && numFixed > 0 && numAuto === 0) {
              if (gutter) {
                decl.value = 'calc((100% - (' + sumFixed + ' + (' + gutter + ' * ' + numFixed + '))) * ' + val + ' - (' + gutter + ' - ' + gutter + ' * ' + val + '))';
                return {
                  v: void 0
                };
              } else {
                decl.value = 'calc(100% * ' + val + ' - ' + sumFixed + ')';
                return {
                  v: void 0
                };
              }
            }

            // fraction(s) and auto(s) only
            if (numFrac > 0 && numAuto > 0 && numFixed === 0) {
              if (gutter) {
                decl.value = 'calc(100% * ' + val + ' - (' + gutter + ' - ' + gutter + ' * ' + val + '))';
                return {
                  v: void 0
                };
              } else {
                decl.value = 'calc(100% * ' + val + ')';
                return {
                  v: void 0
                };
              }
            }

            // fractions(s), fixed number(s), and auto(s)
            if (numFrac > 0 && numFixed > 0 && numAuto > 0) {
              if (gutter) {
                decl.value = 'calc((100% - (' + sumFixed + ' + (' + gutter + ' * ' + numFixed + '))) * ' + val + ' - (' + gutter + ' - ' + gutter + ' * ' + val + '))';
                return {
                  v: void 0
                };
              } else {
                decl.value = 'calc((100% - ' + sumFixed + ') * ' + val + ')';
                return {
                  v: void 0
                };
              }
            }
          }

          // val is auto
          if (val.match(/auto/)) {
            // auto(s) only
            if (numAuto > 0 && numFrac === 0 && numFixed === 0) {
              if (gutter) {
                decl.value = 'calc((100% - ((' + numAuto + ' - 1) * ' + gutter + ')) / ' + numAuto + ')';
                return {
                  v: void 0
                };
              } else {
                decl.value = 'calc(100% / ' + numAuto + ')';
                return {
                  v: void 0
                };
              }
            }

            // auto(s) and fixed number(s) only
            if (numAuto > 0 && numFixed > 0 && numFrac === 0) {
              if (gutter) {
                decl.value = 'calc((100% - ' + sumFixed + ' - ((' + numFixed + ' + ' + numAuto + ' - 1) * ' + gutter + ')) / ' + numAuto + ')';
                return {
                  v: void 0
                };
              } else {
                decl.value = 'calc((100% - ' + sumFixed + ') / ' + numAuto + ')';
                return {
                  v: void 0
                };
              }
            }

            // auto(s) and fraction(s) only
            if (numAuto > 0 && numFrac > 0 && numFixed === 0) {
              if (gutter) {
                decl.value = 'calc(((100% - (100% * ' + sumFrac + ' - (' + gutter + ' - ' + gutter + ' * ' + sumFrac + '))) / ' + numAuto + ') - ' + gutter + ')';
                return {
                  v: void 0
                };
              } else {
                decl.value = 'calc((100% - (100% * ' + sumFrac + ')) / ' + numAuto + ')';
                return {
                  v: void 0
                };
              }
            }

            // auto(s), fraction(s), and fixed number(s)
            if (numAuto > 0 && numFrac > 0 && numFixed > 0) {
              if (gutter) {
                decl.value = 'calc((100% - ((' + sumFixed + ' + (' + gutter + ' * ' + numFixed + ')) + ((100% - (' + sumFixed + ' + (' + gutter + ' * ' + numFixed + '))) * ' + sumFrac + ' - (' + gutter + ' - ' + gutter + ' * ' + sumFrac + '))) - (' + gutter + ' * ' + numAuto + ')) / ' + numAuto + ')';
                return {
                  v: void 0
                };
              } else {
                decl.value = 'calc((100% - (' + sumFixed + ' + ((100% - ' + sumFixed + ') * ' + sumFrac + '))) / ' + numAuto + ')';
                return {
                  v: void 0
                };
              }
            }
          }
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
      }
    });
  };
});

exports.default = ant;
module.exports = exports['default'];