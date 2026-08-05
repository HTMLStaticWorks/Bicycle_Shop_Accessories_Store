/**
 * CycleNest - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll progress indicator
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  document.body.appendChild(progress);

  // Sticky Navbar + progress (single rAF-throttled scroll handler)
  const header = document.querySelector('.header');
  const hero = document.querySelector('.hero');
  const heroImage = document.querySelector('.hero-image');
  let ticking = false;

  // Let the header float transparently over dark, full-bleed heroes
  if (header && document.querySelector('.hero, .hero-split')) {
    header.classList.add('over-dark');
  }

  const onScroll = () => {
    const y = window.scrollY;

    if (header) {
      header.classList.toggle('scrolled', y > 24);
    }

    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;

    // Gentle parallax drift on the hero photograph
    if (heroImage && hero && !reduceMotion && y < window.innerHeight) {
      heroImage.style.transform = `translate3d(0, ${y * 0.08}px, 0) scale(1.02)`;
    }

    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
  onScroll();

  // Mobile Drawer
  const hamburger = document.querySelector('.hamburger');
  const drawer = document.querySelector('.mobile-drawer');
  const closeDrawer = document.querySelector('.drawer-close');

  if (hamburger && drawer && closeDrawer) {
    const setDrawer = (open) => {
      drawer.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      hamburger.setAttribute('aria-expanded', String(open));
    };

    hamburger.addEventListener('click', () => setDrawer(true));
    closeDrawer.addEventListener('click', () => setDrawer(false));

    // Close when a destination is chosen
    drawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => setDrawer(false));
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (drawer.classList.contains('open') && !drawer.contains(e.target) && !hamburger.contains(e.target)) {
        setDrawer(false);
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) setDrawer(false);
    });
  }

  // Theme Toggle
  const themeToggles = document.querySelectorAll('.theme-toggle');

  const syncThemeIcons = () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    themeToggles.forEach(toggle => {
      const icon = toggle.querySelector('i');
      if (icon) icon.className = isDark ? 'ph ph-sun' : 'ph ph-moon';
      toggle.setAttribute('aria-pressed', String(isDark));
    });
  };

  const currentTheme = localStorage.getItem('theme');
  if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  syncThemeIcons();

  const THEME_SWEEP_MS = 620;
  const THEME_EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';

  const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    syncThemeIcons();
  };

  // Origin of the sweep: the centre of the icon that was clicked
  const toggleOrigin = (toggle) => {
    const rect = toggle.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  };

  // Distance from the origin to the furthest viewport corner
  const cornerRadius = (x, y) =>
    Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

  // Fallback for browsers without the View Transitions API: sweep a solid veil
  // painted in the colour of whichever theme is being covered up.
  const veilSweep = (toggle, newTheme) => {
    const { x, y } = toggleOrigin(toggle);
    const r = cornerRadius(x, y);
    const toDark = newTheme === 'dark';
    const styles = getComputedStyle(document.documentElement);
    // Either way the veil wears the light backdrop: going light it grows out of
    // the icon ahead of the swap, going dark it collapses back into it after.
    const veil = document.createElement('div');
    veil.className = 'theme-veil';
    veil.style.background = styles.getPropertyValue('--veil-light').trim() || '#ffffff';

    const from = toDark ? `circle(${r}px at ${x}px ${y}px)` : `circle(0px at ${x}px ${y}px)`;
    const to = toDark ? `circle(0px at ${x}px ${y}px)` : `circle(${r}px at ${x}px ${y}px)`;
    veil.style.clipPath = from; // seed it so the first painted frame is already clipped

    document.body.appendChild(veil);
    if (toDark) applyTheme(newTheme);

    const anim = veil.animate({ clipPath: [from, to] }, { duration: THEME_SWEEP_MS, easing: THEME_EASE, fill: 'forwards' });
    anim.finished.catch(() => {}).then(() => {
      if (!toDark) applyTheme(newTheme);
      veil.remove();
    });
  };

  const sweepTheme = (toggle, newTheme) => {
    if (reduceMotion || !document.startViewTransition) {
      if (reduceMotion) { applyTheme(newTheme); return; }
      veilSweep(toggle, newTheme);
      return;
    }

    const { x, y } = toggleOrigin(toggle);
    const r = cornerRadius(x, y);
    const toDark = newTheme === 'dark';

    document.documentElement.classList.add('theme-sweeping');
    const transition = document.startViewTransition(() => applyTheme(newTheme));

    transition.ready.then(() => {
      const clip = [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`];
      document.documentElement.animate(
        // Light: the new theme grows out of the icon.
        // Dark: the old theme collapses back into the icon, uncovering the new one.
        { clipPath: toDark ? clip.slice().reverse() : clip },
        {
          duration: THEME_SWEEP_MS,
          easing: THEME_EASE,
          pseudoElement: toDark ? '::view-transition-old(root)' : '::view-transition-new(root)'
        }
      );
    }).catch(() => {});

    transition.finished.catch(() => {}).then(() => {
      document.documentElement.classList.remove('theme-sweeping');
    });
  };

  themeToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const theme = document.documentElement.getAttribute('data-theme');
      sweepTheme(toggle, theme === 'dark' ? 'light' : 'dark');
    });
  });

  // RTL Toggle
  const rtlToggles = document.querySelectorAll('.rtl-toggle');
  let isRTL = localStorage.getItem('rtl') === 'true';

  const applyRTL = (rtl) => {
    if (rtl) {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.removeAttribute('dir');
    }
  };

  applyRTL(isRTL);

  rtlToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      isRTL = !isRTL;
      applyRTL(isRTL);
      localStorage.setItem('rtl', isRTL.toString());
    });
  });

  // Scroll reveal — staggered per group, class-driven so no-JS still renders
  const revealTargets = document.querySelectorAll(
    '.card, .section-header, .tile, .service-row, .booking-panel, .grid > *, .page-hero .container'
  );

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const siblings = Array.from(entry.target.parentElement.children).indexOf(entry.target);
        entry.target.style.transitionDelay = `${Math.min(Math.max(siblings, 0), 4) * 60}ms`;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(el => {
      el.classList.add('reveal');
      observer.observe(el);
    });
  }
});
