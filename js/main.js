/**
 * Auto Shine Studio — Main JS
 * Mobile-first, clean, bug-free
 */
'use strict';

const $ = (s, c=document) => c.querySelector(s);
const $$ = (s, c=document) => [...c.querySelectorAll(s)];
const debounce = (fn, ms=250) => { let t; return (...a) => { clearTimeout(t); t=setTimeout(()=>fn(...a),ms); }; };

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
  initPhoneInputs();
  initDynamicYear();
  initParticles();
  initCounters();
  initSwiper();
  initAOS();
  setActiveLink();
  initDateMin();
}

/* ─── Navbar scroll ─── */
function initNavbar() {
  const nav = $('#navbar');
  if (!nav) return;
  const update = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', update, {passive:true});
  update();
}

/* ─── Mobile menu ─── */
function initMobileMenu() {
  const btn  = $('#mobile-toggle');
  const menu = $('#mobile-menu');
  if (!btn || !menu) return;

  const open  = () => { menu.classList.add('active'); btn.classList.add('open'); btn.setAttribute('aria-expanded','true'); };
  const close = () => { menu.classList.remove('active'); btn.classList.remove('open'); btn.setAttribute('aria-expanded','false'); };
  const isOpen= () => menu.classList.contains('active');

  btn.addEventListener('click', e => { e.stopPropagation(); isOpen() ? close() : open(); });
  document.addEventListener('click', e => { if (isOpen() && !menu.contains(e.target) && !btn.contains(e.target)) close(); });
  document.addEventListener('keydown', e => { if (e.key==='Escape' && isOpen()) close(); });
  $$('a', menu).forEach(a => a.addEventListener('click', close));
  window.addEventListener('resize', debounce(() => { if (window.innerWidth>=768) close(); }));
}

/* ─── Smooth scroll ─── */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (!href || href === '#' || href.startsWith('http')) return;
      const target = $(href);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior:'smooth' });
    });
  });
}

/* ─── Scroll-to-top ─── */
function initScrollTop() {
  const btn = document.createElement('button');
  btn.className = 'scroll-top';
  btn.setAttribute('aria-label','Back to top');
  btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  document.body.appendChild(btn);
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY>400), {passive:true});
  btn.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));
}

/* ─── FAQ ─── */
function initFAQ() {
  $$('.faq-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.faq-item');
      const body = item.querySelector('.faq-body');
      const wasOpen = item.classList.contains('active');
      $$('.faq-item').forEach(i => { i.classList.remove('active'); const b=i.querySelector('.faq-body'); if(b) b.classList.remove('open'); });
      if (!wasOpen) { item.classList.add('active'); body.classList.add('open'); }
    });
  });
}

/* ─── Gallery filter ─── */
function initGalleryFilter() {
  const btns  = $$('.filter-btn[data-category]');
  const items = $$('.gallery-item[data-category]');
  if (!btns.length) return;
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.category;
      items.forEach(item => {
        item.style.display = (cat==='all' || item.dataset.category===cat) ? '' : 'none';
      });
    });
  });
}

/* ─── Blog filter ─── */
function initBlogFilter() {
  const btns  = $$('.category-filter');
  const posts = $$('.blog-post');
  if (!btns.length) return;
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.category;
      posts.forEach(p => { p.style.display = (cat==='all' || p.dataset.category===cat) ? '' : 'none'; });
    });
  });
}

/* ─── Forms ─── */
function initForms() {
  handleForm('bookingForm',  'successMessage');
  handleForm('contactForm',  'contactSuccessMessage');
}

function handleForm(formId, modalId) {
  const form  = $(`#${formId}`);
  const modal = $(`#${modalId}`);
  if (!form || !modal) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    $$('[required]', form).forEach(f => {
      const empty = !f.value.trim();
      f.classList.toggle('error', empty);
      if (empty) valid = false;
    });
    if (valid) {
      modal.classList.add('open');
      form.reset();
      // Remove error states
      $$('.error', form).forEach(f => f.classList.remove('error'));
    }
  });
  // Close on backdrop click
  modal.addEventListener('click', e => { if (e.target===modal) modal.classList.remove('open'); });
}

/* ─── Phone inputs ─── */
function initPhoneInputs() {
  $$('input[type="tel"]').forEach(input => {
    input.addEventListener('input', () => {
      input.value = input.value.replace(/\D/g,'').slice(0,10);
    });
  });
}

/* ─── Dynamic year ─── */
function initDynamicYear() {
  $$('.current-year').forEach(el => { el.textContent = new Date().getFullYear(); });
}

/* ─── Date minimum ─── */
function initDateMin() {
  const d = $('#date');
  if (!d) return;
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth()+1).padStart(2,'0');
  const dd = String(today.getDate()).padStart(2,'0');
  d.min = `${y}-${m}-${dd}`;
}

/* ─── Particles ─── */
function initParticles() {
  const container = $('.hero-particles');
  if (!container) return;
  const count = window.matchMedia('(max-width:768px)').matches ? 12 : 28;
  for (let i=0; i<count; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    Object.assign(p.style, {
      left: `${Math.random()*100}%`,
      bottom: `${Math.random()*30}%`,
      animationDuration: `${7+Math.random()*10}s`,
      animationDelay: `${Math.random()*9}s`,
      width: `${1+Math.random()*2}px`,
      height: `${1+Math.random()*2}px`,
    });
    container.appendChild(p);
  }
}

/* ─── Counters ─── */
function initCounters() {
  const els = $$('[data-counter]');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      obs.unobserve(entry.target);
    });
  }, {threshold:0.5});
  els.forEach(el => obs.observe(el));
}

function animateCounter(el) {
  const target = parseFloat(el.dataset.target || 0);
  const suffix = el.dataset.suffix || '';
  const dur = 1800, step = 16;
  const inc = target / (dur/step);
  let cur = 0;
  const timer = setInterval(() => {
    cur = Math.min(cur+inc, target);
    el.textContent = (Number.isInteger(target) ? Math.floor(cur) : cur.toFixed(1)) + suffix;
    if (cur>=target) clearInterval(timer);
  }, step);
}

/* ─── Swiper ─── */
function initSwiper() {
  if (typeof Swiper==='undefined') return;
  if ($('.testimonialSwiper .swiper-slide')) {
    new Swiper('.testimonialSwiper', {
      loop:true,
      autoplay:{delay:5000,disableOnInteraction:false},
      pagination:{el:'.swiper-pagination',clickable:true},
      breakpoints:{640:{slidesPerView:1,spaceBetween:16},768:{slidesPerView:2,spaceBetween:20},1024:{slidesPerView:3,spaceBetween:28}}
    });
  }
  if ($('.featuredSwiper .swiper-slide')) {
    new Swiper('.featuredSwiper', {
      loop:true,
      autoplay:{delay:4000,disableOnInteraction:false},
      pagination:{el:'.swiper-pagination',clickable:true},
      navigation:{nextEl:'.swiper-button-next',prevEl:'.swiper-button-prev'},
      breakpoints:{640:{slidesPerView:1,spaceBetween:16},768:{slidesPerView:2,spaceBetween:20},1024:{slidesPerView:3,spaceBetween:28}}
    });
  }
}

/* ─── AOS ─── */
function initAOS() {
  if (typeof AOS==='undefined') return;
  AOS.init({duration:750,once:true,offset:70,easing:'ease-out-cubic'});
}

/* ─── Active nav link ─── */
function setActiveLink() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  $$('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href') || '';
    const match = href===page || (page===''&&href==='index.html') || (page==='index.html'&&href==='index.html');
    if (!a.classList.contains('mobile-book-btn') && !a.classList.contains('nav-cta')) {
      a.classList.toggle('active', match);
    }
  });
}

window.addEventListener('error', e => console.error('Error:', e.message));
console.log('%c🚗 Auto Shine Studio','font-size:18px;font-weight:bold;color:#C9A84C');
console.log('%cRohini Sector-8, Delhi | +91 80767 27526','color:#666;font-size:11px');