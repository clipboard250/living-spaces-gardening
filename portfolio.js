/* ============================================================
   Living Spaces Gardening — portfolio + project pages
   ============================================================ */
(function () {
  'use strict';

  /* ---------- nav ---------- */
  var nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 60 || true);
    });
  }
  window.toggleMenu = function () {
    var menu = document.getElementById('navLinks');
    var btn = document.querySelector('.hamburger');
    menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', menu.classList.contains('open'));
  };
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    a.addEventListener('click', function () {
      document.getElementById('navLinks').classList.remove('open');
    });
  });

  /* ---------- contact modals (same behaviour as homepage) ---------- */
  var isMobile =
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    'ontouchstart' in window ||
    window.innerWidth < 1024;

  function open(id) {
    var el = document.getElementById(id);
    if (el) {
      el.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }
  function close(id) {
    var el = document.getElementById(id);
    if (el) {
      el.classList.remove('open');
      document.body.style.overflow = '';
    }
  }
  window.openSMS = function (e) {
    if (e) e.preventDefault();
    open(isMobile ? 'pickerModal' : 'emailModal');
  };
  window.openSMSDirect = function () { open('smsModal'); };
  window.openEmailDirect = function (e) { if (e) e.preventDefault(); open('emailModal'); };
  window.closePicker = function () { close('pickerModal'); };
  window.closeSMS = function () { close('smsModal'); };
  window.closeEmail = function () { close('emailModal'); };

  ['pickerModal', 'smsModal', 'emailModal'].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('click', function (e) { if (e.target === this) close(id); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { close('pickerModal'); close('smsModal'); close('emailModal'); }
  });

  /* ---------- cookie banner ---------- */
  if (!localStorage.getItem('cookies')) {
    var cb = document.getElementById('cookieBanner');
    if (cb) cb.style.display = 'flex';
  }

  /* ---------- card carousels ---------- */
  document.querySelectorAll('.pcard-media').forEach(function (media) {
    var count = parseInt(media.dataset.count, 10) || 1;
    if (count < 2) return;

    var track = media.querySelector('.pcard-track');
    var slides = media.querySelectorAll('.pcard-slide');
    var dots = media.querySelectorAll('.pcard-dot');
    var counter = media.querySelector('.pcard-count b');
    var prev = media.querySelector('.pcard-prev');
    var next = media.querySelector('.pcard-next');
    var i = 0;

    function render() {
      track.style.transform = 'translateX(' + -i * 100 + '%)';
      dots.forEach(function (d, n) {
        d.classList.toggle('is-on', n === i);
        d.setAttribute('aria-selected', n === i);
      });
      slides.forEach(function (s, n) { s.tabIndex = n === i ? 0 : -1; });
      if (counter) counter.textContent = i + 1;
      if (prev) prev.disabled = i === 0;
      if (next) next.disabled = i === count - 1;
    }
    function go(n) {
      i = Math.max(0, Math.min(count - 1, n));
      render();
    }

    if (prev) prev.addEventListener('click', function (e) { e.preventDefault(); go(i - 1); });
    if (next) next.addEventListener('click', function (e) { e.preventDefault(); go(i + 1); });
    dots.forEach(function (d) {
      d.addEventListener('click', function (e) { e.preventDefault(); go(parseInt(d.dataset.go, 10)); });
    });

    /* pointer swipe — drag must not fire the link */
    var down = false, startX = 0, dx = 0, moved = false;

    media.addEventListener('pointerdown', function (e) {
      if (e.target.closest('.pcard-arrow, .pcard-dot')) return;
      down = true; moved = false; startX = e.clientX; dx = 0;
      track.classList.add('is-dragging');
    });
    media.addEventListener('pointermove', function (e) {
      if (!down) return;
      dx = e.clientX - startX;
      if (Math.abs(dx) > 8) moved = true;
      var pct = (dx / media.offsetWidth) * 100;
      if ((i === 0 && dx > 0) || (i === count - 1 && dx < 0)) pct *= 0.3; // resistance at the ends
      track.style.transform = 'translateX(' + (-i * 100 + pct) + '%)';
    });
    function release() {
      if (!down) return;
      down = false;
      track.classList.remove('is-dragging');
      if (Math.abs(dx) > media.offsetWidth * 0.18) { go(dx < 0 ? i + 1 : i - 1); } else { render(); }
    }
    media.addEventListener('pointerup', release);
    media.addEventListener('pointercancel', release);
    media.addEventListener('pointerleave', release);

    /* a real drag shouldn't open the project page */
    slides.forEach(function (s) {
      s.addEventListener('click', function (e) {
        if (moved) { e.preventDefault(); moved = false; }
      });
      s.addEventListener('dragstart', function (e) { e.preventDefault(); });
    });

    /* arrow keys when a slide has focus */
    media.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1); media.querySelector('.pcard-slide[tabindex="0"]').focus(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); media.querySelector('.pcard-slide[tabindex="0"]').focus(); }
    });

    render();
  });

  /* ---------- before / after slider ---------- */
  document.querySelectorAll('[data-ba]').forEach(function (frame) {
    var range = frame.querySelector('.ba-range');
    if (!range) return;
    function paint() { frame.style.setProperty('--pos', range.value + '%'); }
    range.addEventListener('input', paint);
    /* drag anywhere on the image, not just the handle */
    frame.addEventListener('pointerdown', function (e) {
      var move = function (ev) {
        var r = frame.getBoundingClientRect();
        var pct = ((ev.clientX - r.left) / r.width) * 100;
        range.value = Math.max(0, Math.min(100, pct));
        paint();
      };
      move(e);
      var up = function () {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
      };
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
    });
    paint();
  });

  /* ---------- filters + view ---------- */
  var grid = document.getElementById('pfGrid');
  if (!grid) return;

  var cards = Array.prototype.slice.call(grid.querySelectorAll('.pcard:not(.pcard-soon)'));
  var soonTile = grid.querySelector('.pcard-soon');
  var countEl = document.getElementById('resultCount');
  var emptyEl = document.getElementById('pfEmpty');
  var active = { service: 'all', location: 'all' };

  function apply() {
    var shown = 0;
    cards.forEach(function (c) {
      var ok =
        (active.service === 'all' || c.dataset.service === active.service) &&
        (active.location === 'all' || c.dataset.location === active.location);
      c.hidden = !ok;
      if (ok) shown++;
    });
    countEl.textContent = shown + (shown === 1 ? ' project' : ' projects');
    emptyEl.hidden = shown !== 0;
    // the coming-soon tile only belongs on the unfiltered grid
    if (soonTile) soonTile.hidden = (active.service !== 'all' || active.location !== 'all');
    var q = [];
    if (active.service !== 'all') q.push('service=' + encodeURIComponent(active.service));
    if (active.location !== 'all') q.push('location=' + encodeURIComponent(active.location));
    history.replaceState(null, '', q.length ? '?' + q.join('&') : location.pathname);
  }

  document.querySelectorAll('.fbtn').forEach(function (b) {
    b.addEventListener('click', function () {
      var g = b.dataset.group;
      active[g] = b.dataset.val;
      document.querySelectorAll('.fbtn[data-group="' + g + '"]').forEach(function (o) {
        var on = o === b;
        o.classList.toggle('is-on', on);
        o.setAttribute('aria-pressed', on);
      });
      apply();
    });
  });

  var clear = document.getElementById('clearFilters');
  if (clear) {
    clear.addEventListener('click', function () {
      active = { service: 'all', location: 'all' };
      document.querySelectorAll('.fbtn').forEach(function (o) {
        var on = o.dataset.val === 'all';
        o.classList.toggle('is-on', on);
        o.setAttribute('aria-pressed', on);
      });
      apply();
    });
  }

  var toggle = document.getElementById('filterToggle');
  var panel = document.getElementById('filterPanel');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var openNow = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !openNow);
      panel.hidden = openNow;
    });
  }

  document.querySelectorAll('.vbtn').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.vbtn').forEach(function (o) {
        var on = o === b;
        o.classList.toggle('is-on', on);
        o.setAttribute('aria-pressed', on);
      });
      grid.classList.toggle('is-list', b.dataset.view === 'list');
      localStorage.setItem('pfView', b.dataset.view);
    });
  });

  /* remember the view, honour ?service= / ?location= deep links */
  var savedView = localStorage.getItem('pfView');
  if (savedView === 'list') {
    var lb = document.querySelector('.vbtn[data-view="list"]');
    if (lb) lb.click();
  }
  var params = new URLSearchParams(location.search);
  ['service', 'location'].forEach(function (g) {
    var v = params.get(g);
    if (!v) return;
    var b = document.querySelector('.fbtn[data-group="' + g + '"][data-val="' + v.replace(/"/g, '') + '"]');
    if (b) { b.click(); panel.hidden = false; toggle.setAttribute('aria-expanded', 'true'); }
  });
})();
