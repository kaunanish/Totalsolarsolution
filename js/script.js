// ===================== TSS Landing Page JS =====================
document.addEventListener('DOMContentLoaded', () => {

  /* ---- Dark mode toggle ---- */
  // All localStorage calls are wrapped in try/catch: on file:// pages (and some
  // browsers with strict privacy settings) localStorage access can throw instead
  // of failing quietly, which would otherwise stop every script below this point
  // from running (including the slideshow).
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  let storedTheme = null;
  try { storedTheme = localStorage.getItem('tss-theme'); } catch (err) { /* storage unavailable */ }
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (storedTheme) {
    root.setAttribute('data-theme', storedTheme);
  } else if (prefersDark) {
    root.setAttribute('data-theme', 'dark');
  }
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      const next = isDark ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('tss-theme', next); } catch (err) { /* storage unavailable */ }
    });
  }

  /* ---- Preloader ---- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('hide'), 300);
  });
  // fallback in case load event already fired
  setTimeout(() => preloader && preloader.classList.add('hide'), 2000);

  /* ---- Footer year ---- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Navbar scroll shadow ---- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });

  /* ---- Hamburger menu ---- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* ---- Active nav link on scroll ---- */
  const sections = document.querySelectorAll('section[id], header[id]');
  const navAnchors = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  });

  /* ---- Reveal on scroll ---- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---- Count-up stats ---- */
  const statNums = document.querySelectorAll('.stat-num');
  const animateCount = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const isYear = target === 2018;
    if (isYear) { el.textContent = target; return; } // establishment year shouldn't count up
    let current = 0;
    const duration = 1500;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = target / steps;
    const tick = () => {
      current += increment;
      if (current >= target) {
        el.textContent = target.toLocaleString('en-IN') + suffix;
      } else {
        el.textContent = Math.floor(current).toLocaleString('en-IN') + suffix;
        requestAnimationFrame(tick);
      }
    };
    tick();
  };
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(el => statObserver.observe(el));

  /* ---- Slideshow ---- */
  const track = document.getElementById('slidesTrack');
  const slides = track ? Array.from(track.children) : [];
  const dotsWrap = document.getElementById('slideDots');
  const prevBtn = document.getElementById('slidePrev');
  const nextBtn = document.getElementById('slideNext');
  let currentSlide = 0;
  let slideTimer;

  if (track && slides.length) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === 0);
      const dot = document.createElement('span');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsWrap.appendChild(dot);
    });

    function updateSlide() {
      slides.forEach((slide, i) => slide.classList.toggle('active', i === currentSlide));
      Array.from(dotsWrap.children).forEach((d, i) => d.classList.toggle('active', i === currentSlide));
    }
    function goToSlide(i) {
      currentSlide = (i + slides.length) % slides.length;
      updateSlide();
      resetTimer();
    }
    function nextSlide() { goToSlide(currentSlide + 1); }
    function prevSlide() { goToSlide(currentSlide - 1); }
    function resetTimer() {
      clearInterval(slideTimer);
      slideTimer = setInterval(nextSlide, 4500);
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    resetTimer();

    // basic touch swipe support
    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
    track.addEventListener('touchend', (e) => {
      const diff = e.changedTouches[0].clientX - touchStartX;
      if (diff > 50) prevSlide();
      else if (diff < -50) nextSlide();
    });
  }

  /* ---- Enquiry form -> WhatsApp ---- */
  const enquiryForm = document.getElementById('enquiryForm');
  const formStatus = document.getElementById('formStatus');
  const WHATSAPP_NUMBER = '917855939461'; // TSS business WhatsApp number, with country code, no + or spaces

  if (enquiryForm) {
    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = new FormData(enquiryForm);
      const name = (data.get('Name') || '').toString().trim();
      const phone = (data.get('Phone') || '').toString().trim();
      const email = (data.get('Email') || '').toString().trim();
      const branch = (data.get('Branch') || '').toString().trim();
      const message = (data.get('Message') || '').toString().trim();

      const lines = ['New Enquiry - TSS Website', '', `Name: ${name}`, `Phone: ${phone}`];
      if (email) lines.push(`Email: ${email}`);
      if (branch) lines.push(`Branch: ${branch}`);
      if (message) lines.push(`Message: ${message}`);

      const waText = encodeURIComponent(lines.join('\n'));
      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

      // Best-effort copy to email in the background too, in case the visitor
      // closes WhatsApp before hitting Send. We don't wait on or read the
      // response — WhatsApp is the primary channel here.
      try {
        fetch(enquiryForm.action, { method: 'POST', body: data, mode: 'no-cors' });
      } catch (err) { /* ignore - email is just a bonus backup */ }

      window.open(waUrl, '_blank');

      // Google Ads conversion tracking — this form submission IS the
      // conversion event (no separate "thank you" page on this site).
      if (typeof gtag === 'function') {
        gtag('event', 'conversion', {
          'send_to': 'AW-18328387983/TBP4CITZ1NEcEI-D1KNE',
          'value': 1.0,
          'currency': 'INR'
        });
      }

      if (formStatus) {
        formStatus.textContent = 'Opening WhatsApp — just hit Send to complete your enquiry!';
        formStatus.classList.add('show');
      }
      enquiryForm.reset();
    });
  }

});
