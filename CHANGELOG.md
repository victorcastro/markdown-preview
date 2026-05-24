# Changelog

## Unreleased

## 1.2 - 2026-05-24

### Added

- Open Graph and Twitter card metadata for richer link previews when sharing the public site.
- `robots.txt` and `sitemap.xml` in `public/` for basic search engine discovery.
- A dedicated PNG social preview asset for public sharing cards.

### Changed

- Expanded the document metadata in `index.html` with canonical, robots, keywords, and theme-color tags.

## 1.1 - 2026-05-24

### Added

- Stable heading ids for rendered Markdown headings so in-document anchor links work reliably.
- A comprehensive Markdown playground fixture in [examples/playground-complex.md](/Users/vcastro/Workspace/VictorCastro/Projects/markdown-preview/examples/playground-complex.md) for parser and layout testing.

### Changed

- Increased the Markdown preview container maximum width from 1040px to 1280px.
- Moved the loaded-file header outside the rendered Markdown card to clearly separate app metadata from document content.
- Reduced the visual prominence of the loaded filename in the preview header.
- Open external links rendered from Markdown in a new tab while preserving in-document `#anchor` navigation in the current view.

## 1.0 - 2026-05-22

Initial release of `markdown-preview`.

### Added

- Full-page drag and drop support for Markdown files.
- Support for `.md` and `.markdown` files.
- Live client-side Markdown rendering in the browser.
- Replacement of the current preview when a new Markdown file is dropped.
- Clear empty, dragging, loaded, and invalid-file states.
- Dark mode visual design with developer-oriented typography.
- Styled Markdown output for headings, lists, links, code blocks, blockquotes, images, and tables.
- GitHub source link in the page header.
- Static Vite build output ready for GitHub Pages.
- GitHub Actions workflows for build checks, GitHub Pages deployment, and release tagging.
