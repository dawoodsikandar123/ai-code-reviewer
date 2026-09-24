const codeInput = document.getElementById("codeInput");
const charCount = document.getElementById("charCount");
const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");
const reviewBtn = document.getElementById("reviewBtn");
const languageSelect = document.getElementById("language");
const resultBadge = document.querySelector(".result-badge");
const emptyResult = document.querySelector(".empty-result");

codeInput.addEventListener("input", () => {
  charCount.textContent = `${codeInput.value.length} characters`;
});

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
    }
  }
});

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
    emptyResult.innerHTML = `
      <h3>Backend Response</h3>
      <pre style="text-align:left; white-space:pre-wrap; color:#c7d0db; margin-top:12px;">${JSON.stringify(data, null, 2)}</pre>
    `;
  } catch (err) {
    resultBadge.textContent = "Error";
    emptyResult.innerHTML = `<h3>Something went wrong</h3><p>${err.message}</p>`;
  } finally {
    reviewBtn.disabled = false;
    reviewBtn.textContent = "Review Code";
  }
});