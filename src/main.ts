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

      <article class="document" hidden>
        <header class="document-header">
          <div>
            <p class="eyebrow">Loaded file</p>
            <h2 data-file-name></h2>
          </div>
          <p data-file-meta></p>
        </header>
        <div class="markdown-body" data-output></div>
      </article>
    </section>
  </main>
`

const shell = document.querySelector<HTMLElement>('.shell')!
const statusLabel = document.querySelector<HTMLElement>('[data-status]')!
const message = document.querySelector<HTMLElement>('[data-message]')!
const output = document.querySelector<HTMLElement>('[data-output]')!
const documentView = document.querySelector<HTMLElement>('.document')!
const fileName = document.querySelector<HTMLElement>('[data-file-name]')!
const fileMeta = document.querySelector<HTMLElement>('[data-file-meta]')!

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

async function renderFile(file: File) {
  if (!isMarkdownFile(file)) {
    documentView.hidden = true
    output.innerHTML = ''
    setState('error', 'That file is not Markdown. Please use a .md or .markdown file.')
    return
  }

  try {
    const markdown = await file.text()
    const html = await marked.parse(markdown)

    output.innerHTML = DOMPurify.sanitize(html)
    fileName.textContent = file.name
    fileMeta.textContent = `${formatBytes(file.size)} · Last modified ${new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(file.lastModified)}`
    documentView.hidden = false
    setState('loaded', '.md or .markdown')
  } catch {
    documentView.hidden = true
    output.innerHTML = ''
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
