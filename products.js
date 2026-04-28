// Prepaid dropdown
const prepaidBtn = document.getElementById('prepaidBtn');
const prepaidMenu = document.getElementById('prepaidMenu');

prepaidBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const open = prepaidMenu.classList.toggle('open');
  prepaidBtn.setAttribute('aria-expanded', open);
});

document.addEventListener('click', () => {
  prepaidMenu.classList.remove('open');
  prepaidBtn.setAttribute('aria-expanded', false);
});

// Hamburger menu
const navHamburger = document.getElementById('navHamburger');
const navLinks = document.querySelector('.nav-links');

navHamburger.addEventListener('click', (e) => {
  e.stopPropagation();
  const open = navLinks.classList.toggle('open');
  navHamburger.setAttribute('aria-expanded', open);
});

document.addEventListener('click', (e) => {
  if (navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      e.target !== navHamburger) {
    navLinks.classList.remove('open');
    navHamburger.setAttribute('aria-expanded', false);
  }
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navHamburger.setAttribute('aria-expanded', false);
  });
});
