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
  const files = Array.from(fileInput.files);

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
  security: "#ff9f43",
  performance: "#62d9ff",
  quality: "#8e8eff"
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
    alert("Pehle code paste ya upload karo.");
    return;
  }

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