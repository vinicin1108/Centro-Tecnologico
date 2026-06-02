// helper snippet for docente cards - inserted into app.js
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
