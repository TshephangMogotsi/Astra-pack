// ── TYPEWRITER SETUP ──
const h1 = document.querySelector('.hero-heading h1');
const cursor = document.createElement('span');
cursor.className = 'type-cursor';
cursor.textContent = '|';
h1.innerHTML = '';
h1.appendChild(cursor);

const headlines = [
  ['Intelligent Systems for', 'Modern Industry'],
  ['Smart Energy for',        'Every Community'],
  ['Automation That',         'Drives Results'],
];

const paragraphs = [
  'The global energy landscape is shifting rapidly. Astrapack harnesses digital infrastructure to connect millions of households and businesses to reliable, prepaid electricity — reducing costs, eliminating barriers, and empowering remote communities.',
  'We deliver reliable prepaid energy solutions that reach households and businesses across Botswana — making electricity accessible, affordable, and easy to manage for every community, no matter how remote.',
  'From industrial control systems to smart building installations, our automation solutions streamline operations, cut costs, and give decision-makers the real-time insight they need to stay ahead.',
];

const heroParagraph = document.querySelector('.hero-desc p');
const heroDesc     = document.querySelector('.hero-desc');

// Declared early so lockDescHeight() can reference it safely
let current = 0;

function lockDescHeight() {
  heroDesc.style.minHeight = '';
  let maxH = 0;
  paragraphs.forEach(text => {
    heroParagraph.textContent = text;
    maxH = Math.max(maxH, heroDesc.offsetHeight);
  });
  heroDesc.style.minHeight = maxH + 'px';
  heroParagraph.textContent = paragraphs[current];
}

lockDescHeight();
window.addEventListener('resize', lockDescHeight);

// Incremented on every goTo() to cancel in-flight steps
let generation = 0;

function clearHeadline() {
  Array.from(h1.childNodes).filter(n => n !== cursor).forEach(n => n.remove());
}


function typeLines(lines, onDone) {
  const gen = generation;
  let lineIdx = 0, charIdx = 0;
  function step() {
    if (generation !== gen) return;
    if (lineIdx >= lines.length) { if (onDone) onDone(); return; }
    const line = lines[lineIdx];
    if (charIdx < line.length) {
      cursor.insertAdjacentText('beforebegin', line[charIdx]);
      charIdx++;
      setTimeout(step, 55);
    } else {
      lineIdx++;
      charIdx = 0;
      if (lineIdx < lines.length) {
        cursor.insertAdjacentElement('beforebegin', document.createElement('br'));
        setTimeout(step, 55);
      } else {
        if (onDone) onDone();
      }
    }
  }
  step();
}

// Type initial headline on load
setTimeout(() => typeLines(headlines[0]), 400);

// ── SLIDER ──
const slides = [
  { box1: "url('images/slide 1.jpg')",   box2: "url('images/slide 1-2.jpg')" },
  { box1: "url('images/slide 2.jpg')",   box2: "url('images/slide 2-2.jpg')" },
  { box1: "url('images/slide 3.jpg')",   box2: "url('images/slide 3-2.jpg')" },
];

let animating = false;
let flip = false;
const box1 = document.getElementById('heroBox1');
const box2 = document.getElementById('heroBox2');
const ov1  = document.getElementById('overlay1');
const ov2  = document.getElementById('overlay2');
const DURATION = 700;

function applySlide(index) {
  const { box1: c1, box2: c2 } = slides[index];
  const ov1From = flip ? '100%' : '-100%';
  const ov2From = flip ? '-100%' : '100%';

  ov1.style.transition = 'none';
  ov2.style.transition = 'none';
  ov1.style.transform = `translateY(${ov1From})`;
  ov2.style.transform = `translateY(${ov2From})`;
  ov1.style.backgroundImage = c1;
  ov2.style.backgroundImage = c2;

  requestAnimationFrame(() => requestAnimationFrame(() => {
    ov1.style.transition = '';
    ov2.style.transition = '';
    ov1.style.transform = 'translateY(0)';
    ov2.style.transform = 'translateY(0)';

    setTimeout(() => {
      box1.style.backgroundImage = c1;
      box2.style.backgroundImage = c2;

      ov1.style.transition = 'none';
      ov2.style.transition = 'none';
      ov1.style.transform = `translateY(${ov1From})`;
      ov2.style.transform = `translateY(${ov2From})`;

      requestAnimationFrame(() => requestAnimationFrame(() => {
        ov1.style.transition = '';
        ov2.style.transition = '';
      }));
    }, DURATION);
  }));

  flip = !flip;
}

function setHeadlineInstant(index) {
  clearHeadline();
  headlines[index].forEach((line, i) => {
    cursor.insertAdjacentText('beforebegin', line);
    if (i < headlines[index].length - 1) {
      cursor.insertAdjacentElement('beforebegin', document.createElement('br'));
    }
  });
  heroParagraph.textContent = paragraphs[index];
}

function goTo(index, manual = false) {
  if (!manual && animating) return; // auto respects the lock; manual always proceeds
  generation++;  // cancels any in-flight erase/type
  current = index;

  if (manual) {
    animating = false;
    setHeadlineInstant(index); // no text animation at all
    applySlide(index);
  } else {
    animating = true;
    clearHeadline();
    heroParagraph.textContent = paragraphs[index];
    applySlide(index);
    typeLines(headlines[index], () => { animating = false; });
  }
}

function next(manual = false) { goTo((current + 1) % slides.length, manual); }
function prev(manual = false) { goTo((current - 1 + slides.length) % slides.length, manual); }

let timer = setInterval(() => next(false), 8000);
function resetTimer() { clearInterval(timer); timer = setInterval(() => next(false), 8000); }

document.getElementById('nextBtn').addEventListener('click', () => { next(true); resetTimer(); });
document.getElementById('prevBtn').addEventListener('click', () => { prev(true); resetTimer(); });

// ── PREPAID DROPDOWN ──
const prepaidBtn  = document.getElementById('prepaidBtn');
const prepaidWrap = prepaidBtn.closest('.prepaid-dropdown');

prepaidBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const open = prepaidWrap.classList.toggle('open');
  prepaidBtn.setAttribute('aria-expanded', open);
});

document.addEventListener('click', () => {
  prepaidWrap.classList.remove('open');
  prepaidBtn.setAttribute('aria-expanded', false);
});

// ── PREPAID MODAL ──
const overlay      = document.getElementById('prepaidOverlay');
const modalTitle   = document.getElementById('prepaidModalTitle');
const modalHeader  = document.getElementById('prepaidModalHeader');
const step1        = document.getElementById('prepaidStep1');
const step2        = document.getElementById('prepaidStep2');
const step3        = document.getElementById('prepaidStep3');
const step4        = document.getElementById('prepaidStep4');
const verifyBtn    = document.getElementById('prepaidVerifyBtn');
const proceedBtn   = document.getElementById('prepaidProceedBtn');
const prepaidError = document.getElementById('prepaidError');

// Mock meter database
const meterDB = {
  '888000111222': { name: 'JOHN DOE' },
  '100200300400': { name: 'JANE SMITH' },
};

let currentUtility = 'Electricity (Prepaid)';
let currentColor   = '#0A6EBD';

function openModal(isWater) {
  currentUtility = isWater ? 'Water (Prepaid)' : 'Electricity (Prepaid)';
  currentColor   = isWater ? '#1b6275' : '#0A6EBD';
  modalTitle.textContent = isWater ? 'Buy Prepaid Water' : 'Buy Prepaid Electricity';
  modalHeader.style.background = currentColor;
  verifyBtn.style.background   = currentColor;
  proceedBtn.style.background  = currentColor;
  // reset to step 1
  step1.style.display = '';
  step2.style.display = 'none';
  step3.style.display = 'none';
  step4.style.display = 'none';
  document.getElementById('meterNumber').value = '';
  document.getElementById('meterPhone').value  = '';
  document.getElementById('meterEmail').value  = '';
  prepaidError.textContent = '';
  overlay.classList.add('open');
}

document.querySelectorAll('.prepaid-option').forEach((option, i) => {
  option.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(i === 1);
    prepaidWrap.classList.remove('open');
  });
});

verifyBtn.addEventListener('click', () => {
  const meter = document.getElementById('meterNumber').value.trim();
  const customer = meterDB[meter];
  if (!customer) {
    prepaidError.textContent = 'Meter number not found. Please check and try again.';
    return;
  }
  prepaidError.textContent = '';
  document.getElementById('confirmName').textContent    = customer.name;
  document.getElementById('confirmMeter').textContent   = meter;
  document.getElementById('confirmUtility').textContent = currentUtility;
  document.getElementById('rechargeAmount').value = '';
  document.querySelectorAll('.prepaid-quick-btn').forEach(b => b.classList.remove('active'));
  modalTitle.textContent = 'Confirm & Select Amount';
  step1.style.display = 'none';
  step2.style.display = '';
});

// Quick recharge buttons
document.querySelectorAll('.prepaid-quick-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.prepaid-quick-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('rechargeAmount').value = btn.dataset.amount;
  });
});

// Proceed to card details
proceedBtn.addEventListener('click', () => {
  const amount = document.getElementById('rechargeAmount').value;
  if (!amount || Number(amount) < 20) {
    alert('Please enter a minimum recharge amount of P20.');
    return;
  }
  const meter   = document.getElementById('confirmMeter').textContent;
  const isWater = currentUtility.startsWith('Water');
  const icon    = isWater ? '💧' : '⚡';
  const label   = isWater ? 'Water' : 'Electricity';
  document.getElementById('payUtilityIcon').textContent = icon;
  document.getElementById('payDetail').textContent = `${label} · Meter ${meter}`;
  document.getElementById('payAmount').textContent  = `P${amount}`;
  document.getElementById('payAmount').style.color  = currentColor;
  document.getElementById('prepaidPayBtn').style.background = currentColor;
  modalTitle.textContent = 'Card Details';
  step2.style.display = 'none';
  step3.style.display = '';
});

// Back from card to amount
document.getElementById('prepaidBackBtn').addEventListener('click', () => {
  modalTitle.textContent = 'Confirm & Select Amount';
  step3.style.display = 'none';
  step2.style.display = '';
});

// Pay Now → success screen
document.getElementById('prepaidPayBtn').addEventListener('click', () => {
  const amount  = document.getElementById('payAmount').textContent;
  const utility = document.getElementById('payDetail').textContent;
  const email   = document.getElementById('meterEmail').value || 'your email';

  // Generate a random 20-digit token split into groups of 4
  const token = Array.from({length: 5}, () =>
    Math.floor(1000 + Math.random() * 9000)).join(' ');

  document.getElementById('prepaidToken').textContent      = token;
  document.getElementById('successEmail').textContent      = email;
  document.getElementById('prepaidSuccessSub').textContent = `${utility} · ${amount}`;
  document.getElementById('prepaidSuccessIcon').style.background = currentColor;
  document.getElementById('prepaidToken').style.color      = currentColor;
  modalTitle.textContent = 'Payment Successful';
  modalHeader.style.background = currentColor;
  step3.style.display = 'none';
  step4.style.display = '';
});

// Copy token
document.getElementById('prepaidCopyBtn').addEventListener('click', () => {
  const token = document.getElementById('prepaidToken').textContent;
  navigator.clipboard.writeText(token.replace(/\s/g, '')).then(() => {
    const label = document.getElementById('copyLabel');
    label.textContent = 'Copied!';
    setTimeout(() => label.textContent = 'Copy token', 2000);
  });
});

// Done button closes modal
document.getElementById('prepaidDoneBtn').addEventListener('click', () => {
  overlay.classList.remove('open');
});

// Format card number with spaces
document.getElementById('cardNumber').addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
});

// Format expiry MM / YY
document.getElementById('cardExpiry').addEventListener('input', (e) => {
  let v = e.target.value.replace(/\D/g, '');
  if (v.length >= 3) v = v.slice(0,2) + ' / ' + v.slice(2,4);
  e.target.value = v;
});

document.getElementById('prepaidModalClose').addEventListener('click', () => {
  overlay.classList.remove('open');
});

overlay.addEventListener('click', (e) => {
  if (e.target === overlay) overlay.classList.remove('open');
});
