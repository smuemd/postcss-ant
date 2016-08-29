---
layout: default
---

## What is ant?

Wouldn't it be nice if `width: auto` actually filled the remaining space?

Ever wish those fancy grid systems would just return a size sans gutter instead of trying to solve every layout problem for you, forcing you to learn *yet another* "mini-language" and leaving you with a ton of headaches and code bloat?

Finding it difficult to create a simple grid with flexbox?

ant has solutions to these problems. Its syntax is incredibly simple, but it might become the most powerful tool in your arsenal -- small-but-strong -- like an ant.

## Installation

`npm i -D postcss-ant`

## API

- `ant(space separated sizes, optional gutter, optional grid type)[1-based index]`
- "space separated sizes" can be valid CSS lengths, fractions, decimals, and `auto`(s). Example: `1/2 auto 300px auto`
- The gutter can be any valid CSS length.
- The grid type can be `nth` or `negative-margin`.
  - `nth` grids leave room for a gutter on a single side of the element, usually ending the last item in a row with `margin-right: 0`.
  - `negative-margin` grids expect margins on both sides of the element, requiring a wrapping element with negative margins on each side.
  - Refer to the Examples section in the sidebar for a clearer understanding.
- It doesn't matter what order the gutter and grid type are defined in (e.g. `ant(1/2 auto, 45px)` and `ant(1/2 auto, negative-margin)` will both work) but the sizes list should always be the first argument. Obviously all 3 parameters can be filled (e.g. `ant(100px auto, 60px, negative-margin)[2]`).
- Please note the **1-based index**. It's 1-based to match how `nth` selectors count things (making it easier for preprocessor looping). It will fetch a size from your list of sizes (e.g. `ant(100px 200px 300px)[1]` will return `100px` whereas `[2]` would return `200px`).

#### Global Settings
atRules are used to define a global settings (this is standard in PostCSS plugins).

- `@ant-gutter [valid CSS length];` (defaults to `30px`)
- `@ant-type [nth or negative-margin];` (defaults to `nth`)

#### Examples

```scss
// Basic Layout
@ant-gutter 60px;

.sidebar {
  width: ant(1/4 auto)[1]; // returns calc(1/4 sans gutter)
}

.content {
  width: ant(1/4 auto)[2]; // returns calc(a percentage of whatever is left over after 1/4 sans calc)
}

// 4-column grid with lots of weird sizes and a custom gutter
.column {
  $gutter: 45px;
  $sizes: 1/3 auto 200px 4%;

  float: left;
  margin-right: $gutter;

  /*
    A preprocessor loop that creates things like:
    &:nth-child(4n + 1) {
      width: ant(1/3 auto 200px 4%, 45px)[1];
    }

    &:nth-child(4n + 2) {
      width: ant(1/3 auto 200px 4%, 45px)[2];
    }

    ...
  */

  @for $i in 1 through 4 {
    &:nth-child(4n + $i) {
      width: ant($sizes, $gutter)[$i];
    }
  }

  &:nth-child(4n) {
    margin-right: 0; // remove the gutter from the last element in each row
  }

  &:nth-child(4n + 1) {
    clear: left; // ensure elements of varying height line break appropriately
  }
}

// Flexbox 4-column grid
.flex-grid {
  display: flex;
  flex-wrap: wrap;
}

.flex-column {
  $flex-gutter: 15px;
  $flex-sizes: 1/3 auto 200px 4%;

  margin-right: $flex-gutter;

  @for $i in 1 through 4 {
    &:nth-child(4n + $i) {
      min-width: ant($flex-sizes, $flex-gutter)[$i];
      max-width: ant($flex-sizes, $flex-gutter)[$i];
    }
  }

  &:nth-child(4n) {
    margin-right: 0;
  }
}
```

There are plenty more real-world examples with thorough explanations and demos in the sidebar.

That's it. Now you know ant. If you're pretty good with preprocessor loops and can use PostCSS plugins, you can stop reading now. Enjoy your new toy.

## postcss-ant vs Flexbox

#### TL;DR

ant does very predictable math and can work with gutters. Flexbox does unpredictable math and **is not** a replacement for grid systems. That said, **the two can happily co-exist** to produce some great stuff, but I personally believe we shouldn't go out of our way to shut out older browser users *if* it provides little-to-no benefit.

As with every single thing in the universe, pick your tools depending on the task at hand. Making a website for senior citizens? Might be a good idea to assume they aren't on a cutting edge browser. Selling organically and ethically sourced coffee beans? Flexbox will probably work for 99% of your userbase.

---

Flexbox is pretty handy for a number of things, and we all rejoiced when `flex-grow: 1` revealed itself as the `width: auto` we've always wanted, but `flex-grow` can be unpredictable, and unpredictable tools result in a lot of wasted time. Consider the following...

#### Example: <span>Product Listing</span>

<p class="mobile-note">
  <b>Note:</b> These examples look screwy on mobile because we're using two `150px` elements for demostration purposes. Too lazy to make it pretty for you toilet-bound studiers. Just trust the blocks are there or turn your phone sideways.
</p>

The first and last item in every row should be `150px`. There are 2 middle items that should fill the remaining space. An implementation with flexbox might look like this:

```scss
.products-row {
  display: flex;
}

.product {
  &:first-child,
  &:last-child {
    width: 150px;
  }

  &:nth-child(2),
  &:nth-child(3) {
    flex-grow: 1;
  }
}
```

Seems to work pretty well until you put a dynamic number of products in it and the last item lands on one of those `flex-grow: 1` elements. Then your symmetry dies:

<div class="example-flexbox-1">
  <div class="products-row">
    <div class="product"></div>
    <div class="product"></div>
    <div class="product"></div>
    <div class="product"></div>
  </div>

  <div class="products-row">
    <div class="product"></div>
    <div class="product wrong"></div>
  </div>
</div>

If you're pretty good at math (or don't mind pixel-nudging), this can be solved by setting `max-width` to an exact size:

```scss
.product {
  &:nth-child(2),
  &:nth-child(3) {
    flex-grow: 1;
    max-width: calc(50% - 150px);
  }
}
```

<div class="example-flexbox-2">
  <div class="products-row">
    <div class="product"></div>
    <div class="product"></div>
    <div class="product"></div>
    <div class="product"></div>
  </div>

  <div class="products-row">
    <div class="product"></div>
    <div class="product"></div>
  </div>
</div>

But now there is **no need** for `flex-grow`. If we remove `flex-grow` and simplify `max-width` to `width`, it performs its purpose -- without flexbox.

```scss
.product {
  float: left;

  &:nth-child(2),
  &:nth-child(3) {
    width: calc(50% - 150px);
  }
}
```

<div class="example-flexbox-3">
  <div class="products-row">
    <div class="product"></div>
    <div class="product"></div>
    <div class="product"></div>
    <div class="product"></div>
  </div>

  <div class="products-row">
    <div class="product"></div>
    <div class="product"></div>
  </div>
</div>

ant performs the `calc` math for you. In fact, ant makes it easy to pass any combination of sizes (fixed/fluid numbers, fractions/decimals, autos) as well as taking care of the math for something flexbox does nothing for: gutters.

Here's an example of that product listing using ant, preprocessor loops, and some clever `nth` selectors:

```html
<div class="products">
  <div class="product"></div>
  <div class="product"></div>
  <div class="product"></div>
  <div class="product"></div>
  ...
</div>
```

```scss
.products {
  // clearfix (can/should be put into a mixin)
  &::after {
    content: '';
    display: table;
    clear: both;
  }
}

.product {
  float: left;
  margin-right: 30px; // whatever the gutter is (ant defaults to a 30px gutter)

  @for $i in 1 through 4 { // the 4 is the number of elements per row. the $i is an iterator (e.g. 1...2...3...4)
    &:nth-child(4n + $i) { // again, the 4 is the number of elements per row
      width: ant(150px auto auto 150px)[$i];
    }
  }

  &:nth-child(4n) {
    margin-right: 0; // remove the gutter from the last element in a row
  }

  &:nth-child(4n + 1) {
    clear: left; // force the first element in every row to clear the row before (helps with elements of uneven heights)
  }
}
```

Seems like a lot of code, but it's not. Here is the same code cleaned up and sans comments:

```scss
.products {
  @include clearfix;
}

.product {
  float: left;
  margin-right: 30px;

  @for $i in 1 through 4 {
    &:nth-child(4n + $i) {
      width: ant(150px auto auto 150px)[$i];
    }
  }

  &:nth-child(4n) {
    margin-right: 0;
  }

  &:nth-child(4n + 1) {
    clear: left;
  }
}
```

<div class="example-flexbox-4">
  <div class="products">
    <div class="product"></div>
    <div class="product"></div>
    <div class="product"></div>
    <div class="product"></div>
    <div class="product"></div>
    <div class="product"></div>
  </div>
</div>

To remove the gutters, simply remove the `margin`s and pass `0` to ant's 2nd param:

```scss
.products {
  @include clearfix;
}

.product {
  float: left;

  @for $i in 1 through 4 {
    &:nth-child(4n + $i) {
      width: ant(150px auto auto 150px, 0)[$i]; // the 0 specifies the gutter size (tinker with it)
    }
  }

  &:nth-child(4n + 1) {
    clear: left;
  }
}
```

14 lines of code.

Compare the number of lines to flexbox's implementation:

```scss
.products {
  display: flex;
}

.product {
  &:nth-child(4n + 1),
  &:nth-child(4n + 4) {
    width: 150px;
  }

  &:nth-child(4n + 2),
  &:nth-child(4n + 3) {
    flex-grow: 1; // superfluous
    min-width: calc(50% - 150px); // difficult to figure out
    max-width: calc(50% - 150px); // gutters not included
  }
}
```

15 lines of code. 14 without the superfluous `flex-grow`.

At this point, you might notice something. ant could be used to calculate those `min`/`max-width`s. It absolutely can (and should, since the provided example's math just happens to be simple), but in this particular use-case, there's no particular benefit to using flexbox over a traditional implementation.

The point is: **ant is not a direct competitor to flexbox. ant does math that can be used with, or without, flexbox.**


#### Rant: <span>The Gutter Problem</span>

A grid isn't just columns. It's columns *and* gutters. Therein lies the problem...

Consider the 3 most prevalent ways to create a grid:

1. **negative-margin** grids (Bootstrap 2)
1. **nth** grids (Susy, [Jeet](http://jeet.gs), Neat)
1. **padding** grids (Bootstrap 3)

Padding grids produce an **insane** amount of markup for no real benefit (now that we have `calc`) so let's not even discuss them here* and just hope they die soon. (* happy to discuss this in Issues if you're particularly keen on them.)

The other 2 approaches (nth and negative-margin) are trying to solve the same unsolvable problem: what do we do with excess gutter?

This is really where ant pulls away from flexbox, but to understand how cool what ant is doing is, you have to understand **The Gutter Problem**.

- Grids are composed of columns and gutters.
- There are 2 main ways to create a gutter:
    1. Half of the gutter on each side of a column.
    1. The entire gutter on one side of a column.
- Where do the excess gutters go?

These simple questions keep grid enthusiasts up at night.

- If you put half a gutter on each side, you need a lot of extra markup to "clip" those overhanging gutters off and/or add background color to columns. (Bootstrap)
- If you put the whole gutter on a single side, you need to remove the last gutter in a row but in order to do that, you need to know how many items will go in each row. (Jeet)

In order for the math behind the full-gutter approach to produce fixed gutters (same size even if you nest) grids required *context* (knowing what size the parent grids were and passing that along to the current grid somehow). This resulted in expecting the developer to know a lot about what their site was going to have in it (bad for sites with lots of dynamic content) and occasionally some pretty gnarly mixin args. But it *did* remove the need for a lot of superfluous markup.

When I began work on [Lost](https://github.com/corysimmons/lost) I wanted to try and solve this problem and ended up discovering some `calc` formula that removed the need for *context* completely.

That formula was migrated over to ant, but where ant assumes nothing about how you plan to implement your grid, you can use either (or neither) approach depending on your exact needs. This results in very slim markup *and* CSS (the Holy Grail).

ant understands The Gutter Problem and will calculate your grid sizes into its equations whereas flexbox just assumes you won't really need gutters and leaves it all the math up to you. Hence flexbox grid systems are typically just Bootstrap knockoffs with rows having `display: flex` and columns having `min` & `max-width` of `100% / however many columns`. This is the extent of the help you get from these grid systems.

Takeaway: **Flexbox doesn't help with gutters. Gutter math is a huge part of grid systems.** Therefore flexbox isn't a replacement for grid systems (as the W3C repeatedly states).

#### Example: <span>Gutter Math</span>

Let's say you need a simple 3-column grid system. Each column should be 1/3 of the container with a 30px gutter between them.

A single-row flexbox implementation might look like this:

```html
<div class="grid">
  <div class="column"></div>
  <div class="column"></div>
  <div class="column"></div>
</div>
```

```scss
.grid {
  display: flex;
}

.column {
  flex-grow: 1;
  margin-right: 30px;

  &:last-child {
    margin-right: 0;
  }
}
```

<div class="example-flexbox-5">
  <div class="grid">
    <div class="column"></div>
    <div class="column"></div>
    <div class="column"></div>
  </div>
</div>

But what happens if we add another element?

<div class="example-flexbox-5">
  <div class="grid">
    <div class="column"></div>
    <div class="column"></div>
    <div class="column"></div>
    <div class="column wrong"></div>
  </div>
</div>

We can add `flex-wrap`, but it won't help without specified `min`/`max-width`s.

We can use Lost's `calc` formula to get the correct sizes: `calc(100% * 1/3 - (30px - 30px * 1/3))`. We'll also have to use a clever `nth` selector. `flex-grow` becomes useless and can be removed:

```scss
.grid {
  display: flex;
  flex-wrap: wrap;
}

.column {
  min-width: calc(100% * 1/3 - (30px - 30px * 1/3));
  max-width: calc(100% * 1/3 - (30px - 30px * 1/3));
  margin-right: 30px;

  &:nth-child(3n + 3) {
    margin-right: 0;
  }
}
```

<div class="example-flexbox-6">
  <div class="grid">
    <div class="column"></div>
    <div class="column"></div>
    <div class="column"></div>
    <div class="column"></div>
  </div>
</div>

Let's use ant **with** flexbox to do the math for us:

```scss
.grid {
  display: flex;
  flex-wrap: wrap;
}

.column {
  min-width: ant(1/3)[1]; // we don't need to specify each column's width since they're all the same
  max-width: ant(1/3)[1];
  margin-right: 30px;

  &:nth-child(3n + 3) {
    margin-right: 0;
  }
}
```

<div class="example-flexbox-7">
  <div class="grid">
    <div class="column"></div>
    <div class="column"></div>
    <div class="column"></div>
    <div class="column"></div>
  </div>
</div>

For posterity's sake -- a float-based implementation using ant:

```scss
.grid {
  @include clearfix;
}

.column {
  float: left;
  margin-right: 30px;

  @for $i in 1 through 3 {
    &:nth-child(3n + $i) {
      width: ant(1/3)[1];
    }
  }

  &:nth-child(3n + 3) {
    margin-right: 0;
  }
}
```

<div class="example-flexbox-8">
  <div class="grid">
    <div class="column"></div>
    <div class="column"></div>
    <div class="column"></div>
    <div class="column"></div>
  </div>
</div>

Buuuuuuuuuuuuuuuuuuut:

- What happens when you need elements of varying sizes?
- What about when you introduce a new element and need another size?
- Will you have to go rewrite all your previous calculations?
- What if you want to tweak the gutter size?
- What happens when you want `flex-grow: 1` but don't want it to break with dynamic sizing? Do you know the math to get that size?
- etc. etc. etc.

Flexbox doesn't have answers to any of these questions because... **it's not a grid system**. It don't care 'bout no dynamic number of elements! It don't care 'bout no gutter math!

## Flexbox's Strengths

So where does flexbox really shine? Source ordering, alignment, and dynamic sizing.

- Simply put, nothing compares to `order` for source ordering. It's insanely easy to use, fairly predictable, and offers a way to perform vertical source ordering (pretty tricky business).
- Alignment with flexbox is also pretty nice. Most of the alignment functionality can be replicated with a `display: table-cell; vertical-alignment: x; text-align: x` container and `display: inline-block` child, but there are a few scenarios that require an extra `display: table` wrapping element to work. Flexbox's alignment is very predictable and will always work with just a parent and child element.
- When you don't know the size of something flexbox can be very useful. For instance, a sticky footer with dynamic text in it. ant offers no way to detect the dynamic text element's height.
- Flexbox produces slightly smaller rulesets. This is actually pretty nice/clean, but you should really consider your audience and if saving several lines of typing are worth screwing over people stuck on older browsers (they actually still exist contrary to popular belief) or dealing with flexbugs between various browsers.

For pretty much everything else **flexbox is overhyped**. Flexbox Fever is actually pretty insane.

## Why PostCSS?

PostCSS *is JavaScript*. JavaScript is infinitely more powerful than any preprocessor could dream to be, so while it is true you could port ant to preprocessors, the syntax would change and the conditional trees aren't of this world (my poor eyes saw it in Stylus when I was originally tinkering around with the idea).

It would also mean maintaining 3+ codebases for the same functionality across the board. Anytime something was tweaked, I would have to do it for each preprocessor, in their stupid preprocessor-specific languages. I'd end up missing bits and pieces and the entire thing would be bad.

That said, feel free to port it. It's possible, just not pretty. I highly suggest you invest that time learning PostCSS (which can be used alongside your favorite preprocessor).

## postcss-calc

ant produces some pretty insane `calc` formulas sometimes. They work great, but something like `calc((100% - 300px - ((1 + 1 - 1) * 30px)) / 1)` can look pretty ugly. For instance, `(1 + 1 - 1)` equals `1`, so why doesn't ant just say `1` and trim down some of that `calc` madness?

Well, it'd require quite a lot of conditionals that would obfuscate the already complicated math behind ant.

Luckily `postcss-calc` was designed for this exact purpose. It will look over these formulas and simplify them a bit. The above formula simplifies to `calc((100% - 300px - 30px) / 1)`. It's not perfect, but does a good enough job.

So, process ant first, get some gnarly `calc` formulas, **then** run over it with `postcss-calc` to simplify them a bit.

**Disclaimer:** It's possible `postcss-calc` could simplify something a bit too much. It has options for precision control. If you notice ant isn't working as expected, try disabling `postcss-calc` first. If that fixes it, try tweaking some of `postcss-calc`'s options. If it continues messing up, just disable it, and open an issue at the `postcss-calc` repo.

Again, gnarly `calc` works. `postcss-calc` is just for neat freaks like myself.

We're not using `postcss-calc` on this site or examples because I want the docs to match ant's output perfectly to avoid confusion.

## Why 99.99% and 99.999999%?

Browser vendors are stupid and can't agree on how to render a sub-pixel. Those %'s are as close as I could get to making all the browsers (including IE8) play nice with sub-pixel rounding issues. They might look ugly, but they work damn well, so before I accept a `100%`-only PR, I would really like to discuss what rounding issues will be affected per browser. Basically, convince me another value would work well for more visitors and I'll happily change it.

## Browser Support

IE8.

ant wasn't explicitly designed to address the increasingly-less-important problem of browser support, but it's ultimately just a `calc` function so anywhere `calc` works, ant works.

With a few polyfills (nicely wrapped up in [boy](https://github.com/corysimmons/boy)), the float grids above should work in IE8. Your mileage may vary, but in basic tests it appears fairly seamless.

Feel free to open issues about browser support as I'm somewhat personally interested in the topic from a "let's not intentionally fuck over poor people" standpoint.
