export function isMarkdownFile(file: { name: string }) {
  const name = file.name.toLowerCase()
  return name.endsWith('.md') || name.endsWith('.markdown')
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
