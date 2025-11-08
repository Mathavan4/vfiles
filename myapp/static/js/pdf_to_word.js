// ✅ CSRF Token Function
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
const csrftoken = getCookie('csrftoken');

// ✅ Elements
const pdfInput = document.getElementById('pdfInput');
const previewSection = document.getElementById('previewSection');
const fileName = document.getElementById('fileName');
const removeFile = document.getElementById('removeFile');
const convertBtn = document.getElementById('convertBtn');
const loader = document.getElementById('loader');

let selectedFile = null;

// ✅ File selection event (fixed re-upload issue)
pdfInput.addEventListener('change', () => {
  const file = pdfInput.files[0];

  // ⚙️ Prevent same file re-upload trigger
  if (!file || (selectedFile && file.name === selectedFile.name)) {
    pdfInput.value = ''; // reset input to avoid same file trigger
    return;
  }

  selectedFile = file;
  previewSection.style.display = 'block';
  fileName.textContent = selectedFile.name;
});

// ✅ Remove file
removeFile.addEventListener('click', () => {
  pdfInput.value = '';
  selectedFile = null;
  previewSection.style.display = 'none';
});

// ✅ Convert button click
convertBtn.addEventListener('click', () => {
  if (!selectedFile) {
    alert("Please select a PDF first!");
    return;
  }

  // 🔄 Show loader (centered)
  loader.style.display = 'flex';
  convertBtn.disabled = true;

  const fd = new FormData();
  fd.append('pdf', selectedFile);

  // 📨 Send to Django backend
  fetch('/convert/upload/', {
    method: 'POST',
    headers: { 'X-CSRFToken': csrftoken },
    body: fd
  })
    .then(r => r.json())
    .then(data => {
      // ✅ Hide loader after response
      loader.style.display = 'none';
      convertBtn.disabled = false;

      if (data.success) {
        // ✅ Redirect to download page
        window.location.href = `/convert/result/?file=${encodeURIComponent(data.filename)}&url=${encodeURIComponent(data.file_url)}`;
      } else {
        alert("Conversion failed: " + data.error);
      }
    })
    .catch(() => {
      loader.style.display = 'none';
      convertBtn.disabled = false;
      alert("Server error while converting!");
    });
});
