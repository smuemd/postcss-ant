---
layout: default
title: Usage
---

## Preprocessors and PostCSS

Preprocessors can be used with PostCSS in a variety of ways, and you should really take the time to learn how to use your favorite preprocessor with PostCSS.

#### PostCSS Parsers

The PostCSS community has rebuilt a lot of preprocessor functionality into custom plugins. You can use SCSS syntax with a plugin like PreCSS and a parser like postcss-scss (you need both).

It's **not the same thing as SCSS** so you need to use special syntax (e.g. `@define-mixin` rather than `@mixin`) and the output looks pretty gross sometimes. Quite a bit of the functionality from Sass has been ported over, but you might end up missing some of Sass' built-in functions that haven't been ported over.

Here's a sample ant grid loop using SCSS-like syntax:

```scss
div {
  $sizes: 1/4 1/2 1/4;

  @for $i from 1 through 3 {
    &:nth-child($i) {
      width: ant($sizes)[$i];
    }
  }
}
```

To get this to parse with postcss-scss, you need to do the following:

- `npm i -D postcss postcss-cli postcss-ant precss postcss-scss`
- Create an `in.scss` file with the SCSS above.
- `node_modules/.bin/postcss -u precss -p postcss-scss -u postcss-ant -o out.css in.scss`

Again, the output will look pretty gross, but you should be minifying your final CSS anyway so it works pretty well.

#### Preprocess THEN PostCSS

The PostCSS community gets upset when you talk about doing this because it breathes life back into preprocessor development, but you can send your stylesheets directly through their respective processor, output a `.css` file (or stdout), and THEN parse over that data with your PostCSS plugins.

This technique is slower than using PostCSS' parsers, but I kind of like it because the PostCSS parsers are pretty half-assed in comparison to the actual preprocessors (missing functionality, differing syntaxes, ugly output).

Another caveat to be aware of is PostCSS custom syntaxes will frequently cause the preprocessor to error. For instance, SCSS has no idea what `ant()[]` is, so when it reaches `[]` it throws an error. You can work around this by using Sass' `unquote()` function liberally: `width: unquote('ant(') $sizes unquote(')[') $i unquote(']');`.

In Stylus you use a sprintf-like function to make this a bit better: `width: 'ant(%s)[%s]' % $sizes $i`. I'm not sure if Sass has a sprintf-like function. Please ping me in issues if you know of a better solution.

*Note: This "escaping in preprocessors" problem has been ongoing since preprocessors were invented. I just started working on a few solutions to this dilemma that should launch before the end of Sept. 2016.*

#### PostStylus

PostStylus actually does run through Stylus directly, but still runs into problems with custom syntaxes. I might be using it incorrectly so please ping me in issues if PostStylus can be used alongside custom syntaxes like the `ant()` function.

#### SugarSS

Instead of making an official postcss-stylus parser, SugarSS was developed as PostCSS' official preprocessor. It has Stylus-like syntax and works well with PostCSS plugins that introduce new syntax, but it's very new and is missing a ton of nice sugar preprocessors already have (like you're expected to replace `lighten()` with the W3C's garbage `color()` function... pfft).

That said, SugarSS combines processing speed with beautiful indentation syntax and will parse custom PostCSS functions without flinching. I used SugarSS on the creation of this website. If you're interested in looking at the code, check it out in the postcss-ant GitHub repo's `gh-pages` branch.

## Integrations

ant is a PostCSS plugin. PostCSS is a JavaScript program that looks at input CSS, alters it, and spits out some output CSS. Autoprefixer is a good example of a PostCSS plugin you're probably familiar with. It looks at an input file for CSS *declarations* (e.g. `transform: rotate(90deg);`) and when it stumbles upon one that matches its set of rules, it alters it and spits out an output file with slightly different CSS.

Kind of like preprocessor mixins, except with all the power of JavaScript. It can be a little tricky to use at first, but is well worth taking a coffee break to tinker with.

These bare-bones, step-by-step, examples should result in the following input and output.

```scss
// input
a { width: ant(1/2)[1]; }

// output
a { width: calc(99.99% * 1/2 - (30px - 30px * 1/2)); }
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
