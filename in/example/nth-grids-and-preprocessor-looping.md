---
layout: default
title: nth Grids and Preprocessor Looping
---

## {{ page.title }}

There are 2 types of popular grid systems:

1. negative-margin grids like Bootstrap. They can accept elements of varying sizes, but produce extra markup (sometimes a lot).
1. nth grids like Jeet. They use `nth` selectors to have light markup, but can be hard to work with when using elements of varying sizes.

There is no perfect balance and **you should always pick the system you need for the job**. If you're making a gallery of pictures and want it to have a mosaic look, a negative-margin grid is probably your best bet. In most cases you can get away with light-markup nth grids.

*Preprocessor loops + nth-grids + ant* introduce something new to the grid game: light markup and irregular, though patterned, grids. Not perfect (since you still need to know how many elements per row), but a new tool for the toolbox that can completely replace old nth grids.

In nth grids you might specify a 3-column grid as such:

```scss
.row {
  @include clearfix;
}

.column {
  float: left;
  width: calc(100% * 1/3 - (30px - 30px * 1/3)); // the last bit trims the size so you can fit a gutter
  margin-right: 30px; // the aforementioned gutter

  &:nth-child(3n) {
    margin-right: 0; // remove the gutter from the last element of each row
  }

  &:nth-child(3n + 1) {
    clear: left; // useful when elements of varying height are involved. makes sure rows line-break as expected.
  }
}
```

There are grid systems out there that will do this for you (e.g. Lost), but they do too much and are punished for it. They assume you're bad at CSS and assign all this code for you. This is great when you have elements that are supposed to be the exact same size, but gets pretty hairy when you want to mix it up.

Say you want the middle elements to become `4/6` and the flanking elements to be `1/6` each. You can do this fairly easily with some neat nth selectors.

```scss
.column {
  float: left;
  margin-right: 30px;

  // these will get the 1st and 3rd elements of every row (if there are 3 elements per row)
  &:nth-child(3n + 1),
  &:nth-child(3n + 3) {
    width: calc(100% * 1/6 - (30px - 30px * 1/6));
  }

  &:nth-child(3n + 2) {
    width: calc(100% * 4/6 - (30px - 30px * 4/6));
  }

  &:nth-child(3n) {
    margin-right: 0;
  }

  &:nth-child(3n + 1) {
    clear: left;
  }
}
```

In previous grid systems, this kinda stuff required doing weird stuff in those grid systems' mini-languages, and the bloat got **bad** with countless unanswerable issues revolving around the issue of bloat.

ant's different and this is why its called a "size-getter" instead of a grid system. It does all that grid-friendly math above for you and simply returns a `calc` formula. You do what you want with it. Widths, heights, rocket-ship dimensions, whatever.

Here's that example above using ant for the math:

```scss
.column {
  float: left;
  margin-right: 30px;

  &:nth-child(3n + 1) {
    width: ant(1/6 4/6 1/6)[1];
  }

  &:nth-child(3n + 2) {
    width: ant(1/6 4/6 1/6)[2];
  }

  &:nth-child(3n + 3) {
    width: ant(1/6 4/6 1/6)[3];
  }

  &:nth-child(3n) {
    margin-right: 0;
  }

  &:nth-child(3n + 1) {
    clear: left;
  }
}
```

Notice how we broke the `(3n + 1)` and `(3n + 3)` selectors apart? They're essentially returning the same size. This was intentional.

With preprocessors, we can stash that list of sizes in a variable:

```scss
.column {
  float: left;
  margin-right: 30px;

  $sizes: 1/6 4/6 1/6;

  &:nth-child(3n + 1) {
    width: ant($sizes)[1];
  }

  &:nth-child(3n + 2) {
    width: ant($sizes)[2];
  }

  &:nth-child(3n + 3) {
    width: ant($sizes)[3];
  }

  &:nth-child(3n) {
    margin-right: 0;
  }

  &:nth-child(3n + 1) {
    clear: left;
  }
}
```

Now if we make any changes to the sizes, we can just tweak them in that one spot. And since we broke apart the selectors, they will always work. For instance, we could simply adjust `$sizes` to `2/6 3/6 1/6` and it'd work great.

But what happens if you want a grid with many elements per row? Writing all those `nth-child` selectors becomes pretty tedious really fast. This is where loops really make ant amazing.

#### Preprocessor Looping: <span>nth grids</span>

```html
<div class="grid">
  <div class="column">1</div>
  <div class="column">2</div>
  <div class="column">3</div>
  <div class="column">4</div>
  <div class="column">5</div>
</div>
```

```scss
.column {
  float: left;
  margin-right: 30px;

  $sizes: 1/15 2/15 3/15 4/15 5/15;

  @for $i in 1 through 5 {
    &:nth-child(5n + $i) {
      width: ant($sizes)[$i];
    }
  }

  &:nth-child(5n) {
    margin-right: 0;
  }

  &:nth-child(5n + 1) {
    clear: left;
  }
}
```

<div class="example-loops-1">
  <div class="grid">
    <div class="column">1</div>
    <div class="column">2</div>
    <div class="column">3</div>
    <div class="column">4</div>
    <div class="column">5</div>
  </div>
</div>

Let's put this in perspective... You just made one of those sick "A List Apart" asymmetrical, content-out thingy, grids in a few lines of code, that produces the minimal amount of markup and CSS output possible, works in IE8 (with a selector and calc polyfill, as found in Boy), and loops down infinitely without superfluous "row" markup.

Want to tweak the gutter? You could put it directly in that loop, but lets stash it in a variable (we might use it somewhere else?).

```scss
.column {
  float: left;
  margin-right: 30px;

  $sizes: 1/15 2/15 3/15 4/15 5/15;
  $gutter: 5px;

  @for $i in 1 through 5 {
    &:nth-child(5n + $i) {
      width: ant($sizes, $gutter)[$i];
    }
  }

  &:nth-child(5n) {
    margin-right: 0;
  }

  &:nth-child(5n + 1) {
    clear: left;
  }
}
```

<div class="example-loops-2">
  <div class="grid">
    <div class="column">1</div>
    <div class="column">2</div>
    <div class="column">3</div>
    <div class="column">4</div>
    <div class="column">5</div>

    <div class="column">1</div>
    <div class="column">2</div>
    <div class="column">3</div>
  </div>
</div>

Note: This should stop on the 3rd element of the 2nd row to demonstrate it doesn't unintentionally expand to fill the rest of the container like `flex-grow: 1` would.
