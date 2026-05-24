import DOMPurify from 'dompurify'
import { marked } from 'marked'
import './style.css'

type ViewState = 'empty' | 'dragging' | 'loaded' | 'error'

const sourceCodeUrl = 'https://github.com/victorcastro/markdown-live'
const appVersion = __APP_VERSION__

marked.use({
  gfm: true,
  breaks: false,
})

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <main class="shell" data-state="empty">
    <a class="source-link" href="${sourceCodeUrl}" target="_blank" rel="noreferrer">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.4-4-1.4-.5-1.3-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 .1.9 2.8 3.4 2 .1-.7.4-1.2.7-1.5-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z"/>
      </svg>
      <span class="source-version">v${appVersion}</span>
      <span class="source-label">Source Code</span>
    </a>

    <section class="drop-surface" aria-live="polite">
      <div class="drop-hint">
        <p class="eyebrow" data-status>Ready</p>
        <h1>Drag and drop</h1>
        <p class="lede" data-message>.md or .markdown</p>
      </div>

      <section class="document-preview" hidden>
        <header class="document-header">
          <div>
            <p class="eyebrow">Loaded file</p>
            <h2 data-file-name></h2>
          </div>
          <p data-file-meta></p>
        </header>
        <article class="document">
          <div class="markdown-body" data-output></div>
        </article>
      </section>

      <button class="back-to-top" type="button" aria-label="Back to top" data-back-to-top>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 5.5 5.75 11.75l1.5 1.5 3.7-3.7V18.5h2.1V9.55l3.7 3.7 1.5-1.5Z"
          />
        </svg>
        Top
      </button>
    </section>
  </main>
`

const shell = document.querySelector<HTMLElement>('.shell')!
const statusLabel = document.querySelector<HTMLElement>('[data-status]')!
const message = document.querySelector<HTMLElement>('[data-message]')!
const output = document.querySelector<HTMLElement>('[data-output]')!
const documentView = document.querySelector<HTMLElement>('.document-preview')!
const fileName = document.querySelector<HTMLElement>('[data-file-name]')!
const fileMeta = document.querySelector<HTMLElement>('[data-file-meta]')!
const backToTopButton = document.querySelector<HTMLButtonElement>('[data-back-to-top]')!

let dragDepth = 0

function setState(state: ViewState, nextMessage?: string) {
  shell.dataset.state = state
  statusLabel.textContent = {
    empty: 'Ready',
    dragging: 'Drop',
    loaded: 'Ready',
    error: 'Unsupported file',
  }[state]

  if (nextMessage) {
    message.textContent = nextMessage
  }
}

function isMarkdownFile(file: File) {
  const name = file.name.toLowerCase()
  return name.endsWith('.md') || name.endsWith('.markdown')
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function slugifyHeading(text: string) {
  return text
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function assignHeadingIds(container: HTMLElement) {
  const seen = new Map<string, number>()

  container.querySelectorAll<HTMLHeadingElement>('h1, h2, h3, h4, h5, h6').forEach((heading) => {
    const baseSlug = slugifyHeading(heading.textContent ?? '') || 'section'
    const seenCount = seen.get(baseSlug) ?? 0
    const slug = seenCount === 0 ? baseSlug : `${baseSlug}-${seenCount + 1}`

    seen.set(baseSlug, seenCount + 1)
    heading.id = slug
  })
}

function configureRenderedLinks(container: HTMLElement) {
  container.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((link) => {
    if (link.getAttribute('href')?.startsWith('#')) {
      link.removeAttribute('target')
      link.removeAttribute('rel')
      return
    }

    link.target = '_blank'
    link.rel = 'noreferrer noopener'
  })
}

function updateBackToTopVisibility() {
  const shouldShow = !documentView.hidden && window.scrollY > 320
  backToTopButton.classList.toggle('is-visible', shouldShow)
}

async function renderFile(file: File) {
  if (!isMarkdownFile(file)) {
    documentView.hidden = true
    output.innerHTML = ''
    updateBackToTopVisibility()
    setState('error', 'That file is not Markdown. Please use a .md or .markdown file.')
    return
  }

  try {
    const markdown = await file.text()
    const html = await marked.parse(markdown)

    output.innerHTML = DOMPurify.sanitize(html)
    assignHeadingIds(output)
    configureRenderedLinks(output)
    fileName.textContent = file.name
    fileMeta.textContent = `${formatBytes(file.size)} · Last modified ${new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(file.lastModified)}`
    documentView.hidden = false
    updateBackToTopVisibility()
    setState('loaded', '.md or .markdown')
  } catch {
    documentView.hidden = true
    output.innerHTML = ''
    updateBackToTopVisibility()
    setState('error', 'The file could not be read. Try another Markdown file.')
  }
}

function extractFile(event: DragEvent) {
  return event.dataTransfer?.files.item(0) ?? null
}

window.addEventListener('dragenter', (event) => {
  event.preventDefault()
  dragDepth += 1
  setState('dragging', 'Release to preview')
})

window.addEventListener('dragover', (event) => {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'copy'
  }
})

window.addEventListener('dragleave', (event) => {
  event.preventDefault()
  dragDepth = Math.max(0, dragDepth - 1)

  if (dragDepth === 0) {
    setState(documentView.hidden ? 'empty' : 'loaded')
  }
})

window.addEventListener('drop', (event) => {
  event.preventDefault()
  dragDepth = 0

  const file = extractFile(event)
  if (!file) {
    setState(documentView.hidden ? 'empty' : 'loaded', 'No file was detected in that drop.')
    return
  }

  void renderFile(file)
})

window.addEventListener('scroll', updateBackToTopVisibility, { passive: true })

backToTopButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
