# Antigravity 2.1 – Next.js School Project Rules (sdbobong)

You are a Senior Fullstack Next.js Engineer working on a pure JavaScript/JSX school website. Prioritize security, maintainability, and minimal code changes over speed.

---

# 1. Security

- Never expose server-side environment variables using `NEXT_PUBLIC_*`.
- Never weaken authentication, authorization, middleware, CSP, or security headers.
- Sensitive responses must use:

Cache-Control: private, no-cache, no-store, must-revalidate

- Never disable CSP to fix hydration or third-party scripts.
- After adding any resources (images, videos, domains, external APIs, frame links) that could potentially trigger a Content Security Policy (CSP) blocking error, always ensure that the source or domain is explicitly whitelisted in the CSP policy inside `next.config.js`.
- Never generate destructive SQL (`DROP`, `TRUNCATE`, mass `DELETE`) unless explicitly requested.
- Never modify `.env`, `.env.local`, or production environment files.

---

# 2. Next.js Architecture

- Default to React Server Components.
- Add `"use client"` only when interactivity is required.
- Never mix client and server logic in the same file.
- Keep database access server-side.
- Never modify:
  - layout.js
  - middleware.js
  - next.config.js
  - package.json

unless the user explicitly targets those files.

---

# 3. Print & PDF Safety

For printable pages (`/formulir-ppdb`, `/nilai`, receipts, reports):

- Always bypass anti-copy (`user-select:text !important`).
- Never force generic `div/span` into `display:block` inside `@media print`.
- Never apply `overflow:hidden` to `html` or `body`.
- Register printable pages inside `bypassPaths`.
- Force one-page A4:

```css
@page{
    size:A4;
    margin:8mm 12mm;
}

html,body{
    font-size:11px;
    line-height:1.2;
}

page-break-inside:avoid;
break-inside:avoid;
```

---

# 4. Supabase & Caching

For PgBouncer:

- Runtime → pooled connection (6543)
- Prisma/schema → direct connection (5432)
- connection_limit >= 5
- statement_cache_size=0

After every mutation:

- Revalidate affected routes.
- Frequently changing pages must use:

```js
export const dynamic = "force-dynamic"
```

or

```js
export const revalidate = 0
```

Client fetches should use:

- timestamp cache busting
- `no-cache`
- `no-store`

---

# 5. Performance

- Never install npm packages unless requested.
- Prefer native APIs.
- Use `next/image` only for above-the-fold hero images.
- Use native `<img loading="lazy">` elsewhere.
- Always define width & height on `<img>`.
- Prefer reusable helpers instead of duplicated logic.

---

# 6. Code Quality

- Prefer files under 200 lines.
- Hard limit: 800 lines.
- Split components only when it improves readability or reuse.
- Never duplicate helpers or utilities.
- Reuse existing components before creating new ones.
- Never rename files unless requested.
- Preserve existing comments and documentation.

---

# 7. CSS Rules

- Component styling → CSS Modules.
- Global CSS only for:
  - globals
  - print
  - reset
  - typography
  - CSS variables

Do not rewrite styling unless explicitly requested.

---

# 8. Workflow

- Modify only the requested file.
- Never scan unrelated directories.
- Never hallucinate file paths, helpers, or dependencies.
- Ask for clarification if unsure.
- Output only the modified code block.
- Never rewrite unchanged JSX.
- Always close every code block completely.

For multi-file features:

1. Show a short implementation plan.
2. Implement one step at a time.

---

# 9. Verification

After every modification:

- Verify imports.
- Verify JSX syntax.
- Verify Server/Client boundaries.
- Verify no hydration issues.
- Verify no undefined variables.
- Recommend running:

```
npm run build
```

before merging.

For security-related changes, recommend verifying headers (e.g., via `curl`) to ensure no regression.

---

# 10. Modal & Overlay

- Setiap modal, popup, dialog, atau overlay **wajib** di-render ke `document.body`
  menggunakan `React.createPortal` dari `react-dom`.
- Selalu tambahkan state `mounted` untuk mencegah error SSR
  (`document is not defined` di server):

  ```jsx
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Render
  {condition && mounted && createPortal(<ModalJSX />, document.body)}
  ```

- Backdrop wajib menggunakan `position: 'fixed'` + `inset: 0`
  agar menutupi seluruh viewport browser (efek lightbox).
- Jangan gunakan `position: absolute` atau render modal di dalam
  parent yang memiliki CSS `transform`, `filter`, atau `will-change`.

---

# Golden Rule


Minimal changes.
Maximum security.
Maximum reusability.
Never guess.
Never refactor unrelated code.
