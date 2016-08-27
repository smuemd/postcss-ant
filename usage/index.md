---
layout: default
title: Usage
---

## Integrations

ant is a PostCSS plugin. PostCSS is a JavaScript program that looks at input CSS, alters it, and spits out some output CSS. Autoprefixer is a good example of a PostCSS plugin you're probably familiar with. It looks at an input file for CSS *declarations* (e.g. `transform: rotate(90deg);`) and when it stumbles upon one that matches its set of rules, it alters it and spits out an output file with slightly different CSS.

Kind of like preprocessor mixins, except with all the power of JavaScript. It can be a little tricky to use at first, but is well worth taking a coffee break to tinker with.

These bare-bones, step-by-step, examples should result in the following input and output.

```scss
// input
a { width: ant(1/2)[1]; }

// output
a { width: calc(100% * 1/2 - (30px - 30px * 1/2)); }
```

Hopefully they'll get you started with your favorite build tool and PostCSS plugins. If you have any questions about how to add more PostCSS plugins, or use a particular preprocessor with these solutions, just ping me via GitHub [issues](https://github.com/corysimmons/postcss-ant/issues) and we can work through it together (then improve these docs).

A lot of the examples have a lot of similar steps. Here is what they all do:

- `mkdir -p ~/Desktop/playground/ant/foo` (creates a dummy directory to test these examples out before fighting with them in a real-world project)
- `cd ~/Desktop/playground/ant/postcss-cli`
- `echo '{}' > package.json` (creates a valid JSON `package.json` so we can save npm packages to it)
- `npm i -D ... ...` (installs packages from npm and saves them to `package.json` as development dependencies)
- `echo 'a { width: ant(1/2)[1]; }' > in.css` (creates a stylesheet with a really basic ant function)

## postcss-cli

- `mkdir -p ~/Desktop/playground/ant/postcss-cli`
- `cd ~/Desktop/playground/ant/postcss-cli`
- `echo '{}' > package.json`
- `npm i -D postcss-cli postcss-ant`
- `echo 'a { width: ant(1/2)[1]; }' > in.css`
- `node_modules/.bin/postcss -u postcss-ant -w -o out.css in.css`

## Node.js

- `mkdir -p ~/Desktop/playground/ant/node`
- `cd ~/Desktop/playground/ant/node`
- `echo '{}' > package.json`
- `npm i -D postcss-ant`
- `echo 'a { width: ant(1/2)[1]; }' > in.css`

```js
// index.js
var fs = require('fs');
var postcss = require('postcss');
var ant = require('postcss-ant');

fs.writeFileSync('out.css', postcss(ant).process(fs.readFileSync('in.css', 'utf8')).css);
```

- `node index`

## Gulp

- `mkdir -p ~/Desktop/playground/ant/gulp/src`
- `cd ~/Desktop/playground/ant/gulp`
- `echo '{}' > package.json`
- `npm i -D gulp gulp-postcss postcss-ant`
- `echo 'a { width: ant(1/2)[1]; }' > src/style.css`

```js
// gulpfile.js
var postcss = require('gulp-postcss');
var gulp = require('gulp');
var ant = require('postcss-ant');

gulp.task('default', function () {
  return gulp.src('./src/style.css')
      .pipe(postcss([ant]))
      .pipe(gulp.dest('./dist'));
});
```

- `gulp`

## Contribute Your Own Integration

I love learning/teaching about a plethora of integrations. I'd love to see some integrations for Webpack, Browserify, Brunch, etc.

If you're proficient in these tools and could provide terse step-by-step directions (like above) for using ant in these environments I would really appreciate you contributing your knowledge via a GitHub [issue](https://github.com/corysimmons/postcss-ant/issues/new).
