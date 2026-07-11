/* ==========================================================================
   Mithra U — Portfolio Script
   Vanilla JS — no frameworks
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------
     0. Loading screen
  ------------------------------------------------------------------ */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 500);
  });
  // Fallback in case 'load' already fired
  setTimeout(() => loader.classList.add('hidden'), 2500);

  /* ------------------------------------------------------------------
     1. AOS init
  ------------------------------------------------------------------ */
  if (window.AOS) {
    AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic' });
  }

  /* ------------------------------------------------------------------
     2. Theme toggle (dark default / light mode)
  ------------------------------------------------------------------ */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const themeIcon = themeToggle.querySelector('i');

  const applyTheme = (theme) => {
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    } else {
      root.removeAttribute('data-theme');
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
    }
  };

  let savedTheme = 'dark';
  try { savedTheme = window.localStorage.getItem('mu-theme') || 'dark'; } catch (e) { /* storage unavailable */ }
  applyTheme(savedTheme);

  themeToggle.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    const next = isLight ? 'dark' : 'light';
    applyTheme(next);
    try { window.localStorage.setItem('mu-theme', next); } catch (e) { /* ignore */ }
  });

  /* ------------------------------------------------------------------
     3. Sticky navbar + active link highlighting
  ------------------------------------------------------------------ */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('[data-nav]');
  const sections = document.querySelectorAll('main section[id]');

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);

    // Scroll progress bar
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    document.getElementById('scrollBar').style.width = progress + '%';

    // Scroll-to-top visibility
    document.getElementById('scrollTopBtn').classList.toggle('visible', scrollTop > 500);

    // Active nav link
    let current = sections[0]?.id;
    const offset = 120;
    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - offset) current = section.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ------------------------------------------------------------------
     4. Mobile hamburger menu
  ------------------------------------------------------------------ */
  const hamburger = document.getElementById('hamburger');
  const navLinksList = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinksList.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  navLinksList.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinksList.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ------------------------------------------------------------------
     5. Scroll to top button
  ------------------------------------------------------------------ */
  document.getElementById('scrollTopBtn').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ------------------------------------------------------------------
     6. Typed.js hero role rotator (with vanilla fallback)
  ------------------------------------------------------------------ */
  const roles = ['Software Engineer', 'Full Stack Developer', 'Java Developer', 'UI/UX Designer', 'Tech Enthusiast'];
  const typedTarget = document.getElementById('typed');

  if (window.Typed) {
    new Typed('#typed', {
      strings: roles,
      typeSpeed: 55,
      backSpeed: 30,
      backDelay: 1400,
      loop: true,
      showCursor: false
    });
  } else {
    // Fallback vanilla typing animation
    let roleIndex = 0, charIndex = 0, deleting = false;
    const type = () => {
      const current = roles[roleIndex];
      typedTarget.textContent = deleting
        ? current.substring(0, charIndex--)
        : current.substring(0, charIndex++);

      let delay = deleting ? 30 : 55;
      if (!deleting && charIndex === current.length + 1) { delay = 1400; deleting = true; }
      if (deleting && charIndex === 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; delay = 300; }
      setTimeout(type, delay);
    };
    type();
  }

  /* ------------------------------------------------------------------
     7. Animated skill progress bars (trigger on scroll into view)
  ------------------------------------------------------------------ */
  const skillFills = document.querySelectorAll('.skill-fill');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.width = el.dataset.value + '%';
        skillObserver.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  skillFills.forEach((el) => skillObserver.observe(el));

  /* ------------------------------------------------------------------
     8. Animated counters (achievements)
  ------------------------------------------------------------------ */
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1500;
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      };
      requestAnimationFrame(step);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach((el) => counterObserver.observe(el));

  /* ------------------------------------------------------------------
     9. Vanilla Tilt on project cards
  ------------------------------------------------------------------ */
  if (window.VanillaTilt) {
    VanillaTilt.init(document.querySelectorAll('.tilt'), {
      max: 8,
      speed: 400,
      glare: true,
      'max-glare': 0.15,
      scale: 1.02
    });
  }

  /* ------------------------------------------------------------------
     10. Ripple button effect
  ------------------------------------------------------------------ */
  document.querySelectorAll('.ripple').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple-effect';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* ------------------------------------------------------------------
     11. Contact form (client-side only demo submission)
  ------------------------------------------------------------------ */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();

    formStatus.textContent = `Thanks ${name || 'there'}! Your message has been noted. I'll get back to you soon.`;
    contactForm.reset();

    setTimeout(() => { formStatus.textContent = ''; }, 6000);
  });

  /* ------------------------------------------------------------------
     12. Resume download placeholder
  ------------------------------------------------------------------ */
  const resumeBtn = document.getElementById('resumeBtn');
  resumeBtn.addEventListener('click', (e) => {
    // No actual resume file bundled with this template — replace href
    // with a real resume PDF path to enable a genuine download.
    if (resumeBtn.getAttribute('href') === '#') {
      e.preventDefault();
      formStatus && (formStatus.textContent = '');
      alert('Add your resume PDF and update the Download Resume button link in index.html.');
    }
  });

  /* ------------------------------------------------------------------
     13. Custom cursor (dot + ring) with hover states
  ------------------------------------------------------------------ */
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

  let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
  let ringX = mouseX, ringY = mouseY;

  if (!isTouchDevice) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    };
    animateRing();

    document.querySelectorAll('a, button, input, textarea, .tilt').forEach((el) => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('active'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('active'));
    });
  } else {
    cursorDot.style.display = 'none';
    cursorRing.style.display = 'none';
  }

  /* ------------------------------------------------------------------
     14. Signature element — Constellation network canvas
     A field of glowing particles that link into a network of lines,
     brightening and connecting toward the cursor — representing
     Mithra's world of connected technologies and systems.
  ------------------------------------------------------------------ */
  const canvas = document.getElementById('constellation');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let width, height;
  const pointer = { x: null, y: null, active: false };

  const palette = ['#7B2FF7', '#F107A3', '#5EFCE8', '#00DBDE'];

  const resizeCanvas = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const createParticles = () => {
    const density = Math.min(90, Math.floor((width * height) / 16000));
    particles = Array.from({ length: density }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.8,
      color: palette[Math.floor(Math.random() * palette.length)]
    }));
  };
  createParticles();
  window.addEventListener('resize', createParticles);

  window.addEventListener('mousemove', (e) => {
    pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true;
  });
  window.addEventListener('mouseleave', () => { pointer.active = false; });

  const linkDist = 130;
  const pointerLinkDist = 190;

  const drawFrame = () => {
    ctx.clearRect(0, 0, width, height);

    // Move + draw particles
    particles.forEach((p) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Link nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < linkDist) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(94, 252, 232, ${0.14 * (1 - dist / linkDist)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }

      // Link to pointer
      if (pointer.active) {
        const dx = particles[i].x - pointer.x, dy = particles[i].y - pointer.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < pointerLinkDist) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.strokeStyle = `rgba(241, 7, 163, ${0.35 * (1 - dist / pointerLinkDist)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Pointer glow node
    if (pointer.active) {
      const grad = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 60);
      grad.addColorStop(0, 'rgba(94, 252, 232, 0.25)');
      grad.addColorStop(1, 'rgba(94, 252, 232, 0)');
      ctx.beginPath();
      ctx.fillStyle = grad;
      ctx.arc(pointer.x, pointer.y, 60, 0, Math.PI * 2);
      ctx.fill();
    }

    if (!prefersReducedMotion) requestAnimationFrame(drawFrame);
  };

  drawFrame();

  /* ------------------------------------------------------------------
     15. Parallax on aurora blobs (subtle, mouse-driven)
  ------------------------------------------------------------------ */
  if (!isTouchDevice && !prefersReducedMotion) {
    const blobs = document.querySelectorAll('.aurora-blob');
    window.addEventListener('mousemove', (e) => {
      const xRatio = (e.clientX / window.innerWidth - 0.5);
      const yRatio = (e.clientY / window.innerHeight - 0.5);
      blobs.forEach((blob, i) => {
        const depth = (i + 1) * 8;
        blob.style.transform = `translate(${xRatio * depth}px, ${yRatio * depth}px)`;
      });
    });
  }

});