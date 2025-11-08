document.addEventListener("DOMContentLoaded", function () {
  const pdfInput = document.getElementById("pdfInput");
  const fileInfo = document.getElementById("fileInfo");
  const fileNameEl = document.getElementById("fileName");
  const removeFile = document.getElementById("removeFile");
  const passwordInput = document.getElementById("passwordInput");
  const togglePassword = document.getElementById("togglePassword");
  const unlockBtn = document.getElementById("unlockBtn");
  const loader = document.getElementById("loader");
  const uploadBox = document.getElementById("uploadBox");
  const resultBox = document.getElementById("resultBox");
  const resultFilename = document.getElementById("resultFilename");
  const downloadBtn = document.getElementById("downloadBtn");
  const homeBtn = document.getElementById("homeBtn");

  let selectedFile = null;
  let fileData = "";
  let filename = "";

  // CSRF helper
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
  const csrftoken = getCookie("csrftoken");

  pdfInput.addEventListener("change", (e) => {
    const f = e.target.files[0];
    if (f) {
      selectedFile = f;
      fileNameEl.textContent = f.name;
      fileInfo.style.display = "flex";
      unlockBtn.disabled = false;

      removeFile.onclick = () => {
        selectedFile = null;
        pdfInput.value = "";
        fileInfo.style.display = "none";
        unlockBtn.disabled = true;
      };
    }
  });

  togglePassword.addEventListener("click", () => {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    togglePassword.classList.toggle("fa-eye-slash");
  });

  unlockBtn.addEventListener("click", async () => {
    if (!selectedFile) { alert("Please choose a PDF"); return; }
    const pwd = passwordInput.value || "";

    loader.style.display = "flex"; // show spinner overlay
    unlockBtn.disabled = true;

    const fd = new FormData();
    fd.append("pdf", selectedFile);
    fd.append("password", pwd);

    try {
      const res = await fetch("/pdf-unlock/convert/", {
        method: "POST",
        headers: { "X-CSRFToken": csrftoken },
        body: fd
      });

      const data = await res.json();
      loader.style.display = "none"; // hide spinner

      if (data.success) {
        uploadBox.style.display = "none";
        resultBox.style.display = "block";
        resultFilename.textContent = data.filename;
        fileData = data.file_data;
        filename = data.filename;
      } else {
        alert("Unlock failed: " + (data.error || "Unknown error"));
        unlockBtn.disabled = false;
      }
    } catch (err) {
      loader.style.display = "none";
      alert("Error contacting server");
      unlockBtn.disabled = false;
    }
  });

  downloadBtn.addEventListener("click", () => {
    if (!fileData) return;
    const a = document.createElement("a");
    a.href = "data:application/pdf;base64," + fileData;
    a.download = filename;
    a.click();
  });

  homeBtn.addEventListener("click", () => window.location.href = "/");
});
