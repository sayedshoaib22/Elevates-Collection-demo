/* ============================================================
   ELEVATES COLLECTION — main.js (ES6+)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Inject structural UI elements ── */
  injectUI();

  /* ── Init modules ── */
  initNavbar();
  initMobileMenu();
  initPageNav();
  initHeroSlider();
  initQuantityButtons();
  initCart();
  initStoreFilters();
  initScrollAnimations();
  initBackToTop();

});


/* ============================================================
   INJECT UI ELEMENTS
   ============================================================ */
function injectUI() {
  // Back-to-top button
  const btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '↑';
  document.body.appendChild(btn);

  // Cart toast
  const toast = document.createElement('div');
  toast.className = 'cart-toast';
  toast.id = 'cart-toast';
  document.body.appendChild(toast);

  // Hamburger button in nav
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const ham = document.createElement('button');
    ham.className = 'nav-hamburger';
    ham.setAttribute('aria-label', 'Open menu');
    ham.innerHTML = '<span></span><span></span><span></span>';
    navbar.appendChild(ham);
  }

  // Mobile nav drawer
  const mobileNav = document.createElement('nav');
  mobileNav.className = 'mobile-nav';
  mobileNav.innerHTML = `
    <a href="#home">Home</a>
    <a href="#collections">Collections</a>
    <a href="#store">Store</a>
    <a href="#about">About Us</a>
    <a href="#contact">Contact</a>
    <a href="https://www.instagram.com/elevatescollection" target="_blank">Instagram</a>
  `;
  document.querySelector('header').appendChild(mobileNav);
}


/* ============================================================
   NAVBAR — sticky + scroll state
   ============================================================ */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}


/* ============================================================
   MOBILE MENU
   ============================================================ */
function initMobileMenu() {
  const ham = document.querySelector('.nav-hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!ham || !mobileNav) return;

  ham.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    ham.setAttribute('aria-expanded', isOpen);
    // Animate hamburger lines
    const spans = ham.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity  = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close on link click
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      ham.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}


/* ============================================================
   PAGE NAVIGATION (SPA-style hash routing)
   ============================================================ */
function initPageNav() {
  const pages    = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a, .footer-top a[href^="#"]');

  function showPage(id) {
    const target = document.getElementById(id);
    if (!target) return;

    pages.forEach(p => p.classList.remove('active'));
    target.classList.add('active');

    // Update nav active state
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
    });

    // Re-trigger scroll animations for newly visible page
    setTimeout(checkScrollAnimations, 100);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Handle all internal links
  document.addEventListener('click', e => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    const id = anchor.getAttribute('href').slice(1);
    if (!id) return;

    // Check if it's a page id
    if (document.getElementById(id)?.classList.contains('page')) {
      e.preventDefault();
      showPage(id);
      history.pushState(null, '', `#${id}`);
    }
  });

  // Handle browser back/forward
  window.addEventListener('popstate', () => {
    const id = location.hash.slice(1) || 'home';
    showPage(id);
  });

  // Initial load
  const initId = location.hash.slice(1) || 'home';
  showPage(initId);
}


/* ============================================================
   HERO SLIDER — fade with auto-play
   ============================================================ */
function initHeroSlider() {
  const wrapper = document.querySelector('.slides-wrapper');
  if (!wrapper) return;

  const slides  = wrapper.querySelectorAll('.slide');
  const dots    = document.querySelectorAll('.slide-dots .dot');
  const prevBtn = document.querySelector('.slide-prev');
  const nextBtn = document.querySelector('.slide-next');

  if (!slides.length) return;

  let current  = 0;
  let autoTimer = null;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  }

  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 5500);
  }

  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  prevBtn?.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  nextBtn?.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); resetAuto(); });
  });

  // Touch / swipe support
  let touchStartX = 0;
  wrapper.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  wrapper.addEventListener('touchend', e => {
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) { goTo(current + (delta > 0 ? 1 : -1)); resetAuto(); }
  });

  startAuto();
}


/* ============================================================
   QUANTITY BUTTONS
   ============================================================ */
function initQuantityButtons() {
  document.addEventListener('click', e => {
    if (e.target.classList.contains('qty-minus')) {
      const counter = e.target.nextElementSibling;
      const val = Math.max(1, parseInt(counter.textContent) - 1);
      counter.textContent = val;
    }
    if (e.target.classList.contains('qty-plus')) {
      const counter = e.target.previousElementSibling;
      counter.textContent = parseInt(counter.textContent) + 1;
    }
  });
}


/* ============================================================
   CART
   ============================================================ */
function initCart() {
  let cartCount = 0;
  const cartCountEl = document.getElementById('cart-count');

  document.addEventListener('click', e => {
    const btn = e.target.closest('.add-to-cart');
    if (!btn) return;

    const card = btn.closest('.product-card');
    const name  = card?.querySelector('h3')?.textContent || 'Item';
    const qty   = parseInt(card?.querySelector('.qty-count')?.textContent || 1);

    cartCount += qty;
    if (cartCountEl) cartCountEl.textContent = cartCount;

    // Button feedback
    const original = btn.textContent;
    btn.textContent = '✓ Added';
    btn.classList.add('added');
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove('added');
      btn.disabled = false;
    }, 1800);

    showToast(`<span class="toast-check">✓</span> ${name} added to cart`);
  });
}

let toastTimer = null;
function showToast(html) {
  const toast = document.getElementById('cart-toast');
  if (!toast) return;
  toast.innerHTML = html;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}


/* ============================================================
   STORE FILTERS
   ============================================================ */
function initStoreFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const storeCards = document.querySelectorAll('.store-grid .product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      storeCards.forEach(card => {
        const show = filter === 'all' || card.dataset.brand === filter;
        card.classList.toggle('hidden', !show);
      });
    });
  });
}


/* ============================================================
   SCROLL ANIMATIONS (IntersectionObserver)
   ============================================================ */
function initScrollAnimations() {
  // Add fade-up to animatable elements
  const targets = [
    '.product-card',
    '.stat',
    '.section-header',
    '.about-story',
    '.about-founders',
    '.about-visit',
    '.contact-info',
    '.contact-form',
    '.collection-category',
    '.page-hero',
  ];

  targets.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      if (!el.classList.contains('fade-up')) {
        el.classList.add('fade-up');
      }
    });
  });

  checkScrollAnimations();

  window.addEventListener('scroll', checkScrollAnimations, { passive: true });
}

function checkScrollAnimations() {
  const els = document.querySelectorAll('.fade-up:not(.visible)');
  els.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) {
      el.classList.add('visible');
    }
  });
}


/* ============================================================
   BACK TO TOP
   ============================================================ */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 420);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}