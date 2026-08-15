(() => {
  const hydrateLogos = () => {
    const logos = [...document.querySelectorAll('img[data-zad-logo]')];
    if (!logos.length) return;
    const source = './assets/zad-logo.png';
    logos.forEach(img => {
      img.src = source;
    });
  };
  hydrateLogos();
  const logoStyle = document.createElement('style');
  logoStyle.textContent = `
    .intro-brand img{width:min(240px,58vw)!important;height:auto!important;max-height:240px!important;object-fit:contain!important;margin-bottom:18px!important;filter:drop-shadow(0 0 34px rgba(43,230,195,.34)) drop-shadow(0 0 18px rgba(230,197,107,.18))!important;border-radius:50%;}
    .intro-brand:before,.intro-brand:after{content:"";position:absolute;left:50%;top:106px;transform:translate(-50%,-50%);border-radius:50%;pointer-events:none;}
    .intro-brand:before{width:290px;height:290px;border:1px solid rgba(43,230,195,.26);box-shadow:0 0 34px rgba(43,230,195,.12),inset 0 0 34px rgba(43,230,195,.06);animation:zadOrbit 9s linear infinite;}
    .intro-brand:after{width:330px;height:210px;border:1px solid rgba(230,197,107,.2);transform:translate(-50%,-50%) rotate(-10deg);animation:zadOrbitGold 12s linear infinite reverse;}
    .brand img,.footer-brand img,.assistant-head img,.identity-visual img{object-fit:contain;border-radius:50%;filter:drop-shadow(0 0 16px rgba(43,230,195,.22));}
    @keyframes zadOrbit{to{transform:translate(-50%,-50%) rotate(360deg)}}
    @keyframes zadOrbitGold{to{transform:translate(-50%,-50%) rotate(350deg)}}
    @media(max-width:620px){.intro-brand img{width:min(200px,58vw)!important}.intro-brand:before{width:238px;height:238px;top:88px}.intro-brand:after{width:275px;height:175px;top:88px}}
  `;
  document.head.appendChild(logoStyle);
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
