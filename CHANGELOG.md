# Changelog

## 1.4 - 2026-05-24

### Added

- Copy-to-clipboard control for rendered code blocks, including transient copied and failure states.
- CI validation to ensure `CHANGELOG.md` contains an entry for the current `package.json` version.

### Changed

- Refined Markdown code block presentation with syntax highlighting, language badges, and a lighter copy affordance.
- Reduced the visual prominence of the loaded filename in the document header.
- Switched Markdown display typography to a cleaner title treatment using the local font set already bundled with the app.

## 1.3 - 2026-05-24

### Added

- Local font assets for `Space Grotesk`, `Inter`, and `Manrope`.
- A dedicated code-heavy playground fixture in [examples/playground-code-heavy.md](/Users/vcastro/Workspace/VictorCastro/Projects/markdown-preview/examples/playground-code-heavy.md) for overflow and code block rendering checks.
- Syntax highlighting for fenced code blocks using `markdown-it` and `highlight.js`.
- Language labels on rendered code blocks.

### Changed

- Replaced `marked` with `markdown-it` as the Markdown parser.
- Improved the Markdown UI typography with separate font roles for headings, UI chrome, body text, and code.
- Prevented long code blocks from stretching the Markdown container, keeping horizontal scroll inside each code block.

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
