/* ============================================================
   NESTLING NIPPERS — shared script
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- mobile nav toggle (dropdown, matches tested pattern) ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', (e) => {
      e.preventDefault();
      navToggle.classList.toggle('active');
      mainNav.classList.toggle('active');
      const expanded = navToggle.classList.contains('active');
      navToggle.setAttribute('aria-expanded', expanded);
    });
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        mainNav.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- highlight active nav link ---------- */
  const here = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.main-nav a').forEach(a => {
    const target = a.getAttribute('href');
    if (target === here || (here === '' && target === 'index.html')) {
      a.classList.add('active-link');
    }
  });

  /* ---------- back to top button ---------- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('show', window.scrollY > 500);
    });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- accordion (Parents' Corner) ---------- */
  document.querySelectorAll('.accordion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.accordion-item');
      const panel = item.querySelector('.accordion-panel');
      const isOpen = item.classList.contains('open');

      const group = item.parentElement;
      group.querySelectorAll('.accordion-item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.accordion-panel').style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove('open');
        panel.style.maxHeight = null;
      } else {
        item.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  /* ============================================================
     SKELETON LOADING — every element with class "skel" contains
     either an <img> or a <video>. We reveal it (fade in, drop the
     shimmer) only once the real media has actually finished
     loading, and we never touch its natural resolution.
     ============================================================ */
  document.querySelectorAll('.skel').forEach(box => {
    const img = box.querySelector('img');
    const video = box.querySelector('video');

    if (img) {
      if (img.complete && img.naturalWidth > 0) {
        box.classList.add('loaded');
      } else {
        img.addEventListener('load', () => box.classList.add('loaded'));
        img.addEventListener('error', () => box.classList.add('loaded')); // avoid stuck shimmer
      }
    }
    if (video) {
      if (video.readyState >= 3) {
        box.classList.add('loaded');
      } else {
        video.addEventListener('canplay', () => box.classList.add('loaded'));
        video.addEventListener('error', () => box.classList.add('loaded'));
      }
    }
  });

  /* ---------- hero video: video is primary; SVG scene is fallback only ---------- */
  document.querySelectorAll('.hero-video-wrap video').forEach(video => {
    const wrap = video.closest('.hero-video-wrap');
    const heroSection = wrap.closest('.hero, .page-hero');

    video.addEventListener('error', () => {
      wrap.classList.add('video-failed');
      if (heroSection) heroSection.classList.add('no-video');
    });
    // if no <source> resolves at all, readyState stays 0 — check shortly after load
    setTimeout(() => {
      if (video.readyState === 0) {
        wrap.classList.add('video-failed');
        if (heroSection) heroSection.classList.add('no-video');
      }
    }, 1500);
  });

  /* ---------- simple client-side contact form ---------- */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.parentName.value.trim();
      const phone = contactForm.phone.value.trim();
      const email = contactForm.email.value.trim();
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      const phoneOk = /^[0-9+\-\s]{8,15}$/.test(phone);

      if (!name || !emailOk || !phoneOk) {
        formStatus.textContent = "Please check the highlighted fields — we need a valid name, phone and email to get back to you.";
        formStatus.className = 'show err';
        return;
      }
      formStatus.textContent = "Thank you, " + name.split(' ')[0] + "! Your enquiry has been noted. Our admissions team will call you within 1 working day.";
      formStatus.className = 'show ok';
      contactForm.reset();
    });
  }

  /* ---------- footer year ---------- */
  document.querySelectorAll('.year-now').forEach(el => el.textContent = new Date().getFullYear());

});
