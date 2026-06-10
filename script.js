/* ============================================================
   LOADING SCREEN
   ============================================================ */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loading-screen').classList.add('hidden');
    document.body.style.overflow = '';
  }, 2200);
});
document.body.style.overflow = 'hidden';

/* ============================================================
   THEME TOGGLE
   ============================================================ */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const body = document.body;

function applyTheme(mode) {
  if (mode === 'dark') {
    body.classList.remove('light-mode');
    body.classList.add('dark-mode');
    themeIcon.className = 'fas fa-sun';
  } else {
    body.classList.remove('dark-mode');
    body.classList.add('light-mode');
    themeIcon.className = 'fas fa-moon';
  }
}

const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const isDark = body.classList.contains('dark-mode');
  const newTheme = isDark ? 'light' : 'dark';
  applyTheme(newTheme);
  localStorage.setItem('theme', newTheme);
});

/* ============================================================
   NAVBAR — scroll + mobile toggle + active link
   ============================================================ */
const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
const allNavLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
  updateScrollProgress();
  updateBackToTop();
  updateActiveNavLink();
});

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close mobile menu on link click
allNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) current = section.id;
  });
  allNavLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

/* ============================================================
   SCROLL PROGRESS BAR
   ============================================================ */
function updateScrollProgress() {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const pct = (window.scrollY / total) * 100;
  document.getElementById('scroll-progress').style.width = pct + '%';
}

/* ============================================================
   BACK TO TOP
   ============================================================ */
const backToTop = document.getElementById('back-to-top');

function updateBackToTop() {
  backToTop.classList.toggle('visible', window.scrollY > 400);
}

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================================
   HERO PARTICLES
   ============================================================ */
(function initParticles() {
  const container = document.getElementById('hero-particles');
  const count = 35;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 4 + 2;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const dur = Math.random() * 10 + 8;
    const delay = Math.random() * 5;
    p.style.cssText = `
      position:absolute;
      width:${size}px; height:${size}px;
      border-radius:50%;
      background:rgba(200,169,110,${Math.random() * 0.4 + 0.1});
      left:${x}%; top:${y}%;
      animation: floatParticle ${dur}s ease-in-out ${delay}s infinite;
      pointer-events:none;
    `;
    container.appendChild(p);
  }
  const style = document.createElement('style');
  style.textContent = `
    @keyframes floatParticle {
      0%,100% { transform: translateY(0) scale(1); opacity:0.6; }
      50% { transform: translateY(-40px) scale(1.2); opacity:1; }
    }
  `;
  document.head.appendChild(style);
})();

/* ============================================================
   STAT COUNTERS
   ============================================================ */
let countersStarted = false;

function startCounters() {
  if (countersStarted) return;
  countersStarted = true;
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = +el.dataset.target;
    const dur = 2000;
    const step = target / (dur / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current);
    }, 16);
  });
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

// Trigger counters when hero stats visible
const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) { startCounters(); statsObserver.disconnect(); }
  }, { threshold: 0.5 });
  statsObserver.observe(heroStats);
}

/* ============================================================
   BOOKING MODAL
   ============================================================ */
const bookingModal = document.getElementById('booking-modal');
const bookingForm = document.getElementById('booking-form');
const formView = document.getElementById('modal-form-view');
const successView = document.getElementById('modal-success-view');
const sessionSelect = document.getElementById('session-type');

function openBooking(sessionType) {
  // Reset to form view
  formView.classList.remove('hidden');
  successView.classList.add('hidden');
  bookingForm.reset();
  clearErrors();

  // Pre-select session if provided
  if (sessionType && sessionSelect) {
    sessionSelect.value = sessionType;
  }

  bookingModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeBooking() {
  bookingModal.classList.remove('active');
  document.body.style.overflow = '';
}

// Close on overlay click
bookingModal.addEventListener('click', (e) => {
  if (e.target === bookingModal) closeBooking();
});

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && bookingModal.classList.contains('active')) closeBooking();
});

/* Validation */
function clearErrors() {
  document.querySelectorAll('.field-error').forEach(el => el.textContent = '');
  document.querySelectorAll('.form-group input, .form-group select').forEach(el => el.classList.remove('error'));
}

function validateBooking() {
  let valid = true;
  const name = document.getElementById('full-name');
  const phone = document.getElementById('phone');
  const session = document.getElementById('session-type');

  clearErrors();

  if (!name.value.trim()) {
    document.getElementById('err-name').textContent = 'الرجاء إدخال اسمك الكامل';
    name.classList.add('error'); valid = false;
  }
  if (!phone.value.trim()) {
    document.getElementById('err-phone').textContent = 'الرجاء إدخال رقم هاتفك';
    phone.classList.add('error'); valid = false;
  } else if (!/^[\d\s\+\-\(\)]{7,}$/.test(phone.value.trim())) {
    document.getElementById('err-phone').textContent = 'رقم الهاتف غير صحيح';
    phone.classList.add('error'); valid = false;
  }
  if (!session.value) {
    document.getElementById('err-session').textContent = 'الرجاء اختيار نوع الجلسة';
    session.classList.add('error'); valid = false;
  }

  return valid;
}

function submitBooking(e) {
  e.preventDefault();
  if (!validateBooking()) return;

  const btn = bookingForm.querySelector('.btn-submit');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';

  const name = document.getElementById('full-name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const session = document.getElementById('session-type').value;

  const message =
    `مرحباً، أود حجز جلسة 📅\n` +
    `الاسم: ${name}\n` +
    `رقم الهاتف: ${phone}\n` +
    `نوع الجلسة: ${session}`;

  const waURL = `https://wa.me/201270192689?text=${encodeURIComponent(message)}`;

  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane"></i> تأكيد الحجز';
    formView.classList.add('hidden');
    successView.classList.remove('hidden');
    window.open(waURL, '_blank');
  }, 1000);
}

/* ============================================================
   LIGHTBOX
   ============================================================ */
const lightbox = document.getElementById('lightbox');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxImg = document.getElementById('lightbox-img');

function openLightbox(src, title) {
  lightboxImg.src = src;
  lightboxImg.alt = title;
  lightboxTitle.textContent = title;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
});

/* ============================================================
   BUTTON RIPPLE EFFECT
   ============================================================ */
document.querySelectorAll('.btn-primary, .btn-pkg, .btn-submit').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      position:absolute; border-radius:50%;
      width:${size}px; height:${size}px;
      left:${e.clientX - rect.left - size/2}px;
      top:${e.clientY - rect.top - size/2}px;
      background:rgba(255,255,255,0.3);
      transform:scale(0); animation: rippleAnim 0.5s ease-out forwards;
      pointer-events:none;
    `;
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes rippleAnim {
    to { transform: scale(2.5); opacity: 0; }
  }
`;
document.head.appendChild(rippleStyle);
