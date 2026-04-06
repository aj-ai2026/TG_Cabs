// TG CABS – main.js

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

/* ── WhatsApp Form Integration ── */
const WA_NUMBER = '919676833444';

function getFormData(form) {
  const data = [];
  form.querySelectorAll('.form-group').forEach(group => {
    const label = group.querySelector('label');
    const input = group.querySelector('input, select, textarea');
    if (label && input && input.value.trim()) {
      data.push({ label: label.textContent.trim(), value: input.value.trim() });
    }
  });
  return data;
}

function getFormTitle(form) {
  if (form.id === 'heroForm') return '🚕 New Quick Enquiry';
  if (form.id === 'contactForm') return '📩 New Contact Message';
  if (form.id === 'bookingForm') return '📋 New Booking Request';
  return '📋 New Enquiry';
}

function buildWhatsAppMessage(form) {
  const title = getFormTitle(form);
  const fields = getFormData(form);
  let msg = `${title}\n${'━'.repeat(20)}\n`;
  fields.forEach(f => {
    msg += `*${f.label}:* ${f.value}\n`;
  });
  const selectedTrip = form.querySelector('.trip-type-btn.selected .label');
  if (selectedTrip) {
    msg += `*Trip Type:* ${selectedTrip.textContent.trim()}\n`;
  }
  const terms = form.querySelector('#terms');
  if (terms && terms.checked) {
    msg += `\n✅ Customer agreed to contact terms.\n`;
  }
  msg += `${'━'.repeat(20)}\n📅 Sent on: ${new Date().toLocaleString('en-IN')}\n🌐 Via: TG Cabs Website`;
  return msg;
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.textContent = message;
  Object.assign(toast.style, {
    position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)',
    background: '#10b981', color: 'white',
    padding: '14px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: '600',
    zIndex: '99999', boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
    transition: 'opacity 0.4s', opacity: '0'
  });
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.style.opacity = '1');
  setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 400); }, 4000);
}

document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let valid = true;
    inputs.forEach(inp => {
      if (!inp.value.trim()) {
        inp.style.borderColor = '#ef4444';
        valid = false;
      } else {
        inp.style.borderColor = '';
      }
    });
    if (!valid) return;

    // Build message and open WhatsApp
    const message = buildWhatsAppMessage(form);
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${WA_NUMBER}?text=${encoded}`, '_blank');

    // Show success feedback
    const btn = form.querySelector('.form-submit, .contact-form-btn, .booking-form-btn');
    if (btn) {
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '✅ Sent to WhatsApp!';
      btn.style.background = '#10b981';
      showToast('✅ Redirecting to WhatsApp...');
      setTimeout(() => {
        form.reset();
        btn.innerHTML = originalHTML;
        btn.style.background = '';
        form.querySelectorAll('.trip-type-btn').forEach(b => b.classList.remove('selected'));
      }, 4000);
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
