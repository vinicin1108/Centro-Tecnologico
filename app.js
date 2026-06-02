const burgerBtn = document.getElementById('burgerBtn');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const introScreen = document.getElementById('introScreen');
const darkModeBtn = document.getElementById('darkModeBtn');
const courseGrid = document.getElementById('courseGrid');
const filterTabs = document.querySelectorAll('.filter-tab');
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const readingProgress = document.getElementById('readingProgress');

const introPhrases = [
  'Tecnologia aplicada à educação.',
  'Projetos reais, laboratórios modernos.',
  'ADS com prática e inclusão digital.'
];
let introIndex = 0;
let charIndex = 0;
let typingTimer;

function typeIntro() {
  const target = document.getElementById('typingText');
  if (!target) return;

  const phrase = introPhrases[introIndex];
  target.textContent = phrase.slice(0, charIndex);
  charIndex += 1;

  if (charIndex > phrase.length) {
    charIndex = 0;
    introIndex = (introIndex + 1) % introPhrases.length;
    typingTimer = setTimeout(typeIntro, 1500);
  } else {
    typingTimer = setTimeout(typeIntro, 80);
  }
}

typeIntro();

function toggleSidebar() {
  if (!sidebar || !sidebarOverlay) return;
  const isOpen = sidebar.classList.toggle('open');
  sidebarOverlay.classList.toggle('open', isOpen);
}

function hideSidebar() {
  if (!sidebar || !sidebarOverlay) return;
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('open');
}

const sections = document.querySelectorAll('.main-content section');

function showSection(id) {
  sections.forEach((section) => {
    section.classList.toggle('hidden-section', section.id !== id);
  });
}

function handleHash() {
  const hash = window.location.hash.replace('#', '') || 'home';
  const targetSection = document.getElementById(hash) || document.getElementById('home');
  if (!targetSection) return;
  showSection(targetSection.id);
  targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function scrollToSection(id) {
  const section = document.getElementById(id);
  if (!section) return;
  showSection(id);
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

if (burgerBtn) {
  burgerBtn.addEventListener('click', toggleSidebar);
}

if (sidebarOverlay) {
  sidebarOverlay.addEventListener('click', hideSidebar);
}

if (sidebar) {
  sidebar.querySelectorAll('.sidebar-link').forEach((link) => {
    link.addEventListener('click', hideSidebar);
  });
}

filterTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    filterTabs.forEach((button) => button.classList.remove('active'));
    tab.classList.add('active');

    const selected = tab.dataset.filter;
    courseGrid.querySelectorAll('.course-card').forEach((card) => {
      const shouldShow = selected === 'all' || card.dataset.category === selected;
      card.style.display = shouldShow ? 'grid' : 'none';
    });
  });
});

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = contactForm.querySelector('#name');
    const email = contactForm.querySelector('#email');
    const message = contactForm.querySelector('#message');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
      formStatus.textContent = 'Por favor, preencha todos os campos.';
      formStatus.style.color = '#bb1c1c';
      return;
    }

    if (!emailPattern.test(email.value.trim())) {
      formStatus.textContent = 'Por favor, informe um e-mail válido.';
      formStatus.style.color = '#bb1c1c';
      return;
    }

    formStatus.textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
    formStatus.style.color = '#0f243f';
    contactForm.reset();
  });
}

function updateReadingProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  readingProgress.style.width = `${progress}%`;
}

window.addEventListener('scroll', updateReadingProgress);
updateReadingProgress();

function initAnchorScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      if (!targetSection) return;
      event.preventDefault();
      hideSidebar();
      window.location.hash = targetId;
    });
  });
}

initAnchorScroll();
window.addEventListener('hashchange', handleHash);

function hideIntro() {
  if (!introScreen) return;
  introScreen.classList.add('hidden');
  clearTimeout(typingTimer);
}

if (introScreen) {
  window.hideIntro = hideIntro;
}

if (darkModeBtn) {
  darkModeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });
}

handleHash();

// A) Apply reveal-hidden to all main sections (automatic)
document.querySelectorAll('main .section, main .hero-section').forEach(el => {
  if (!el.classList.contains('reveal-hidden')) el.classList.add('reveal-hidden');
});

/* ----------------------
   Reveal on scroll
   ---------------------- */
const revealElements = document.querySelectorAll('.reveal-hidden');
if (revealElements.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(el => revealObserver.observe(el));
}

// C) Magnetic buttons and refined hover-lift
const magneticButtons = document.querySelectorAll('.magnetic-btn');
magneticButtons.forEach(btn => {
  btn.style.transition = 'transform 220ms ease, box-shadow 220ms ease';
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    const amtX = (relX / rect.width) * 16; // max 16px
    const amtY = (relY / rect.height) * 8; // max 8px
    btn.style.transform = `translate3d(${amtX}px, ${amtY}px, 0) scale(1.02)`;
    btn.style.boxShadow = '0 18px 40px rgba(2,6,23,0.18)';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.boxShadow = '';
  });
});

// Refine hover-lift for elements with .hover-lift
document.querySelectorAll('.hover-lift').forEach(el => {
  el.style.transition = 'transform 260ms cubic-bezier(.2,.9,.2,1), box-shadow 260ms ease';
  el.addEventListener('mouseenter', () => {
    el.style.transform = 'translateY(-10px)';
    el.style.boxShadow = '0 20px 50px rgba(2,6,23,0.12)';
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
    el.style.boxShadow = '';
  });
});

/* ----------------------
   Scroll spy for nav
   ---------------------- */
const navLinks = document.querySelectorAll('.main-nav a');
const pageSections = Array.from(document.querySelectorAll('main .section, main .hero-section'))
  .filter(s => s.id);

function updateActiveNav() {
  const offset = 140; // header offset
  const scrollPos = window.scrollY + offset;
  let currentId = 'home';
  for (let i = 0; i < pageSections.length; i++) {
    const sec = pageSections[i];
    const top = sec.offsetTop;
    if (scrollPos >= top) currentId = sec.id;
  }
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${currentId}`);
  });
}

window.addEventListener('scroll', () => {
  updateActiveNav();
});
updateActiveNav();

// Docente cards: toggle expand/collapse on click or keyboard
(function setupDocenteCards(){
  const cards = document.querySelectorAll('.docente-card');
  if (!cards.length) return;

  function closeAll(except) {
    cards.forEach(c => {
      if (c !== except) {
        c.setAttribute('aria-expanded', 'false');
        const more = c.querySelector('.doc-more');
        if (more) more.setAttribute('aria-hidden', 'true');
      }
    });
  }

  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      const expanded = card.getAttribute('aria-expanded') === 'true';
      if (!expanded) closeAll(card);
      card.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      const more = card.querySelector('.doc-more');
      if (more) more.setAttribute('aria-hidden', expanded ? 'true' : 'false');
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
      if (e.key === 'Escape') {
        card.setAttribute('aria-expanded', 'false');
        const more = card.querySelector('.doc-more');
        if (more) more.setAttribute('aria-hidden', 'true');
      }
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.docente-card')) {
      closeAll();
    }
  });
})();
