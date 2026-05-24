# markdown-preview

Minimal browser-based Markdown previewer built with Vite and vanilla TypeScript.

Drop a Markdown file anywhere on the page and `markdown-preview` renders it instantly. Drop another file to replace the current preview.

Live: [victorcastro.github.io/markdown-preview](https://victorcastro.github.io/markdown-preview)

## Overview

`markdown-preview` is a single-page static web app. It runs entirely in the browser, with no backend, server-side rendering, routing, or runtime Node dependency.

The interface is intentionally minimal: a full-screen drop area, dark mode, developer-oriented typography, and a polished Markdown reading surface.

## Features

- Full-page drag and drop interaction.
- Supports `.md` and `.markdown` files.
- Replaces the rendered document immediately when a new file is dropped.
- Clear UI states for ready, dragging, loaded, and invalid file.
- Styled Markdown output for headings, lists, links, code blocks, blockquotes, images, and tables.
- Sanitized HTML output before rendering.
- Static production build in `dist`, ready for GitHub Pages.

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Tech Stack

- [Vite](https://vite.dev/) with vanilla TypeScript.
- [markdown-it](https://github.com/markdown-it/markdown-it) for Markdown parsing.
- [DOMPurify](https://github.com/cure53/DOMPurify) for HTML sanitization.
- GitHub Actions for CI, GitHub Pages deploy, and release tagging.
