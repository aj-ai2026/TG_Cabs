// RK Travels – main.js

/* ── Navbar scroll effect ── */
const navbar = document.querySelector('.navbar');
function handleNavbar() {
  if (window.scrollY > 60) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
}
window.addEventListener('scroll', handleNavbar, { passive: true });
handleNavbar();

/* ── Mobile hamburger ── */
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (mobileMenu.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });
  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

/* ── AOS-like scroll animations ── */
function initAOS() {
  const els = document.querySelectorAll('[data-aos]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.aosDelay || 0;
        setTimeout(() => entry.target.classList.add('aos-animate'), parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => observer.observe(el));
}
initAOS();

/* ── Counter animation ── */
function animateCounters() {
  const counters = document.querySelectorAll('.count-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const step = target / 80;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) { current = target; clearInterval(timer); }
          el.textContent = Math.floor(current).toLocaleString('en-IN') + suffix;
        }, 20);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => observer.observe(el));
}
animateCounters();

/* ── Active nav link ── */
function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}
setActiveNav();

/* ── Inquiry / Booking form submit ── */
document.querySelectorAll('.form-submit, .contact-form-btn, .booking-form-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    const form = this.closest('form');
    if (form) {
      const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
      let valid = true;
      inputs.forEach(inp => {
        if (!inp.value.trim()) { inp.style.borderColor = '#ef4444'; valid = false; }
        else { inp.style.borderColor = ''; }
      });
      if (valid) {
        this.textContent = '✓ Request Sent! We\'ll contact you shortly.';
        this.style.background = '#10b981';
        setTimeout(() => { form.reset(); this.textContent = 'Send Enquiry'; this.style.background = ''; }, 4000);
      }
    }
  });
});

/* ── Package filter tabs ── */
const filterTabs = document.querySelectorAll('.filter-tab');
if (filterTabs.length) {
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const category = tab.dataset.filter;
      document.querySelectorAll('.package-card[data-category]').forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ── Trip type selector (Booking page) ── */
document.querySelectorAll('.trip-type-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.trip-type-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  });
});

/* ── Smooth scroll for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});
