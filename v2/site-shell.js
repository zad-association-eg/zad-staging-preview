(() => {
  'use strict';

  /*
   * ZAD GLOBAL SITE SHELL
   * Single source of truth for Header + Footer
   * Arabic / English ready
   */

  const script =
    document.currentScript ||
    [...document.scripts].find(script =>
      /site-shell\.js(?:\?|$)/.test(script.src)
    );

  if (!script?.src) return;

  /*
   * الموقع الأساسي V2 يتم اكتشافه تلقائيًا
   * حتى تعمل الصفحات الداخلية بدون مشاكل في المسارات.
   */

  const v2Root = new URL('./', script.src);

  const isEnglish =
    (document.documentElement.lang || '')
      .toLowerCase()
      .startsWith('en');

  const languageRoot = isEnglish
    ? new URL('en/', v2Root)
    : v2Root;

  const cleanPath = value =>
    value
      .replace(/\/index\.html$/i, '/')
      .replace(/\/+$/, '/');

  const currentPath =
    cleanPath(window.location.pathname);

  const languageHomePath =
    cleanPath(languageRoot.pathname);

  const isLanguageHome =
    currentPath === languageHomePath;

  /*
   * داخل الرئيسية نستخدم #section مباشرة.
   * من أي صفحة داخلية نرجع للرئيسية ثم للقسم المطلوب.
   */

  const sectionHref = id =>
    isLanguageHome
      ? `#${id}`
      : `${languageRoot.href}#${id}`;

  const homeHref =
    isLanguageHome
      ? '#home'
      : `${languageRoot.href}#home`;

  const logoUrl =
    new URL(
      'assets/zad-logo.png',
      v2Root
    ).href;

  const arabicHome =
    v2Root.href;

  const englishHome =
    new URL(
      'en/',
      v2Root
    ).href;

  /* =========================================================
     BILINGUAL COPY
  ========================================================= */

  const copy = isEnglish
    ? {
        brandSub:
          'ZAD Association for Criminal Investigation Officers',

        navLabel:
          'Main navigation',

        home:
          'Home',

        about:
          'About',

        services:
          'Services',

        projects:
          'Projects',

        studio:
          'Studio',

        board:
          'Board',

        contact:
          'Contact',

        memberPortal:
          'Member Portal',

        languageLabel:
          'العربية',

        quickLinks:
          'Quick Links',

        platform:
          'Platform',

        contactUs:
          'Contact Us',

        developerName:
          'Ahmed Abdel Khalek Sayed',

        engineer:
          'Digital Platform & Automation Engineer',

        rights:
          'ZAD DIGITAL PLATFORM · STAGING PREVIEW · 2026 ©'
      }
    : {
        brandSub:
          'جمعية زاد لضباط البحث الجنائي',

        navLabel:
          'التنقل الرئيسي',

        home:
          'الرئيسية',

        about:
          'عن الجمعية',

        services:
          'الخدمات',

        projects:
          'المشروعات',

        studio:
          'الاستوديو',

        board:
          'مجلس الإدارة',

        contact:
          'تواصل معنا',

        memberPortal:
          'بوابة الأعضاء',

        languageLabel:
          'EN',

        quickLinks:
          'روابط سريعة',

        platform:
          'المنصة',

        contactUs:
          'تواصل معنا',

        developerName:
          'أحمد عبد الخالق سيد',

        engineer:
          'Digital Platform & Automation Engineer',

        rights:
          '© 2026 · ZAD DIGITAL PLATFORM · STAGING PREVIEW'
      };

  /* =========================================================
     MOUNT POINTS
  ========================================================= */

  const headerHost =
    document.querySelector(
      '[data-zad-header]'
    ) ||
    document.getElementById(
      'globalHeader'
    );

  const footerHost =
    document.querySelector(
      '[data-zad-footer]'
    ) ||
    document.getElementById(
      'globalFooter'
    );

  /* =========================================================
     GLOBAL HEADER
  ========================================================= */

  if (headerHost) {
    headerHost.innerHTML = `
      <header
        class="site-header"
        id="siteHeader"
      >
        <div class="shell header-shell">

          <a
            class="brand"
            href="${homeHref}"
            aria-label="${copy.home}"
          >
            <img
              src="${logoUrl}"
              data-zad-logo
              alt="${
                isEnglish
                  ? 'ZAD Association logo'
                  : 'شعار جمعية زاد'
              }"
            >

            <span>
              <strong>ZAD</strong>
              <small>
                ${copy.brandSub}
              </small>
            </span>
          </a>

          <button
            class="nav-toggle"
            id="navToggle"
            type="button"
            aria-label="${
              isEnglish
                ? 'Open menu'
                : 'فتح القائمة'
            }"
            aria-expanded="false"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <nav
            class="main-nav"
            id="mainNav"
            aria-label="${copy.navLabel}"
          >

            <a
              class="active"
              href="${homeHref}"
              data-nav-section="home"
            >
              ${copy.home}
            </a>

            <a
              href="${sectionHref('about')}"
              data-nav-section="about"
            >
              ${copy.about}
            </a>

            <a
              href="${sectionHref('services')}"
              data-nav-section="services"
            >
              ${copy.services}
            </a>

            <a
              href="${sectionHref('projects')}"
              data-nav-section="projects"
            >
              ${copy.projects}
            </a>

            <a
              href="${sectionHref('studio')}"
              data-nav-section="studio"
            >
              ${copy.studio}
            </a>

            <a
              href="${sectionHref('leadership')}"
              data-nav-section="leadership"
            >
              ${copy.board}
            </a>

            <a
              href="${sectionHref('contact')}"
              data-nav-section="contact"
            >
              ${copy.contact}
            </a>

          </nav>

          <div class="header-actions">

            <a
              class="mini-action language-switch"
              href="${
                isEnglish
                  ? arabicHome
                  : englishHome
              }"
              ${
                isEnglish
                  ? 'lang="ar" dir="rtl"'
                  : 'lang="en" dir="ltr"'
              }
              aria-label="${
                isEnglish
                  ? 'الانتقال إلى العربية'
                  : 'Switch to English'
              }"
            >
              ${copy.languageLabel}
            </a>

            <a
              class="member-cta"
              href="${sectionHref('contact')}"
            >

              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8c.8-4 3-6 7-6s6.2 2 7 6"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.7"
                  stroke-linecap="round"
                />
              </svg>

              <span>
                ${copy.memberPortal}
              </span>

            </a>

          </div>

        </div>
      </header>
    `;
  }

  /* =========================================================
     GLOBAL FOOTER
  ========================================================= */

  if (footerHost) {
    footerHost.innerHTML = `
      <footer id="contact">

        <div class="shell footer-main">

          <div class="footer-brand reveal-ar">

            <img
              src="${logoUrl}"
              data-zad-logo
              alt="${
                isEnglish
                  ? 'ZAD Association logo'
                  : 'شعار جمعية زاد'
              }"
            >

            <div>
              <strong>
                ZAD DIGITAL PLATFORM
              </strong>

              <small>
                ${copy.brandSub}
              </small>
            </div>

          </div>

          <div class="footer-links">

            <div>

              <b>
                ${copy.quickLinks}
              </b>

              <a href="${homeHref}">
                ${copy.home}
              </a>

              <a href="${sectionHref('about')}">
                ${copy.about}
              </a>

              <a href="${sectionHref('services')}">
                ${copy.services}
              </a>

            </div>

            <div>

              <b>
                ${copy.platform}
              </b>

              <a href="${sectionHref('projects')}">
                ${copy.projects}
              </a>

              <a href="${sectionHref('studio')}">
                Media Studio
              </a>

              <a href="${sectionHref('leadership')}">
                ${copy.board}
              </a>

            </div>

            <div>

              <b>
                ${copy.contactUs}
              </b>

              <a href="tel:+201070700071">
                01070700071
              </a>

              <a
                href="mailto:zadassociation2023@gmail.com"
              >
                zadassociation2023@gmail.com
              </a>

              <a
                href="https://wa.me/201070700071"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>

            </div>

          </div>

        </div>

        <div
          class="footer-social shell"
          aria-label="${
            isEnglish
              ? 'Social media links'
              : 'روابط التواصل الاجتماعي'
          }"
        >

          <!-- Facebook -->

          <a
            class="social-link social-facebook"
            href="https://www.facebook.com/zadassociationassiut"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >

            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M14 8h3V4.5c-.6-.1-1.8-.2-3.2-.2-3.1 0-5.2 1.9-5.2 5.4V12H5v4h3.6v8H13v-8h3.5l.6-4H13V10c0-1.2.3-2 1-2Z"
                fill="currentColor"
              />
            </svg>

          </a>

          <!-- Messenger -->

          <a
            class="social-link social-messenger"
            href="https://m.me/zadassociationassiut"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Messenger"
          >

            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >

              <path
                d="M12 3C6.9 3 3 6.7 3 11.5c0 2.6 1.2 4.9 3.2 6.5V21l3-1.6c.9.3 1.8.4 2.8.4 5.1 0 9-3.7 9-8.3S17.1 3 12 3Z"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
              />

              <path
                d="m7.5 14 3-3.2 2.2 1.8 3.8-4-3 5.4-2.2-1.8L7.5 14Z"
                fill="currentColor"
              />

            </svg>

          </a>

          <!-- WhatsApp -->

          <a
            class="social-link social-whatsapp"
            href="https://wa.me/201070700071"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
          >

            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >

              <path
                d="M12 3.5a8.4 8.4 0 0 0-7.2 12.7L4 20l3.9-1a8.5 8.5 0 1 0 4.1-15.5Z"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
              />

              <path
                d="M9 8.3c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.8 1.8c.1.2 0 .5-.1.7l-.7.8c-.2.2-.1.4 0 .6.5.9 1.4 1.7 2.4 2.2.3.2.5.2.7-.1l.8-1c.2-.2.4-.3.7-.2l1.8.8c.3.1.4.3.4.6 0 .4-.2 1.4-.9 1.9-.6.5-1.4.8-2.4.5-1.1-.3-2.6-.9-4.3-2.4-1.3-1.2-2.2-2.7-2.5-3.7-.4-1.2 0-2 .6-2.5Z"
                fill="currentColor"
              />

            </svg>

          </a>

        </div>

        <div class="developer-signature">

          <span>
            ${copy.developerName}
          </span>

          <small>
            ${copy.engineer}
          </small>

        </div>

        <div class="rights">
          ${copy.rights}
        </div>

      </footer>
    `;
  }

  /* =========================================================
     READY EVENT
  ========================================================= */

  window.dispatchEvent(
    new CustomEvent(
      'zad:shell-ready',
      {
        detail: {
          language:
            isEnglish
              ? 'en'
              : 'ar',

          root:
            v2Root.href
        }
      }
    )
  );

})();
