/* ═══════════════════════════════════════════
   HANDELD — script.js
   Interactions, animations, and behavior
═══════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── DOM REFS ─── */
  const navbar       = document.getElementById('navbar');
  const hamburger    = document.getElementById('hamburger');
  const navLinks     = document.getElementById('navLinks');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const storeModal    = document.getElementById('storeModal');
  const storeModalName = document.getElementById('storeModalName');

  /* ═══════════════════════
     NAVBAR: scroll + mobile
  ════════════════════════ */

  // Sticky shadow on scroll
  const handleNavScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // Mobile menu toggle
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    mobileOverlay.classList.toggle('show', isOpen);
    mobileOverlay.style.display = 'block';
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileOverlay.addEventListener('click', closeMenu);

  // Close menu on nav link click
  document.querySelectorAll('.nav-link, .nav-cta-btn').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  function closeMenu() {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    mobileOverlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
     STORE MODAL
  â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
  const modalTriggers = document.querySelectorAll('[data-modal-trigger]');
  const modalCloseEls = storeModal ? storeModal.querySelectorAll('[data-modal-close]') : [];

  function openStoreModal(storeName = 'App Store') {
    if (!storeModal) return;
    storeModal.classList.add('show');
    storeModal.setAttribute('aria-hidden', 'false');
    if (storeModalName) storeModalName.textContent = storeName;
    document.body.style.overflow = 'hidden';
  }

  function closeStoreModal() {
    if (!storeModal) return;
    storeModal.classList.remove('show');
    storeModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const storeName = trigger.getAttribute('data-store') || 'App Store';
      openStoreModal(storeName);
    });
  });

  modalCloseEls.forEach(el => el.addEventListener('click', closeStoreModal));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeStoreModal();
  });

  /* ═══════════════════════
     SCROLL REVEAL
  ════════════════════════ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target); // fire once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ═══════════════════════
     FAQ ACCORDION
  ════════════════════════ */
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-q');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });

      // Toggle clicked
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ═══════════════════════
     SMOOTH SCROLLING
  ════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ═══════════════════════
     ACTIVE NAV LINK (scrollspy)
  ════════════════════════ */
  const sections = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link');

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinkEls.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => spyObserver.observe(s));

  // Style for active nav link
  const style = document.createElement('style');
  style.textContent = `.nav-link.active { color: var(--purple-600) !important; background: var(--purple-100); }`;
  document.head.appendChild(style);

  /* ═══════════════════════
     TILT / HOVER — feature cards
  ════════════════════════ */
  document.querySelectorAll('.feature-card, .testi-card, .pricing-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
      card.style.transition = 'transform 0.1s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s cubic-bezier(.4,0,.2,1), box-shadow 0.3s ease, border-color 0.3s ease';
    });
  });

  /* ═══════════════════════
     BREATHING TEXT CYCLE
  ════════════════════════ */
  const bcText = document.querySelector('.bc-text');
  if (bcText) {
    const breatheStates = ['Breathe In', 'Hold...', 'Breathe Out', 'Rest...'];
    const breatheDurations = [4000, 2000, 4000, 2000];
    let breatheIdx = 0;

    function cycleBreath() {
      bcText.style.opacity = '0';
      setTimeout(() => {
        breatheIdx = (breatheIdx + 1) % breatheStates.length;
        bcText.textContent = breatheStates[breatheIdx];
        bcText.style.opacity = '1';
      }, 400);
      setTimeout(cycleBreath, breatheDurations[breatheIdx]);
    }

    bcText.style.transition = 'opacity 0.4s ease';
    setTimeout(cycleBreath, breatheDurations[0]);
  }

  /* ═══════════════════════
     COUNTER ANIMATION
  ════════════════════════ */
  function animateCounter(el, target, suffix = '') {
    const duration = 1800;
    const start = performance.now();
    const isDecimal = target % 1 !== 0;

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = isDecimal
        ? (eased * target).toFixed(1)
        : Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const nums = entry.target.querySelectorAll('.stat-num');
        nums.forEach(num => {
          const text = num.textContent;
          if (text.includes('K')) animateCounter(num, 50, 'K+');
          else if (text.includes('%')) animateCounter(num, 98, '%');
          else if (text.includes('.')) animateCounter(num, 4.9, '');
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);

  /* ═══════════════════════
     PROGRESS BAR ANIMATION
  ════════════════════════ */
  const progressBar = document.querySelector('.progress-fill');
  if (progressBar) {
    const pObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          pObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    progressBar.style.animationPlayState = 'paused';
    pObs.observe(progressBar);
  }

  /* ═══════════════════════
     PARALLAX ORBS (hero)
  ════════════════════════ */
  const orbs = document.querySelectorAll('.orb');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        orbs.forEach((orb, i) => {
          const speed = (i + 1) * 0.15;
          orb.style.transform = `translateY(${scrollY * speed}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  /* ═══════════════════════
     PRICING: token count pulse on hover
  ════════════════════════ */
  document.querySelectorAll('.pricing-card').forEach(card => {
    const tokenCount = card.querySelector('.pc-token-count');
    if (!tokenCount) return;
    card.addEventListener('mouseenter', () => {
      tokenCount.style.transform = 'scale(1.15)';
      tokenCount.style.transition = 'transform 0.25s cubic-bezier(.4,0,.2,1)';
    });
    card.addEventListener('mouseleave', () => {
      tokenCount.style.transform = 'scale(1)';
    });
  });

  /* ═══════════════════════
     RIPPLE ON CTA BUTTONS
  ════════════════════════ */
  document.querySelectorAll('.btn-primary, .pc-btn-featured, .pc-btn-elite').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position:absolute;
        border-radius:50%;
        width:${size}px;
        height:${size}px;
        top:${e.clientY - rect.top - size/2}px;
        left:${e.clientX - rect.left - size/2}px;
        background:rgba(255,255,255,0.25);
        pointer-events:none;
        animation:ripple-anim 0.6s ease-out forwards;
      `;
      const existingRipple = this.querySelector('.ripple-span');
      if (existingRipple) existingRipple.remove();
      ripple.classList.add('ripple-span');
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  // Ripple keyframe
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
    @keyframes ripple-anim {
      from { transform: scale(0); opacity: 1; }
      to   { transform: scale(2.5); opacity: 0; }
    }
  `;
  document.head.appendChild(rippleStyle);

  /* ═══════════════════════
     TRUST LOGOS: auto-scroll
  ════════════════════════ */
  const trustedLogos = document.querySelector('.trusted-logos');
  if (trustedLogos) {
    // Duplicate for seamless loop
    const clone = trustedLogos.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    trustedLogos.parentNode.appendChild(clone);

    const wrap = document.createElement('div');
    wrap.style.cssText = `
      display:flex;
      gap:36px;
      animation: marquee 24s linear infinite;
      width: max-content;
    `;
    // Move logos into wrapper
    const logos1 = trustedLogos.querySelectorAll('.trust-logo');
    const logos2 = clone.querySelectorAll('.trust-logo');

    logos1.forEach(l => wrap.appendChild(l.cloneNode(true)));
    logos2.forEach(l => wrap.appendChild(l.cloneNode(true)));

    trustedLogos.innerHTML = '';
    clone.remove();
    trustedLogos.appendChild(wrap);
    trustedLogos.style.overflow = 'hidden';
    trustedLogos.style.flex = '1';
    trustedLogos.style.display = 'block';
  }

  /* ═══════════════════════
     SCREEN CARDS: subtle rotate interaction
  ════════════════════════ */
  document.querySelectorAll('.screen-card').forEach((card, i) => {
    setTimeout(() => {
      card.style.opacity = '1';
    }, i * 120);
  });

  /* ═══════════════════════
     FLOATING CHIPS: random micro-animation offsets
  ════════════════════════ */
  document.querySelectorAll('.floating-chip').forEach(chip => {
    chip.style.animationDuration = `${5 + Math.random() * 3}s`;
    chip.style.animationDelay = `${-Math.random() * 4}s`;
  });

  /* ═══════════════════════
     CURSOR GLOW (desktop only)
  ════════════════════════ */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const cursor = document.createElement('div');
    cursor.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(168,85,247,0.35), transparent);
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      transition: transform 0.15s ease, width 0.25s ease, height 0.25s ease, opacity 0.3s ease;
      opacity: 0;
    `;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top  = e.clientY + 'px';
      cursor.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
    });

    document.querySelectorAll('a, button, .feature-card, .testi-card, .pricing-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width = '40px';
        cursor.style.height = '40px';
        cursor.style.background = 'radial-gradient(circle, rgba(168,85,247,0.2), transparent)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.width = '20px';
        cursor.style.height = '20px';
        cursor.style.background = 'radial-gradient(circle, rgba(168,85,247,0.35), transparent)';
      });
    });
  }

  /* ═══════════════════════
     PAGE LOAD ANIMATION
  ════════════════════════ */
  window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.4s ease';
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });

  // Fallback if load already fired
  if (document.readyState === 'complete') {
    document.body.style.opacity = '1';
  }

  console.log('%c✦ Handeld', 'font-family:Sora,sans-serif;font-size:24px;font-weight:800;background:linear-gradient(135deg,#9333ea,#3b82f6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;padding:8px 0;');
  console.log('%cSmarter Decisions. Calmer Mind. Better Living.', 'color:#7c6fa0;font-size:13px;');

})();
