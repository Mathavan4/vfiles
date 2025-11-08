// Toggle password visibility
const togglePassword = document.querySelector('#togglePassword');
const password = document.querySelector('#password');
togglePassword.addEventListener('click', () => {
  const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
  password.setAttribute('type', type);
  togglePassword.classList.toggle('fa-eye-slash');
});

// Reset form show/hide
const showReset = document.querySelector('#showReset');
const backLogin = document.querySelector('#backLogin');
const loginForm = document.querySelector('#loginForm');
const resetForm = document.querySelector('#resetForm');

showReset.addEventListener('click', () => {
  loginForm.style.display = 'none';
  resetForm.style.display = 'block';
});

backLogin.addEventListener('click', () => {
  resetForm.style.display = 'none';
  loginForm.style.display = 'block';
});

// Password visibility toggle for reset
const toggleNewPassword = document.querySelector('#toggleNewPassword');
const newPassword = document.querySelector('#newPassword');
toggleNewPassword.addEventListener('click', () => {
  const type = newPassword.getAttribute('type') === 'password' ? 'text' : 'password';
  newPassword.setAttribute('type', type);
  toggleNewPassword.classList.toggle('fa-eye-slash');
});

const toggleConfirmPassword = document.querySelector('#toggleConfirmPassword');
const confirmPassword = document.querySelector('#confirmPassword');
toggleConfirmPassword.addEventListener('click', () => {
  const type = confirmPassword.getAttribute('type') === 'password' ? 'text' : 'password';
  confirmPassword.setAttribute('type', type);
  toggleConfirmPassword.classList.toggle('fa-eye-slash');
});
