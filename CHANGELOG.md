# Changelog

All notable changes to this theme are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and versions follow
[Semantic Versioning](https://semver.org/).

## [1.1.1] - 2026-10-14

### Changed

- A wikilink without a label (`[[design-review-rules]]`) prints the linked note's title instead of its file name.

### Fixed

- The sample note's diagram no longer shows a shortened file name that differed from the text.

## [1.1.0] - 2026-10-14

### Added

- Links between notes in the forms editors write: `[[wikilinks]]` (with `|label` and `#heading`) and relative `./note.md` links, alongside `/notes/<slug>` paths. A link to a note that does not exist yet prints as plain text.
- Gutter markers for tables (`|`) and for a picture on a line of its own (`![]`); pictures get a width limit and a hairline border.
- Every word the theme prints is in `ui` in `src/config.ts`, so a site in another language translates one block.
- The 404 page lists the latest notes.

### Changed

- The home page's name in the header carries a `#`, the notebook's title line.
- The light/dark switch reads `theme: system` instead of a lone `system`.
- Chinese and Japanese are counted by character for the word count and reading time.

## [1.0.0] - 2026-10-14

First release. The demo is live at https://monoline-free.ondelva.com.

### Fixed

- A wide table in a note scrolls inside a wrapper (`.table-scroll`) instead of having its own display changed, so screen readers still announce it as a table.
- With analytics set to GA4, `gtag()` is now on `window`, so your own events can call it.

## [0.9.0] - 2026-10-13

First snapshot.
