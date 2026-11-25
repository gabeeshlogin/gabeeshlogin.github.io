(() => {
  'use strict';
  const config = window.SITEPILOTS_CONFIG || {};
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.email || '') ? config.email : 'hello@sitepilots.co.uk';
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  function closeMenu() { if (toggle && nav) { toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Open menu'); nav.classList.remove('is-open'); } }
  toggle?.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); nav.classList.toggle('is-open', open); });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') { closeMenu(); toggle.focus(); } });
  document.addEventListener('click', e => { if (nav && toggle && !nav.contains(e.target) && !toggle.contains(e.target)) closeMenu(); });
  window.matchMedia('(min-width: 861px)').addEventListener('change', closeMenu);

  // Header shadow once scrolled; mobile CTA bar after the hero and away from the enquiry form.
  const header = document.querySelector('.site-header');
  const mobileCta = document.querySelector('#mobile-cta');
  const hero = document.querySelector('.hero');
  const start = document.querySelector('#start');
  let pastHero = false, atStart = false;
  const syncCta = () => mobileCta?.classList.toggle('is-visible', pastHero && !atStart);
  window.addEventListener('scroll', () => header?.classList.toggle('is-scrolled', window.scrollY > 8), { passive: true });
  if ('IntersectionObserver' in window && hero && start) {
    new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting; syncCta(); }).observe(hero);
    new IntersectionObserver(([e]) => { atStart = e.isIntersecting; syncCta(); }).observe(start);
  }

  const projects = {
    bakery: { url: 'foldbakery.co.uk', img: 'img/work-fold.webp', phone: 'img/work-fold-m.webp', link: 'examples/bakery/', name: 'Fold, bakery & coffee', description: 'Quiet and premium, led by the photography. A Christmas order banner, menu, opening hours and order-ahead, all one tap away on a phone.', features: ['Seasonal order banner', 'Menu and opening hours', 'Order ahead for collection'] },
    cafe: { url: 'ryeandember.co.uk', img: 'img/work-rye.webp', phone: 'img/work-rye-m.webp', link: 'examples/cafe/', name: 'Rye & Ember', description: 'Warm and local, built around what came out of the oven today, with opening times and order-ahead front and centre.', features: ['Today’s bakes', 'Live opening status', 'Order for collection'] },
    electrician: { url: 'haldenelectrical.co.uk', img: 'img/work-halden.webp', phone: 'img/work-halden-m.webp', link: 'examples/electrician/', name: 'Halden Electrical', description: 'Loud and confident, with fixed prices, areas covered and a call button that never leaves the screen.', features: ['Tap-to-call everywhere', 'Fixed price list', 'Quick quote form'] }
  };
  const display = document.querySelector('#project-display');
  const setText = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
  document.querySelectorAll('[data-trade].example-tab').forEach(button => {
    button.addEventListener('click', () => {
      const key = button.dataset.trade;
      const item = projects[key];
      if (!item || !display) return;
      document.querySelectorAll('.example-tab').forEach(tab => { const active = tab === button; tab.classList.toggle('is-active', active); tab.setAttribute('aria-pressed', String(active)); });
      display.dataset.trade = key;
      document.getElementById('project-img').src = item.img;
      document.getElementById('project-phone').src = item.phone;
      ['url', 'name', 'description'].forEach(field => setText(`project-${field}`, item[field]));
      document.getElementById('project-features').replaceChildren(...item.features.map(f => { const li = document.createElement('li'); li.textContent = f; return li; }));
      document.getElementById('project-link').href = document.getElementById('project-preview').href = item.link;
    });
  });

  const form = document.querySelector('#enquiry-form');
  const ready = document.querySelector('#enquiry-ready');
  let enquiryText = '';
  if (form && ready) {
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const value = id => document.getElementById(id).value.trim();
      if (!value('name') || !value('business')) { const field = document.getElementById(!value('name') ? 'name' : 'business'); field.setCustomValidity('Please enter your details.'); field.reportValidity(); field.addEventListener('input', () => field.setCustomValidity(''), { once: true }); return; }
      const details = { name: value('name'), business: value('business'), email: value('email'), trade: value('trade'), brief: value('brief') };
      enquiryText = `Hello SitePilots,\n\nI'm interested in a £99 website build.\n\nName: ${details.name}\nBusiness: ${details.business}\nEmail: ${details.email}\nType of business: ${details.trade}\n\nWhat I need:\n${details.brief || 'I would like to discuss the website with you.'}\n\nPlease confirm the scope, delivery date and any domain or hosting costs before payment.\n\nThanks,\n${details.name}`;
      document.getElementById('email-draft').href = `mailto:${email}?subject=${encodeURIComponent('£99 website enquiry: ' + details.business)}&body=${encodeURIComponent(enquiryText)}`;
      const summary = document.getElementById('enquiry-summary');
      summary.replaceChildren();
      [['Business', details.business], ['Business type', details.trade], ['Reply to', details.email]].forEach(([label, content]) => { const term = document.createElement('dt'); const definition = document.createElement('dd'); term.textContent = label; definition.textContent = content; summary.append(term, definition); });
      form.hidden = true;
      ready.hidden = false;
      document.getElementById('copy-status').textContent = '';
      document.getElementById('copy-fallback').hidden = true;
      ready.focus({ preventScroll: true });
      ready.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' });
    });
    document.getElementById('edit-enquiry').addEventListener('click', () => { ready.hidden = true; form.hidden = false; document.getElementById('name').focus(); });
    document.getElementById('copy-enquiry').addEventListener('click', async () => {
      const status = document.getElementById('copy-status');
      try { await navigator.clipboard.writeText(enquiryText); status.textContent = `Copied. Paste it into an email to ${email}.`; }
      catch { const fallback = document.getElementById('copy-fallback'); fallback.value = enquiryText; fallback.hidden = false; fallback.focus(); fallback.select(); status.textContent = `Select and copy the text below, then email it to ${email}.`; }
    });
  }
  // An unconfigured or non-Whop URL never turns into a fake checkout.
  try {
    if (config.whopCheckoutUrl) {
      const url = new URL(config.whopCheckoutUrl);
      if (url.protocol === 'https:' && (url.hostname === 'whop.com' || url.hostname.endsWith('.whop.com'))) {
        document.querySelectorAll('[data-checkout]').forEach((link) => { link.href = url.href; });
      }
    }
  } catch { /* Keep the working enquiry flow when a checkout URL is invalid. */ }
})();
