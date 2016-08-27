---
layout: default
title: Basic Usage
---

## {{ page.title }}

ant's syntax looks like this: `ant(1/3 200px auto)[2]`. It expects a bunch of space-separated sizes -- any number of valid CSS lengths, fractions, decimals, and even the `auto` keyword -- and in the square brackets we're telling it to get the second item in the group of sizes. In this contrived example, it'd simply return `200px`, but if you were to ask for `[1]` or `[3]` it'd return a pretty crazy `calc` formula.

You can specify a gutter size (a valid CSS length) as the 2nd param to `ant()`. For example, notice the `0` in `ant(1/3, 0)[1]`. It would make the gutter `0`, effectively returning `calc(100% * 1/3)` (or `33.333%`). I refer to these as "local gutters".

By default, the gutter is `30px`, but you can change this on a global level by setting an atRule like `@ant-gutter 15px;`. An atRule should go at the top of a stylesheet.

You can set both a global gutter and a local gutter. So the grids throughout your site could have a global gutter of `60px`, but maybe you want a particular grid to be spaced out to `90px` with a local gutter.

#### Example: <span>Retrieving a Size</span>

Let's start by making a 2 column grid with a 30px gutter (the default gutter size) between them. Follow along in Inspector to see the `calc` formulas and where the gutters are being placed.

```html
<section>
  <div>1</div>
  <div>2</div>
</section>
```

```scss
section {
  overflow: hidden;
}

div {
  float: left;
  width: ant(1/2)[1];

  &:first-child {
    margin-right: 30px;
  }
}
```

We don't need to set a size for each element in our grid like `ant(1/2 1/2)`. Since these sizes are identical we just need to have ant return the same `calc` formula for each.

The `ant(1/2)[1]` asks ant to return a `calc` formula that returns 1/2 of the container's width (100%) minus the gutter between them.

<div class="example-basic-1">
  <section>
    <div>1</div>
    <div>2</div>
  </section>
</div>

In this case, ant answers "What's half of the container sans a 30px gutter?" with: `calc(100% * 1/2 - (30px - 30px * 1/2))`.

#### Example: <span>Auto Sizes</span>

Let's change the 1st column to a fixed size of `300px` and the 2nd column can just fill the rest of the space. We still want a `30px` gutter between them.

```scss
div {
  float: left;

  &:first-child {
    width: ant(300px auto)[1];
    margin-right: 30px;
  }

  &:last-child {
    width: ant(300px auto)[2];
  }
}
```

<div class="example-basic-2">
  <section>
    <div>1</div>
    <div>2</div>
  </section>
</div>

The 2nd element's `auto` value: `calc((100% - 300px - ((1 + 1 - 1) * 30px)) / 1)`. Kinda ugly but works beautifully and can be slimmed down with [postcss-calc]({{ site.baseurl }}/#postcss-calc).

#### Example: <span>Custom Local Gutters</span>

Let's shrink the gutter down to `5px`. Notice the 2nd param passed to `ant()` and the `margin-right` (our gutter):

```scss
div {
  float: left;

  &:first-child {
    width: ant(300px auto, 5px)[1];
    margin-right: 5px;
  }

  &:last-child {
    width: ant(300px auto)[2];
  }
}
```

<div class="example-basic-3">
  <section>
    <div>1</div>
    <div>2</div>
  </section>
</div>

#### Example: <span>Preprocessor Variables</span>

We can store our sizes and gutter in preprocessor variables and simply tweak those variables until things look how we like. Let's get rid of the gutter completely by setting it to `0` and make our 1st column `1/4` instead of `300px`:

```scss
div {
  $gutter: 0;
  $sizes: 1/4 auto;

  float: left;

  &:first-child {
    width: ant($sizes, $gutter)[1];
    margin-right: $gutter;
  }

  &:last-child {
    width: ant($sizes, $gutter)[2];
  }
}
```

<div class="example-basic-4">
  <section>
    <div>1</div>
    <div>2</div>
  </section>
</div>

#### Example: <span>Global Gutter</span>

In fact, let's just get rid of gutters throughout our site by setting our `@ant-gutter` atRule. Since we're not fooling with gutters, we can get rid of some superfluous code.

```scss
@ant-gutter 0;

section {
  overflow: hidden;
}

div {
  $sizes: 1/4 auto;

  float: left;

  &:first-child {
    width: ant($sizes)[1];
  }

  &:last-child {
    width: ant($sizes)[2];
  }
}
```

You could (and perhaps should) use `flex-grow` for these examples, but as we proceed, you'll begin to see the incredible strength of ant.
