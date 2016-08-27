---
layout: default
title: negative-margin Grids
---

## {{ page.title }}

This type of grid is outstanding when you have no idea how many columns dynamic content (like pictures) will span, but if used on everything, you'll quickly become buried in confusing superfluous `div`s that might span several included files (e.g. opening a `<div>` in `header.php`, closing that same `<div>` in `footer.php`, all the `<div>`s in-between...).

Bootstrap and Foundation are negative-margin grids in the sense they have a wrapping element that applies a negative margin to "pull" the inner content out so its edges line up. They're also padding grids (i.e. every column has padding instead of margins between them). Padding grids produce an insane amount of markup if you need background color on your columns, so we're going to focus on a margin-based only approach and hope padding grids die.

If we put half a gutter on the left and right of a column, it will have half a gutter pushing in on the sides of a parent element.

Let's pass the `negative-margin` argument to `ant()` and you can see the left and right sides of the grid are pushed in a bit:

```html
<div class="grid">
  <div class="column">1</div>
  <div class="column">2</div>
  <div class="column">3</div>
</div>
```

```scss
.grid {
  @include clearfix;
}

.column {
  float: left;
  width: ant(1/3, negative-margin)[1];
  margin: 0 15px;
}
```

<div class="example-loops-3">
  <div class="grid">
    <div class="column">1</div>
    <div class="column">2</div>
    <div class="column">3</div>
  </div>
</div>

By applying a negative margin (hence the name) to each side of `.grid`, we can pull the child elements out a bit and make them flush with the rest of the content:

```scss
.grid {
  @include clearfix;
  margin: 0 -15px; // should match the column's side margins
}

.column {
  float: left;
  width: ant(1/3, negative-margin)[1];
  margin: 0 15px;
}
```

<div class="example-loops-4">
  <div class="grid">
    <div class="column">1</div>
    <div class="column">2</div>
    <div class="column">3</div>
  </div>
</div>

You'll notice the `.grid` element is now overhanging everything. If this creates a problem, contain it with *another* element and apply `overflow: hidden` to that element.

So negative-margin grid markup typically looks like this:

```html
<div class="container">
  <div class="row"> <!-- .grid in the previous examples because .row makes me feel like it can only hold 1 row of content -->
    <div class="column">1</div>
    <div class="column">2</div>
    <div class="column">3</div>
  </div>
</div>
```

As you nest, you will need to put a row immediately inside of a column like so (in order to pull the columns back out flush again):

```html
<div class="container">
  <div class="row">
    <div class="column">1a</div>

    <div class="column">
      <div class="row">
        <div class="column">1b</div>
        <div class="column">2b</div>
      </div>
    </div>

    <div class="column">2a</div>
  </div>
</div>
```

You've probably seen this type of markup before. It's unbeatable for when you just want to toss dynamic elements of varying size into an area, but can get pretty bloated quick.

#### Example: <span>Basic Irregular Grid without Counting</span>

Let's create a really simple irregular grid. Maybe this could be a photo gallery. Let's start by making all the images `1/4`, then let's sprinkle a couple `1/2` elements in there.

```html
<div class="photos">
  <figure>1</figure>
  <figure>2</figure>
  <figure>3</figure>
  <figure>4</figure>
  <figure>5</figure>
  <figure>6</figure>
  <figure>7</figure>
  <figure>8</figure>
  <figure>9</figure>
  <figure>10</figure>
  <figure>11</figure>
  <figure>12</figure>
  <figure>13</figure>
</div>
```

```scss
$gutter: 2px;

.photos {
  @include clearfix;
  margin: 0 -$gutter;
}

figure {
  float: left;
  margin: 0 1px; // half of $gutter (1px on each side = 2px between elements = 2px gutter)
  width: ant(1/4, $gutter, negative-margin)[1]; // set all the elements to 1/4

  &:nth-child(6),
  &:nth-child(8) {
    width: ant(1/2, $gutter, negative-margin)[1]; // cherry pick a couple as 1/2
  }
}
```

<div class="example-neg-1">
  <div class="photos">
    <figure>1</figure>
    <figure>2</figure>
    <figure>3</figure>
    <figure>4</figure>
    <figure>5</figure>
    <figure>6</figure>
    <figure>7</figure>
    <figure>8</figure>
    <figure>9</figure>
    <figure>10</figure>
    <figure>11</figure>
    <figure>12</figure>
    <figure>13</figure>
  </div>
</div>

Big deal. Grid systems have been doing this kind of stuff forever. Fair enough. Let's complicate things a bit.

#### Example: <span>Mosaic Layout with Fillers</span>

*Author's Note:* Skip to the next example if you're not into tinkering around with cool stuff and just want the best solution for this kind of layout.

```scss
figure {
  float: left;
  margin: 0 1px;

  $sizes: 1/7 1/5 1/3;

  @for $i in 1 through 3 {
    &:nth-child(3n + $i) {
      width: ant($sizes, $gutter, negative-margin)[$i];
    }
  }
}
```

<div class="example-neg-2">
  <div class="photos">
    <figure>1</figure>
    <figure>2</figure>
    <figure>3</figure>
    <figure>4</figure>
    <figure>5</figure>
    <figure>6</figure>
    <figure>7</figure>
    <figure>8</figure>
    <figure>9</figure>
    <figure>10</figure>
    <figure>11</figure>
    <figure>12</figure>
    <figure>13</figure>
  </div>
</div>

Okay, now it looks a bit cooler, but elements aren't aligning flush with the right side because the rows don't add up to `100%`.

Well... lets pick some elements out to fill in the gaps. Let's start with `figure` "4".

What we're doing is saying "Here are all the sizes on the board [1-3]. Now auto fill the remainder [4]."

```scss
figure {
  float: left;
  margin: 0 1px;

  $sizes: 1/7 1/5 1/3;

  @for $i in 1 through 3 {
    &:nth-child(3n + $i) {
      width: ant($sizes, $gutter, negative-margin)[$i];
    }
  }

  &:nth-child(4) {
    width: ant($sizes auto, $gutter, negative-margin)[4];
  }
}
```

<div class="example-neg-3">
  <div class="photos">
    <figure>1</figure>
    <figure>2</figure>
    <figure>3</figure>
    <figure>4</figure>
    <figure>5</figure>
    <figure>6</figure>
    <figure>7</figure>
    <figure>8</figure>
    <figure>9</figure>
    <figure>10</figure>
    <figure>11</figure>
    <figure>12</figure>
    <figure>13</figure>
  </div>
</div>

It looks like magic since `$sizes auto` happens to work in this scenario, but let's pull the sizes out of the variable so we can really see what's going on for this next one.

Now let's get "6" to fill the void. We have elements 5, 6, 7, 8, on that row. So those 4 elements need to add up to 100%.

- If we inspect `figure` 5 we can see it is getting the 1/5. So let's make that the first size in our list.
- 6 *should* be 1/3, so let's add that to our list.
- 7 is 1/7. Add it to the list.
- And 8 comes back around to 1/5. Add it.

We should now have `ant(1/5 1/3 1/7 1/5)`.

If we add all those together we get `1/5 + 1/3 + 1/7 + 1/5` which is like... some sort of fraction thingy that's close-ish to `1/1` (what we're looking for).

But the point is, we still need that last little bit of space. If we toss an `auto` on the end, it'll get that last bit of space, **but** it won't combine it with the `1/3` our 6th element already has.

What we need to do, is replace the `1/3` with `auto` and fetch that. Our function should look like this `ant(1/5 auto 1/7 1/5, $gutter, negative-margin)[2]`.

```scss
figure {
  float: left;
  margin: 0 1px;

  @for $i in 1 through 3 {
    &:nth-child(3n + $i) {
      width: ant(1/7 1/5 1/3, $gutter, negative-margin)[$i];
    }
  }

  &:nth-child(4) {
    width: ant(1/7 1/5 1/3 auto, $gutter, negative-margin)[4];
  }

  &:nth-child(6) {
    width: ant(1/5 auto 1/7 1/5, $gutter, negative-margin)[2];
  }
}
```

<div class="example-neg-4">
  <div class="photos">
    <figure>1</figure>
    <figure>2</figure>
    <figure>3</figure>
    <figure>4</figure>
    <figure>5</figure>
    <figure>6</figure>
    <figure>7</figure>
    <figure>8</figure>
    <figure>9</figure>
    <figure>10</figure>
    <figure>11</figure>
    <figure>12</figure>
    <figure>13</figure>
  </div>
</div>

Let's get the 10th `figure` next. Same thing. Figure out what elements are on its row. Add them to a sizes list. Replace the 10's size with the keyword `auto` and fetch that index:

```scss
figure {
  float: left;
  margin: 0 1px;

  @for $i in 1 through 3 {
    &:nth-child(3n + $i) {
      width: ant(1/7 1/5 1/3, $gutter, negative-margin)[$i];
    }
  }

  &:nth-child(4) {
    width: ant(1/7 1/5 1/3 auto, $gutter, negative-margin)[4];
  }

  &:nth-child(6) {
    width: ant(1/5 auto 1/7 1/5, $gutter, negative-margin)[2];
  }
}
```

<div class="example-neg-5">
  <div class="photos">
    <figure>1</figure>
    <figure>2</figure>
    <figure>3</figure>
    <figure>4</figure>
    <figure>5</figure>
    <figure>6</figure>
    <figure>7</figure>
    <figure>8</figure>
    <figure>9</figure>
    <figure>10</figure>
    <figure>11</figure>
    <figure>12</figure>
    <figure>13</figure>
  </div>
</div>

You can get that last row on your own as homework.

#### Example: <span>Flexbox</span>

The very astute will have noticed something long ago. We could have been using flexbox instead of manually figuring out these `auto` sizes. Indeed, and it's particularly good at these kinds of dynamic "filler" widths. I just wanted to demonstrate that technique (aside from being neat, who knows when it might come in handy?).

```scss
.photos {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -$gutter;
}

figure {
  margin: 0 1px;

  @for $i in 1 through 3 {
    &:nth-child(3n + $i) {
      width: ant(1/7 1/5 1/3, $gutter, negative-margin)[$i];
    }
  }

  &:nth-child(4),
  &:nth-child(6),
  &:nth-child(10),
  &:nth-child(12) {
    flex-grow: 1;
  }
}
```

<div class="example-neg-6">
  <div class="photos">
    <figure>1</figure>
    <figure>2</figure>
    <figure>3</figure>
    <figure>4</figure>
    <figure>5</figure>
    <figure>6</figure>
    <figure>7</figure>
    <figure>8</figure>
    <figure>9</figure>
    <figure>10</figure>
    <figure>11</figure>
    <figure>12</figure>
    <figure>13</figure>
  </div>
</div>

Notice how well flexbox (fillers and style elimination) and ant (sizes and gutter math) play together at the right times.

The flexibility of negative-margin grids might tempt you to just use them for everything, but I promise you littering `containers` and `rows` throughout a larger codebase is going to cause a lot more headaches than having to remember 2 types of grids and their uses.

Mix and match between nth and negative-margin grids throughout every project. Use the right tool for the job for ease-of-use and the minimal amount of bloat.
