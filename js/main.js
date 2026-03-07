/**
 * Auto Shine Studio — Main JavaScript
 * Clean, structured, bug-free
 */

'use strict';

/* ─── Utility ─── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const debounce = (fn, ms = 250) => {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
};

/* ─── DOM Ready ─── */
document.addEventListener('DOMContentLoaded', init);

function init() {
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initScrollTop();
  initFAQ();
  initGalleryFilter();
  initBlogFilter();
  initForms();
  initPhoneFormat();
  initDynamicYear();
  initParticles();
  initSwiper();
  initAOS();
  setActiveNavLink();
  console.log('%c🚗 Auto Shine Studio', 'font-size:18px;font-weight:bold;color:#C9A84C');
  console.log('%cPremium Car Detailing | Rohini Sector-8, Delhi', 'color:#666;font-size:12px');
}

/* ─── Navbar Scroll Effect ─── */
function initNavbar() {
  const navbar = $('.navbar');
  if (!navbar) return;

  const handleScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ─── Mobile Menu ─── */
function initMobileMenu() {
  const toggle = $('#mobile-toggle');
  const menu   = $('#mobile-menu');
  if (!toggle || !menu) return;

  const open  = () => { menu.classList.add('active'); toggle.classList.add('open'); toggle.setAttribute('aria-expanded', 'true'); };
  const close = () => { menu.classList.remove('active'); toggle.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); };
  const isOpen = () => menu.classList.contains('active');

  toggle.addEventListener('click', e => { e.stopPropagation(); isOpen() ? close() : open(); });

  document.addEventListener('click', e => {
    if (isOpen() && !menu.contains(e.target) && !toggle.contains(e.target)) close();
  });

  document.addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen()) close(); });

  $$('a', menu).forEach(a => a.addEventListener('click', close));

  window.addEventListener('resize', debounce(() => {
    if (window.innerWidth >= 768) close();
  }));
}

/* ─── Smooth Scroll ─── */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = $(href);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ─── Scroll To Top ─── */
function initScrollTop() {
  // Create button
  const btn = document.createElement('button');
  btn.id = 'scroll-top';
  btn.className = 'scroll-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ─── FAQ Accordion ─── */
function initFAQ() {
  $$('.faq-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.faq-item');
      const body = item.querySelector('.faq-body');
      const isOpen = item.classList.contains('active');

      // Close all
      $$('.faq-item').forEach(i => {
        i.classList.remove('active');
        const b = i.querySelector('.faq-body');
        if (b) b.classList.remove('open');
      });

      // Open current if was closed
      if (!isOpen) {
        item.classList.add('active');
        body.classList.add('open');
      }
    });
  });
}

/* ─── Gallery Filter ─── */
function initGalleryFilter() {
  const btns  = $$('.filter-btn[data-category]');
  const items = $$('.gallery-item[data-category]');
  if (!btns.length || !items.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.category;

      items.forEach(item => {
        const match = cat === 'all' || item.dataset.category === cat;
        item.style.display = match ? 'block' : 'none';
        if (match && typeof AOS !== 'undefined') AOS.refresh();
      });
    });
  });
}

/* ─── Blog Filter ─── */
function initBlogFilter() {
  const btns  = $$('.category-filter');
  const posts = $$('.blog-post');
  if (!btns.length || !posts.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.category;

      posts.forEach(post => {
        post.style.display = (cat === 'all' || post.dataset.category === cat) ? 'block' : 'none';
      });
    });
  });
}

/* ─── Form Handling ─── */
function initForms() {
  // Booking form
  const bookingForm = $('#bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', e => {
      e.preventDefault();
      if (validateForm(bookingForm)) {
        showSuccess('successMessage');
        bookingForm.reset();
      }
    });
  }

  // Contact form
  const contactForm = $('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      if (validateForm(contactForm)) {
        showSuccess('contactSuccessMessage');
        contactForm.reset();
      }
    });
  }

  // Hide success on backdrop click
  $$('.success-message').forEach(msg => {
    msg.addEventListener('click', e => {
      if (e.target === msg) msg.classList.add('hidden');
    });
  });
}

function validateForm(form) {
  let valid = true;
  $$('[required]', form).forEach(field => {
    const isEmpty = !field.value.trim();
    field.classList.toggle('border-red-500', isEmpty);
    if (isEmpty) valid = false;
  });
  return valid;
}

function showSuccess(id) {
  const el = $(`#${id}`);
  if (el) {
    el.classList.remove('hidden');
    el.focus?.();
  }
}

/* ─── Phone Formatting ─── */
function initPhoneFormat() {
  $$('input[type="tel"]').forEach(input => {
    input.addEventListener('input', () => {
      input.value = input.value.replace(/\D/g, '').slice(0, 10);
    });
  });
}

/* ─── Dynamic Year ─── */
function initDynamicYear() {
  const year = new Date().getFullYear();
  $$('.current-year').forEach(el => { el.textContent = year; });
}

/* ─── Floating Particles ─── */
function initParticles() {
  const container = $('.hero-particles');
  if (!container) return;

  const count = window.matchMedia('(max-width: 768px)').matches ? 15 : 30;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      bottom: ${Math.random() * 30}%;
      animation-duration: ${6 + Math.random() * 10}s;
      animation-delay: ${Math.random() * 8}s;
      width: ${1 + Math.random() * 2}px;
      height: ${1 + Math.random() * 2}px;
      opacity: ${0.3 + Math.random() * 0.5};
    `;
    container.appendChild(p);
  }
}

/* ─── Swiper (testimonials / gallery sliders) ─── */
function initSwiper() {
  if (typeof Swiper === 'undefined') return;

  // Testimonials
  if ($('.testimonialSwiper')) {
    new Swiper('.testimonialSwiper', {
      loop: true,
      autoplay: { delay: 5000, disableOnInteraction: false },
      pagination: { el: '.swiper-pagination', clickable: true },
      breakpoints: {
        640:  { slidesPerView: 1, spaceBetween: 20 },
        768:  { slidesPerView: 2, spaceBetween: 24 },
        1024: { slidesPerView: 3, spaceBetween: 32 },
      }
    });
  }

  // Featured Gallery Slider
  if ($('.featuredSwiper')) {
    new Swiper('.featuredSwiper', {
      loop: true,
      autoplay: { delay: 4000, disableOnInteraction: false },
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
      breakpoints: {
        640:  { slidesPerView: 1, spaceBetween: 16 },
        768:  { slidesPerView: 2, spaceBetween: 20 },
        1024: { slidesPerView: 3, spaceBetween: 28 },
      }
    });
  }
}

/* ─── AOS Init ─── */
function initAOS() {
  if (typeof AOS === 'undefined') return;
  AOS.init({
    duration: 800,
    once: true,
    offset: 80,
    easing: 'ease-out-cubic',
  });
}

/* ─── Active Nav Link ─── */
function setActiveNavLink() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  $$('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    a.classList.toggle('active', href === page || (page === '' && href === 'index.html'));
  });
}

/* ─── Counter Animation ─── */
function animateCounter(el) {
  const target = parseFloat(el.dataset.target || el.textContent);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const step = 16;
  const steps = duration / step;
  const increment = target / steps;
  let current = 0;

  const timer = setInterval(() => {
    current = Math.min(current + increment, target);
    el.textContent = (Number.isInteger(target) ? Math.floor(current) : current.toFixed(1)) + suffix;
    if (current >= target) clearInterval(timer);
  }, step);
}

// Trigger counter animation on scroll
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

$$('[data-counter]').forEach(el => counterObserver.observe(el));

/* ─── Global Error Handler ─── */
window.addEventListener('error', e => {
  console.error('Error:', e.message, 'at', e.filename, ':', e.lineno);
});
