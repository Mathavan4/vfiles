const pdfInput = document.getElementById("pdfInput");
const addBtn = document.getElementById("addBtn");
const loader = document.getElementById("loader");
const resultBox = document.querySelector(".pdfwm-result-box");
const pdfPreview = document.getElementById("pdfPreview");
const downloadBtn = document.getElementById("downloadBtn");
const fileNameDisplay = document.getElementById("fileName");

let selectedFile = null;
let lastBlobURL = null;

// ✅ File choose update
pdfInput.addEventListener("change", function () {
  selectedFile = this.files[0] || null;
  fileNameDisplay.textContent = selectedFile ? selectedFile.name : "No file chosen";
});

// ✅ CSRF Token
function getCSRFToken() {
  const name = "csrftoken";
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(name + "=")) return cookie.substring(name.length + 1);
  }
  return "";
}

// ✅ Add Watermark
addBtn.addEventListener("click", async () => {
  if (!selectedFile) return alert("Please select a PDF file!");
  const text = document.getElementById("watermarkText").value.trim();
  const position = document.getElementById("positionSelect").value;
  const opacity = document.getElementById("opacityInput").value;
  if (!text) return alert("Enter watermark text!");

  loader.style.display = "block";
  addBtn.disabled = true;

  const formData = new FormData();
  formData.append("pdf", selectedFile);
  formData.append("text", text);
  formData.append("position", position);
  formData.append("opacity", opacity);

  const response = await fetch("/preview-watermark/", {
    method: "POST",
    headers: { "X-CSRFToken": getCSRFToken() },
    body: formData,
  });

  loader.style.display = "none";
  addBtn.disabled = false;

  if (response.ok) {
    const blob = await response.blob();
    lastBlobURL = URL.createObjectURL(blob);
    pdfPreview.src = lastBlobURL;
    resultBox.style.display = "block";
  } else {
    alert("Failed to add watermark. Try again!");
  }
});

// ✅ Download
downloadBtn.addEventListener("click", () => {
  if (!lastBlobURL) return;
  const a = document.createElement("a");
  a.href = lastBlobURL;
  a.download = "watermarked.pdf";
  a.click();
});
