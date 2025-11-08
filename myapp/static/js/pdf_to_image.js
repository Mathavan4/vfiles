document.addEventListener('DOMContentLoaded', function () {
  const pdfInput = document.getElementById('pdfInput');
  const fileList = document.getElementById('fileList');
  const convertBtn = document.getElementById('convertBtn');
  const loaderOverlay = document.getElementById('loaderOverlay');
  const resultBox = document.getElementById('resultBox');
  const imagePreview = document.getElementById('imagePreview');
  const downloadBtn = document.getElementById('downloadBtn');
  const zipBtn = document.getElementById('zipBtn');
  const homeBtn = document.getElementById('homeBtn');

  let files = [];
  let images = [];
  let outputFormat = 'png'; // ✅ store format

  pdfInput.addEventListener('change', function (e) {
    files = Array.from(e.target.files);
    renderFileList();
    convertBtn.disabled = files.length === 0;
  });

  function renderFileList() {
    fileList.innerHTML = '';
    files.forEach((file, index) => {
      const div = document.createElement('div');
      div.classList.add('file-item');
      div.innerHTML = `<span>${file.name}</span>
                       <button class="remove-btn" data-index="${index}">×</button>`;
      fileList.appendChild(div);
    });

    document.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const idx = this.getAttribute('data-index');
        files.splice(idx, 1);
        pdfInput.value = '';
        renderFileList();
        convertBtn.disabled = files.length === 0;
      });
    });
  }

  convertBtn.addEventListener('click', async function () {
    if (files.length === 0) return;

    loaderOverlay.style.display = 'flex';
    convertBtn.disabled = true;

    const fd = new FormData();
    files.forEach(f => fd.append('pdfs', f));
    outputFormat = document.querySelector('input[name="format"]:checked').value; // ✅ store format
    fd.append('format', outputFormat);

    try {
      const res = await fetch('/convert/pdf-to-image/', {
        method: 'POST',
        body: fd
      });
      const data = await res.json();

      loaderOverlay.style.display = 'none';
      if (data.success) {
        images = data.results.flatMap(r => r.images);
        outputFormat = data.format || outputFormat;
        showResults(images);
      } else {
        alert("Conversion failed: " + data.error);
        convertBtn.disabled = false;
      }
    } catch (err) {
      alert("Error connecting to server");
      loaderOverlay.style.display = 'none';
      convertBtn.disabled = false;
    }
  });

  function showResults(images) {
    document.querySelector('.upload-box').style.display = 'none';
    resultBox.style.display = 'block';
    imagePreview.innerHTML = '';
    images.forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      imagePreview.appendChild(img);
    });
  }

  // ✅ Fix: download correct format
  downloadBtn.addEventListener('click', () => {
    images.forEach((imgSrc, index) => {
      const a = document.createElement('a');
      a.href = imgSrc;
      a.download = `page_${index + 1}.${outputFormat}`;
      a.click();
    });
  });

  // ✅ Fix: include format in ZIP
  zipBtn.addEventListener('click', async () => {
    const res = await fetch('/download/zip/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ images, format: outputFormat })
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted_images.zip';
    a.click();
  });

  homeBtn.addEventListener('click', () => window.location.href = '/');
});
