/* ============================================================
   C. Neumann MVSc — main.js
   ============================================================ */

'use strict';

/* ── Google Translate Init (called by GT script) ─────────── */
window.googleTranslateElementInit = function () {
  new window.google.translate.TranslateElement(
    {
      pageLanguage: 'es',
      includedLanguages: 'ca,en',
      autoDisplay: false,
    },
    'google_translate_element'
  );
};

/* ── Language Switcher ────────────────────────────────────── */
function getActiveLang() {
  return localStorage.getItem('siteLang') || 'es';
}

function setGoogTranslate(lang) {
  // Clear GT cookie in all domain permutations GT might have used
  ['', '; domain=' + location.hostname, '; domain=.' + location.hostname].forEach(function (d) {
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/' + d;
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None' + d;
  });

  if (lang !== 'es') {
    const val = '/es/' + lang;
    document.cookie = 'googtrans=' + val + '; path=/';
    document.cookie = 'googtrans=' + val + '; path=/; domain=.' + location.hostname;
  }

  // localStorage is the authoritative source for the active button — not the GT cookie
  localStorage.setItem('siteLang', lang);
}

function markActiveLangBtn(lang) {
  document.querySelectorAll('.lang-btn').forEach(function (btn) {
    const isActive = btn.dataset.lang === lang;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', String(isActive));
  });
}

function initLangSwitcher() {
  markActiveLangBtn(getActiveLang());

  document.querySelectorAll('.lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const lang = btn.dataset.lang;
      setGoogTranslate(lang);
      location.reload();
    });
  });
}

/* ── Scroll Reveal ────────────────────────────────────────── */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(function (el) { observer.observe(el); });
}

/* ── Sticky Nav Shadow ────────────────────────────────────── */
function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const handler = function () {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', handler, { passive: true });
  handler();
}

/* ── Mobile Navigation ────────────────────────────────────── */
function initMobileNav() {
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile');
  if (!hamburger || !mobileMenu) return;

  const toggle = function (open) {
    hamburger.classList.toggle('open', open);
    mobileMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  hamburger.addEventListener('click', function () {
    toggle(!hamburger.classList.contains('open'));
  });

  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () { toggle(false); });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') toggle(false);
  });
}

/* ── Active Nav Link ──────────────────────────────────────── */
function initActiveNavLink() {
  const links = document.querySelectorAll('.nav__link:not(.nav__cta)');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  links.forEach(function (link) {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkFile = href.split('/').pop();
    if (
      linkFile === currentPath ||
      (currentPath === '' && linkFile === 'index.html')
    ) {
      link.classList.add('active');
    }
  });
}

/* ── Cookie Banner ────────────────────────────────────────── */
function initCookieBanner() {
  const banner = document.querySelector('.cookie-banner');
  const btn = document.querySelector('.cookie-banner__btn');
  if (!banner || !btn) return;

  if (localStorage.getItem('cookieDismissed')) {
    banner.classList.add('hidden');
    return;
  }

  btn.addEventListener('click', function () {
    banner.classList.add('hidden');
    localStorage.setItem('cookieDismissed', '1');
  });
}

/* ── Contact Form ─────────────────────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const successMsg = document.getElementById('formSuccess');

  const rules = {
    name:     { required: true },
    email:    { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    practice: { required: true },
    referral: { required: true, notDefault: true },
    message:  { required: true, minLen: 10 },
    gdpr:     { required: true, checkbox: true },
  };

  const msgs = {
    name:     'El nombre es obligatorio.',
    email:    'Introduce una dirección de correo electrónico válida.',
    practice: 'El nombre de la clínica es obligatorio.',
    referral: 'Selecciona el tipo de derivación.',
    message:  'Por favor, escribe un mensaje más detallado.',
    gdpr:     'Debes confirmar tu consentimiento para continuar.',
  };

  function validateField(id, rule, value, checked) {
    const group = form.querySelector('[data-field="' + id + '"]');
    const errEl = group ? group.querySelector('.form__error') : null;
    let msg = '';

    if (rule.checkbox) {
      if (!checked) msg = msgs[id];
    } else if (rule.required && !value.trim()) {
      msg = msgs[id];
    } else if (rule.notDefault && value === '') {
      msg = msgs[id];
    } else if (rule.pattern && value.trim() && !rule.pattern.test(value.trim())) {
      msg = msgs[id];
    } else if (rule.minLen && value.trim().length < rule.minLen) {
      msg = msgs[id];
    }

    if (group) group.classList.toggle('has-error', !!msg);
    if (errEl) errEl.textContent = msg;
    return !msg;
  }

  Object.keys(rules).forEach(function (id) {
    const el = form.elements[id];
    if (!el) return;
    el.addEventListener('blur', function () {
      validateField(id, rules[id], el.value || '', el.checked || false);
    });
    el.addEventListener('input', function () {
      const group = form.querySelector('[data-field="' + id + '"]');
      if (group && group.classList.contains('has-error')) {
        validateField(id, rules[id], el.value || '', el.checked || false);
      }
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    let valid = true;

    Object.keys(rules).forEach(function (id) {
      const el = form.elements[id];
      if (!el) return;
      if (!validateField(id, rules[id], el.value || '', el.checked || false)) {
        valid = false;
      }
    });

    if (!valid) {
      const firstError = form.querySelector(
        '.has-error input, .has-error select, .has-error textarea'
      );
      if (firstError) firstError.focus();
      return;
    }

    form.style.display = 'none';
    if (successMsg) {
      successMsg.style.display = 'block';
      successMsg.focus();
    }
  });
}

/* ── Smooth Anchor Scrolling ──────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH =
        parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--nav-h'),
          10
        ) || 70;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - navH - 12,
        behavior: 'smooth',
      });
    });
  });
}

/* ── Init ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {
  initScrollReveal();
  initNavScroll();
  initMobileNav();
  initActiveNavLink();
  initLangSwitcher();
  initCookieBanner();
  initContactForm();
  initSmoothScroll();
});
