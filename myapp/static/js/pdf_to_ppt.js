function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const csrftoken = getCookie('csrftoken');

const pdfInput = document.getElementById('pdfInput');
const fileText = document.getElementById('file-text');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const removeFile = document.getElementById('removeFile');
const convertBtn = document.getElementById('convertBtn');
const loader = document.getElementById('loader');
const resultBox = document.getElementById('resultBox');
const resultFile = document.getElementById('resultFile');
const downloadBtn = document.getElementById('downloadBtn');
const homeBtn = document.getElementById('homeBtn');

let selectedFile = null;

pdfInput.addEventListener('change', () => {
  selectedFile = pdfInput.files[0];
  if (selectedFile) {
    fileText.textContent = selectedFile.name;
    fileName.textContent = selectedFile.name;
    fileInfo.style.display = 'flex';
    convertBtn.disabled = false;
  }
});

removeFile.addEventListener('click', () => {
  pdfInput.value = '';
  selectedFile = null;
  fileText.textContent = 'No file chosen';
  fileInfo.style.display = 'none';
  convertBtn.disabled = true;
});

convertBtn.addEventListener('click', () => {
  if (!selectedFile) {
    alert('Please upload a PDF first!');
    return;
  }

  loader.style.display = 'block';
  convertBtn.disabled = true;

  const fd = new FormData();
  fd.append('pdf', selectedFile);

  const startTime = Date.now();

  fetch('/pdf-to-ppt/convert/', {
    method: 'POST',
    headers: { 'X-CSRFToken': csrftoken },
    body: fd
  })
    .then(r => r.json()) 
    .then(data => {
      const minDuration = 1200; // spinner min time 1.2s
      const elapsed = Date.now() - startTime;
      const delay = elapsed < minDuration ? minDuration - elapsed : 0;

      setTimeout(() => {
        loader.style.display = 'none';
        convertBtn.disabled = false; 

        if (data.success) {
          const byteChars = atob(data.file_b64);
          const byteNums = new Array(byteChars.length);
          for (let i = 0; i < byteChars.length; i++) {
            byteNums[i] = byteChars.charCodeAt(i);
          }
          const blob = new Blob([new Uint8Array(byteNums)], {
            type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
          });
          const blobUrl = URL.createObjectURL(blob);

          resultFile.textContent = data.filename;
          resultBox.style.display = 'block';
          document.getElementById('uploadBox').style.display = 'none';

          downloadBtn.onclick = () => {
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = data.filename;
            a.click();
          };

          homeBtn.onclick = () => window.location.href = '/';
        } else {
          alert('Conversion failed!');
        }
      }, delay);
    })
    .catch(() => {
      loader.style.display = 'none';
      convertBtn.disabled = false;
      alert('Error during conversion.');
    });
});
