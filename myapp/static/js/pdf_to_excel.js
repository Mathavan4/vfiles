document.addEventListener("DOMContentLoaded", () => {
  const pdfInput = document.getElementById("pdfFile");
  const convertBtn = document.getElementById("convertBtn");
  const loader = document.getElementById("loader");
  const downloadSection = document.getElementById("downloadSection");
  const fileNameEl = document.getElementById("fileName");
  const downloadBtn = document.getElementById("downloadBtn");
  const uploadSection = document.getElementById("uploadSection");
  const filePreview = document.getElementById("filePreview");
  const fileNamePreview = document.getElementById("fileNamePreview");
  const removeFile = document.getElementById("removeFile");
  const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

  let uploadedFile = null;

  // File select
  pdfInput.addEventListener("change", (e) => {
    uploadedFile = e.target.files[0];
    if (uploadedFile) {
      filePreview.style.display = "flex";
      fileNamePreview.textContent = uploadedFile.name;
      convertBtn.disabled = false;
    }
  });

  // Remove file
  removeFile.addEventListener("click", () => {
    uploadedFile = null;
    pdfInput.value = "";
    filePreview.style.display = "none";
    convertBtn.disabled = true;
  });

  // Convert to Excel
  convertBtn.addEventListener("click", async () => {
    if (!uploadedFile) {
      alert("⚠️ Please select a PDF file first!");
      return;
    }

    loader.style.display = "block";
    convertBtn.disabled = true;

    const formData = new FormData();
    formData.append("pdf", uploadedFile);

    try {
      const response = await fetch("/convert_pdf_to_excel/", {
        method: "POST",
        headers: { "X-CSRFToken": csrftoken },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Conversion failed!");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const newName = uploadedFile.name.replace(".pdf", ".xlsx");

      loader.style.display = "none";
      uploadSection.classList.add("hidden");
      downloadSection.classList.remove("hidden");
      fileNameEl.textContent = newName;

      downloadBtn.onclick = () => {
        const a = document.createElement("a");
        a.href = url;
        a.download = newName;
        a.click();
      };
    } catch (err) {
      loader.style.display = "none";
      alert("⚠️ Conversion failed! Try again.");
    } finally {
      convertBtn.disabled = false;
    }
  });
});
