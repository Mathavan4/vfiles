document.addEventListener("DOMContentLoaded", function () {
  const pdfInput = document.getElementById("pdfInput");
  const fileList = document.getElementById("fileList");
  const protectBtn = document.getElementById("protectBtn");
  const loaderOverlay = document.getElementById("loaderOverlay");
  const resultBox = document.getElementById("resultBox");
  const fileName = document.getElementById("fileName");
  const downloadBtn = document.getElementById("downloadBtn");
  const homeBtn = document.getElementById("homeBtn");
  const passwordInput = document.getElementById("passwordInput");
  const togglePassword = document.getElementById("togglePassword");

  let selectedFile = null;
  let fileData = "";
  let filename = "";

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

  pdfInput.addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (file) {
      selectedFile = file;
      fileList.innerHTML = `
        <div class="file-item">
          <span>${file.name}</span>
          <button class="remove-btn">×</button>
        </div>`;
      document.querySelector(".remove-btn").addEventListener("click", () => {
        selectedFile = null;
        pdfInput.value = "";
        fileList.innerHTML = ""; 
        protectBtn.disabled = true;
      });
      protectBtn.disabled = false;
    }
  });

  togglePassword.addEventListener("click", function () {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    this.classList.toggle("fa-eye-slash");
  });

  protectBtn.addEventListener("click", async function () {
    if (!selectedFile || !passwordInput.value) {
      alert("Please upload a PDF and set a password.");
      return;
    }

    protectBtn.disabled = true;

    const formData = new FormData();
    formData.append("pdf", selectedFile);
    formData.append("password", passwordInput.value);

    try {
      loaderOverlay.style.display = "flex";

      const response = await fetch("/pdf-protect/convert/", {
        method: "POST",
        headers: { "X-CSRFToken": csrftoken },
        body: formData,
      });

      const data = await response.json();
      loaderOverlay.style.display = "none";
      protectBtn.disabled = false;

      if (data.success) {
        document.querySelector(".upload-box").style.display = "none";
        resultBox.style.display = "block";
        fileName.textContent = data.filename;
        fileData = data.file_data;
        filename = data.filename;
      } else {
        alert("Failed to protect PDF: " + data.error);
      }
    } catch (error) {
      loaderOverlay.style.display = "none";
      protectBtn.disabled = false;
      alert("Error protecting PDF. Please try again.");
    }
  });

  downloadBtn.addEventListener("click", function () {
    const link = document.createElement("a");
    link.href = "data:application/pdf;base64," + fileData;
    link.download = filename;
    link.click();
  });

  homeBtn.addEventListener("click", function () {
    window.location.href = "/";
  });
});
