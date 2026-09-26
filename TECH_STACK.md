# Tech Stack — AI Code Reviewer

---

## Runtime & Server

| Technology | Version (from package.json) | Purpose |
|------------|----------------------------|---------|
| **Node.js** | 22+ required | Runtime; also provides the built-in `node:sqlite` module used for the database |
| **Express** | `^5.2.1` | HTTP server, static file serving, JSON body parsing, REST routing |
| **dotenv** | `^18.0.3` | Loads `GEMINI_API_KEY` from the `.env` file into `process.env` at startup |

---

## Database

| Technology | Version | Purpose |
|------------|---------|---------|
| **SQLite** (via `node:sqlite`) | Built-in to Node.js 22 | Persistent storage for all reviews and their issues; no external binary or npm package required |

The `node:sqlite` module (`DatabaseSync`) is used with prepared statements and manual transaction control (`BEGIN` / `COMMIT` / `ROLLBACK`).

---

## AI / External API

| Technology | Purpose |
|------------|---------|
| **Google Gemini API** | AI code review — model `gemini-flash-lite-latest` via the `v1beta/models/…:generateContent` endpoint |

The server calls the Gemini REST API directly using the native `fetch` available in Node.js 22+. No SDK or additional package is used.

---

## Frontend

| Technology | Purpose |
|------------|---------|
| **HTML5** | Single-page structure (`frontend/index.html`) — semantic elements, no framework |
| **Vanilla CSS** | All styling (`frontend/style.css`) — dark/light themes, responsive layout, animations |
| **Vanilla JavaScript** | All client-side logic (`frontend/script.js`) — DOM manipulation, fetch calls, validation heuristics, score calculation, history, clock, toast, theme |

No frontend framework, bundler, or transpiler is used. The browser loads `.html`, `.css`, and `.js` directly.

---

## Browser APIs Used (frontend)

| API | Used for |
|-----|----------|
| `fetch` | `POST /review`, `GET /history`, `GET /history/:id` |
| `localStorage` | Persisting the selected dark/light theme across page loads |
| `navigator.clipboard.writeText` | Copy Report button |
| `requestAnimationFrame` | Score ring animation, number count-up animation |
| `MutationObserver` | Watching `resultBadge` text to trigger history reload after review completes |
| `setInterval` | Live clock update every 1 000 ms |
| `Intl.DateTimeFormat` | Resolving browser timezone for clock display |
| `Element.scrollIntoView` | Smooth scroll to results section after loading a history item |

---

## Project Configuration

| File | Purpose |
|------|---------|
| `package.json` | Project metadata, npm scripts placeholder, lists `express` and `dotenv` as dependencies; `"type": "commonjs"` |
| `package-lock.json` | Locked dependency tree |
| `.env` | Environment variable file (git-ignored); holds `GEMINI_API_KEY` |
| `.gitignore` | Excludes `node_modules/`, `.env`, `*.db`, `*.db-shm`, `*.db-wal` |

---

## What Is Intentionally Absent

- No TypeScript compilation step
- No frontend bundler (Webpack, Vite, etc.)
- No CSS framework (no Tailwind, Bootstrap, etc.)
- No ORM (raw SQL via `node:sqlite` prepared statements)
- No authentication or sessions
- No external SQLite npm package (uses Node.js built-in)
- No Gemini SDK (plain `fetch` to the REST endpoint)
