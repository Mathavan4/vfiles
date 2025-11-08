// Dropdown toggle for "All PDF Tools"
const toolsBtn = document.getElementById('tools-btn');
const toolsDropdown = document.getElementById('tools-dropdown');
toolsBtn.addEventListener('click', () => {
  toolsDropdown.classList.toggle('active');
  if (toolsDropdown.style.display === 'flex') {
    toolsDropdown.style.display = 'none';
  } else {
    toolsDropdown.style.display = 'flex';
  }
});

// Hamburger menu toggle for mobile
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});
