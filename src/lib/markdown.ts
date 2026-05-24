export function isMarkdownFile(file: { name: string }) {
  const name = file.name.toLowerCase()
  return name.endsWith('.md') || name.endsWith('.markdown')
}

export function looksLikeMarkdown(content: string) {
  const text = content.trim()
  if (!text) return false

  if (text.includes('\n')) {
    const markdownPatterns = [
      /^(#{1,6})\s/m,
      /^>\s/m,
      /^[-*+]\s/m,
      /^\d+\.\s/m,
      /```/,
      /\[.+\]\(.+\)/,
      /^---$/m,
      /^\|.+\|$/m,
    ]

    if (markdownPatterns.some((pattern) => pattern.test(text))) {
      return true
    }
  }

  return text.length >= 80
}

export function configureRenderedLinks(container: HTMLElement) {
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
