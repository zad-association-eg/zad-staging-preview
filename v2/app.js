(() => {
  'use strict';

  /* =========================================================
     ZAD DIGITAL PLATFORM
     FINAL V2 INTERACTION LAYER
  ========================================================= */

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  const mobileQuery = window.matchMedia('(max-width: 620px)');

  const isMobile = () => mobileQuery.matches;

  /* =========================================================
     LOGO HYDRATION
  ========================================================= */

  const currentScript =
    document.currentScript ||
    $$('script[src]').find(script => /app\.js(?:\?|$)/.test(script.src));

  const logoSource = currentScript?.src
  ? new URL('./assets/zad-logo-official.webp', currentScript.src).href
  : './assets/zad-logo-official.webp';

  const hydrateLogos = () => {
    $$('img[data-zad-logo]').forEach(img => {
      img.src = logoSource;

      if (!img.alt) {
        img.setAttribute('aria-hidden', 'true');
      }
    });
  };

  hydrateLogos();

  /* =========================================================
     PREMIUM LOGO MOTION
  ========================================================= */

  const logoStyle = document.createElement('style');

  logoStyle.textContent = `
    .intro-brand img{
      width:min(240px,58vw)!important;
      height:auto!important;
      max-height:240px!important;
      object-fit:contain!important;
      margin-bottom:18px!important;
      filter:
        drop-shadow(0 0 34px rgba(43,230,195,.34))
        drop-shadow(0 0 18px rgba(230,197,107,.18))!important;
      border-radius:50%;
    }

    .intro-brand:before,
    .intro-brand:after{
      content:"";
      position:absolute;
      left:50%;
      top:106px;
      transform:translate(-50%,-50%);
      border-radius:50%;
      pointer-events:none;
    }

    .intro-brand:before{
      width:290px;
      height:290px;
      border:1px solid rgba(43,230,195,.26);
      box-shadow:
        0 0 34px rgba(43,230,195,.12),
        inset 0 0 34px rgba(43,230,195,.06);
      animation:zadOrbit 9s linear infinite;
    }

    .intro-brand:after{
      width:330px;
      height:210px;
      border:1px solid rgba(230,197,107,.20);
      transform:translate(-50%,-50%) rotate(-10deg);
      animation:zadOrbitGold 12s linear infinite reverse;
    }

    .brand img,
    .footer-brand img,
    .assistant-head img,
    .identity-visual img{
      object-fit:contain;
      border-radius:50%;
      filter:drop-shadow(0 0 16px rgba(43,230,195,.22));
    }

    @keyframes zadOrbit{
      to{
        transform:translate(-50%,-50%) rotate(360deg);
      }
    }

    @keyframes zadOrbitGold{
      to{
        transform:translate(-50%,-50%) rotate(350deg);
      }
    }

    @media(max-width:620px){
      .intro-brand img{
        width:min(200px,58vw)!important;
      }

      .intro-brand:before{
        width:238px;
        height:238px;
        top:88px;
      }

      .intro-brand:after{
        width:275px;
        height:175px;
        top:88px;
      }
    }

    @media(prefers-reduced-motion:reduce){
      .intro-brand:before,
      .intro-brand:after{
        animation:none!important;
      }
    }
  `;

  document.head.appendChild(logoStyle);

  /* =========================================================
     INTRO
  ========================================================= */

  const intro = $('#intro');
  const introSkip = $('#introSkip');

  const releaseBodyLock = () => {
    if (!$('#assistantPanel')?.classList.contains('open')) {
      document.body.classList.remove('locked');
    }
  };

  const endIntro = () => {
    if (!intro || intro.classList.contains('is-gone')) return;

    intro.classList.add('is-gone');

    try {
      sessionStorage.setItem('zadIntroSeen', '1');
    } catch (_) {}

    releaseBodyLock();

    window.setTimeout(() => {
      intro.remove();
    }, 480);
  };

  let introAlreadySeen = false;

  try {
    introAlreadySeen = sessionStorage.getItem('zadIntroSeen') === '1';
  } catch (_) {}

  if (intro && !reduceMotion && !introAlreadySeen) {
    document.body.classList.add('locked');

    introSkip?.addEventListener('click', endIntro);

    window.setTimeout(endIntro, 3450);
  } else {
    intro?.remove();
    document.body.classList.remove('locked');
  }

  /* =========================================================
     HEADER
  ========================================================= */

  const header = $('#siteHeader');

  const syncHeader = () => {
    header?.classList.toggle('scrolled', window.scrollY > 18);
  };

  syncHeader();

  window.addEventListener('scroll', syncHeader, {
    passive: true
  });

  /* =========================================================
     MOBILE NAVIGATION
  ========================================================= */

  const navToggle = $('#navToggle');
  const mainNav = $('#mainNav');

  const closeNavigation = () => {
    mainNav?.classList.remove('open');

    navToggle?.setAttribute(
      'aria-expanded',
      'false'
    );
  };

  const openNavigation = () => {
    mainNav?.classList.add('open');

    navToggle?.setAttribute(
      'aria-expanded',
      'true'
    );
  };

  navToggle?.addEventListener('click', event => {
    event.stopPropagation();

    if (mainNav?.classList.contains('open')) {
      closeNavigation();
    } else {
      openNavigation();
    }
  });

  mainNav?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeNavigation);
  });

  document.addEventListener('pointerdown', event => {
    if (!mainNav?.classList.contains('open')) return;

    if (
      mainNav.contains(event.target) ||
      navToggle?.contains(event.target)
    ) {
      return;
    }

    closeNavigation();
  });

  /* =========================================================
     SMOOTH INTERNAL LINKS
  ========================================================= */

  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const href = link.getAttribute('href');

      if (!href || href === '#') return;

      const target = document.querySelector(href);

      if (!target) return;

      event.preventDefault();

      closeNavigation();

      const headerHeight =
        header?.getBoundingClientRect().height || 0;

      const targetTop =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight -
        14;

      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: reduceMotion ? 'auto' : 'smooth'
      });
    });
  });

  /* =========================================================
     REVEAL ANIMATIONS
  ========================================================= */

  const revealItems = $$('.reveal-ar,.reveal-en,.reveal-up');

  if (
    !reduceMotion &&
    'IntersectionObserver' in window
  ) {
    const revealObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -6% 0px'
      }
    );

    revealItems.forEach((element, index) => {
      element.style.transitionDelay =
        `${Math.min((index % 4) * 55, 165)}ms`;

      revealObserver.observe(element);
    });
  } else {
    revealItems.forEach(element => {
      element.classList.add('in');
    });
  }

  /* =========================================================
     ACTIVE NAVIGATION SECTION
  ========================================================= */

  const navLinks = $$('.main-nav a[href^="#"]');

  const trackedSections = navLinks
    .map(link => {
      const href = link.getAttribute('href');

      if (!href || href === '#home') return null;

      const element = document.querySelector(href);

      return element
        ? {
            id: href,
            element,
            link
          }
        : null;
    })
    .filter(Boolean);

  const homeLink = $('.main-nav a[href="#home"]');

  const setActiveNav = href => {
    navLinks.forEach(link => {
      const active =
        link.getAttribute('href') === href;

      link.classList.toggle('active', active);

      if (active) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const syncActiveNav = () => {
    const headerHeight =
      header?.getBoundingClientRect().height || 0;

    const referencePoint =
      window.scrollY +
      headerHeight +
      Math.min(window.innerHeight * 0.28, 220);

    const firstContentSection =
      trackedSections[0]?.element;

    if (
      !firstContentSection ||
      referencePoint <
        firstContentSection.offsetTop
    ) {
      if (homeLink) {
        setActiveNav('#home');
      }

      return;
    }

    let activeHref = '#home';

    trackedSections.forEach(section => {
      if (
        referencePoint >=
        section.element.offsetTop
      ) {
        activeHref = section.id;
      }
    });

    setActiveNav(activeHref);
  };

  syncActiveNav();

  window.addEventListener(
    'scroll',
    syncActiveNav,
    { passive: true }
  );

  window.addEventListener(
    'resize',
    syncActiveNav,
    { passive: true }
  );

  /* =========================================================
     STUDIO FILTERS
  ========================================================= */

  const filters = $$('.studio-filters button');
  const mediaCards = $$('.media-card');

  filters.forEach(button => {
    button.addEventListener('click', () => {
      filters.forEach(item => {
        item.classList.remove('active');
      });

      button.classList.add('active');

      const filter =
        button.dataset.filter || 'all';

      mediaCards.forEach(card => {
        const hidden =
          filter !== 'all' &&
          card.dataset.type !== filter;

        card.classList.toggle(
          'is-hidden',
          hidden
        );
      });
    });
  });

  /* =========================================================
     SMART ASSISTANT
  ========================================================= */

  const assistantFab = $('#assistantFab');
  const openAssistantButton = $('#openAssistant');
  const mobileAssistantOpen = $('#mobileAssistantOpen');

  const assistantPanel = $('#assistantPanel');
  const assistantClose = $('#assistantClose');
  const assistantInput = $('#assistantInput');
  const assistantForm = $('#assistantForm');
  const assistantMessages = $('#assistantMessages');
  const assistantQuick = $('.assistant-quick');

  let assistantTrigger = null;

  const lockForAssistant = () => {
    if (isMobile()) {
      document.body.classList.add('locked');
    }
  };

  const unlockFromAssistant = () => {
    if (!$('#intro')) {
      document.body.classList.remove('locked');
    }
  };

  const scrollAssistantToBottom = () => {
    const body = $('.assistant-body');

    if (!body) return;

    requestAnimationFrame(() => {
      body.scrollTop = body.scrollHeight;
    });
  };

  const showAssistant = trigger => {
    if (!assistantPanel) return;

    assistantTrigger =
      trigger ||
      document.activeElement;

    closeNavigation();

    assistantPanel.classList.add('open');

    assistantPanel.setAttribute(
      'aria-hidden',
      'false'
    );

    assistantPanel.setAttribute(
      'aria-modal',
      isMobile() ? 'true' : 'false'
    );

    lockForAssistant();

    scrollAssistantToBottom();

    window.setTimeout(() => {
      assistantInput?.focus({
        preventScroll: true
      });
    }, 160);
  };

  const hideAssistant = () => {
    if (!assistantPanel) return;

    assistantPanel.classList.remove('open');

    assistantPanel.setAttribute(
      'aria-hidden',
      'true'
    );

    assistantPanel.setAttribute(
      'aria-modal',
      'false'
    );

    unlockFromAssistant();

    if (
      assistantTrigger instanceof HTMLElement
    ) {
      window.setTimeout(() => {
        assistantTrigger.focus({
          preventScroll: true
        });
      }, 100);
    }
  };

  assistantFab?.addEventListener(
    'click',
    () => {
      if (
        assistantPanel?.classList.contains('open')
      ) {
        hideAssistant();
      } else {
        showAssistant(assistantFab);
      }
    }
  );

  openAssistantButton?.addEventListener(
    'click',
    () => showAssistant(openAssistantButton)
  );

  mobileAssistantOpen?.addEventListener(
    'click',
    () => showAssistant(mobileAssistantOpen)
  );

  assistantClose?.addEventListener(
    'click',
    hideAssistant
  );

  /* Desktop click-outside.
     Mobile assistant is fullscreen,
     so outside-click is intentionally disabled.
  */

  document.addEventListener(
    'pointerdown',
    event => {
      if (
        !assistantPanel?.classList.contains('open')
      ) {
        return;
      }

      if (isMobile()) return;

      const insidePanel =
        assistantPanel.contains(event.target);

      const triggerClicked =
        assistantFab?.contains(event.target) ||
        openAssistantButton?.contains(event.target) ||
        mobileAssistantOpen?.contains(event.target);

      if (
        !insidePanel &&
        !triggerClicked
      ) {
        hideAssistant();
      }
    }
  );

  /* =========================================================
     ASSISTANT QUICK ACTIONS
  ========================================================= */

  $$('.assistant-quick button').forEach(button => {
    button.addEventListener('click', () => {
      if (!assistantInput) return;

      assistantInput.value =
        button.textContent.trim();

      assistantInput.focus();

      assistantInput.dispatchEvent(
        new Event('input', {
          bubbles: true
        })
      );
    });
  });

  assistantInput?.addEventListener(
    'input',
    () => {
      if (!assistantQuick) return;

      const hasText =
        assistantInput.value.trim().length > 0;

      assistantQuick.style.opacity =
        hasText ? '.55' : '1';
    }
  );

  /* =========================================================
     ASSISTANT MESSAGE SUBMISSION
  ========================================================= */

  assistantForm?.addEventListener(
    'submit',
    event => {
      event.preventDefault();

      if (
        !assistantInput ||
        !assistantMessages
      ) {
        return;
      }

      const text =
        assistantInput.value.trim();

      if (!text) return;

      const message =
        document.createElement('div');

      message.className =
        'assistant-message';

      message.textContent = text;

      assistantMessages.appendChild(message);

      assistantInput.value = '';

      if (assistantQuick) {
        assistantQuick.style.opacity = '1';
      }

      scrollAssistantToBottom();

      /*
        Backend integration point.

        When the secure API layer is connected,
        send `text` to the backend here
        and append the assistant response
        to #assistantMessages.
      */
    }
  );

  /* =========================================================
     KEYBOARD
  ========================================================= */

  document.addEventListener(
    'keydown',
    event => {
      if (event.key !== 'Escape') return;

      if (
        assistantPanel?.classList.contains('open')
      ) {
        hideAssistant();
        return;
      }

      if (
        mainNav?.classList.contains('open')
      ) {
        closeNavigation();
      }
    }
  );

  /* =========================================================
     BACK TO TOP
  ========================================================= */

  const backToTop = $('#backToTop');

  if (backToTop) {
    backToTop.style.opacity = '0';
    backToTop.style.visibility = 'hidden';
    backToTop.style.pointerEvents = 'none';
    backToTop.style.transform =
      'translateY(8px)';

    backToTop.style.transition =
      'opacity .22s ease, transform .22s ease, visibility .22s ease';

    const syncBackToTop = () => {
      const visible =
        window.scrollY > 650 &&
        !isMobile();

      backToTop.style.opacity =
        visible ? '1' : '0';

      backToTop.style.visibility =
        visible ? 'visible' : 'hidden';

      backToTop.style.pointerEvents =
        visible ? 'auto' : 'none';

      backToTop.style.transform =
        visible
          ? 'translateY(0)'
          : 'translateY(8px)';
    };

    syncBackToTop();

    window.addEventListener(
      'scroll',
      syncBackToTop,
      { passive: true }
    );

    mobileQuery.addEventListener?.(
      'change',
      syncBackToTop
    );

    backToTop.addEventListener(
      'click',
      () => {
        window.scrollTo({
          top: 0,
          behavior:
            reduceMotion
              ? 'auto'
              : 'smooth'
        });
      }
    );
  }

  /* =========================================================
     MOBILE RESIZE / ORIENTATION SAFETY
  ========================================================= */

  const syncResponsiveState = () => {
    if (
      assistantPanel?.classList.contains('open')
    ) {
      assistantPanel.setAttribute(
        'aria-modal',
        isMobile() ? 'true' : 'false'
      );

      if (isMobile()) {
        document.body.classList.add('locked');
      } else if (!$('#intro')) {
        document.body.classList.remove('locked');
      }
    }

    if (!isMobile()) {
      closeNavigation();
    }
  };

  mobileQuery.addEventListener?.(
    'change',
    syncResponsiveState
  );

  window.addEventListener(
    'orientationchange',
    syncResponsiveState
  );

  /* =========================================================
     FINAL INITIAL SYNC
  ========================================================= */
  /* =========================================================
     PREMIUM TITLE SCROLL REVEAL
     Word-by-word scroll illumination for H1 / H2 / H3
  ========================================================= */

  const titleRevealHeadings = $$('h1,h2,h3')
    .filter(heading => !heading.closest('.assistant-panel'));

  const clampTitleProgress = (value, min = 0, max = 1) =>
    Math.min(max, Math.max(min, value));

  const titleNodeIsAccent = (node, heading) => {
    const parent = node.parentElement;

    if (!parent) return false;

    if (parent.closest('em')) {
      return true;
    }

    if (
      heading.matches('.hero h1') &&
      parent.closest('span')
    ) {
      return true;
    }

    return false;
  };

  const splitTitleForReveal = heading => {
    if (
      !heading ||
      heading.dataset.fxSplit === '1'
    ) {
      return;
    }

    const walker = document.createTreeWalker(
      heading,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          if (
            !node.nodeValue ||
            !node.nodeValue.trim()
          ) {
            return NodeFilter.FILTER_REJECT;
          }

          const parent = node.parentElement;

          if (!parent) {
            return NodeFilter.FILTER_REJECT;
          }

          if (
            parent.closest(
              'script,style,.fx-title-word'
            )
          ) {
            return NodeFilter.FILTER_REJECT;
          }

          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const textNodes = [];

    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }

    textNodes.forEach(node => {
      const text = node.nodeValue;
      const pieces = text.split(/(\s+)/);

      const fragment =
        document.createDocumentFragment();

      const accent =
        titleNodeIsAccent(node, heading);

      pieces.forEach(piece => {
        if (!piece) return;

        if (/^\s+$/.test(piece)) {
          fragment.appendChild(
            document.createTextNode(piece)
          );

          return;
        }

        const word =
          document.createElement('span');

        word.className = accent
          ? 'fx-title-word fx-accent'
          : 'fx-title-word';

        word.textContent = piece;

        fragment.appendChild(word);
      });

      node.replaceWith(fragment);
    });

    heading.classList.add('fx-title-ready');
    heading.dataset.fxSplit = '1';
  };

  const prepareTitleReveal = () => {
    if (reduceMotion) {
      return;
    }

    titleRevealHeadings.forEach(
      splitTitleForReveal
    );
  };

  let titleRevealTicking = false;

  const updateTitleReveal = () => {
    if (reduceMotion) {
      titleRevealTicking = false;
      return;
    }

    const viewportHeight =
      window.innerHeight ||
      document.documentElement.clientHeight;

    titleRevealHeadings.forEach(heading => {
      const words =
        $$('.fx-title-word', heading);

      if (!words.length) return;

      const rect =
        heading.getBoundingClientRect();

      /*
        يبدأ التأثير عندما يقترب العنوان من منطقة القراءة،
        ثم يضيء الكلمات تدريجيًا مع السكرول.
        عند الرجوع لأعلى ينعكس التأثير تلقائيًا.
      */

      const start =
        viewportHeight * 0.88;

      const travel =
        Math.max(
          viewportHeight * 0.34,
          rect.height + 90
        );

      const overallProgress =
        clampTitleProgress(
          (start - rect.top) / travel
        );

      words.forEach((word, index) => {
        const wordProgress =
          clampTitleProgress(
            overallProgress *
              (words.length + 2.5) -
              index
          );

        const eased =
          1 -
          Math.pow(
            1 - wordProgress,
            3
          );

        const accent =
          word.classList.contains(
            'fx-accent'
          );

        const from = accent
          ? [66, 118, 108]
          : [92, 118, 113];

        const to = accent
          ? [105, 255, 219]
          : [241, 255, 252];

        const red =
          Math.round(
            from[0] +
            (to[0] - from[0]) *
              eased
          );

        const green =
          Math.round(
            from[1] +
            (to[1] - from[1]) *
              eased
          );

        const blue =
          Math.round(
            from[2] +
            (to[2] - from[2]) *
              eased
          );

        word.style.color =
          `rgb(${red},${green},${blue})`;

        word.style.opacity =
          String(
            0.24 +
            eased * 0.76
          );

        word.style.transform =
          `translateY(${(1 - eased) * 0.12}em)`;

        word.style.filter =
          `blur(${(1 - eased) * 1.1}px)`;

        if (eased > 0.6) {
          const glow =
            accent
              ? 0.22 * eased
              : 0.10 * eased;

          word.style.textShadow =
            `0 0 18px rgba(83,240,214,${glow})`;
        } else {
          word.style.textShadow = 'none';
        }
      });
    });

    titleRevealTicking = false;
  };

  const requestTitleRevealUpdate = () => {
    if (
      reduceMotion ||
      titleRevealTicking
    ) {
      return;
    }

    titleRevealTicking = true;

    window.requestAnimationFrame(
      updateTitleReveal
    );
  };

  prepareTitleReveal();

  if (!reduceMotion) {
    updateTitleReveal();

    window.addEventListener(
      'scroll',
      requestTitleRevealUpdate,
      { passive: true }
    );

    window.addEventListener(
      'resize',
      requestTitleRevealUpdate,
      { passive: true }
    );

    window.addEventListener(
      'orientationchange',
      requestTitleRevealUpdate
    );
  }
  syncHeader();
  syncActiveNav();
  syncResponsiveState();
/* =========================================================
   ZAD PANORAMA STUDIO
   Project filters + cinematic lightbox
========================================================= */

const panoramaStudio = document.querySelector('#studio');

if (
  panoramaStudio &&
  panoramaStudio.dataset.panoramaReady !== 'true'
) {
  panoramaStudio.dataset.panoramaReady = 'true';

  const filterButtons = Array.from(
    panoramaStudio.querySelectorAll(
      '.studio-filters button[data-filter]'
    )
  );

  const projectCards = Array.from(
    panoramaStudio.querySelectorAll(
      '.studio-project-card[data-type]'
    )
  );

  const mediaButtons = Array.from(
    panoramaStudio.querySelectorAll(
      '.studio-media-open[data-studio-image]'
    )
  );


  /* =====================================================
     PROJECT FILTERS
  ===================================================== */

  const applyStudioFilter = filter => {
    projectCards.forEach(card => {
      const shouldShow =
        filter === 'all' ||
        card.dataset.type === filter;

      card.classList.toggle(
        'is-hidden',
        !shouldShow
      );

      card.setAttribute(
        'aria-hidden',
        shouldShow ? 'false' : 'true'
      );
    });

    filterButtons.forEach(button => {
      const isActive =
        button.dataset.filter === filter;

      button.classList.toggle(
        'active',
        isActive
      );

      button.setAttribute(
        'aria-pressed',
        isActive ? 'true' : 'false'
      );
    });
  };


  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      applyStudioFilter(
        button.dataset.filter || 'all'
      );
    });
  });

  applyStudioFilter('all');


  /* =====================================================
     CREATE CINEMATIC LIGHTBOX
  ===================================================== */

  const lightbox = document.createElement('div');

  lightbox.className = 'studio-lightbox';

  lightbox.setAttribute(
    'role',
    'dialog'
  );

  lightbox.setAttribute(
    'aria-modal',
    'true'
  );

  lightbox.setAttribute(
    'aria-label',
    'معرض صور مشروعات زاد'
  );

  lightbox.innerHTML = `
    <div class="studio-lightbox-backdrop"></div>

    <div class="studio-lightbox-shell">

      <button
        type="button"
        class="studio-lightbox-close"
        aria-label="إغلاق الصورة"
      >
        ×
      </button>

      <button
        type="button"
        class="studio-lightbox-nav studio-lightbox-prev"
        aria-label="الصورة السابقة"
      >
        ‹
      </button>

      <figure class="studio-lightbox-stage">

        <img
          class="studio-lightbox-image"
          src=""
          alt=""
        >

        <figcaption class="studio-lightbox-caption">

          <div>
            <span class="studio-lightbox-kicker">
              ZAD PANORAMA
            </span>

            <strong class="studio-lightbox-title"></strong>

            <small class="studio-lightbox-location"></small>
          </div>

          <span class="studio-lightbox-counter"></span>

        </figcaption>

      </figure>

      <button
        type="button"
        class="studio-lightbox-nav studio-lightbox-next"
        aria-label="الصورة التالية"
      >
        ›
      </button>

    </div>
  `;

  document.body.appendChild(lightbox);


  const lightboxImage =
    lightbox.querySelector(
      '.studio-lightbox-image'
    );

  const lightboxTitle =
    lightbox.querySelector(
      '.studio-lightbox-title'
    );

  const lightboxLocation =
    lightbox.querySelector(
      '.studio-lightbox-location'
    );

  const lightboxCounter =
    lightbox.querySelector(
      '.studio-lightbox-counter'
    );

  const closeButton =
    lightbox.querySelector(
      '.studio-lightbox-close'
    );

  const prevButton =
    lightbox.querySelector(
      '.studio-lightbox-prev'
    );

  const nextButton =
    lightbox.querySelector(
      '.studio-lightbox-next'
    );

  const backdrop =
    lightbox.querySelector(
      '.studio-lightbox-backdrop'
    );


  let activeMediaIndex = 0;
  let previousFocus = null;


  const getVisibleMedia = () =>
    mediaButtons.filter(button => {
      const card =
        button.closest(
          '.studio-project-card'
        );

      return (
        card &&
        !card.classList.contains(
          'is-hidden'
        )
      );
    });


  const renderStudioMedia = index => {
    const visibleMedia =
      getVisibleMedia();

    if (!visibleMedia.length) {
      return;
    }

    activeMediaIndex =
      (
        index +
        visibleMedia.length
      ) %
      visibleMedia.length;

    const media =
      visibleMedia[
        activeMediaIndex
      ];

    const imageSource =
      media.dataset.studioImage || '';

    const title =
      media.dataset.studioTitle ||
      'مشروعات زاد';

    const location =
      media.dataset.studioLocation ||
      '';

    lightboxImage.src =
      imageSource;

    lightboxImage.alt =
      title +
      (
        location
          ? ` - ${location}`
          : ''
      );

    lightboxTitle.textContent =
      title;

    lightboxLocation.textContent =
      location;

    lightboxCounter.textContent =
      `${activeMediaIndex + 1} / ${visibleMedia.length}`;

    const multiple =
      visibleMedia.length > 1;

    prevButton.disabled =
      !multiple;

    nextButton.disabled =
      !multiple;
  };


  const openStudioLightbox =
    media => {

      const visibleMedia =
        getVisibleMedia();

      const index =
        visibleMedia.indexOf(media);

      previousFocus =
        document.activeElement;

      renderStudioMedia(
        index >= 0 ? index : 0
      );

      lightbox.classList.add(
        'is-open'
      );

      document.body.classList.add(
        'studio-lightbox-open'
      );

      closeButton.focus();
    };


  const closeStudioLightbox =
    () => {

      lightbox.classList.remove(
        'is-open'
      );

      document.body.classList.remove(
        'studio-lightbox-open'
      );

      lightboxImage.removeAttribute(
        'src'
      );

      if (
        previousFocus &&
        typeof previousFocus.focus ===
          'function'
      ) {
        previousFocus.focus();
      }
    };


  const showNextStudioMedia =
    () => {
      renderStudioMedia(
        activeMediaIndex + 1
      );
    };


  const showPreviousStudioMedia =
    () => {
      renderStudioMedia(
        activeMediaIndex - 1
      );
    };


  mediaButtons.forEach(media => {
    media.addEventListener(
      'click',
      () => {
        openStudioLightbox(media);
      }
    );
  });


  closeButton.addEventListener(
    'click',
    closeStudioLightbox
  );

  backdrop.addEventListener(
    'click',
    closeStudioLightbox
  );

  prevButton.addEventListener(
    'click',
    showPreviousStudioMedia
  );

  nextButton.addEventListener(
    'click',
    showNextStudioMedia
  );


  document.addEventListener(
    'keydown',
    event => {

      if (
        !lightbox.classList.contains(
          'is-open'
        )
      ) {
        return;
      }

      if (event.key === 'Escape') {
        closeStudioLightbox();
      }

      if (event.key === 'ArrowRight') {
        showNextStudioMedia();
      }

      if (event.key === 'ArrowLeft') {
        showPreviousStudioMedia();
      }
    }
  );
}
})();
