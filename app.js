const burgerBtn = document.getElementById('burgerBtn');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const introScreen = document.getElementById('introScreen');
// const darkModeBtn = document.getElementById('darkModeBtn');
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

const isIntroDisabled = document.body && document.body.classList.contains('page-interna');
if (!isIntroDisabled) {
  typeIntro();
}


function setSidebarA11y(isOpen) {
  if (!sidebar) return;
  sidebar.setAttribute('aria-hidden', String(!isOpen));
}

function toggleSidebar() {
  if (!sidebar || !sidebarOverlay) return;
  const isOpen = sidebar.classList.toggle('open');
  sidebar.classList.toggle('closed', !isOpen);
  sidebarOverlay.classList.toggle('open', isOpen);
  setSidebarA11y(isOpen);
}

function hideSidebar() {
  if (!sidebar || !sidebarOverlay) return;
  sidebar.classList.remove('open');
  sidebar.classList.add('closed');
  sidebarOverlay.classList.remove('open');
  setSidebarA11y(false);
  if (burgerBtn) burgerBtn.setAttribute('aria-expanded', 'false');
}

const isIndexPage = (() => {
  const p = window.location.pathname;
  return p.endsWith('/index.html') || p === '/' || p.endsWith('/Centro-Tecnologico/index.html');
})();

const sections = isIndexPage
  ? document.querySelectorAll('.main-content section')
  : [];

function showSection(id) {
  if (!sections || !sections.length) return;
  sections.forEach((section) => {
    const hide = section.id !== id && section.id !== '' && section.id !== 'destaques';
    section.classList.toggle('hidden-section', hide);
  });
}


function handleHash() {
  if (!isIndexPage) return;

  const hash = window.location.hash.replace('#', '') || 'home';
  const targetSection = document.getElementById(hash) || document.getElementById('home');
  if (!targetSection) return;

  showSection(targetSection.id);
  targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function scrollToSection(id) {
  if (!isIndexPage) return;
  const section = document.getElementById(id);
  if (!section) return;
  showSection(id);
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}


if (burgerBtn) {
  burgerBtn.addEventListener('click', () => {
    toggleSidebar();
    if (!sidebar || !burgerBtn) return;
    const isOpen = sidebar.classList.contains('open');
    burgerBtn.setAttribute('aria-expanded', String(isOpen));
  });

  // ensure initial state
  if (sidebar) burgerBtn.setAttribute('aria-expanded', String(sidebar.classList.contains('open')));
}

if (sidebarOverlay) {
  sidebarOverlay.addEventListener('click', hideSidebar);
}

if (sidebar) {
  sidebar.querySelectorAll('.sidebar-link').forEach((link) => {
    link.addEventListener('click', () => {
      setTimeout(hideSidebar, 0);
    });
  });
}

// Close button inside sidebar (mobile fullscreen header)
const sidebarCloseBtn = document.querySelector('.sidebar-close');
if (sidebarCloseBtn) {
  sidebarCloseBtn.addEventListener('click', (e) => {
    e.preventDefault();
    hideSidebar();
  });
}

if (courseGrid && filterTabs.length) {
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
}


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
  if (!readingProgress) return;
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  readingProgress.style.width = `${progress}%`;
}

window.addEventListener('scroll', updateReadingProgress);
updateReadingProgress();


function initAnchorScroll() {
  // Somente aplica comportamento customizado quando estamos no index (modo de navegação por seções).
  if (!isIndexPage) return;

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    // Não trate links cujo destino não está na página atual
    // (ex.: href="#alguma-coisa" que não exista) ou links vazios.
    const href = link.getAttribute('href') || '';
    if (!href || href === '#') return;

    // Exclui links que apontem explicitamente para outra página.
    if (href.endsWith('.html')) return;

    link.addEventListener('click', (event) => {
      const targetId = href.substring(1);
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

if (introScreen && !isIntroDisabled) {
  window.hideIntro = hideIntro;
}


// dark mode removido (botão ocultado no header)
/* if (darkModeBtn) {
  darkModeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  });
} */

handleHash();

// Em páginas diferentes do index, não aplicamos showSection/hidden-section.
// Isso evita quebra visual no GitHub Pages quando a página é standalone (ex.: institucional.html).

// A) Apply reveal-hidden to all main sections (automatic)
document.querySelectorAll('main .section, main .hero-section').forEach((el) => {
  if (!el.classList.contains('reveal-hidden')) el.classList.add('reveal-hidden');
});


/* ----------------------
   Reveal on scroll
   ---------------------- */
const revealElements = document.querySelectorAll('.reveal-hidden');
if (revealElements.length) {
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((el) => revealObserver.observe(el));

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

/* ================================================================
   AGENDA DINÂMICA â€” eventos por mês
   (aplica somente quando a página possuir #agendaGrid)
   ================================================================ */

var AGENDA_MES_INICIAL = 1;
var AGENDA_MESES = ['Maio 2026','Junho 2026','Julho 2026'];
var AGENDA_EVENTOS = {
  'Maio 2026': [
    { dia:'10', mes:'Mai', destaque:false, titulo:'Semana acadêmica', info:'09:00 • Auditório central' }
  ],
  'Junho 2026': [
    { dia:'01', mes:'Jun', destaque:false, titulo:'Prazo final — relatório de estágio', info:'' },
    { dia:'04', mes:'Jun', destaque:true,  titulo:'Corpus Christi — aulas suspensas', info:'04 a 06 Jun' },
    { dia:'15', mes:'Jun', destaque:false, titulo:'Prazo final — lançamento de notas', info:'' },
    { dia:'20', mes:'Jun', destaque:false, titulo:'Fim do período letivo', info:'' },
    { dia:'22', mes:'Jun', destaque:false, titulo:'Exames finais', info:'' },
    { dia:'23', mes:'Jun', destaque:false, titulo:'Exames finais', info:'' },
    { dia:'24', mes:'Jun', destaque:false, titulo:'Exames finais', info:'' },
    { dia:'25', mes:'Jun', destaque:false, titulo:'Exames finais', info:'' }
  ],
  'Julho 2026': [
    { dia:'01', mes:'Jul', destaque:false, titulo:'Início do recesso acadêmico', info:'' }
  ]
};

function agendaRenderMes(indice) {
  var nomeMes = AGENDA_MESES[indice];
  var lista = AGENDA_EVENTOS[nomeMes] || [];

  var grid = document.getElementById('agendaGrid');
  var titulo = document.getElementById('agendaMesTitulo');
  var btnAnt = document.getElementById('agendaBtnAnterior');
  var btnProx = document.getElementById('agendaBtnProximo');

  if (titulo) titulo.textContent = nomeMes;
  if (btnAnt) btnAnt.disabled = (indice === 0);
  if (btnProx) btnProx.disabled = (indice === AGENDA_MESES.length - 1);

  if (!grid) return;

  if (!lista.length) {
    grid.innerHTML = '<p class="agenda-vazia">Nenhum evento neste mês.</p>';
    return;
  }

  grid.innerHTML = lista.map(function (e) {
    var destaqueClass = e.destaque ? ' destaque' : '';
    var infoHtml = e.info ? '<p>' + e.info + '</p>' : '';

    return (
      '<div class="agenda-card' + destaqueClass + '">' +
        '<span class="agenda-data">' + e.dia + ' ' + e.mes + '</span>' +
        '<h3>' + e.titulo + '</h3>' +
        infoHtml +
      '</div>'
    );
  }).join('');
}

function initAgenda() {
  if (!document.getElementById('agendaGrid')) return;

  var mesAtual = AGENDA_MES_INICIAL;
  agendaRenderMes(mesAtual);

  var btnAnt = document.getElementById('agendaBtnAnterior');
  if (btnAnt) {
    btnAnt.addEventListener('click', function () {
      if (mesAtual > 0) {
        mesAtual -= 1;
        agendaRenderMes(mesAtual);
      }
    });
  }

  var btnProx = document.getElementById('agendaBtnProximo');
  if (btnProx) {
    btnProx.addEventListener('click', function () {
      if (mesAtual < AGENDA_MESES.length - 1) {
        mesAtual += 1;
        agendaRenderMes(mesAtual);
      }
    });
  }
}

initAgenda();
