import DOMPurify from 'dompurify'
import hljs from 'highlight.js/lib/common'
import MarkdownIt from 'markdown-it'
import { configureRenderedLinks, isMarkdownFile, looksLikeMarkdown } from './lib/markdown'
import './style.css'

type ViewState = 'empty' | 'dragging' | 'loaded' | 'error'
type DocumentSnapshot = {
  fileName: string
  fileMeta: string
  markdown: string
}

const sourceCodeUrl = 'https://github.com/victorcastro/markdown-preview'
const appVersion = __APP_VERSION__

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

const markdownParser = new MarkdownIt({
  html: true,
  breaks: false,
  highlight(code, language): string {
    const normalizedLanguage = language.trim().toLowerCase()

    if (normalizedLanguage && hljs.getLanguage(normalizedLanguage)) {
      const highlightedCode = hljs.highlight(code, { language: normalizedLanguage, ignoreIllegals: true }).value
      return `<pre data-language="${normalizedLanguage}"><code class="hljs language-${normalizedLanguage}">${highlightedCode}</code></pre>`
    }

    const escapedCode = escapeHtml(code)
    return `<pre><code class="hljs">${escapedCode}</code></pre>`
  },
})

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <main class="shell" data-state="empty" data-has-document="false">
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
          <div class="document-header-actions">
            <p data-file-meta></p>
            <button class="clear-document" type="button" aria-label="Clear current markdown" data-clear-document>
              Clear
            </button>
          </div>
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
const clearDocumentButton = document.querySelector<HTMLButtonElement>('[data-clear-document]')!

let dragDepth = 0
const documentHistory: Array<DocumentSnapshot | null> = [null]
let historyIndex = 0

function syncDocumentPresence() {
  shell.dataset.hasDocument = String(!documentView.hidden)
}

function setState(state: ViewState, nextMessage?: string) {
  shell.dataset.state = state
  delete statusLabel.dataset.tone
  delete message.dataset.tone
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

function setTransientErrorMessage(nextMessage: string) {
  statusLabel.textContent = 'Clipboard error'
  statusLabel.dataset.tone = 'error'
  message.textContent = nextMessage
  message.dataset.tone = 'error'
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

function updateBackToTopVisibility() {
  const shouldShow = !documentView.hidden && window.scrollY > 320
  backToTopButton.classList.toggle('is-visible', shouldShow)
}

function canCaptureUndoShortcut(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return true

  return !target.closest('input, textarea, select, [contenteditable="true"]')
}

function createCopyButton(codeBlock: HTMLElement) {
  const copyIconMarkup = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M9 9.75A2.25 2.25 0 0 1 11.25 7.5h6A2.25 2.25 0 0 1 19.5 9.75v8.25a2.25 2.25 0 0 1-2.25 2.25h-6A2.25 2.25 0 0 1 9 18Zm2.25-.75a.75.75 0 0 0-.75.75v8.25c0 .414.336.75.75.75h6a.75.75 0 0 0 .75-.75V9.75a.75.75 0 0 0-.75-.75Zm-4.5 6a.75.75 0 0 1-1.5 0V6A2.25 2.25 0 0 1 7.5 3.75h6.75a.75.75 0 0 1 0 1.5H7.5a.75.75 0 0 0-.75.75Z"
      />
    </svg>
  `
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'code-copy-button'
  button.innerHTML = copyIconMarkup
  button.setAttribute('aria-label', 'Copy code to clipboard')

  let resetLabelTimer: number | undefined

  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(codeBlock.textContent ?? '')
      button.textContent = 'Copied'
      button.dataset.copied = 'true'

      if (resetLabelTimer) {
        window.clearTimeout(resetLabelTimer)
      }

      resetLabelTimer = window.setTimeout(() => {
        button.innerHTML = copyIconMarkup
        delete button.dataset.copied
      }, 1800)
    } catch {
      button.textContent = 'Failed'
      button.dataset.copied = 'false'

      if (resetLabelTimer) {
        window.clearTimeout(resetLabelTimer)
      }

      resetLabelTimer = window.setTimeout(() => {
        button.innerHTML = copyIconMarkup
        delete button.dataset.copied
      }, 1800)
    }
  })

  return button
}

function createCodeBlockHeader(language?: string) {
  const header = document.createElement('div')
  header.className = 'code-block-header'

  const languageLabel = document.createElement('span')
  languageLabel.className = 'code-block-language'
  languageLabel.textContent = language ? language.toUpperCase() : 'CODE'
  header.append(languageLabel)

  return header
}

function decorateCodeBlocks(container: HTMLElement) {
  container.querySelectorAll<HTMLElement>('pre > code').forEach((codeBlock) => {
    const pre = codeBlock.parentElement
    if (!(pre instanceof HTMLPreElement)) return

    const languageClass = Array.from(codeBlock.classList).find((className) => className.startsWith('language-'))
    if (languageClass) {
      const language = languageClass.replace('language-', '')
      if (language) {
        pre.dataset.language = language
      }
    }

    if (pre.parentElement?.classList.contains('code-block')) {
      return
    }

    const codeBlockContainer = document.createElement('div')
    codeBlockContainer.className = 'code-block'

    const header = createCodeBlockHeader(pre.dataset.language)
    header.append(createCopyButton(codeBlock))

    pre.replaceWith(codeBlockContainer)
    codeBlockContainer.append(header, pre)
  })
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
    const snapshot: DocumentSnapshot = {
      fileName: file.name,
      fileMeta: `${formatBytes(file.size)} · Last modified ${new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(file.lastModified)}`,
      markdown,
    }

    applyDocumentSnapshot(snapshot, {
      recordHistory: true,
      stateMessage: '.md or .markdown',
    })
  } catch {
    documentView.hidden = true
    output.innerHTML = ''
    updateBackToTopVisibility()
    setState('error', 'The file could not be read. Try another Markdown file.')
  }
}

function renderMarkdown(markdown: string) {
  const html = markdownParser.render(markdown)

  output.innerHTML = DOMPurify.sanitize(html)
  assignHeadingIds(output)
  decorateCodeBlocks(output)
  configureRenderedLinks(output)
  documentView.hidden = false
  updateBackToTopVisibility()
  syncDocumentPresence()
}

function pushHistory(snapshot: DocumentSnapshot | null) {
  documentHistory.splice(historyIndex + 1)
  documentHistory.push(snapshot)
  historyIndex = documentHistory.length - 1
}

function applyDocumentSnapshot(
  snapshot: DocumentSnapshot | null,
  options: {
    recordHistory: boolean
    stateMessage: string
  }
) {
  if (options.recordHistory) {
    pushHistory(snapshot)
  }

  if (!snapshot) {
    documentView.hidden = true
    output.innerHTML = ''
    fileName.textContent = ''
    fileMeta.textContent = ''
    updateBackToTopVisibility()
    syncDocumentPresence()
    setState('empty', options.stateMessage)
    return
  }

  renderMarkdown(snapshot.markdown)
  fileName.textContent = snapshot.fileName
  fileMeta.textContent = snapshot.fileMeta
  setState('loaded', options.stateMessage)
}

function moveHistory(direction: 'undo' | 'redo') {
  if (direction === 'undo') {
    if (historyIndex === 0) return
    historyIndex -= 1
  } else {
    if (historyIndex >= documentHistory.length - 1) return
    historyIndex += 1
  }

  const snapshot = documentHistory[historyIndex]
  const stateMessage =
    direction === 'undo'
      ? snapshot
        ? 'History undo applied'
        : 'History reverted to empty state'
      : 'History redo applied'

  applyDocumentSnapshot(snapshot, {
    recordHistory: false,
    stateMessage,
  })
}

function clearCurrentDocument() {
  if (documentHistory[historyIndex] === null) return

  applyDocumentSnapshot(null, {
    recordHistory: true,
    stateMessage: 'Current markdown cleared',
  })
}

function buildClipboardSnapshot(markdown: string): DocumentSnapshot {
  return {
    fileName: 'Pasted from clipboard',
    fileMeta: `${formatBytes(new TextEncoder().encode(markdown).length)} · Pasted just now`,
    markdown,
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

window.addEventListener('paste', (event) => {
  const clipboardData = event.clipboardData
  if (!clipboardData) return

  const markdown = clipboardData.getData('text/markdown') || clipboardData.getData('text/plain')
  if (!looksLikeMarkdown(markdown)) {
    setTransientErrorMessage('Clipboard content does not look like Markdown.')
    return
  }

  event.preventDefault()
  applyDocumentSnapshot(buildClipboardSnapshot(markdown), {
    recordHistory: true,
    stateMessage: 'Markdown pasted from clipboard',
  })
})

window.addEventListener('keydown', (event) => {
  if (!canCaptureUndoShortcut(event.target)) return
  if (!event.metaKey) return

  if (event.key.toLowerCase() === 'z' && !event.shiftKey) {
    event.preventDefault()
    moveHistory('undo')
    return
  }

  if (event.key.toLowerCase() === 'z' && event.shiftKey) {
    event.preventDefault()
    moveHistory('redo')
  }
})

window.addEventListener('scroll', updateBackToTopVisibility, { passive: true })

backToTopButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

clearDocumentButton.addEventListener('click', () => {
  clearCurrentDocument()
})
