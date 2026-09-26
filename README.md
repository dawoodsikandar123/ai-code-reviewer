# AI Code Reviewer

> A hackathon project — AI-powered code analysis tool using Google Gemini.

---

## Problem & Solution

**Problem:** Developers waste time manually reviewing code for bugs, security issues, performance problems, and style violations — especially under deadline pressure.

**Solution:** Paste or upload code, select the language, and receive instant structured feedback powered by the Gemini API, including a scored health report, per-issue explanations, complexity analysis, and a persistent review history.

---

## Implemented Features

- **AI Code Review** — Sends code to Gemini and returns structured JSON feedback (bugs, security, performance, quality issues)
- **Code Health Score** — Computed from issue counts with a weighted penalty formula; displayed as an animated SVG ring (0–100)
- **Issue Severity Filters** — Filter results by: All, Bug, Security, Performance, Quality
- **Complexity Analysis** — Displays time complexity, space complexity, and an optimization suggestion returned by the AI
- **AI Summary** — A 1–2 sentence plain-English summary of overall code quality
- **Copy Report** — Copies a plain-text formatted review report to clipboard
- **File Upload** — Upload one or multiple source files; single-file upload auto-fills the textarea and auto-detects language from file extension
- **Language Auto-detection** — Maps file extensions to language selection automatically
- **Client-side Validation** — Checks for empty input, unsupported languages, non-code text, and language mismatches before sending to the server
- **Server-side Validation** — Same heuristic checks enforced on the backend (guards against bypassed client validation)
- **Review History** — All reviews are persisted to SQLite; displayed in a paginated list (5 per page) with View More / Show Less
- **History Search** — Real-time client-side search/filter of history by language, score, date, or complexity
- **History Refresh** — Manual refresh button with a spinning animation
- **Load a Past Review** — Click any history item to reload its full results in the review panel
- **Dark / Light Theme** — Toggle button in the navbar; preference persisted in `localStorage`
- **Live Clock** — Real-time HH:MM:SS clock with date and timezone displayed in the navbar center
- **Toast Notifications** — Bottom-right slide-in toasts for success, error, and info states (auto-dismiss after 3.5 s)
- **Loading Skeleton** — Shown during AI request; replaces the results panel with an animated shimmer placeholder
- **Retry on 503** — Server automatically retries Gemini requests up to 5 times with exponential back-off on HTTP 503

---

## Project Structure

```
ai-code-reviewer/
├── backend/
│   ├── server.js       # Express server, API routes, validation, Gemini integration
│   ├── db.js           # SQLite schema, prepared statements, saveReview / getHistory / getReviewById
│   └── reviews.db      # SQLite database file (git-ignored)
├── frontend/
│   ├── index.html      # Single-page HTML with all sections (hero, review card, results, history)
│   ├── script.js       # All client-side logic (review flow, history, clock, theme, toasts, copy)
│   └── style.css       # Dark/light theme styles, animations, responsive layout
├── .env                # Environment variables (git-ignored)
├── .gitignore
├── package.json
└── package-lock.json
```

---

## Setup & Run

### Prerequisites

- Node.js 22+ (uses the built-in `node:sqlite` module — no external SQLite dependency required)

### 1. Install dependencies

```bash
npm install
```

### 2. Create the environment file

Create a `.env` file in the project root with the following variable:

```
GEMINI_API_KEY=your_key_here
```

> Only the variable **name** is listed above. Do not commit your actual key.

### 3. Start the server

```bash
node backend/server.js
```

The app is served at **http://localhost:3000**

---

## How to Use

1. Open **http://localhost:3000** in a browser.
2. **Select a language** from the dropdown (JavaScript, TypeScript, Python, Java, C, C++).
3. **Paste code** into the textarea, or click **Upload Files** to load a source file. Single-file uploads auto-fill the textarea and detect the language.
4. Click **Review Code**. A loading skeleton appears while the AI processes the request.
5. Results appear with:
   - An animated **Code Health score ring**
   - Summary cards for **Total Issues / Security / Performance / Quality**
   - An **AI Summary** paragraph
   - A **Complexity card** (time, space, optimization suggestion)
   - Individual **issue cards** with severity, line number, message, and fix suggestion
6. Use the **filter buttons** (All / Bug / Security / Performance / Quality) to narrow issues.
7. Click **Copy Report** to copy a plain-text version of the results to clipboard.
8. Scroll down to **Review History** to see all past reviews. Click any row to reload it in the results panel.
9. Use the **search box** in history to filter by language, score, date, or complexity.
10. Toggle **Dark / Light** mode using the button in the top-right of the navbar.

---

## Environment Variables

| Name             | Required | Description                     |
|------------------|----------|---------------------------------|
| `GEMINI_API_KEY` | Yes      | Google Gemini API key           |

---

## Supported Languages

| Language   | File Extensions             |
|------------|-----------------------------|
| JavaScript | `.js`, `.jsx`               |
| TypeScript | `.ts`, `.tsx`               |
| Python     | `.py`                       |
| Java       | `.java`                     |
| C          | `.c`, `.h`                  |
| C++        | `.cpp`, `.cc`, `.cxx`, `.hpp` |
