(() => {
  const hydrateLogos = async () => {
    const logos = [...document.querySelectorAll('img[data-zad-logo]')];
    if (!logos.length) return;
    try {
      const response = await fetch('../assets/zad-logo.webp.b64.txt', { cache: 'force-cache' });
      if (!response.ok) throw new Error('logo');
      const base64 = (await response.text()).replace(/\s+/g, '');
      const source = `data:image/webp;base64,${base64}`;
      logos.forEach(img => img.src = source);
    } catch {
      logos.forEach(img => {
        img.style.display = 'none';
        img.closest('.brand,.footer-brand,.intro-brand,.assistant-head')?.classList.add('logo-fallback');
      });
    }
  };
  hydrateLogos();
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const intro = document.getElementById('intro');
  const introSkip = document.getElementById('introSkip');
  const endIntro = () => {
    if (!intro) return;
    intro.classList.add('is-gone');
    document.body.classList.remove('locked');
    setTimeout(() => intro.remove(), 460);
  };
  if (intro && !reduce) {
    document.body.classList.add('locked');
    introSkip?.addEventListener('click', endIntro);
    setTimeout(endIntro, 3450);
  } else {
    intro?.remove();
  }

  const header = document.getElementById('siteHeader');
  const syncHeader = () => header?.classList.toggle('scrolled', scrollY > 18);
  syncHeader();
  addEventListener('scroll', syncHeader, { passive: true });

  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  navToggle?.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  mainNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  }));

  if (!reduce) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.13, rootMargin: '0px 0px -7% 0px' });
    document.querySelectorAll('.reveal-ar,.reveal-en,.reveal-up').forEach((el, index) => {
      el.style.transitionDelay = `${Math.min((index % 4) * 65, 195)}ms`;
      io.observe(el);
    });
  } else {
    document.querySelectorAll('.reveal-ar,.reveal-en,.reveal-up').forEach(el => el.classList.add('in'));
  }

  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.main-nav a')];
  if ('IntersectionObserver' in window) {
    const navIO = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
    sections.forEach(s => navIO.observe(s));
  }

  const filters = [...document.querySelectorAll('.studio-filters button')];
  const mediaCards = [...document.querySelectorAll('.media-card')];
  filters.forEach(btn => btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    mediaCards.forEach(card => card.classList.toggle('is-hidden', filter !== 'all' && card.dataset.type !== filter));
  }));

  const assistantFab = document.getElementById('assistantFab');
  const openAssistant = document.getElementById('openAssistant');
  const assistantPanel = document.getElementById('assistantPanel');
  const assistantClose = document.getElementById('assistantClose');
  const assistantInput = document.getElementById('assistantInput');
  const quick = [...document.querySelectorAll('.assistant-quick button')];
  const showAssistant = () => {
    assistantPanel.classList.add('open');
    assistantPanel.setAttribute('aria-hidden', 'false');
    setTimeout(() => assistantInput?.focus(), 120);
  };
  const hideAssistant = () => {
    assistantPanel.classList.remove('open');
    assistantPanel.setAttribute('aria-hidden', 'true');
  };
  assistantFab?.addEventListener('click', () => assistantPanel.classList.contains('open') ? hideAssistant() : showAssistant());
  openAssistant?.addEventListener('click', showAssistant);
  assistantClose?.addEventListener('click', hideAssistant);
  addEventListener('keydown', e => { if (e.key === 'Escape') hideAssistant(); });
  addEventListener('pointerdown', e => {
    if (!assistantPanel?.classList.contains('open')) return;
    if (!assistantPanel.contains(e.target) && !assistantFab.contains(e.target) && !openAssistant?.contains(e.target)) hideAssistant();
  });
  quick.forEach(btn => btn.addEventListener('click', () => {
    assistantInput.value = btn.textContent;
    document.querySelector('.assistant-quick')?.remove();
    assistantInput.focus();
  }));
  assistantInput?.addEventListener('input', () => {
    if (assistantInput.value.trim()) document.querySelector('.assistant-quick')?.remove();
  });
  document.getElementById('assistantForm')?.addEventListener('submit', e => {
    e.preventDefault();
    const text = assistantInput.value.trim();
    if (!text) return;
    const msg = document.createElement('div');
    msg.className = 'assistant-message';
    msg.textContent = text;
    document.getElementById('assistantMessages').append(msg);
    assistantInput.value = '';
  });
})();