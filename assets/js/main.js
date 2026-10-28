/* ─────────────────────────────────────────────────────────────
   The Garden Barber – site scripts
   No libraries; everything here is progressive enhancement, so
   the site still works (and the form still sends) without JS.
   ───────────────────────────────────────────────────────────── */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Footer year ─────────────────────────────────────────── */
  document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ── Header border once scrolled ─────────────────────────── */
  const header = document.getElementById('site-header');
  if (header) {
    const onScroll = () => {
      const scrolled = window.scrollY > 8;
      header.classList.toggle('shadow-soft', scrolled);
      header.classList.toggle('border-sage-900/10', scrolled);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── Mobile menu ─────────────────────────────────────────── */
  const menuBtn = document.getElementById('menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (menuBtn && menu) {
    const setMenu = (open) => {
      menu.dataset.open = String(open);
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menuBtn.querySelector('[data-open-hide]').classList.toggle('hidden', open);
      menuBtn.querySelector('[data-open-show]').classList.toggle('hidden', !open);
    };
    menuBtn.addEventListener('click', () => setMenu(menu.dataset.open !== 'true'));
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => e.key === 'Escape' && setMenu(false));
    window.addEventListener('resize', () => window.innerWidth >= 1024 && setMenu(false));
  }

  /* ── Reveal on scroll ────────────────────────────────────── */
  const reveals = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    reveals.forEach((el) => io.observe(el));
  }

  /* ── Services explorer (tabs) ────────────────────────────── */
  const services = document.querySelector('[data-services]');
  if (services) {
    const tabs = [...services.querySelectorAll('[role="tab"]')];
    const panels = tabs.map((t) => document.getElementById(t.getAttribute('aria-controls')));
    const select = (i, focus) => {
      tabs.forEach((t, j) => {
        const on = i === j;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        panels[j].hidden = !on;
        if (on && !reduceMotion) {
          panels[j].classList.remove('is-entering');
          void panels[j].offsetWidth; // restart the animation
          panels[j].classList.add('is-entering');
        }
      });
      if (focus) tabs[i].focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(i));
      t.addEventListener('keydown', (e) => {
        const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
        if (e.key in keys) { e.preventDefault(); select((i + keys[e.key] + tabs.length) % tabs.length, true); }
        if (e.key === 'Home') { e.preventDefault(); select(0, true); }
        if (e.key === 'End') { e.preventDefault(); select(tabs.length - 1, true); }
      });
    });
    select(0);
  }

  /* ── "Get a quote" buttons pre-select the service ────────── */
  const serviceSelect = document.getElementById('f-service');
  document.querySelectorAll('[data-service]').forEach((el) =>
    el.addEventListener('click', () => {
      const opt = [...serviceSelect.options].find((o) => o.text === el.dataset.service);
      if (opt) serviceSelect.value = opt.value;
    })
  );

  /* ── Before / after sliders ──────────────────────────────── */
  document.querySelectorAll('[data-ba]').forEach((ba) => {
    const handle = ba.querySelector('.ba-handle');
    let pos = 50;
    const set = (p) => {
      pos = Math.max(0, Math.min(100, p));
      ba.style.setProperty('--pos', pos + '%');
      handle.setAttribute('aria-valuenow', String(Math.round(pos)));
      handle.setAttribute('aria-valuetext', Math.round(pos) + '% before');
    };
    const fromEvent = (e) => {
      const r = ba.getBoundingClientRect();
      set(((e.clientX - r.left) / r.width) * 100);
    };
    let dragging = false;
    ba.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      dragging = true;
      ba.classList.add('is-dragging');
      ba.setPointerCapture(e.pointerId);
      fromEvent(e);
    });
    ba.addEventListener('pointermove', (e) => dragging && fromEvent(e));
    const stop = () => { dragging = false; ba.classList.remove('is-dragging'); };
    ba.addEventListener('pointerup', stop);
    ba.addEventListener('pointercancel', stop);
    handle.addEventListener('keydown', (e) => {
      const step = e.shiftKey ? 20 : 5;
      const map = { ArrowLeft: -step, ArrowDown: -step, ArrowRight: step, ArrowUp: step };
      if (e.key in map) { e.preventDefault(); set(pos + map[e.key]); }
      if (e.key === 'Home') { e.preventDefault(); set(0); }
      if (e.key === 'End') { e.preventDefault(); set(100); }
    });
    set(50);

    // A gentle one-off nudge the first time a slider comes into view
    if (!reduceMotion && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        let t0;
        const tick = (now) => {
          if (dragging) return;
          t0 = t0 || now;
          const t = (now - t0) / 1600;
          if (t >= 1) { set(50); return; }
          set(50 + Math.sin(t * Math.PI * 2) * 14 * (1 - t));
          requestAnimationFrame(tick);
        };
        setTimeout(() => requestAnimationFrame(tick), 500);
      }, { threshold: 0.6 });
      io.observe(ba);
    }
  });

  /* ── Gallery lightbox ────────────────────────────────────── */
  const lb = document.getElementById('lightbox');
  const items = [...document.querySelectorAll('[data-gallery] [data-full]')];
  if (lb && items.length) {
    const img = lb.querySelector('[data-lb-img]');
    const cap = lb.querySelector('[data-lb-caption]');
    const count = lb.querySelector('[data-lb-count]');
    let index = 0;
    let lastFocus = null;

    const show = (i) => {
      index = (i + items.length) % items.length;
      const it = items[index];
      img.style.opacity = '0';
      const next = new Image();
      next.onload = next.onerror = () => {
        img.src = it.dataset.full;
        img.alt = it.querySelector('img').alt;
        img.style.opacity = '1';
      };
      next.src = it.dataset.full;
      cap.textContent = it.dataset.caption || '';
      count.textContent = `${index + 1} / ${items.length}`;
    };
    const open = (i) => {
      lastFocus = document.activeElement;
      lb.classList.remove('hidden');
      lb.classList.add('flex');
      document.documentElement.style.overflow = 'hidden';
      show(i);
      lb.querySelector('[data-lb-close]').focus();
    };
    const close = () => {
      lb.classList.add('hidden');
      lb.classList.remove('flex');
      document.documentElement.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    };

    items.forEach((it, i) => it.addEventListener('click', () => open(i)));
    lb.querySelector('[data-lb-close]').addEventListener('click', close);
    lb.querySelector('[data-lb-prev]').addEventListener('click', () => show(index - 1));
    lb.querySelector('[data-lb-next]').addEventListener('click', () => show(index + 1));
    lb.querySelector('[data-lb-stage]').addEventListener('click', (e) => { if (e.target === e.currentTarget) close(); });

    document.addEventListener('keydown', (e) => {
      if (lb.classList.contains('hidden')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
      if (e.key === 'Tab') {
        // keep focus inside the viewer
        const f = [...lb.querySelectorAll('button')].filter((b) => b.offsetParent !== null);
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    // Swipe on touch screens
    let sx = 0, sy = 0;
    lb.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    lb.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(index + (dx < 0 ? 1 : -1));
      else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) close();
    }, { passive: true });
  }

  /* ── Sticky mobile bar: show after the hero, hide over the form ── */
  const bar = document.getElementById('mobile-bar');
  const hero = document.getElementById('top');
  const contact = document.getElementById('contact');
  if (bar && hero && contact && 'IntersectionObserver' in window) {
    let pastHero = false, atContact = false;
    const update = () => (bar.dataset.show = String(pastHero && !atContact));
    new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting && e.boundingClientRect.top < 0; update(); }, { rootMargin: '-55% 0px 0px 0px' }).observe(hero);
    new IntersectionObserver(([e]) => { atContact = e.isIntersecting; update(); }, { threshold: 0.15 }).observe(contact);
  }

  /* ── Quote form: inline validation + sending state ───────── */
  const form = document.getElementById('quote-form');
  if (form) {
    const fields = [...form.querySelectorAll('.field[aria-describedby]')];
    const check = (f) => {
      const v = f.value.trim();
      let ok = true;
      if (f.required && !v) ok = false;
      if (f.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) ok = false;
      if (f.type === 'tel' && v && v.replace(/\D/g, '').length < 6) ok = false;
      f.setAttribute('aria-invalid', String(!ok));
      return ok;
    };
    fields.forEach((f) => {
      f.addEventListener('blur', () => f.value.trim() && check(f));
      f.addEventListener('input', () => f.getAttribute('aria-invalid') === 'true' && check(f));
    });
    form.addEventListener('submit', (e) => {
      const bad = fields.filter((f) => !check(f));
      if (bad.length) { e.preventDefault(); bad[0].focus(); return; }
      const btn = form.querySelector('[data-submit]');
      btn.disabled = true;
      btn.classList.add('opacity-80', 'cursor-wait');
      btn.querySelector('[data-label]').textContent = 'Sending…';
    });
    // If the visitor comes back with the browser's back button, reset the button
    window.addEventListener('pageshow', () => {
      const btn = form.querySelector('[data-submit]');
      btn.disabled = false;
      btn.classList.remove('opacity-80', 'cursor-wait');
      btn.querySelector('[data-label]').textContent = 'Send message';
    });
  }
})();
