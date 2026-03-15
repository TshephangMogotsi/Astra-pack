// Tab switching
const tabs = document.querySelectorAll('.prod-tab');
const panels = document.querySelectorAll('.prod-panel');

function activateTab(type) {
  tabs.forEach(t => {
    t.setAttribute('aria-selected', t.id === 'tab-' + type);
  });
  panels.forEach(p => {
    p.hidden = p.id !== 'panel-' + type;
  });
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const type = tab.id.replace('tab-', '');
    activateTab(type);
    history.replaceState(null, '', '?type=' + type);
  });
});

// Read URL param on load — default to "all"
const params = new URLSearchParams(window.location.search);
const typeParam = params.get('type');
if (typeParam === 'water' || typeParam === 'electricity') {
  activateTab(typeParam);
} else {
  activateTab('all');
}

// Prepaid dropdown
const prepaidBtn = document.getElementById('prepaidBtn');
const prepaidMenu = document.getElementById('prepaidMenu');

prepaidBtn.addEventListener('click', () => {
  const open = prepaidMenu.classList.toggle('open');
  prepaidBtn.setAttribute('aria-expanded', open);
});

document.addEventListener('click', e => {
  if (!prepaidBtn.contains(e.target) && !prepaidMenu.contains(e.target)) {
    prepaidMenu.classList.remove('open');
    prepaidBtn.setAttribute('aria-expanded', false);
  }
});
