# Writing notes

A note is one Markdown file in `src/content/notes/`. The filename is the URL: `src/content/notes/the-second-kickoff.md` is served at `/notes/the-second-kickoff`. MDX (`.mdx`) works too, with the same fields.

## A note

```md
---
title: The second kickoff
date: 2025-11-03
updated: 2025-11-10
description: Why every project I have worked on gets a second kickoff in March.
tags: [meetings, process]
---

The first kickoff is for the people who sold the project...

## What changes by March

- the brief has been rewritten once
- someone new owns the budget
```

Start the body with prose. The title is printed by the page, so do not repeat it as a `#` heading; start sections at `##`.

## Fields

| Field         | Required | What it does                                                                                                     |
| ------------- | -------- | ---------------------------------------------------------------------------------------------------------------- |
| `title`       | yes      | The note's title: tables, the page, the feed.                                                                    |
| `date`        | yes      | `YYYY-MM-DD`. Sorts the notes and groups `/notes` by year. Dates are read as UTC, so they never shift a day.     |
| `updated`     |          | Prints `updated YYYY-MM-DD` in the meta line under the title.                                                    |
| `description` |          | The meta description and the feed summary. Without it, the first paragraph is used, cut at about 160 characters. |
| `tags`        |          | A list. The first tag fills the table's tag column; all of them appear in the note's path line.                  |
| `draft`       |          | `true` keeps the note out of every page, table and the feed. Default `false`.                                    |

Computed, so not fields: the word count and reading time (`4 min · 812 words`), the year groups and every URL.

## The source gutter

Every block keeps the Markdown that made it, printed small and grey in a gutter to the left of the text. You do not write anything extra: the markers are read from your file when the site is built.

| You write          | The gutter shows                             |
| ------------------ | -------------------------------------------- |
| `## Heading`       | `##` (and `###` … `######` for deeper ones)  |
| `> quote`          | `>`                                          |
| `- item`, `* item` | `-` (any bullet is shown as `-`)             |
| `3. item`          | `3.` (the real number, also in nested lists) |
| ` ``` `            | ` ``` ` beside the code block                |
| `---`              | `---`                                        |
| `[^1]`             | `[^1]` beside the footnote                   |

Plain paragraphs have no marker: a line with a marker is structure, a line without one is prose. On screens narrower than 48rem the gutter folds into a prefix on the block's first line.

Footnotes are listed at the end of the note, numbered in the order you first refer to them, whatever their label.[^labels] To hide every marker, set `monoline.gutter: false` in `src/config.ts` ([customization.md](customization.md#the-source-gutter)).

[^labels]: So `[^why]` is printed as `[^1]` if it is the first footnote you refer to. Labels are for you, numbers are for the reader.

## Links between notes

Link to another note with its path: `[the review rules](/notes/design-review-rules)`.

## Tags

Tags are free text. The first one fills the table's tag column; all of them appear in the note's path line.

## Pages

`src/pages/about.md` is a plain page in the note column, with the source gutter:

```md
---
layout: ../layouts/Page.astro
title: about
description: Who writes these notes, and what they are for.
---
```

Add another page the same way: `src/pages/colophon.md` is served at `/colophon`. Add `updated: 2026-10-08` to print a date under the title. Add the page to `nav.header` if it belongs in the header.

## Adding a field

Add it to the `notes` schema in `src/content.config.ts` and make it optional (`.optional()`) or give it a default (`.default(…)`), so existing notes keep building. Then print it where you need it: the note page is `src/pages/notes/[...slug].astro`, the table is `src/components/notes/NotesTable.astro`.
