---
title: Playground Codigo Extremo
author: Codex
tags:
  - markdown
  - code
  - syntax-highlighting
  - overflow
version: 1
---

# Playground Codigo Extremo

Archivo de prueba pensado para arrastrar en `markdown-preview` y comprobar:

- Bloques de codigo en distintos lenguajes.
- Lineas extremadamente largas, con y sin espacios.
- Comportamiento de overflow horizontal, wrapping y scroll.
- Legibilidad de bloques compactos y bloques muy densos.

## Tabla de contenidos manual

1. [TypeScript](#typescript)
2. [JavaScript](#javascript)
3. [Python](#python)
4. [Bash](#bash)
5. [JSON](#json)
6. [SQL](#sql)
7. [CSS](#css)
8. [HTML](#html)
9. [Linea sin espacios](#linea-sin-espacios)

---

## TypeScript

```ts
type AuditEvent = {
  id: string
  actor: string
  scope: 'ui' | 'api' | 'worker'
  createdAt: string
  metadata: Record<string, string>
}

const buildAuditSummary = (events: AuditEvent[]) =>
  events
    .map((event) => `${event.createdAt} :: ${event.scope.toUpperCase()} :: ${event.actor} :: ${event.id}`)
    .join('\n')

console.log(buildAuditSummary([{ id: 'evt_001', actor: 'victor', scope: 'ui', createdAt: '2026-05-24T10:12:00Z', metadata: { section: 'preview', action: 'render_markdown', branch: 'feature/improve-markdown-ui', note: 'testing very long but still human-readable inline structures inside code blocks' } }]))
```

## JavaScript

```js
const payload = { source: 'drop-event', fileName: 'playground-code-heavy.md', detectedLanguage: 'javascript', enabledFlags: ['render_tables', 'render_code_fences', 'open_external_links', 'preserve_anchor_navigation', 'stress_test_super_long_lines_in_a_single_statement_for_layout_validation'] }

const message = `Rendering ${payload.fileName} from ${payload.source} with ${payload.enabledFlags.length} flags enabled while we inspect whether the code block keeps horizontal scrolling usable and avoids destroying the surrounding layout on narrow screens.`

console.log(message)
```

## Python

```python
from dataclasses import dataclass

@dataclass
class PreviewMetrics:
    file_name: str
    heading_count: int
    code_block_count: int
    has_horizontal_scroll: bool

metrics = PreviewMetrics(file_name="playground-code-heavy.md", heading_count=9, code_block_count=9, has_horizontal_scroll=True)
print(f"Preview file={metrics.file_name} headings={metrics.heading_count} code_blocks={metrics.code_block_count} horizontal_scroll={metrics.has_horizontal_scroll} note='this line is intentionally extended with additional diagnostic wording to go well beyond two hundred characters and make wrapping problems obvious in the UI under stress conditions'")
```

## Bash

```bash
APP_ENV=preview ENABLE_VERBOSE_LOGGING=true ENABLE_RENDER_DIAGNOSTICS=true MARKDOWN_FILE=examples/playground-code-heavy.md node -e "console.log('simulate render pipeline with a very long command line intended to exceed two hundred characters and expose whether command snippets remain readable, scrollable and visually contained inside the markdown document card')"
```

## JSON

```json
{
  "name": "markdown-preview",
  "mode": "playground",
  "description": "Fixture designed to validate code block rendering across multiple languages including pathological line lengths that exceed two hundred characters so the UI can be evaluated for overflow, scroll and wrapping behavior.",
  "checks": ["typescript", "javascript", "python", "bash", "json", "sql", "css", "html", "long-unbroken-line"]
}
```

## SQL

```sql
SELECT preview_id, file_name, rendered_at, viewport_width, viewport_height, horizontal_scroll_enabled, wrapping_strategy, visual_regressions_detected, reviewer_notes FROM markdown_preview_render_audits WHERE file_name = 'playground-code-heavy.md' AND reviewer_notes LIKE '%line longer than 200 characters%' ORDER BY rendered_at DESC LIMIT 25;
```

## CSS

```css
.markdown-body pre[data-language="stress-test"] code{display:block;max-width:100%;overflow-x:auto;white-space:pre;padding:20px 22px;border-radius:20px;background:linear-gradient(180deg,rgba(12,17,25,.96),rgba(17,24,39,.92));box-shadow:0 18px 48px rgba(0,0,0,.34);border:1px solid rgba(244,240,232,.08);}
```

## HTML

```html
<section class="preview-diagnostics" data-file="playground-code-heavy.md" data-purpose="overflow-check" data-note="This single HTML line is intentionally verbose so the rendered markdown UI can be inspected under a long inline attribute payload that comfortably exceeds two hundred characters without introducing line breaks."><p>Preview diagnostics block</p></section>
```

## Linea sin espacios

```txt
markdownpreview_stresscase_without_any_spaces_or_breakpoints_0123456789_abcdefghijklmnopqrstuvwxyz_ABCDEFGHIJKLMNOPQRSTUVWXYZ_repeat_repeat_repeat_repeat_repeat_repeat_repeat_repeat_repeat_repeat_repeat_repeat_repeat_repeat_repeat_repeat_repeat_repeat
```

## Notas de validacion

- Revisa si aparece scroll horizontal solo dentro del bloque.
- Comprueba si el contenedor padre mantiene su ancho y no rompe la card.
- Verifica que las lineas largas con espacios y sin espacios se comporten distinto.
