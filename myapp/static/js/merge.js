document.addEventListener('DOMContentLoaded', function() {
  const mergeForm = document.getElementById('mergeForm');
  const overlay = document.getElementById('loadingOverlay');

  if (mergeForm) {
    mergeForm.addEventListener('submit', function() {
      overlay.style.display = 'flex';  // show spinner
    });
  }
});