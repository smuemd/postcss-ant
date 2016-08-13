---
layout: default
title: Grids by Looping
---

## {{ page.title }}

There are 2 types of popular grid systems:

1. markup-based grids like Bootstrap. They can accept elements of varying sizes, but produce extra markup (sometimes a lot).
1. nth-based grids like Jeet. They use `nth` selectors to have light markup, but can be hard to work with when using elements of varying sizes.

There is no perfect balance and **you should always pick the system you need for the job**. If you're making a gallery of pictures and want it to have a mosaic look, a markup-based grid is probably your best bet. In most cases you can get away with light markup nth-based grids.

*Preprocessor loops + nth-grids + ant* introduce something new to the grid game: light markup and irregular, though patterned, grids. Not perfect, but a new tool for the toolbox that can completely replace old nth-grids.

In nth-grids like Lost, Jeet, etc. you might specify a grid as such:

```scss
.column {
  lost-column: 1/4;
}
```

If this were going to span more than one row, each `.column` would need to be 1/4 the width of the container with spaces for a gutter between them.

These grid systems do too much. They assume you're bad at CSS and try to add it all for you. As a result, you end up with **a lot** of unmanageable bloat.

ant's different and this is why I call it a "size-getter" instead of a grid system. It simply returns a grid-friendly size to you. You do what you want with it.

#### Example: <span>A Single Row Grid</span>
