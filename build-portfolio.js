/* Living Spaces Gardening — portfolio builder
   Usage: node build-portfolio.js
   Outputs: portfolio.html + project-<slug>.html for every project in projects-data.js
*/
const fs = require('fs');
const path = require('path');
const { PROJECTS, SERVICES, LOCATIONS } = require('./projects-data.js');

const OUT = process.argv[2] || __dirname;
const SITE = 'https://www.livingspacesgardening.com';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/* ---------- shared chrome ---------- */

const head = ({ title, desc, canonical, ogImage, jsonld }) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canonical}">
<meta property="og:url" content="${canonical}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${SITE}/${ogImage}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="assets/Living-Spaces-Gardening-Mark-Terracota-2.png">
<link rel="apple-touch-icon" href="assets/Living-Spaces-Gardening-Mark-Terracota-2.png">
<script type="application/ld+json">
${JSON.stringify(jsonld, null, 2)}
</script>
<script>
  window.addEventListener('load', function () {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=G-1XETH7XHDZ';
    document.head.appendChild(s);
  });
</script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', { 'analytics_storage': 'denied' });
  gtag('js', new Date());
  gtag('config', 'G-1XETH7XHDZ');
  if (localStorage.getItem('cookies') === 'accepted') {
    gtag('consent', 'update', { 'analytics_storage': 'granted' });
  }
</script>
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
<noscript><link href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet"></noscript>
<link rel="stylesheet" href="portfolio.css">
</head>
<body>
<a href="#main" class="skip-nav">Skip to main content</a>`;

const nav = `
<nav id="nav" class="scrolled" aria-label="Main navigation">
  <div class="nav-logo">
    <a href="/"><img src="assets/Living-Spaces-Gardening-Brand-Lettering-Terracota.webp" alt="Living Spaces Gardening" width="154" height="64" loading="eager" fetchpriority="high" title="Living Spaces Gardening"></a>
  </div>
  <ul class="nav-links" id="navLinks">
    <li><a href="/#intro">Gardens</a></li>
    <li><a href="portfolio.html" aria-current="page">Portfolio</a></li>
    <li class="nav-has-dropdown"><a href="/#services">How we help</a><ul class="nav-dropdown"><li><a href="/#svc-native-design">Native Landscape Design</a></li><li><a href="/#svc-hardscape">Hardscape Design</a></li><li><a href="/#svc-irrigation">Irrigation &amp; Lighting</a></li><li><a href="/#svc-permaculture">Permaculture Design</a></li><li><a href="/#svc-specimen-tree">Specimen Tree Sourcing</a></li><li><a href="/#svc-maintenance">Garden Maintenance</a></li></ul></li>
    <li class="nav-has-dropdown"><a href="/#services">Service Areas</a><ul class="nav-dropdown"><li><a href="/service-areas/st-petersburg-fl">St. Petersburg</a></li><li><a href="/service-areas/gulfport-fl">Gulfport</a></li><li><a href="/service-areas/pinellas-park-fl">Pinellas Park</a></li><li><a href="/service-areas/largo-fl">Largo</a></li><li><a href="/service-areas/clearwater-fl">Clearwater</a></li><li><a href="/service-areas/dunedin-fl">Dunedin</a></li><li><a href="/service-areas/tarpon-springs-fl">Tarpon Springs</a></li><li><a href="/service-areas/tampa-fl">Tampa</a></li><li><a href="/service-areas/pinellas-county-fl">Pinellas County</a></li></ul></li>
    <li><a href="/#about">Meet the family</a></li>
    <li><a href="press.html">Press</a></li>
    <li><a href="/blog">Blog</a></li>
    <li><a href="#contact" onclick="openSMS(event)" class="nav-cta">Connect</a></li>
  </ul>
  <button class="hamburger" onclick="toggleMenu()" aria-label="Open menu" aria-expanded="false" aria-controls="navLinks">
    <span></span><span></span><span></span>
  </button>
</nav>`;

const cta = `
<section class="cta" id="contact">
  <div class="cta-inner">
    <p class="eyebrow">Start here</p>
    <h2>Let's talk about <em>your property</em>.</h2>
    <p>Pick a topic below. Kiamesha responds personally. Consultations start at $125 and that goes toward your design.</p>
    <div class="cta-grid">
      <a href="#contact" onclick="openSMS(event)" class="cta-sms-btn">🌿 I want a garden that takes care of itself</a>
      <a href="#contact" onclick="openSMS(event)" class="cta-sms-btn">🌺 Help me pick the right plants</a>
      <a href="#contact" onclick="openSMS(event)" class="cta-sms-btn">🪨 Let's talk about hardscaping</a>
      <a href="#contact" onclick="openSMS(event)" class="cta-sms-btn">✂️ I need help with ongoing care</a>
      <a href="#contact" onclick="openSMS(event)" class="cta-sms-btn cta-sms-wide">I'm not sure yet. Let's just talk</a>
    </div>
  </div>
</section>`;

const footer = `
<footer>
  <div class="footer-logo">
    <img src="assets/Living-Spaces-Gardening-Mark-Terracota-2.png" alt="Living Spaces Gardening" width="46" height="46" loading="lazy">
  </div>
  <div class="footer-center">
    <p>&copy; 2026 Living Spaces Gardening. St. Petersburg, FL &middot; <a href="privacy.html">Privacy Policy</a></p>
  </div>
  <div class="footer-right">
    <a href="https://www.livingrestorations.com" class="sister-site">Living Restorations ↗</a>
    <div class="footer-social">
      <a href="https://www.instagram.com/livingspacesgardening/" target="_blank" rel="noopener" aria-label="Living Spaces Gardening on Instagram"><img src="assets/gallery/icon-instagram.svg" alt="Instagram" width="20" height="20"></a>
      <a href="https://www.facebook.com/livingspacesgardening" target="_blank" rel="noopener" aria-label="Living Spaces Gardening on Facebook"><img src="assets/gallery/icon-facebook.jpeg" alt="Facebook" width="20" height="20" style="border-radius:50%;"></a>
    </div>
  </div>
</footer>`;

const modals = `
<div class="picker-overlay" id="pickerModal">
  <div class="picker-modal" role="dialog" aria-modal="true">
    <button class="picker-close" onclick="closePicker()" aria-label="Close">&times;</button>
    <p class="eyebrow">Get in Touch</p>
    <h3>How would you like to reach us?</h3>
    <p>Text us directly or send an email.</p>
    <div class="picker-options">
      <button onclick="closePicker();openSMSDirect();" class="picker-btn picker-btn-text">📱 Text us</button>
      <button onclick="closePicker();openEmailDirect();" class="picker-btn picker-btn-email">📧 Send an email</button>
    </div>
  </div>
</div>

<div class="email-overlay" id="emailModal">
  <div class="email-modal" role="dialog" aria-label="Get in touch with Living Spaces Gardening" aria-modal="true">
    <button class="email-close" onclick="closeEmail()" aria-label="Close">&times;</button>
    <p class="eyebrow">Get in Touch</p>
    <h3>Tell us about your garden.</h3>
    <p class="form-sub">Kiamesha responds personally. Consultations start at $125 and that goes toward your design.</p>
    <form action="https://formspree.io/f/xeerpvjv" method="POST">
      <input type="hidden" name="_cc" value="kiamesha@livingspacesgardening.com,justinweisensel@gmail.com">
      <input type="hidden" name="_subject" value="Living Spaces Gardening website inquiry">
      <div class="form-row">
        <div class="form-group"><label for="fname">Name</label><input type="text" id="fname" name="name" placeholder="Your name" required></div>
        <div class="form-group"><label for="femail">Email</label><input type="email" id="femail" name="email" placeholder="your@email.com" required></div>
      </div>
      <div class="form-group">
        <label for="fphone">Phone</label>
        <input type="tel" id="fphone" name="phone" placeholder="727-555-1234" required>
        <span class="field-hint">No spam, no cold calls. We use this to follow up personally.</span>
      </div>
      <div class="form-group">
        <label for="faddress">Address or Zip Code</label>
        <input type="text" id="faddress" name="address" placeholder="123 Main St, St. Petersburg, FL (or just your zip code)">
        <span class="field-hint">Helps us understand your area. We never show up unannounced.</span>
      </div>
      <div class="form-group">
        <label for="ftopic">What's going on with your garden?</label>
        <select id="ftopic" name="topic" required>
          <option value="" disabled selected>Select a topic</option>
          <option value="Native garden that takes care of itself">🌿 I want a garden that takes care of itself</option>
          <option value="Help picking the right plants">🌺 Help me pick the right plants</option>
          <option value="Hardscaping">🪨 Let's talk about hardscaping</option>
          <option value="Ongoing garden care">✂️ I need help with ongoing care</option>
          <option value="Not sure yet">💬 Not sure yet. Let's just talk</option>
        </select>
      </div>
      <div class="form-group">
        <label for="fmessage">Tell us about your property</label>
        <textarea id="fmessage" name="message" rows="4" placeholder="Location, size, what you're working with, what you'd love to see..."></textarea>
      </div>
      <button type="submit" class="form-submit">Send Message</button>
      <p class="form-note">You'll hear back within one business day.</p>
    </form>
  </div>
</div>

<div class="sms-overlay" id="smsModal">
  <div class="sms-modal" role="dialog" aria-label="Text us about your garden" aria-modal="true">
    <button class="sms-close" onclick="closeSMS()" aria-label="Close">&times;</button>
    <p class="eyebrow">Connect</p>
    <h3>What's going on with your garden?</h3>
    <p class="sms-sub">Text us directly or prefer email? Choose what works for you.</p>
    <div class="sms-options">
      <a href="sms:7277107400?body=Hi!%20I%20want%20a%20native%20Florida%20garden%20that%20takes%20care%20of%20itself.%0A%0AA%20little%20about%20me%20so%20you%20can%20help%3A%0A%0AName%3A%20%0AAddress%3A%20%0AEmail%3A%20%0A%0AWhat%20caught%20my%20eye%3A%20" class="sms-option"><span>🌿</span> I want a garden that takes care of itself</a>
      <a href="sms:7277107400?body=Hi!%20I%20need%20help%20picking%20the%20right%20plants%20for%20my%20garden.%0A%0AA%20little%20about%20me%20so%20you%20can%20help%3A%0A%0AName%3A%20%0AAddress%3A%20%0AEmail%3A%20%0A%0AWhat%20caught%20my%20eye%3A%20" class="sms-option"><span>🌺</span> Help me pick the right plants</a>
      <a href="sms:7277107400?body=Hi!%20I%27d%20love%20to%20talk%20about%20hardscaping%20for%20my%20garden.%0A%0AA%20little%20about%20me%20so%20you%20can%20help%3A%0A%0AName%3A%20%0AAddress%3A%20%0AEmail%3A%20%0A%0AWhat%20caught%20my%20eye%3A%20" class="sms-option"><span>🪨</span> Let's talk hardscaping</a>
      <a href="sms:7277107400?body=Hi!%20I%20need%20help%20keeping%20my%20garden%20healthy.%0A%0AA%20little%20about%20me%20so%20you%20can%20help%3A%0A%0AName%3A%20%0AAddress%3A%20%0AEmail%3A%20%0A%0AWhat%20caught%20my%20eye%3A%20" class="sms-option"><span>✂️</span> I need garden maintenance</a>
      <a href="sms:7277107400?body=Hi!%20I%27m%20not%20sure%20what%20I%20need%20yet%20%E2%80%94%20can%20we%20talk%20about%20my%20garden%3F%0A%0AA%20little%20about%20me%20so%20you%20can%20help%3A%0A%0AName%3A%20%0AAddress%3A%20%0AEmail%3A%20%0A%0AWhat%20caught%20my%20eye%3A%20" class="sms-option"><span>💬</span> Not sure yet. Let's just talk</a>
    </div>
  </div>
</div>

<div id="cookieBanner" class="cookie-banner">
  <div class="cookie-inner">
    <p>We use cookies to see how people find us and what helps. Hit "Got it" if that works for you. "Decline" is fine too — the garden's still here either way. <a href="privacy.html">Privacy Policy</a></p>
    <div class="cookie-actions">
      <button onclick="document.getElementById('cookieBanner').style.display='none';localStorage.setItem('cookies','accepted');gtag('consent','update',{'analytics_storage':'granted'})" class="cookie-accept">Got it</button>
      <button onclick="document.getElementById('cookieBanner').style.display='none';localStorage.setItem('cookies','declined')" class="cookie-decline">Decline</button>
    </div>
  </div>
</div>`;

const baseScript = `
<script src="portfolio.js" defer></script>`;

/* ---------- portfolio grid ---------- */

function card(p, i) {
  const slides = p.images
    .map(
      (im, n) => `
        <a class="pcard-slide" href="project-${p.slug}.html" aria-label="Open ${esc(p.title)}" tabindex="${n === 0 ? '0' : '-1'}">
          <img src="${im.src}" alt="${esc(im.alt)}" width="1200" height="1200" loading="${i < 3 ? 'eager' : 'lazy'}" style="object-position:${im.pos};">
        </a>`
    )
    .join('');

  const dots =
    p.images.length > 1
      ? `<div class="pcard-dots" role="tablist" aria-label="Project photos">${p.images
          .map(
            (im, n) =>
              `<button class="pcard-dot${n === 0 ? ' is-on' : ''}" data-go="${n}" role="tab" aria-selected="${n === 0}" aria-label="Photo ${n + 1} of ${p.images.length}"></button>`
          )
          .join('')}</div>`
      : '';

  const arrows =
    p.images.length > 1
      ? `<button class="pcard-arrow pcard-prev" data-dir="-1" aria-label="Previous photo">‹</button>
         <button class="pcard-arrow pcard-next" data-dir="1" aria-label="Next photo">›</button>
         <span class="pcard-count"><b>1</b>/${p.images.length}</span>`
      : '';

  return `
      <article class="pcard" data-service="${esc(p.service)}" data-location="${esc(p.location)}">
        <div class="pcard-media" data-count="${p.images.length}">
          <div class="pcard-track">${slides}
          </div>
          ${arrows}
          ${dots}
          ${p.images.length > 1 ? '<span class="pcard-swipe-hint" aria-hidden="true">Swipe</span>' : ''}
        </div>
        <a class="pcard-body" href="project-${p.slug}.html">
          <div class="pcard-tags">
            <span class="tag tag-service">${esc(p.service)}</span>
            <span class="tag tag-loc">${esc(p.locationFull)}</span>
            ${p.before ? '<span class="tag tag-ba">Before / after</span>' : ''}
          </div>
          <h2 class="pcard-title">${esc(p.title)}</h2>
          <p class="pcard-sum">${esc(p.summary)}</p>
          <span class="pcard-link">See the project →</span>
        </a>
      </article>`;
}

function buildPortfolio() {
  const jsonld = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${SITE}/portfolio.html#page`,
      url: `${SITE}/portfolio.html`,
      name: 'Portfolio — Living Spaces Gardening',
      description:
        'Native Florida landscape design, hardscaping, permaculture, and specimen tree projects across Tampa Bay.',
      isPartOf: { '@id': `${SITE}/#website` },
      about: { '@id': `${SITE}/#business` },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: PROJECTS.length,
        itemListElement: PROJECTS.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${SITE}/project-${p.slug}.html`,
          name: p.title
        }))
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'Portfolio', item: `${SITE}/portfolio.html` }
      ]
    }
  ];

  const btn = (group, val, label, on) =>
    `<button class="fbtn${on ? ' is-on' : ''}" data-group="${group}" data-val="${esc(val)}"${on ? ' aria-pressed="true"' : ' aria-pressed="false"'}>${esc(label)}</button>`;

  const html = `${head({
    title: 'Portfolio | Living Spaces Gardening — Native Florida Landscape Projects',
    desc:
      'Rain gardens, oolite boulder hardscape, specimen trees, and permaculture across Tampa Bay. See what Living Spaces Gardening has put in the ground since 2018.',
    canonical: `${SITE}/portfolio.html`,
    ogImage: PROJECTS[0].images[0].src,
    jsonld
  })}
${nav}

<main id="main">

<section class="pf-head">
  <div class="pf-head-inner">
    <p class="eyebrow">Portfolio</p>
    <h1>Work we've put <em>in the ground</em>.</h1>
    <p class="pf-sub">Every project below is a real Tampa Bay property. Swipe the photos. Open one to see what was wrong, what we did, and what grows there now.</p>
  </div>
</section>

<div class="pf-bar">
  <div class="pf-bar-inner">
    <button class="pf-filter-toggle" id="filterToggle" aria-expanded="false" aria-controls="filterPanel">
      Filter <span class="pf-plus">+</span>
    </button>
    <p class="pf-count" id="resultCount">${PROJECTS.length} projects</p>
    <div class="pf-view" role="group" aria-label="View">
      <button class="vbtn is-on" data-view="grid" aria-pressed="true">Grid</button>
      <button class="vbtn" data-view="list" aria-pressed="false">List</button>
    </div>
  </div>
  <div class="pf-filters" id="filterPanel" hidden>
    <div class="fgroup">
      <p class="fgroup-label">Service</p>
      <div class="fgroup-btns">
        ${btn('service', 'all', 'All work', true)}
        ${SERVICES.map((s) => btn('service', s, s, false)).join('\n        ')}
      </div>
    </div>
    <div class="fgroup">
      <p class="fgroup-label">Where</p>
      <div class="fgroup-btns">
        ${btn('location', 'all', 'All of Tampa Bay', true)}
        ${LOCATIONS.map((l) => btn('location', l, l, false)).join('\n        ')}
      </div>
    </div>
    <button class="fclear" id="clearFilters">Clear filters</button>
  </div>
</div>

<section class="pf-grid-wrap">
  <div class="pf-grid" id="pfGrid">
${PROJECTS.map(card).join('\n')}
    <article class="pcard pcard-soon" aria-label="More projects coming soon">
      <div class="pcard-soon-media">
        <span class="pcard-soon-mark">✦</span>
      </div>
      <div class="pcard-body">
        <div class="pcard-tags"><span class="tag tag-soon">Coming soon</span></div>
        <h2 class="pcard-title">More going in the ground</h2>
        <p class="pcard-sum">We photograph every project as it wraps. New native landscapes, hardscape, and specimen trees are on the way.</p>
        <a href="#contact" onclick="openSMS(event)" class="pcard-link">Start yours →</a>
      </div>
    </article>
  </div>
  <div class="pf-empty" id="pfEmpty" hidden>
    <p class="pf-empty-h">Nothing matches that combination yet.</p>
    <p>Clear a filter, or text us — we've probably built it and just haven't photographed it.</p>
    <a href="#contact" onclick="openSMS(event)" class="btn-primary">Get in touch</a>
  </div>
</section>

${cta}
</main>
${footer}
${modals}
${baseScript}
</body>
</html>
`;
  fs.writeFileSync(path.join(OUT, 'portfolio.html'), html);
}

/* ---------- project detail ---------- */

function buildProject(p, idx) {
  const prev = PROJECTS[(idx - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(idx + 1) % PROJECTS.length];

  const jsonld = [
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      '@id': `${SITE}/project-${p.slug}.html#project`,
      name: p.title,
      headline: p.title,
      description: p.summary,
      url: `${SITE}/project-${p.slug}.html`,
      dateCreated: p.year,
      creator: { '@id': `${SITE}/#business` },
      locationCreated: {
        '@type': 'Place',
        address: { '@type': 'PostalAddress', addressLocality: p.location, addressRegion: 'FL', addressCountry: 'US' }
      },
      about: { '@type': 'Service', name: p.service },
      image: p.images.map((im) => ({
        '@type': 'ImageObject',
        contentUrl: `${SITE}/${im.src}`,
        caption: im.caption
      }))
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'Portfolio', item: `${SITE}/portfolio.html` },
        { '@type': 'ListItem', position: 3, name: p.title, item: `${SITE}/project-${p.slug}.html` }
      ]
    }
  ];

  const hero = p.images[0];

  /* Project plans — the design book, drawn out */
  const plans = (p.plans && p.plans.length)
    ? `
<section class="plans" aria-labelledby="plans-h-${p.slug}">
  <p class="eyebrow">Project plans</p>
  <h2 class="sec-h" id="plans-h-${p.slug}">What we drew before anything went in the ground.</h2>
  <div class="plans-grid">
    ${p.plans.map((pl) => `<figure class="plan">
      <img src="${pl.src}" alt="${esc(pl.alt)}" width="1200" height="900" loading="lazy">
      <figcaption>${esc(pl.label)}</figcaption>
    </figure>`).join('\n    ')}
  </div>
</section>`
    : '';

  /* Species guide — falls back to the plain list when nobody's filled it in */
  const species = (p.species && p.species.length)
    ? `
<section class="species" aria-labelledby="sp-h-${p.slug}">
  <p class="eyebrow">Species guide</p>
  <h2 class="sec-h" id="sp-h-${p.slug}">Every plant here is doing a job.</h2>
  <ul class="species-list">
    ${p.species.map((s) => `<li class="sp">
      <p class="sp-common">${esc(s.common)}</p>
      ${s.latin ? `<p class="sp-latin">${esc(s.latin)}</p>` : ''}
      ${s.role ? `<p class="sp-role">${esc(s.role)}</p>` : ''}
    </li>`).join('\n    ')}
  </ul>
</section>`
    : `
<section class="proj-plants">
  <p class="eyebrow">What's growing here</p>
  <ul class="plant-list">
    ${p.plants.map((pl) => `<li>${esc(pl)}</li>`).join('\n    ')}
  </ul>
</section>`;

  /* Related — same service first, then same city, never itself */
  const related = PROJECTS
    .filter((o) => o.slug !== p.slug)
    .sort((a, c) => {
      const score = (x) => (x.service === p.service ? 2 : 0) + (x.location === p.location ? 1 : 0);
      return score(c) - score(a);
    })
    .slice(0, 3);

  const relatedHtml = `
<section class="related" aria-labelledby="rel-h">
  <div class="related-head">
    <h2 class="sec-h" id="rel-h">More like this</h2>
    <a href="portfolio.html" class="proj-nav-all">All projects</a>
  </div>
  <div class="related-grid">
    ${related.map((r) => `<a class="rel" href="project-${r.slug}.html">
      <div class="rel-media"><img src="${r.images[0].src}" alt="${esc(r.images[0].alt)}" width="800" height="600" loading="lazy" style="object-position:${r.images[0].pos};"></div>
      <p class="rel-title">${esc(r.title)}</p>
      <p class="rel-meta">${esc(r.locationFull)} · ${esc(r.service)}</p>
    </a>`).join('\n    ')}
  </div>
</section>`;

  const beforeAfter = p.before
    ? `
<section class="ba" aria-labelledby="ba-h-${p.slug}">
  <p class="eyebrow">Before / after</p>
  <h2 class="ba-h" id="ba-h-${p.slug}">Same spot. ${esc(p.year)}.</h2>
  <div class="ba-frame" data-ba>
    <img class="ba-after" src="${hero.src}" alt="${esc(hero.alt)}" width="1200" height="900" loading="lazy" style="object-position:${hero.pos};">
    <div class="ba-before-wrap">
      <img class="ba-before" src="${p.before.src}" alt="${esc(p.before.alt)}" width="1200" height="900" loading="lazy" style="object-position:${p.before.pos || 'center center'};">
    </div>
    <span class="ba-tag ba-tag-b" aria-hidden="true">Before</span>
    <span class="ba-tag ba-tag-a" aria-hidden="true">After</span>
    <span class="ba-handle" aria-hidden="true"><i></i></span>
    <input class="ba-range" type="range" min="0" max="100" value="50" step="0.1"
           aria-label="Drag to compare before and after">
  </div>
  <p class="ba-note">Drag the handle. Arrow keys work too.</p>
</section>`
    : '';

  const html = `${head({
    title: `${p.title} — ${p.locationFull} | Living Spaces Gardening`,
    desc: `${p.summary} ${p.service} in ${p.locationFull} by Living Spaces Gardening.`,
    canonical: `${SITE}/project-${p.slug}.html`,
    ogImage: hero.src,
    jsonld
  })}
${nav}

<main id="main">

<nav class="crumbs" aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="portfolio.html">Portfolio</a></li>
    <li aria-current="page">${esc(p.locationFull)}</li>
  </ol>
</nav>

<section class="proj-hero">
  <div class="proj-hero-media">
    <img src="${hero.src}" alt="${esc(hero.alt)}" width="1200" height="1200" loading="eager" fetchpriority="high" style="object-position:${hero.pos};">
  </div>
  <div class="proj-hero-text">
    <div class="pcard-tags">
      <span class="tag tag-service">${esc(p.service)}</span>
      <span class="tag tag-loc">${esc(p.locationFull)}</span>
    </div>
    <h1>${esc(p.title)}</h1>
    <p class="proj-sum">${esc(p.summary)}</p>
    <dl class="proj-facts">
      <div><dt>Where</dt><dd>${esc(p.locationFull)}</dd></div>
      <div><dt>Service</dt><dd>${esc(p.service)}</dd></div>
      <div><dt>Year</dt><dd>${esc(p.year)}</dd></div>
      <div><dt>Scope</dt><dd>${esc(p.scope)}</dd></div>
      ${p.facts && p.facts.size ? `<div><dt>Planted area</dt><dd>${esc(p.facts.size)}</dd></div>` : ''}
      ${p.facts && p.facts.lot ? `<div><dt>Lot</dt><dd>${esc(p.facts.lot)}</dd></div>` : ''}
      ${p.facts && p.facts.environment ? `<div><dt>Environment</dt><dd>${esc(p.facts.environment)}</dd></div>` : ''}
      ${p.facts && p.facts.status ? `<div><dt>Status</dt><dd>${esc(p.facts.status)}</dd></div>` : ''}
    </dl>
    <a href="#contact" onclick="openSMS(event)" class="btn-primary">Start a project like this</a>
  </div>
</section>

<section class="proj-story">
  <div class="story-col">
    <p class="eyebrow">What was wrong</p>
    <p>${esc(p.problem)}</p>
  </div>
  <div class="story-col">
    <p class="eyebrow">What we did</p>
    <p>${esc(p.approach)}</p>
  </div>
  <div class="story-col">
    <p class="eyebrow">What it does now</p>
    <p>${esc(p.result)}</p>
  </div>
</section>

${beforeAfter}

${plans}

${species}

${
  p.images.length > 1
    ? `<section class="proj-shots" aria-label="Project photos">
  ${p.images
    .map(
      (im) => `<figure class="shot">
    <img src="${im.src}" alt="${esc(im.alt)}" width="1200" height="1200" loading="lazy" style="object-position:${im.pos};">
    <figcaption>${esc(im.caption)}</figcaption>
  </figure>`
    )
    .join('\n  ')}
</section>`
    : `<section class="proj-shots proj-shots-single" aria-label="Project photo">
  <figure class="shot">
    <img src="${hero.src}" alt="${esc(hero.alt)}" width="1200" height="1200" loading="lazy" style="object-position:${hero.pos};">
    <figcaption>${esc(hero.caption)}</figcaption>
  </figure>
</section>`
}

${relatedHtml}

<nav class="proj-nav" aria-label="More projects">
  <a class="proj-nav-link" href="project-${prev.slug}.html">
    <span class="proj-nav-dir">← Previous</span>
    <span class="proj-nav-title">${esc(prev.title)}</span>
  </a>
  <a class="proj-nav-all" href="portfolio.html">All projects</a>
  <a class="proj-nav-link proj-nav-next" href="project-${next.slug}.html">
    <span class="proj-nav-dir">Next →</span>
    <span class="proj-nav-title">${esc(next.title)}</span>
  </a>
</nav>

${cta}
</main>
${footer}
${modals}
${baseScript}
</body>
</html>
`;
  fs.writeFileSync(path.join(OUT, `project-${p.slug}.html`), html);
}

/* ---------- run ---------- */
buildPortfolio();
PROJECTS.forEach(buildProject);
console.log(`Built portfolio.html + ${PROJECTS.length} project pages into ${OUT}`);
