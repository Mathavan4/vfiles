document.addEventListener("DOMContentLoaded", () => {

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

  const pdfInput = document.getElementById('pdfInput');
  const previewSection = document.getElementById('previewSection');
  const fileName = document.getElementById('fileName');
  const removeFile = document.getElementById('removeFile');
  const nextBtn = document.getElementById('nextBtn');
  const optionsBox = document.getElementById('optionsBox');
  const compressBtn = document.getElementById('compressBtn');
  const dropdownSelected = document.getElementById('dropdownSelected');
  const dropdownOptions = document.getElementById('dropdownOptions');
  const selectedQualityText = document.getElementById('selectedQuality');
  const uploadBox = document.getElementById('uploadBox');
  const overlay = document.getElementById('overlay');

  let selectedFile = null;
  let selectedQuality = "medium";

  pdfInput?.addEventListener('change', () => {
    selectedFile = pdfInput.files[0];
    if (selectedFile) {
      previewSection.style.display = 'block';
      fileName.textContent = selectedFile.name;
    }
  });

  removeFile?.addEventListener('click', () => {
    pdfInput.value = '';
    selectedFile = null;
    previewSection.style.display = 'none';
    optionsBox.style.display = 'none';
    uploadBox.style.display = 'block';
  });

  nextBtn?.addEventListener('click', () => {
    if (!selectedFile) {
      alert("Please upload a PDF first!");
      return;
    }
    uploadBox.style.display = 'none';
    optionsBox.style.display = 'block';
  });

  dropdownSelected?.addEventListener('click', () => {
    dropdownOptions.classList.toggle('show');
  });

  document.querySelectorAll('.option').forEach(opt => {
    opt.addEventListener('click', () => {
      selectedQuality = opt.getAttribute('data-value');
      selectedQualityText.textContent = opt.textContent;
      dropdownOptions.classList.remove('show');
    });
  });

  // ✅ Compress PDF + Keep spinner visible until next page fully loaded
  compressBtn?.addEventListener('click', () => {
    if (!selectedFile) {
      alert("Please upload a PDF first!");
      return;
    }

    overlay.style.display = 'flex';
    compressBtn.disabled = true;

    const fd = new FormData();
    fd.append('pdf', selectedFile);
    fd.append('quality', selectedQuality);

    fetch('/compress/upload/', {
      method: 'POST',
      headers: { 'X-CSRFToken': csrftoken },
      body: fd
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          // 🧠 Trick: keep spinner visible using a hidden form submit (no DOM wipe)
          const form = document.createElement('form');
          form.method = 'GET';
          form.action = '/compress/result/';
          document.body.appendChild(form);
          form.submit(); // this navigates without clearing spinner early
        } else {
          overlay.style.display = 'none';
          compressBtn.disabled = false;
          alert('Compression failed: ' + data.error);
        }
      })
      .catch(() => {
        overlay.style.display = 'none';
        compressBtn.disabled = false;
        alert("Server error while compressing!");
      });
  });

});
