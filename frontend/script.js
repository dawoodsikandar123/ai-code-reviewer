const codeInput = document.getElementById("codeInput");
const charCount = document.getElementById("charCount");
const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");
const reviewBtn = document.getElementById("reviewBtn");

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

reviewBtn.addEventListener("click", () => {
  alert("AI review backend abhi connect nahi hua. UI ready hai.");
});