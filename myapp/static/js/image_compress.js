document.addEventListener('DOMContentLoaded', function () {
  const imageInput = document.getElementById('imageInput');
  const fileList = document.getElementById('fileList');
  const compressBtn = document.getElementById('compressBtn');
  const loader = document.getElementById('loader');
  const resultBox = document.getElementById('resultBox');
  const imageList = document.getElementById('imageList');
  const homeBtn = document.getElementById('homeBtn');
  const uploadBox = document.getElementById('uploadBox');

  let files = [];

  imageInput.addEventListener('change', function (e) {
    files = Array.from(e.target.files);
    renderFileList();
    compressBtn.disabled = files.length === 0;
  });

  function renderFileList() {
    fileList.innerHTML = '';
    files.forEach((file, index) => {
      const div = document.createElement('div');
      div.classList.add('file-item');
      div.innerHTML = `
        <span>${file.name}</span>
        <button class="remove-btn" data-index="${index}">×</button>`;
      fileList.appendChild(div);
    });

    document.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const idx = this.getAttribute('data-index');
        files.splice(idx, 1);
        imageInput.value = '';
        renderFileList();
        compressBtn.disabled = files.length === 0;
      });
    });
  }

  compressBtn.addEventListener('click', async function () {
    if (files.length === 0) return;

    // ✅ Show spinner only after pressing Compress
    loader.style.display = 'flex';
    compressBtn.disabled = true;

    const fd = new FormData();
    files.forEach(f => fd.append('images', f));

    try {
      const res = await fetch('/convert/image-compress/', {
        method: 'POST',
        body: fd
      });

      const data = await res.json();

      // ✅ Hide spinner after response
      loader.style.display = 'none';

      if (data.success) {
        showResults(data.results);
      } else {
        alert("Compression failed: " + data.error);
        compressBtn.disabled = false;
      }
    } catch (err) {
      alert("Error connecting to server");
      loader.style.display = 'none';
      compressBtn.disabled = false;
    }
  });

  function showResults(results) {
    uploadBox.style.display = 'none';
    resultBox.style.display = 'block';
    imageList.innerHTML = '';

    results.forEach((imgData) => {
      const div = document.createElement('div');
      div.classList.add('image-item');
      div.innerHTML = `
        <span>${imgData.filename}</span><br>
        <a href="${imgData.image}" download="${imgData.filename}" class="btn">Download</a>
      `;
      imageList.appendChild(div);
    });
  }

  homeBtn.addEventListener('click', () => window.location.href = '/');
});
