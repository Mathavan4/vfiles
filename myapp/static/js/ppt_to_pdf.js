document.addEventListener("DOMContentLoaded", () => {
  const pptInput = document.getElementById("pptFile");
  const fileInfo = document.getElementById("fileInfo");
  const fileNameEl = document.getElementById("fileName");
  const removeFile = document.getElementById("removeFile");
  const convertBtn = document.getElementById("convertBtn");
  const downloadSection = document.getElementById("downloadSection");
  const convertedName = document.getElementById("convertedName");
  const downloadBtn = document.getElementById("downloadBtn");
  const uploadSection = document.getElementById("uploadSection");
  const loadingOverlay = document.getElementById("loadingOverlay");

  let uploadedFile = null;
  let lastBlobUrl = null;

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

  pptInput.addEventListener("change", (e) => {
    uploadedFile = e.target.files[0];
    if (uploadedFile) {
      fileInfo.classList.remove("hidden");
      fileNameEl.textContent = uploadedFile.name;
    } else {
      fileInfo.classList.add("hidden");
      fileNameEl.textContent = "";
    }
  });

  removeFile.addEventListener("click", () => {
    pptInput.value = "";
    uploadedFile = null;
    fileInfo.classList.add("hidden");
  });

  convertBtn.addEventListener("click", async () => {
    if (!uploadedFile) {
      alert("⚠️ Please select a PowerPoint file first!");
      return;
    }

    convertBtn.disabled = true;
    convertBtn.textContent = "Converting...";
    loadingOverlay.classList.remove("hidden"); // Show spinner

    const formData = new FormData();
    formData.append("ppt", uploadedFile);

    try {
      const csrftoken = getCookie("csrftoken");
      const response = await fetch(CONVERT_URL, {
        method: "POST",
        body: formData,
        credentials: "same-origin",
        headers: { "X-CSRFToken": csrftoken },
      });

      if (!response.ok) throw new Error("Conversion failed: " + response.status);
      const contentType = response.headers.get("Content-Type") || "";
      if (!contentType.includes("pdf")) throw new Error("Server did not return a PDF file");

      const blob = await response.blob();
      if (lastBlobUrl) URL.revokeObjectURL(lastBlobUrl);
      const url = URL.createObjectURL(blob);
      lastBlobUrl = url;

      const newName = uploadedFile.name.replace(/\.pptx?$/i, ".pdf");

      uploadSection.classList.add("hidden");
      downloadSection.classList.remove("hidden");
      convertedName.textContent = newName;

      downloadBtn.onclick = () => {
        const a = document.createElement("a");
        a.href = url;
        a.download = newName;
        a.click();
      };
    } catch (err) {
      console.error("⚠️ Error:", err);
      alert("⚠️ Conversion failed! Please try again.");
    } finally {
      convertBtn.disabled = false;
      convertBtn.textContent = "Convert to PDF";
      loadingOverlay.classList.add("hidden"); // Hide spinner
    }
  });
});
