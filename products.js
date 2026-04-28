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
