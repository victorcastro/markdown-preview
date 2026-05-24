title: Playground Markdown Complejo
author: Codex
tags:
  - markdown
  - gfm
  - html
  - edge-cases
version: 1
---

# Playground Markdown Complejo

Archivo de prueba pensado para arrastrar en `markdown-live` y comprobar:

- Tipografias y jerarquia visual.
- Listas simples, mixtas y anidadas.
- Bloques de codigo, tablas, citas e imagenes.
- HTML embebido, escapes, enlaces y casos borde.

## Tabla de contenidos manual

1. [Parrafos y enfasis](#parrafos-y-enfasis)
2. [Listas](#listas)
3. [Citas](#citas)
4. [Codigo](#codigo)
5. [Tablas](#tablas)
6. [Enlaces e imagenes](#enlaces-e-imagenes)
7. [HTML embebido](#html-embebido)
8. [Casos limite](#casos-limite)

---

## Parrafos y enfasis

Texto normal con **negrita**, _cursiva_, **_combinado_**, ~~tachado~~, `inline code` y una mezcla como **texto con `codigo` dentro**.

Tambien hay escapes: \*esto no deberia ser cursiva\*, \#esto no deberia ser un heading\#, \[texto\](https://example.com).

Linea con salto duro al final.  
Esta linea deberia quedar debajo.

Linea separada por un parrafo.

<kbd>Ctrl</kbd> + <kbd>K</kbd> y HTML inline como <mark>resaltado</mark>, <sub>sub</sub> y <sup>sup</sup>.

### Caracteres especiales

- Ampersand: AT&T
- Comparadores: 2 < 3 y 5 > 4
- Entidades HTML: &copy; &trade; &hearts;
- Emoji en texto: :rocket: :warning: :sparkles:

## Listas

### Lista desordenada

- Item nivel 1
- Otro item
  - Item anidado
  - Otro anidado con `code`
    - Tercer nivel
- Item final

### Lista ordenada

1. Primer paso
2. Segundo paso
3. Tercer paso

### Lista mixta

1. Paso principal
   - Nota A
   - Nota B
2. Paso siguiente
   1. Subpaso 2.1
   2. Subpaso 2.2
3. Cierre

### Task list

- [x] Renderizar headings
- [x] Renderizar tablas
- [ ] Verificar comportamiento de HTML sanitizado
- [ ] Revisar listas con nesting profundo

## Citas

> Cita simple.

> Cita multilinea.
> Segunda linea de la misma cita.
>
> - Lista dentro de cita
> - Segundo item
>
> `codigo inline` dentro de una cita.

> #### Heading dentro de cita
>
> > Cita anidada de segundo nivel.

## Codigo

Codigo inline: `const answer = 42`

```ts
type User = {
  id: string
  name: string
  roles: string[]
}

const users: User[] = [
  { id: 'u_1', name: 'Ada', roles: ['admin', 'editor'] },
  { id: 'u_2', name: 'Linus', roles: ['viewer'] },
]

console.log(users.map((user) => user.name).join(', '))
```

```bash
npm install
npm run dev
npm run build
```

```json
{
  "name": "markdown-live",
  "private": true,
  "features": ["drag-drop", "gfm", "sanitized-html"]
}
```

```diff
- const theme = 'light'
+ const theme = 'dark'
```

Bloque con tildes invertidas dentro:

```md
Para escribir un fence literal puedes usar:

\`\`\`ts
console.log('hola')
\`\`\`
```

## Tablas

| Columna | Tipo | Obligatorio | Notas |
|:--------|:----:|------------:|:------|
| `title` | text | si | Titulo principal |
| `items` | list | no | Puede ser una lista anidada |
| `meta` | map | no | Admite pares clave-valor |

| Plan | Precio | Estado |
|---|---:|---|
| Free | 0 | activo |
| Pro | 12.50 | beta |
| Enterprise | 199 | negociacion |

## Enlaces e imagenes

Enlace normal: [OpenAI](https://openai.com)

Enlace autolink: <https://github.com/markedjs/marked>

Enlace con titulo: [Proyecto](https://github.com/victorcastro/markdown-live "Repositorio markdown-live")

Referencia reutilizable: [documentacion][docs] y [buscador][search].

[docs]: https://marked.js.org/
[search]: https://www.google.com/

Imagen remota:

![Markdown Logo](https://markdown-here.com/img/icon256.png)

Imagen con referencia:

![Logo de ejemplo][img-ref]

[img-ref]: https://dummyimage.com/640x220/111827/e8e2d8.png&text=markdown-live+preview

## HTML embebido

<details open>
  <summary>Bloque desplegable HTML</summary>
  <p>Este contenido prueba como conviven HTML y Markdown.</p>
  <ul>
    <li>Elemento A</li>
    <li>Elemento B</li>
  </ul>
</details>

<div align="center">
  <strong>HTML block</strong><br />
  <em>centrado y con salto de linea</em>
</div>

Formulario simple:

<form>
  <label>
    Nombre
    <input type="text" value="demo" />
  </label>
</form>

Intento de contenido potencialmente sensible al sanitizador:

<script>
  console.log('esto no deberia ejecutarse')
</script>

<img src="x" onerror="alert('xss')" alt="malicious test" />

## Casos limite

### Heading pegado
####### Esto no es un heading valido en CommonMark

### Regla horizontal seguida de lista

---
- item inmediatamente despues de hr
- segundo item

### Texto muy largo

Este es un parrafo muy largo pensado para comprobar overflow, wrapping, legibilidad y separacion vertical dentro del contenedor principal de la app, especialmente en pantallas estrechas donde el ancho maximo, las tablas, las imagenes y los bloques de codigo pueden competir por el espacio disponible y generar decisiones de layout menos evidentes.

### Pseudo definiciones

Termino
: Esto parece una lista de definicion, pero no todos los parsers la soportan.

### HTML comentado

<!-- Este comentario no deberia verse -->

### Bloque indentado

    const indented = true
    console.log('codigo indentado')

### Lista con parrafos

1. Primer item con parrafo introductorio.

   Este segundo parrafo sigue perteneciendo al primer item.

2. Segundo item con bloque:

   ```txt
   multilinea
   dentro de lista
   ```

## Cierre

Si algo se ve raro, las zonas mas probables son:

- tablas anchas
- listas mezcladas
- HTML sanitizado
- bloques dentro de listas
- imagenes remotas segun CORS o disponibilidad externa
