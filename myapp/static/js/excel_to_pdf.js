document.addEventListener("DOMContentLoaded", () => {
  const excelInput = document.getElementById("excelFile");
  const convertBtn = document.getElementById("convertBtn");
  const loadingMsg = document.getElementById("loadingMsg");
  const downloadSection = document.getElementById("downloadSection");
  const fileNameEl = document.getElementById("fileName");
  const downloadBtn = document.getElementById("downloadBtn");
  const uploadSection = document.getElementById("uploadSection");

  let uploadedFile = null;

  excelInput.addEventListener("change", (e) => {
    uploadedFile = e.target.files[0];
  });

  convertBtn.addEventListener("click", async () => {
    if (!uploadedFile) {
      alert("⚠️ Please select an Excel file first!");
      return;
    }

    loadingMsg.classList.remove("hidden");
    const formData = new FormData();
    formData.append("excel", uploadedFile);

    try {
      const response = await fetch("/convert_excel_to_pdf/", {
        method: "POST",
        body: formData,
      });

      const contentType = response.headers.get("Content-Type");
      if (!response.ok || !contentType.includes("pdf")) {
        throw new Error("Invalid server response");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      loadingMsg.classList.add("hidden");
      uploadSection.classList.add("hidden");
      downloadSection.classList.remove("hidden");

      const newName = uploadedFile.name.replace(/\.(xls|xlsx)$/i, ".pdf");
      fileNameEl.textContent = newName;

      downloadBtn.onclick = () => {
        const a = document.createElement("a");
        a.href = url;
        a.download = newName;
        a.click();
      };
    } catch (err) {
      console.error("⚠️ Conversion error:", err);
      loadingMsg.classList.add("hidden");
      alert("⚠️ Conversion failed! Try again.");
    }
  });
});
