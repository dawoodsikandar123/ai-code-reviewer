const codeInput = document.getElementById("codeInput");
const charCount = document.getElementById("charCount");
const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");
const reviewBtn = document.getElementById("reviewBtn");
const languageSelect = document.getElementById("language");
const resultBadge = document.querySelector(".result-badge");
const emptyResult = document.querySelector(".empty-result");
const summaryCards = document.querySelectorAll(".summary-card .summary-number");
const scoreRingFill = document.querySelector(".score-ring-fill");
const scoreNumber = document.querySelector(".score-number");

const CIRCUMFERENCE = 339.292;
const validationMsg = document.getElementById("validationMsg");

const SUPPORTED_LANGUAGES = new Set(["javascript", "typescript", "python", "java", "c", "cpp"]);

const SUPPORTED_EXTENSIONS = new Set([
  "js", "jsx", "ts", "tsx", "py", "java", "c", "h", "cpp", "cc", "cxx", "hpp"
]);

/** Mirror of the backend heuristic — keep in sync with server.js looksLikeCode() */
function looksLikeCode(text) {
  const t = text.trim();
  if (t.length < 10) return false;
  const plainPhrases = /^(hi|hello|hey|test|testing|yo|ok|okay|yes|no|help|thanks|bye|lol|wtf|what|why|how|who|hmm+|hm+|ugh+|oh+|ah+|um+|uh+|sup|yo+)\s*[!?.]*$/i;
  if (plainPhrases.test(t)) return false;
  const codeTokens = /[{}\[\]();=><+\-*\/%!&|^~]|\/\/|\/\*|\*\/|=>|->|::|#include|#define|import\s|export\s|function\s|const\s|let\s|var\s|def\s|class\s|public\s|private\s|return\s|if\s*\(|for\s*\(|while\s*\(|int\s|void\s|String\s/;
  if (codeTokens.test(t)) return true;
  if (t.split('\n').length > 2) return true;
  if (t.split('\n').length === 1 && t.length < 60) return false;
  return true;
}

function showValidationMsg(text) {
  validationMsg.textContent = text;
  validationMsg.hidden = false;
}

function clearValidationMsg() {
  validationMsg.hidden = true;
  validationMsg.textContent = "";
}

codeInput.addEventListener("input", () => {
  charCount.textContent = `${codeInput.value.length} characters`;
});

const extensionToLanguage = {
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  py: "python",
  java: "java",
  c: "c",
  h: "c",
  cpp: "cpp",
  cc: "cpp",
  cxx: "cpp",
  hpp: "cpp"
};

function detectLanguageFromFilename(name) {
  const ext = name.split(".").pop().toLowerCase();
  return extensionToLanguage[ext] || null;
}

fileInput.addEventListener("change", async () => {
  fileList.innerHTML = "";
  clearValidationMsg();

  const files = Array.from(fileInput.files);

  // Validate every selected file's extension before doing anything else
  for (const file of files) {
    const ext = file.name.split(".").pop().toLowerCase();
    if (!SUPPORTED_EXTENSIONS.has(ext)) {
      showValidationMsg(
        "Unsupported file type. Please upload a JavaScript, TypeScript, Python, Java, C, or C++ source file."
      );
      fileInput.value = "";   // reset so the same bad file can't slip through
      return;
    }
  }

  for (const file of files) {
    const item = document.createElement("div");
    item.className = "file-item";
    item.textContent = file.name;
    fileList.appendChild(item);

    if (files.length === 1) {
      const text = await file.text();
      codeInput.value = text;
      charCount.textContent = `${text.length} characters`;

      const detected = detectLanguageFromFilename(file.name);
      if (detected) {
        languageSelect.value = detected;
      }
    }
  }
});

const severityColors = {
  bug: "#ff6b6b",
  security: "#e0a458",
  performance: "#62d9ff",
  quality: "#a78bfa"
};

function calculateScore(counts) {
  const penalty = counts.bug * 15 + counts.security * 20 + counts.performance * 10 + counts.quality * 5;
  return Math.max(0, 100 - penalty);
}

function scoreColor(score) {
  if (score >= 80) return "#40d47a";
  if (score >= 50) return "#f5c542";
  return "#ff6b6b";
}

function animateNumber(el, from, to, duration) {
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.round(from + (to - from) * progress);
    el.textContent = value;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function animateScore(score) {
  const offset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;
  const color = scoreColor(score);

  scoreRingFill.style.stroke = color;
  scoreNumber.style.color = color;

  scoreRingFill.style.transition = "none";
  scoreRingFill.style.strokeDashoffset = CIRCUMFERENCE;
  scoreRingFill.getBoundingClientRect();
  scoreRingFill.style.transition = "stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.6s ease";
  scoreRingFill.style.strokeDashoffset = offset;

  animateNumber(scoreNumber, 0, score, 1400);
}

function renderResults(data) {
  const issues = data.issues || [];

  const counts = { bug: 0, security: 0, performance: 0, quality: 0 };
  issues.forEach(issue => {
    if (counts[issue.severity] !== undefined) counts[issue.severity]++;
  });

  summaryCards[0].textContent = issues.length;
  summaryCards[1].textContent = counts.security;
  summaryCards[2].textContent = counts.performance;
  summaryCards[3].textContent = counts.quality;

  animateScore(calculateScore(counts));

  if (issues.length === 0) {
    emptyResult.innerHTML = `
      <h3>No issues found</h3>
      <p>The AI didn't find any problems in this code.</p>
    `;
    return;
  }

  emptyResult.innerHTML = issues.map(issue => `
    <div style="text-align:left; border:1px solid #252d38; border-radius:10px; padding:16px; margin-bottom:12px; background:#0b0f14;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <span style="color:${severityColors[issue.severity] || '#9fa9b7'}; font-weight:700; text-transform:uppercase; font-size:12px;">
          ${issue.severity}
        </span>
        <span style="color:#9fa9b7; font-size:12px;">Line ${issue.line}</span>
      </div>
      <p style="color:#eaf0f6; margin-bottom:8px;">${issue.message}</p>
      <p style="color:#9fa9b7; font-size:13px;"><strong style="color:#62d9ff;">Fix:</strong> ${issue.suggestion}</p>
    </div>
  `).join("");
}

reviewBtn.addEventListener("click", async () => {
  const code = codeInput.value.trim();
  const language = languageSelect.value;

  if (!code) {
    showValidationMsg("Please paste or upload code before reviewing.");
    return;
  }

  if (!SUPPORTED_LANGUAGES.has(language)) {
    showValidationMsg(
      "Unsupported language. Please use JavaScript, TypeScript, Python, Java, C, or C++."
    );
    return;
  }

  if (!looksLikeCode(code)) {
    showValidationMsg("Please enter valid code for the selected language.");
    return;
  }

  clearValidationMsg();

  reviewBtn.disabled = true;
  reviewBtn.textContent = "Reviewing...";
  resultBadge.textContent = "Running...";

  try {
    const res = await fetch("/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Request failed");
    }

    resultBadge.textContent = "Review complete";
    renderResults(data);
  } catch (err) {
    resultBadge.textContent = "Error";
    emptyResult.innerHTML = `<h3>Something went wrong</h3><p>${err.message}</p>`;
  } finally {
    reviewBtn.disabled = false;
    reviewBtn.textContent = "Review Code";
  }
});


// ── Review History ────────────────────────────────────────────────────

const historyList      = document.getElementById("historyList");
const refreshHistoryBtn = document.getElementById("refreshHistoryBtn");

/** Format an ISO timestamp to a readable local string */
function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}

/** Render the loading / empty / error placeholder inside historyList */
function setHistoryState(type, message) {
  const icons = { loading: "&lt;/&gt;", empty: "&lt;/&gt;", error: "⚠" };
  const titles = { loading: "Loading history…", empty: "No reviews yet", error: "Could not load history" };
  historyList.innerHTML = `
    <div class="history-state ${type === "error" ? "error" : ""}">
      <div class="history-state-icon">${icons[type]}</div>
      <h3>${titles[type]}</h3>
      <p>${message}</p>
    </div>`;
}

/** Build one history row element */
function buildHistoryItem(review) {
  const color = scoreColor(review.score);
  const item = document.createElement("div");
  item.className = "history-item";
  item.dataset.id = review.id;
  item.innerHTML = `
    <div class="history-item-left">
      <div class="history-item-meta">
        <span class="history-lang-badge">${review.language}</span>
        <span class="history-date">${formatDate(review.created_at)}</span>
      </div>
      <div class="history-stats">
        <span class="history-stat">
          <span class="history-stat-dot total"></span>
          ${review.total_issues} total
        </span>
        <span class="history-stat">
          <span class="history-stat-dot security"></span>
          ${review.security} security
        </span>
        <span class="history-stat">
          <span class="history-stat-dot performance"></span>
          ${review.performance} perf
        </span>
        <span class="history-stat">
          <span class="history-stat-dot quality"></span>
          ${review.quality} quality
        </span>
      </div>
    </div>
    <div class="history-item-score">
      <span class="history-score-number" style="color:${color}">${review.score}</span>
      <span class="history-score-label">Score</span>
    </div>`;
  return item;
}

const HISTORY_PAGE_SIZE = 5;
const historyMoreRow = document.getElementById("historyMoreRow");
const viewMoreBtn    = document.getElementById("viewMoreBtn");
let historyOverflowEl = null; // holds the collapsible container
let historyExpanded = false;

/** Fetch and render the history list with View More / Show Less */
async function loadHistory() {
  refreshHistoryBtn.classList.add("spinning");
  setHistoryState("loading", "Fetching your previous reviews…");

  try {
    const res = await fetch("/history");
    if (!res.ok) throw new Error(`Server error ${res.status}`);
    const reviews = await res.json();

    historyList.innerHTML = "";
    historyOverflowEl = null;
    historyExpanded = false;
    historyMoreRow.hidden = true;

    if (reviews.length === 0) {
      setHistoryState("empty", "Submit your first review to see it here.");
      return;
    }

    const visible = reviews.slice(0, HISTORY_PAGE_SIZE);
    const hidden  = reviews.slice(HISTORY_PAGE_SIZE);

    visible.forEach((review, i) => {
      const item = buildHistoryItem(review);
      item.style.animationDelay = `${i * 0.05}s`;
      historyList.appendChild(item);
    });

    if (hidden.length > 0) {
      // Build collapsed overflow container
      historyOverflowEl = document.createElement("div");
      historyOverflowEl.className = "history-overflow";

      hidden.forEach((review, i) => {
        const item = buildHistoryItem(review);
        item.style.animationDelay = `${i * 0.04}s`;
        historyOverflowEl.appendChild(item);
      });

      historyList.appendChild(historyOverflowEl);
      viewMoreBtn.textContent = `View More (${hidden.length})`;
      historyMoreRow.hidden = false;
    }
  } catch (err) {
    setHistoryState("error", err.message);
  } finally {
    refreshHistoryBtn.classList.remove("spinning");
  }
}

viewMoreBtn.addEventListener("click", () => {
  if (!historyOverflowEl) return;
  historyExpanded = !historyExpanded;
  historyOverflowEl.classList.toggle("expanded", historyExpanded);
  viewMoreBtn.textContent = historyExpanded
    ? "Show Less"
    : `View More (${historyOverflowEl.children.length})`;
});

/** Load a saved review by id and display it in the results section */
async function loadHistoryItem(id) {
  resultBadge.textContent = "Loading…";

  try {
    const res = await fetch(`/history/${id}`);
    if (!res.ok) throw new Error(`Server error ${res.status}`);
    const data = await res.json();

    // Populate the score ring and summary cards from stored counts
    summaryCards[0].textContent = data.total_issues;
    summaryCards[1].textContent = data.security;
    summaryCards[2].textContent = data.performance;
    summaryCards[3].textContent = data.quality;
    animateScore(data.score);

    // Render the issue cards (re-use existing renderResults logic via issues array)
    renderResults(data);

    resultBadge.textContent = `History #${id}`;

    // Scroll up smoothly so the user sees the results
    document.querySelector(".results-section").scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (err) {
    resultBadge.textContent = "Error";
    emptyResult.innerHTML = `<h3>Could not load review</h3><p>${err.message}</p>`;
  }
}

// Click delegation — single listener on the list container
historyList.addEventListener("click", (e) => {
  const item = e.target.closest(".history-item");
  if (!item) return;
  loadHistoryItem(Number(item.dataset.id));
});

refreshHistoryBtn.addEventListener("click", loadHistory);

// Reload history automatically after every successful review
const _originalClick = reviewBtn.onclick;
reviewBtn.addEventListener("click", () => {
  // Wait for the review fetch to finish then refresh history.
  // We hook into the existing click handler by watching resultBadge.
  const observer = new MutationObserver(() => {
    const text = resultBadge.textContent;
    if (text === "Review complete" || text === "Error") {
      observer.disconnect();
      if (text === "Review complete") loadHistory();
    }
  });
  observer.observe(resultBadge, { childList: true, characterData: true, subtree: true });
});

// Load history on page start
loadHistory();


// ── Live Clock ────────────────────────────────────────────────────────

const clockTimeEl = document.getElementById("clockTime");
const clockDateEl = document.getElementById("clockDate");
const clockTzEl   = document.getElementById("clockTz");

const WEEKDAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTHS   = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function pad2(n) { return String(n).padStart(2, "0"); }

function tick() {
  const now = new Date();

  const h = pad2(now.getHours());
  const m = pad2(now.getMinutes());
  const s = pad2(now.getSeconds());
  clockTimeEl.textContent = `${h}:${m}:${s}`;

  const day  = WEEKDAYS[now.getDay()];
  const mon  = MONTHS[now.getMonth()];
  const date = now.getDate();
  const year = now.getFullYear();
  clockDateEl.textContent = `${day}, ${mon} ${date}, ${year}`;

  // Derive timezone from browser — no geolocation needed
  if (!clockTzEl.textContent) {
    try {
      const offset = now.toTimeString().match(/GMT[+-]\d{4}/)?.[0]
        || Intl.DateTimeFormat().resolvedOptions().timeZone;
      clockTzEl.textContent = offset;
    } catch (_) {}
  }
}

tick();
setInterval(tick, 1000);
