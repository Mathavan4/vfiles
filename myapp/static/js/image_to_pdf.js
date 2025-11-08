function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
const csrftoken = getCookie("csrftoken");

const imageInput = document.getElementById("imageInput");
const previewContainer = document.getElementById("previewContainer");
const convertBtn = document.getElementById("convertBtn");
const spinnerOverlay = document.getElementById("spinnerOverlay");
const resultBox = document.getElementById("resultBox");
const resultFile = document.getElementById("resultFile");
const downloadBtn = document.getElementById("downloadBtn");
const homeBtn = document.getElementById("homeBtn");

let selectedFiles = [];

imageInput.addEventListener("change", () => {
  previewContainer.innerHTML = "";
  selectedFiles = Array.from(imageInput.files);
  convertBtn.disabled = selectedFiles.length === 0;

  selectedFiles.forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imgBox = document.createElement("div");
      imgBox.classList.add("img-box");
      imgBox.innerHTML = `
        <img src="${e.target.result}" alt="preview" class="preview-img">
        <button class="remove-btn" data-index="${index}">×</button>
      `;
      previewContainer.appendChild(imgBox);
    };
    reader.readAsDataURL(file);
  });
});

previewContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-btn")) {
    const index = parseInt(e.target.getAttribute("data-index"));
    selectedFiles.splice(index, 1);
    if (selectedFiles.length === 0) convertBtn.disabled = true;
    previewContainer.innerHTML = "";
    selectedFiles.forEach((file, i) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const imgBox = document.createElement("div");
        imgBox.classList.add("img-box");
        imgBox.innerHTML = `
          <img src="${ev.target.result}" class="preview-img">
          <button class="remove-btn" data-index="${i}">×</button>
        `;
        previewContainer.appendChild(imgBox);
      };
      reader.readAsDataURL(file);
    });
  }
});

convertBtn.addEventListener("click", () => {
  if (selectedFiles.length === 0) return alert("Please select at least one image!");

  spinnerOverlay.style.display = "flex"; // Show full-screen spinner
  convertBtn.disabled = true;

  const fd = new FormData();
  selectedFiles.forEach((f) => fd.append("images", f));

  fetch("/convert/image-to-pdf/", {
    method: "POST",
    headers: { "X-CSRFToken": csrftoken },
    body: fd,
  })
    .then((res) => res.json())
    .then((data) => {
      spinnerOverlay.style.display = "none"; // Hide spinner
      convertBtn.disabled = false;

      if (data.success) {
        resultBox.style.display = "block";
        document.querySelector(".upload-box").style.display = "none";
        resultFile.textContent = data.filename;

        const blob = new Blob(
          [Uint8Array.from(atob(data.pdf_b64), (c) => c.charCodeAt(0))],
          { type: "application/pdf" }
        );
        const blobUrl = URL.createObjectURL(blob);
        downloadBtn.onclick = () => {
          const a = document.createElement("a");
          a.href = blobUrl;
          a.download = data.filename;
          a.click();
        };
        homeBtn.onclick = () => (window.location.href = "/");
      } else {
        alert(data.error || "Error converting image!");
      }
    })
    .catch(() => {
      spinnerOverlay.style.display = "none";
      alert("Error converting image!");
    });
});
