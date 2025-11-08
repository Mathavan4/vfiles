// Show PDF preview & handle remove
  const fileInput = document.getElementById('id_pdf_file');
  const preview = document.getElementById('preview');
  const pdfPreview = document.getElementById('pdfPreview');
  const removeBtn = document.getElementById('removeFile');

  fileInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file && file.type === 'application/pdf') {
      const url = URL.createObjectURL(file);
      pdfPreview.src = url + "#toolbar=0";
      preview.classList.remove('hidden');
    }
  });

  removeBtn.addEventListener('click', function() {
    fileInput.value = '';
    pdfPreview.src = '';
    preview.classList.add('hidden');
  });