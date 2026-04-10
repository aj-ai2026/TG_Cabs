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
    if (group.closest('[style*="display: none"]')) return; // skip hidden fields
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
  form.addEventListener('submit', function (e) {
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

/* ── Trip type selectors logic (Booking & Index) ── */
// Booking Page
document.querySelectorAll('.trip-type-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.trip-type-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    
    const outstationFields = document.getElementById('outstationFields');
    const localFields = document.getElementById('localFields');
    if (outstationFields && localFields) {
      if (btn.dataset.type === 'local') {
        outstationFields.style.display = 'none';
        outstationFields.querySelectorAll('input').forEach(inp => inp.removeAttribute('required'));
        localFields.style.display = '';
        localFields.querySelectorAll('select').forEach(inp => inp.setAttribute('required', 'true'));
      } else {
        localFields.style.display = 'none';
        localFields.querySelectorAll('select').forEach(inp => inp.removeAttribute('required'));
        outstationFields.style.display = '';
        outstationFields.querySelectorAll('input').forEach(inp => inp.setAttribute('required', 'true'));
      }
    }
  });
});

// Index Page (Hero Form)
const heroTripSelect = document.querySelector('#heroForm select');
if (heroTripSelect) {
  heroTripSelect.addEventListener('change', (e) => {
    const isLocal = e.target.value === 'Local (Half/Full Day)';
    const outstationFields = document.getElementById('indexOutstationFields');
    const localFields = document.getElementById('indexLocalFields');
    if (outstationFields && localFields) {
      if (isLocal) {
        outstationFields.style.display = 'none';
        outstationFields.querySelectorAll('input').forEach(inp => inp.removeAttribute('required'));
        localFields.style.display = '';
        localFields.querySelectorAll('select').forEach(inp => inp.setAttribute('required', 'true'));
      } else {
        localFields.style.display = 'none';
        localFields.querySelectorAll('select').forEach(inp => inp.removeAttribute('required'));
        outstationFields.style.display = '';
        outstationFields.querySelectorAll('input').forEach(inp => inp.setAttribute('required', 'true'));
      }
    }
  });
}

/* ── Testimonial Slider ── */
const testimonialTrack = document.getElementById('testimonialTrack');
const testimonialControls = document.getElementById('testimonialControls');
if (testimonialTrack && testimonialControls) {
  const cards = testimonialTrack.querySelectorAll('.testimonial-card');
  const cardWidth = cards[0].offsetWidth + 24; // width + gap
  let currentIndex = 0;

  // Create dots
  cards.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.className = 'slider-dot' + (index === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(index));
    testimonialControls.appendChild(dot);
  });

  const dots = testimonialControls.querySelectorAll('.slider-dot');

  function goToSlide(index) {
    currentIndex = index;
    testimonialTrack.style.transform = `translateX(-${index * cardWidth}px)`;
    dots.forEach(d => d.classList.remove('active'));
    dots[index].classList.add('active');
  }

  // Auto scroll
  setInterval(() => {
    let nextIndex = currentIndex + 1;
    if (nextIndex >= cards.length) nextIndex = 0;
    goToSlide(nextIndex);
  }, 5000);
}

/* ── WhatsApp Chat Bubble ── */
const waBubble = document.getElementById('waChatBubble');
const waBtn = document.getElementById('whatsappBtn');
if (waBubble) {
  // Show bubble after 3 seconds
  setTimeout(() => {
    waBubble.classList.add('show');
  }, 3000);

  if (waBtn) {
    waBtn.addEventListener('click', () => {
      waBubble.classList.remove('show');
    });
  }
}

/* ── Smooth scroll for anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

/* ── City Autocomplete for From/To fields ── */
const INDIAN_CITIES = [
  // Telangana
  "Hyderabad, Telangana", "Warangal, Telangana", "Nizamabad, Telangana", "Karimnagar, Telangana",
  "Khammam, Telangana", "Mahbubnagar, Telangana", "Nalgonda, Telangana", "Siddipet, Telangana",
  "Adilabad, Telangana", "Suryapet, Telangana", "Mancherial, Telangana", "Ramagundam, Telangana",
  "Miryalaguda, Telangana", "Jagtial, Telangana", "Bodhan, Telangana", "Kamareddy, Telangana",
  "Kothagudem, Telangana", "Zaheerabad, Telangana", "Sangareddy, Telangana", "Medak, Telangana",
  "Wanaparthy, Telangana", "Jangaon, Telangana", "Bhongir, Telangana", "Gadwal, Telangana",
  "Srisailam, Telangana", "Yadgirigutta, Telangana", "Wargal, Telangana",
  // Andhra Pradesh
  "Visakhapatnam, Andhra Pradesh", "Vijayawada, Andhra Pradesh", "Guntur, Andhra Pradesh",
  "Nellore, Andhra Pradesh", "Kurnool, Andhra Pradesh", "Tirupati, Andhra Pradesh",
  "Rajahmundry, Andhra Pradesh", "Kadapa, Andhra Pradesh", "Kakinada, Andhra Pradesh",
  "Anantapur, Andhra Pradesh", "Eluru, Andhra Pradesh", "Ongole, Andhra Pradesh",
  "Srikakulam, Andhra Pradesh", "Chittoor, Andhra Pradesh", "Machilipatnam, Andhra Pradesh",
  "Proddatur, Andhra Pradesh", "Tenali, Andhra Pradesh", "Narasaraopet, Andhra Pradesh",
  "Amaravati, Andhra Pradesh", "Hindupur, Andhra Pradesh", "Vizianagaram, Andhra Pradesh",
  // Maharashtra
  "Mumbai, Maharashtra", "Pune, Maharashtra", "Nagpur, Maharashtra", "Nashik, Maharashtra",
  "Aurangabad, Maharashtra", "Solapur, Maharashtra", "Kolhapur, Maharashtra", "Thane, Maharashtra",
  "Navi Mumbai, Maharashtra", "Sangli, Maharashtra", "Amravati, Maharashtra", "Latur, Maharashtra",
  "Ahmednagar, Maharashtra", "Satara, Maharashtra", "Jalgaon, Maharashtra", "Akola, Maharashtra",
  "Parbhani, Maharashtra", "Ratnagiri, Maharashtra", "Mahabaleshwar, Maharashtra",
  "Shirdi, Maharashtra", "Lonavala, Maharashtra",
  // Karnataka
  "Bengaluru, Karnataka", "Mysuru, Karnataka", "Mangaluru, Karnataka", "Hubli, Karnataka",
  "Dharwad, Karnataka", "Belgaum, Karnataka", "Gulbarga, Karnataka", "Davangere, Karnataka",
  "Bellary, Karnataka", "Shimoga, Karnataka", "Tumkur, Karnataka", "Udupi, Karnataka",
  "Hassan, Karnataka", "Bijapur, Karnataka", "Hampi, Karnataka", "Coorg, Karnataka",
  // Tamil Nadu
  "Chennai, Tamil Nadu", "Coimbatore, Tamil Nadu", "Madurai, Tamil Nadu", "Tiruchirappalli, Tamil Nadu",
  "Salem, Tamil Nadu", "Tirunelveli, Tamil Nadu", "Erode, Tamil Nadu", "Vellore, Tamil Nadu",
  "Thanjavur, Tamil Nadu", "Ooty, Tamil Nadu", "Kodaikanal, Tamil Nadu", "Kanchipuram, Tamil Nadu",
  "Mahabalipuram, Tamil Nadu", "Pondicherry, Tamil Nadu", "Rameswaram, Tamil Nadu",
  // Kerala
  "Thiruvananthapuram, Kerala", "Kochi, Kerala", "Kozhikode, Kerala", "Kollam, Kerala",
  "Thrissur, Kerala", "Alappuzha, Kerala", "Kannur, Kerala", "Palakkad, Kerala",
  "Munnar, Kerala", "Wayanad, Kerala", "Thekkady, Kerala", "Kumarakom, Kerala", "Alleppey, Kerala",
  // Delhi & NCR
  "New Delhi, Delhi", "Noida, Uttar Pradesh", "Gurgaon, Haryana", "Faridabad, Haryana",
  "Ghaziabad, Uttar Pradesh", "Greater Noida, Uttar Pradesh",
  // Rajasthan
  "Jaipur, Rajasthan", "Jodhpur, Rajasthan", "Udaipur, Rajasthan", "Kota, Rajasthan",
  "Ajmer, Rajasthan", "Bikaner, Rajasthan", "Jaisalmer, Rajasthan", "Mount Abu, Rajasthan",
  "Pushkar, Rajasthan", "Alwar, Rajasthan", "Bhilwara, Rajasthan",
  // Gujarat
  "Ahmedabad, Gujarat", "Surat, Gujarat", "Vadodara, Gujarat", "Rajkot, Gujarat",
  "Gandhinagar, Gujarat", "Bhavnagar, Gujarat", "Junagadh, Gujarat", "Dwarka, Gujarat",
  "Somnath, Gujarat", "Kutch, Gujarat", "Gir, Gujarat",
  // Uttar Pradesh
  "Lucknow, Uttar Pradesh", "Varanasi, Uttar Pradesh", "Agra, Uttar Pradesh", "Kanpur, Uttar Pradesh",
  "Allahabad, Uttar Pradesh", "Meerut, Uttar Pradesh", "Mathura, Uttar Pradesh", "Ayodhya, Uttar Pradesh",
  "Gorakhpur, Uttar Pradesh", "Aligarh, Uttar Pradesh", "Bareilly, Uttar Pradesh",
  // Madhya Pradesh
  "Bhopal, Madhya Pradesh", "Indore, Madhya Pradesh", "Gwalior, Madhya Pradesh", "Jabalpur, Madhya Pradesh",
  "Ujjain, Madhya Pradesh", "Khajuraho, Madhya Pradesh", "Pachmarhi, Madhya Pradesh",
  // West Bengal
  "Kolkata, West Bengal", "Siliguri, West Bengal", "Durgapur, West Bengal", "Darjeeling, West Bengal",
  "Howrah, West Bengal", "Asansol, West Bengal", "Shantiniketan, West Bengal",
  // Bihar & Jharkhand
  "Patna, Bihar", "Gaya, Bihar", "Bodh Gaya, Bihar", "Ranchi, Jharkhand", "Jamshedpur, Jharkhand",
  "Deoghar, Jharkhand",
  // Odisha
  "Bhubaneswar, Odisha", "Cuttack, Odisha", "Puri, Odisha", "Rourkela, Odisha", "Konark, Odisha",
  // Goa
  "Panaji, Goa", "Margao, Goa", "Vasco da Gama, Goa", "Calangute, Goa", "Baga, Goa",
  // Punjab & Haryana
  "Chandigarh, Punjab", "Amritsar, Punjab", "Ludhiana, Punjab", "Jalandhar, Punjab",
  "Patiala, Punjab", "Karnal, Haryana", "Ambala, Haryana", "Panipat, Haryana", "Hisar, Haryana",
  // Himachal Pradesh
  "Shimla, Himachal Pradesh", "Manali, Himachal Pradesh", "Dharamshala, Himachal Pradesh",
  "Dalhousie, Himachal Pradesh", "Kullu, Himachal Pradesh", "Kasol, Himachal Pradesh",
  "Spiti Valley, Himachal Pradesh",
  // Uttarakhand
  "Dehradun, Uttarakhand", "Rishikesh, Uttarakhand", "Haridwar, Uttarakhand", "Mussoorie, Uttarakhand",
  "Nainital, Uttarakhand", "Jim Corbett, Uttarakhand", "Badrinath, Uttarakhand", "Kedarnath, Uttarakhand",
  // Jammu & Kashmir
  "Srinagar, Jammu & Kashmir", "Jammu, Jammu & Kashmir", "Gulmarg, Jammu & Kashmir",
  "Pahalgam, Jammu & Kashmir", "Leh, Ladakh", "Ladakh, Ladakh",
  // North East
  "Guwahati, Assam", "Shillong, Meghalaya", "Gangtok, Sikkim", "Imphal, Manipur",
  "Aizawl, Mizoram", "Agartala, Tripura", "Itanagar, Arunachal Pradesh", "Kohima, Nagaland",
  "Kaziranga, Assam", "Tawang, Arunachal Pradesh",
  // Chhattisgarh
  "Raipur, Chhattisgarh", "Bhilai, Chhattisgarh", "Bilaspur, Chhattisgarh"
];

function initCityAutocomplete() {
  const inputs = document.querySelectorAll('[data-autocomplete="city"]');
  if (!inputs.length) return;

  // Inject CSS for dropdown
  const style = document.createElement('style');
  style.textContent = `
    .city-ac-wrap { position: relative; }
    .city-ac-list {
      position: absolute; top: 100%; left: 0; right: 0; z-index: 999;
      background: white; border: 1px solid var(--border); border-top: none;
      border-radius: 0 0 var(--radius-sm) var(--radius-sm);
      max-height: 220px; overflow-y: auto; box-shadow: var(--shadow-md);
      display: none;
    }
    .city-ac-list.open { display: block; }
    .city-ac-item {
      padding: 10px 14px; font-size: 14px; cursor: pointer;
      display: flex; justify-content: space-between; align-items: center;
      transition: background 0.15s;
    }
    .city-ac-item:hover, .city-ac-item.active { background: #fffef5; }
    .city-ac-item .city-name { font-weight: 600; color: var(--dark); }
    .city-ac-item .city-state { font-size: 11px; color: var(--muted); }
    .city-ac-item .city-match { color: var(--accent-dark); font-weight: 700; }
    .city-ac-list::-webkit-scrollbar { width: 6px; }
    .city-ac-list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
  `;
  document.head.appendChild(style);

  inputs.forEach(input => {
    // Wrap input in a relative container
    const wrapper = document.createElement('div');
    wrapper.className = 'city-ac-wrap';
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);

    // Create dropdown
    const dropdown = document.createElement('div');
    dropdown.className = 'city-ac-list';
    wrapper.appendChild(dropdown);

    let activeIdx = -1;

    function renderResults(query) {
      if (!query || query.length < 2) { dropdown.classList.remove('open'); return; }
      const q = query.toLowerCase();
      const matches = INDIAN_CITIES.filter(c => c.toLowerCase().includes(q)).slice(0, 8);
      if (!matches.length) { dropdown.classList.remove('open'); return; }

      dropdown.innerHTML = matches.map((city, i) => {
        const [name, state] = city.split(', ');
        // Highlight matching text
        const idx = name.toLowerCase().indexOf(q);
        let display = name;
        if (idx >= 0) {
          display = name.slice(0, idx) + '<span class="city-match">' + name.slice(idx, idx + q.length) + '</span>' + name.slice(idx + q.length);
        }
        return `<div class="city-ac-item" data-value="${city}" data-index="${i}">
          <span class="city-name">${display}</span>
          <span class="city-state">${state || ''}</span>
        </div>`;
      }).join('');
      activeIdx = -1;
      dropdown.classList.add('open');
    }

    function selectItem(value) {
      const city = value.split(', ')[0]; // Just the city name
      input.value = city;
      dropdown.classList.remove('open');
      input.style.borderColor = '';
    }

    input.addEventListener('input', () => renderResults(input.value));
    input.addEventListener('focus', () => { if (input.value.length >= 2) renderResults(input.value); });

    dropdown.addEventListener('click', (e) => {
      const item = e.target.closest('.city-ac-item');
      if (item) selectItem(item.dataset.value);
    });

    input.addEventListener('keydown', (e) => {
      const items = dropdown.querySelectorAll('.city-ac-item');
      if (!items.length || !dropdown.classList.contains('open')) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIdx = Math.min(activeIdx + 1, items.length - 1);
        items.forEach((it, i) => it.classList.toggle('active', i === activeIdx));
        items[activeIdx].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIdx = Math.max(activeIdx - 1, 0);
        items.forEach((it, i) => it.classList.toggle('active', i === activeIdx));
        items[activeIdx].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter' && activeIdx >= 0) {
        e.preventDefault();
        selectItem(items[activeIdx].dataset.value);
      } else if (e.key === 'Escape') {
        dropdown.classList.remove('open');
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) dropdown.classList.remove('open');
    });
  });
}
initCityAutocomplete();
