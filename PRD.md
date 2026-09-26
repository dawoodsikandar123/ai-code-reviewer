# Product Requirements Document — AI Code Reviewer

> Hackathon Project

---

## Problem

Manual code review is time-consuming and inconsistent. Developers reviewing their own code under deadline pressure miss bugs, security issues, and performance problems. There is no lightweight, zero-setup tool that provides immediate, structured, AI-generated feedback on code snippets.

---

## Goal

Provide a web-based tool that accepts code input, sends it to an AI model, and returns structured, actionable feedback with a quality score — all without requiring a local AI installation or IDE plugin.

---

## Target Users

- Individual developers wanting quick feedback before committing code
- Hackathon participants building and reviewing code rapidly
- Students learning to write better code with explanations

---

## Supported Languages

| Language   | Identifier used internally |
|------------|---------------------------|
| JavaScript | `javascript`              |
| TypeScript | `typescript`              |
| Python     | `python`                  |
| Java       | `java`                    |
| C          | `c`                       |
| C++        | `cpp`                     |

---

## Implemented Product Requirements

### PR-01 — Code Submission

- User pastes code into a textarea or uploads a source file.
- Language is selected via a dropdown (JavaScript, TypeScript, Python, Java, C, C++).
- When a single file is uploaded, its content is loaded into the textarea and the language dropdown is set automatically based on file extension.
- Uploading multiple files shows each filename as a badge; content is not merged.
- A live character count is displayed below the editor header.

### PR-02 — Input Validation (Client and Server)

Both the browser and the server independently enforce:

| Check | Description |
|-------|-------------|
| Empty input | Rejected if no code is present |
| Unsupported language | Rejected if language is not in the supported set |
| Non-code input | Rejected when the text does not contain recognisable code tokens and is short plain prose |
| Language mismatch | Rejected when the code clearly signals a different language than the selected one |

Validation errors are displayed as an inline message below the submit button. The same checks on the server return HTTP 400 with an error description.

### PR-03 — AI Review

- Code and language are sent to the Gemini API (`gemini-flash-lite-latest`) via a `POST /review` request.
- The AI returns a structured JSON response containing:
  - `summary` — 1–2 sentence overall quality description
  - `issues[]` — list of issues, each with: `line`, `severity`, `message`, `suggestion`
  - `time_complexity` — Big-O notation string
  - `space_complexity` — Big-O notation string
  - `optimization_suggestion` — brief text suggestion
- Allowed severity values: `bug`, `security`, `performance`, `quality`
- The server retries up to 5 times with exponential back-off (starting at 1 500 ms) on HTTP 503 responses from Gemini.

### PR-04 — Code Health Score

- Calculated on the server (and mirrored on the client) using a weighted penalty:
  - Bug: −15 per issue
  - Security: −20 per issue
  - Performance: −10 per issue
  - Quality: −5 per issue
- Score = `max(0, 100 − total penalty)`
- Score is stored with the review in the database.

### PR-05 — Results Display

- **Score ring** — animated SVG circle that fills proportionally to the score; color changes: green (≥ 80), yellow (≥ 50), red (< 50)
- **Summary cards** — four cards showing total issues, security count, performance count, quality count
- **AI Summary card** — plain-text paragraph from the AI, shown with a left accent border
- **Complexity card** — time complexity, space complexity, and optional optimization text
- **Issue cards** — each card shows severity (color-coded), line number, message, and fix suggestion
- **Issue filter bar** — buttons (All / Bug / Security / Performance / Quality) that filter the visible issue cards without re-fetching

### PR-06 — Copy Report

- A **Copy Report** button appears after a successful review.
- Clicking it builds a plain-text report (score, counts, complexity, summary, all issues) and copies it to the clipboard using the Clipboard API.
- A toast notification confirms success or failure.

### PR-07 — Review History

- Every completed review is saved to a local SQLite database (server-side).
- The history section loads on page start and refreshes automatically after each successful review.
- History items are displayed newest-first, 5 per page.
- Additional items are accessible via a **View More** / **Show Less** toggle with animated expand/collapse.
- A real-time search field filters the visible history by language, score, date, time complexity, or space complexity (client-side, no additional server requests).
- Clicking a history row fetches the full review (including issues) via `GET /history/:id` and renders it in the results section, scrolling the view to the top of the results.
- A refresh button manually reloads the history list.

### PR-08 — Dark / Light Theme

- Default theme is dark (background `#0b0f14`).
- A toggle button in the navbar switches between dark and light themes.
- The selected theme is persisted in `localStorage` and restored on page load.

### PR-09 — Live Clock

- The navbar center displays a real-time clock: `HH:MM:SS`, full date, and browser timezone.
- Updates every second via `setInterval`.

### PR-10 — Toast Notifications

- A fixed bottom-right container shows slide-in toasts.
- Three types: `success` (green left border), `error` (red left border), `info` (cyan left border).
- Toasts auto-dismiss after 3 500 ms with a fade/slide-out transition.

### PR-11 — Responsive Layout

- At ≤ 800 px: hero heading shrinks, toolbar and results header stack vertically, summary grid becomes 2 columns, history items stack score below meta.
- At ≤ 500 px: container widens to 94 %, summary grid becomes 1 column.
- Navbar reflows at ≤ 900 px: clock moves below the logo/actions row.
