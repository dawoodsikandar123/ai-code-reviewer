# Design — AI Code Reviewer

---

## Layout

The page is a single scrollable document divided into three regions:

```
┌──────────────────────────────────────────────┐
│  Navbar                                      │  fixed height, full width
│  Logo (left) | Clock (center) | Theme + Status (right) │
├──────────────────────────────────────────────┤
│  Main container (max-width: 1200px, 88% wide)│
│                                              │
│  Hero section                                │
│    Eyebrow label                             │
│    H1 heading                                │
│    Subtitle paragraph                        │
│                                              │
│  Review Card                                 │
│    Toolbar: Language select | Upload button  │
│    Editor wrapper: header + textarea         │
│    File badge list                           │
│    Review Code button (full width)           │
│    Validation message (inline, below button) │
│                                              │
│  Results Section                             │
│    Results header: eyebrow + h2 | badge + copy btn │
│    Loading skeleton (shown during fetch)     │
│    Score ring (SVG, 160×160 px)              │
│    Summary grid (4 cards: total/security/perf/quality) │
│    AI Summary card                           │
│    Issue filter buttons (All/Bug/Security/Performance/Quality) │
│    Complexity card (time, space, optimization) │
│    Issue cards / empty state                 │
├──────────────────────────────────────────────┤
│  History Section (full width background)     │
│    Container (same max-width)                │
│    Header: eyebrow + h2 | refresh button     │
│    Search input (full width)                 │
│    History item list                         │
│    View More / Show Less button              │
├──────────────────────────────────────────────┤
│  Footer (centered text)                      │
└──────────────────────────────────────────────┘
│  Toast container (fixed, bottom-right)       │
```

---

## Dark Theme (Default)

| Element | Color |
|---------|-------|
| Page background | `#0b0f14` |
| Card backgrounds | `#111720` |
| Card borders | `#252d38` |
| Navbar border | `#202631` |
| Body text | `#f5f7fa` |
| Secondary text | `#9fa9b7` |
| Muted text | `#737e8c` |
| Primary accent (cyan) | `#62d9ff` |
| Button text on cyan bg | `#071016` |
| Input/select background | `#0b0f14` |
| Input borders | `#303947` |
| Editor header background | `#151c25` |
| Code textarea text | `#eaf0f6` |

---

## Light Theme

Activated by adding the `.light` class to `<body>`. The toggle button label switches between "Light" and "Dark". The choice is saved in `localStorage` under the key `"theme"`.

| Element | Color |
|---------|-------|
| Page background | `#f0f2f5` |
| Card backgrounds | `#ffffff` |
| Card borders | `#d1d5db` |
| Navbar background | `#ffffff` |
| Body text | `#1a1f28` |
| Secondary text | `#4b5563` / `#6b7280` |
| Primary accent (blue) | `#2563eb` |
| Review button | Gradient `#2563eb → #1d4ed8` with white text |
| Filter active button | `#2563eb` background with white text |

All interactive elements (history items, summary cards, history search focus) use `#2563eb` as the hover/focus accent in light mode.

---

## Navbar

Three-column CSS grid: `1fr auto 1fr`. Contains:

- **Left** — Logo: `</>` icon (cyan) + "AI Code Reviewer" text
- **Center** — Live clock: time (`HH:MM:SS`), date (full weekday, month, day, year), timezone (GMT offset)
- **Right** — Theme toggle button + green status dot with "Ready" label

The clock time pulses with `@keyframes clockPulse` (opacity oscillates between 1 and 0.85 every second).  
The navbar has `backdrop-filter: blur(6px)` applied.  
Hovering over the navbar makes the logo icon glow (`text-shadow` with cyan rgba).

---

## Review Interface

### Language Selector

- 180 px wide `<select>` element.
- Hover: border turns cyan (`#62d9ff`) in dark mode, blue in light mode.

### Upload Button

- Styled `<label>` wrapping a hidden `<input type="file" multiple>`.
- Accepts any file; extension is validated in JavaScript against the supported set.
- Hover: border turns cyan.

### Code Editor

- `<textarea>` with `min-height: 360px`, `resize: vertical`, monospace font (`Consolas`), 14 px, 1.7 line-height.
- The wrapping `.editor-wrapper` gets a cyan `border-color` and `box-shadow: 0 0 0 3px rgba(98,217,255,0.15)` on `:focus-within`.
- An `.editor-header` bar shows "Code" label and a live character count.

### Review Button

- Full-width, gradient background: `#7ee6ff → #4fc3f7` (dark), `#2563eb → #1d4ed8` (light).
- Hover: lifts 2 px (`translateY(-2px)`) and deepens the cyan/blue glow shadow.
- Active: returns to translateY(0).
- Disabled state (during fetch): opacity 0.6, `cursor: not-allowed`.
- Label changes to `"Reviewing..."` while the fetch is in flight.

### File Badges

- Small rounded chips below the textarea showing uploaded filenames.
- Hover: lift 2 px, border turns cyan.

---

## Results Interface

### Loading Skeleton

Shown while the review fetch is in progress:
- A circular skeleton ring (80×80 px) on the left.
- Three skeleton lines (60 %, 40 %, 80 % width) on the right.
- Both use a `@keyframes shimmer` animation (background-position sweep, 1.4 s infinite).

### Score Ring

- SVG `viewBox="0 0 120 120"` with two `<circle>` elements (r=54):
  - Background track: `stroke: #202631`, 10 px width.
  - Fill arc: `stroke-dasharray: 339.292`, offset animated from full to target.
- Animation: `stroke-dashoffset` transitions over 1.4 s with `cubic-bezier(0.4, 0, 0.2, 1)`.
- The numeric score counts from 0 to the target value using `requestAnimationFrame` over 1 400 ms.
- The fill stroke color and numeric color transition over 0.6 s ease based on score range.
- The card scales to 1.04 on hover.

### Summary Cards

Four cards in a `grid-template-columns: repeat(4, 1fr)` grid:
- Total Issues, Security, Performance, Quality.
- Hover: lift 6 px, number scales 1.08×.
- Each card has a per-`nth-child` border-color and glow-shadow on hover:
  1. Total — cyan (`#62d9ff`)
  2. Security — orange (`#e0a458`)
  3. Performance — cyan (`#62d9ff`)
  4. Quality — purple (`#a78bfa`)

### AI Summary Card

- Left border accent `3px solid #62d9ff` (dark) / `#2563eb` (light).
- Background slightly darker than the page: `#111720` (dark) / `#f0f7ff` (light).

### Complexity Card

- Two items displayed side by side: **Time Complexity** and **Space Complexity**.
- Values rendered in Consolas 20 px, cyan (`#62d9ff`) / blue (`#2563eb`).
- Optional optimization text below a top border separator.

### Issue Cards

Rendered as inline HTML inside the `.empty-result` container:
- Each card: dark background (`#0b0f14`), `1px solid #252d38` border, 10 px radius.
- Header row: severity label (color-coded, uppercase, 12 px) on the left; line number (muted, 12 px) on the right.
- Message text: light (`#eaf0f6`).
- Fix suggestion: muted (`#9fa9b7`) with "Fix:" label in cyan (`#62d9ff`).

Severity colors:
| Severity | Color |
|----------|-------|
| bug | `#ff6b6b` |
| security | `#e0a458` |
| performance | `#62d9ff` |
| quality | `#a78bfa` |

### Issue Filter Bar

Pill-shaped buttons. The active button has a filled cyan/blue background. Non-active buttons are outlined with hover color change. Shown only when there are issues.

---

## History Interface

### History Items

Each item is a CSS grid (`1fr auto`) card:
- **Left column:** language badge (pill, cyan text), date string, issue stat dots (color-coded), optional complexity line.
- **Right column:** large score number (color-coded by score range), small "Score" label.
- Hover: border turns cyan, lifts 3 px, background lightens slightly, cyan box-shadow appears.
- Each item has `animation: slideInResult 0.3s ease both` with staggered `animation-delay` per item.

### History State Placeholders

Three states (loading / empty / error) use a centered card with icon and message:
- Loading and empty: cyan `</>` monospace icon.
- Error: `⚠` icon in red (`#ff6b6b`).

### View More / Show Less

- The overflow container uses `max-height: 0; opacity: 0` collapsed to `max-height: 4000px; opacity: 1` expanded.
- Transition: `max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1)`, `opacity 0.4s ease`.

### Refresh Button

Square icon button (38×38 px). On click it receives `.spinning` which applies `transform: rotate(360deg)` over 0.5 s linear.

### Search Input

Full-width search field. Focus: cyan border + `box-shadow: 0 0 0 3px rgba(98,217,255,0.1)`. Filters history client-side with no additional server requests.

---

## Validation / Error States

### Inline Validation Message

- Appears below the Review Code button on client-side validation failure.
- Background: `rgba(255,107,107,0.08)`, border: `rgba(255,107,107,0.35)`, text: `#ff6b6b` (dark) / `#dc2626` (light).
- Hidden with `hidden` attribute when no error.

### Empty / Error Result State

The `.empty-result` container is reused for:
- Default state — "Your review will appear here" with the `</>` icon.
- No issues found — "No issues found" message.
- Filtered with no matches — "No `<filter>` issues" message.
- Server/network error — "Something went wrong" with the error message.

---

## Loading / Toast States

### Loading Skeleton

Visible during a review fetch. Shows a shimmer animation. Hidden immediately when the response arrives (success or error).

### Toast Notifications

Fixed `bottom: 24px; right: 24px` container. Toasts:
- Start at `opacity: 0; transform: translateY(12px)`.
- Entrance: `opacity: 1; translateY(0)` over 0.25 s.
- Auto-dismiss after 3 500 ms; exit is the reverse transition followed by DOM removal.
- Success: `3px solid #40d47a` left border.
- Error: `3px solid #ff6b6b` left border.
- Info: `3px solid #62d9ff` left border.
- Light mode: white background, gray border.

---

## Animations

| Animation | Element | Details |
|-----------|---------|---------|
| `fadeInPage` | `<body>` | Fade in on load, 0.6 s ease |
| `clockPulse` | `.clock-time` | Opacity 1 → 0.85 → 1, 1 s infinite |
| `shimmer` | Skeleton ring + lines | Background-position sweep, 1.4 s infinite |
| `slideInResult` | `.empty-result > div`, `.history-item` | `opacity:0 + translateY(12px)` → visible, 0.3–0.4 s, staggered per child |
| Score ring fill | `.score-ring-fill` | `stroke-dashoffset` over 1.4 s cubic-bezier; color over 0.6 s |
| Score number | `.score-number` | Count-up via `requestAnimationFrame` over 1 400 ms |
| Refresh button spin | `.history-refresh-btn.spinning` | `rotate(360deg)` over 0.5 s linear |
| History overflow | `.history-overflow` | `max-height` + opacity expand/collapse over 0.4–0.5 s |
| Card hover lift | Summary cards, history items, file items | `translateY(-2px to -6px)` over 0.2–0.25 s |
| Review button hover | `.review-btn` | `translateY(-2px)` + deepened shadow |

---

## Responsive Behavior

| Breakpoint | Changes |
|------------|---------|
| ≤ 900 px | Navbar becomes two rows: logo+actions top row, clock full-width bottom row; clock switches to horizontal layout |
| ≤ 800 px | Hero h1 shrinks to 36 px; toolbar and results header stack vertically; summary grid → 2 columns; history items stack score below meta row |
| ≤ 500 px | Container widens to 94%; summary grid → 1 column |
