/* ============================================================
   C. Neumann MVSc — main.js
   ============================================================ */

'use strict';

/* ── Scroll Reveal ────────────────────────────────────────── */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach((el) => observer.observe(el));
}

/* ── Sticky Nav Shadow ────────────────────────────────────── */
function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  const handler = () => {
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

  const toggle = (open) => {
    hamburger.classList.toggle('open', open);
    mobileMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.contains('open');
    toggle(!isOpen);
  });

  // Close on mobile link click
  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => toggle(false));
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggle(false);
  });
}

/* ── Active Nav Link ──────────────────────────────────────── */
function initActiveNavLink() {
  const links = document.querySelectorAll('.nav__link:not(.nav__cta)');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkFile = href.split('/').pop();
    if (linkFile === currentPath || (currentPath === '' && linkFile === 'index.html')) {
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

  btn.addEventListener('click', () => {
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
    name:    { required: true, label: 'Your name' },
    email:   { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, label: 'A valid email address' },
    practice:{ required: true, label: 'Practice name' },
    referral:{ required: true, notDefault: true, label: 'Type of referral' },
    message: { required: true, minLen: 10, label: 'A message' },
    gdpr:    { required: true, checkbox: true, label: 'GDPR consent' },
  };

  function validateField(id, rule, value, checked) {
    const group = form.querySelector(`[data-field="${id}"]`);
    const errEl = group ? group.querySelector('.form__error') : null;
    let msg = '';

    if (rule.checkbox) {
      if (!checked) msg = 'Please confirm your consent to continue.';
    } else if (rule.required && !value.trim()) {
      msg = `${rule.label} is required.`;
    } else if (rule.notDefault && value === '') {
      msg = `Please select a referral type.`;
    } else if (rule.pattern && value.trim() && !rule.pattern.test(value.trim())) {
      msg = `${rule.label} is required.`;
    } else if (rule.minLen && value.trim().length < rule.minLen) {
      msg = `Please provide a more detailed message.`;
    }

    if (group) group.classList.toggle('has-error', !!msg);
    if (errEl) errEl.textContent = msg;
    return !msg;
  }

  // Real-time validation on blur
  Object.keys(rules).forEach((id) => {
    const el = form.elements[id];
    if (!el) return;
    el.addEventListener('blur', () => {
      validateField(id, rules[id], el.value || '', el.checked || false);
    });
    el.addEventListener('input', () => {
      const group = form.querySelector(`[data-field="${id}"]`);
      if (group && group.classList.contains('has-error')) {
        validateField(id, rules[id], el.value || '', el.checked || false);
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    Object.keys(rules).forEach((id) => {
      const el = form.elements[id];
      if (!el) return;
      const ok = validateField(id, rules[id], el.value || '', el.checked || false);
      if (!ok) valid = false;
    });

    if (!valid) {
      // Focus first error field
      const firstError = form.querySelector('.has-error input, .has-error select, .has-error textarea');
      if (firstError) firstError.focus();
      return;
    }

    // Success — hide form, show confirmation
    form.style.display = 'none';
    if (successMsg) {
      successMsg.style.display = 'block';
      successMsg.focus();
    }
  });
}

/* ── Smooth anchor scrolling (for same-page links) ─────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 70;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ── Init ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initNavScroll();
  initMobileNav();
  initActiveNavLink();
  initCookieBanner();
  initContactForm();
  initSmoothScroll();
});
