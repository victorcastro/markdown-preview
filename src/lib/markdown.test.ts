import { describe, expect, it } from 'vitest'
import { JSDOM } from 'jsdom'
import { configureRenderedLinks, isMarkdownFile } from './markdown'

describe('isMarkdownFile', () => {
  it('accepts .md files case-insensitively', () => {
    expect(isMarkdownFile({ name: 'README.MD' })).toBe(true)
  })

  it('accepts .markdown files', () => {
    expect(isMarkdownFile({ name: 'notes.markdown' })).toBe(true)
  })

  it('rejects non-markdown extensions', () => {
    expect(isMarkdownFile({ name: 'notes.txt' })).toBe(false)
    expect(isMarkdownFile({ name: 'notes.mdx' })).toBe(false)
  })
})

describe('configureRenderedLinks', () => {
  it('forces external links to open in a new tab', () => {
    const dom = new JSDOM('<div><a href="https://openai.com">OpenAI</a></div>')
    const container = dom.window.document.querySelector('div') as HTMLElement
    const link = container.querySelector('a') as HTMLAnchorElement

    configureRenderedLinks(container)

    expect(link.target).toBe('_blank')
    expect(link.rel).toBe('noreferrer noopener')
  })

  it('keeps in-document anchor links in the current tab', () => {
    const dom = new JSDOM('<div><a href="#parrafos" target="_blank" rel="noreferrer noopener">Anchor</a></div>')
    const container = dom.window.document.querySelector('div') as HTMLElement
    const link = container.querySelector('a') as HTMLAnchorElement

    configureRenderedLinks(container)

    expect(link.getAttribute('target')).toBeNull()
    expect(link.getAttribute('rel')).toBeNull()
  })

  it('does not touch anchors without href', () => {
    const dom = new JSDOM('<div><a>Plain text</a></div>')
    const container = dom.window.document.querySelector('div') as HTMLElement
    const link = container.querySelector('a') as HTMLAnchorElement

    configureRenderedLinks(container)

    expect(link.getAttribute('target')).toBeNull()
    expect(link.getAttribute('rel')).toBeNull()
  })
})
