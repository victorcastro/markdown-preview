# markdown-live

A minimal single-page Markdown previewer built with Vite and vanilla TypeScript.

Drop a `.md` or `.markdown` file anywhere on the page and the app renders it directly in the browser. Dropping another Markdown file replaces the current preview immediately.

## Features

- Full-page drag and drop area.
- Supports `.md` and `.markdown` files.
- Clear empty, dragging, loaded, and error states.
- Markdown rendering with headings, lists, links, code blocks, blockquotes, and tables.
- Client-side only: no backend, SSR, or runtime Node dependency.
- Static `dist` output ready for GitHub Pages.

## Tech Stack

- [Vite](https://vite.dev/) with vanilla TypeScript.
- [marked](https://marked.js.org/) for Markdown parsing.
- [DOMPurify](https://github.com/cure53/DOMPurify) for sanitized HTML output.

## Getting Started

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

Preview the production build locally:

```bash
npm run preview
```

## GitHub Pages

The project uses `base: './'` in `vite.config.ts`, so the generated files work when served from a GitHub Pages subpath.

To publish manually:

```bash
npm run build
```

Then deploy the contents of `dist`.

## Project Structure

```text
markdown-live/
├── public/
│   └── favicon.svg
├── src/
│   ├── main.ts
│   └── style.css
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```
