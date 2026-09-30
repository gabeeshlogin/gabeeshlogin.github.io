(() => {
  'use strict';
  const config = window.SITEPILOTS_CONFIG || {};
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.email || '') ? config.email : 'hello@sitepilots.co.uk';
  document.querySelectorAll('[data-year]').forEach(el => { el.textContent = new Date().getFullYear(); });
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  function closeMenu() { if (toggle && nav) { toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); } }
  toggle?.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open); });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') { closeMenu(); toggle.focus(); } });
  document.addEventListener('click', e => { if (nav && toggle && !nav.contains(e.target) && !toggle.contains(e.target)) closeMenu(); });
  window.matchMedia('(min-width: 801px)').addEventListener('change', closeMenu);

  const projects = {
    landscaping: { brand: 'green&ground', kicker: 'GARDEN DESIGN & LANDSCAPING', title: ['Room to', 'grow.'], name: 'Green & Ground', description: 'An inviting home for garden transformations. Big project photos, clear services and a simple way to enquire.' },
    electrical: { brand: 'VOLT / ELECTRICAL', kicker: 'LOCAL ELECTRICIANS', title: ['Wired', 'properly.'], name: 'Volt Electrical', description: 'Bold, direct and easy to use. A clear introduction to your electrical services, with contact details right where customers need them.' },
    building: { brand: 'HART & CO.', kicker: 'BUILDING & RENOVATION', title: ['Built for', 'living.'], name: 'Hart & Co. Builders', description: 'A confident showcase for building work. Space for your projects, your process and the details that help customers choose you.' }
  };
  const display = document.querySelector('#project-display');
  document.querySelectorAll('[data-trade].example-tab').forEach(button => {
    button.addEventListener('click', () => {
      const key = button.dataset.trade;
      const item = projects[key];
      if (!item || !display) return;
      document.querySelectorAll('.example-tab').forEach(tab => { const active = tab === button; tab.classList.toggle('is-active', active); tab.setAttribute('aria-pressed', String(active)); });
      display.dataset.trade = key;
      document.querySelector('#project-brand').textContent = item.brand;
      document.querySelector('#project-kicker').textContent = item.kicker;
      const headline = document.querySelector('#project-headline');
      headline.replaceChildren(document.createTextNode(item.title[0]), document.createElement('br'), document.createTextNode(item.title[1]));
      document.querySelector('#project-name').textContent = item.name;
      document.querySelector('#project-description').textContent = item.description;
      document.querySelector('#project-link').href = `example.html?trade=${key}`;
      const projectImage = display.querySelector('.project-image');
      projectImage.setAttribute('aria-label', key === 'electrical' ? 'Bold orange and black electrical business typography' : 'An illustrative garden and home renovation');
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
      enquiryText = `Hello SitePilots,\n\nI'm interested in a £69 website build.\n\nName: ${details.name}\nBusiness: ${details.business}\nEmail: ${details.email}\nTrade: ${details.trade}\n\nWhat I need:\n${details.brief || 'I would like to discuss the website with you.'}\n\nPlease confirm the scope, delivery date and any domain or hosting costs before payment.\n\nThanks,\n${details.name}`;
      document.getElementById('email-draft').href = `mailto:${email}?subject=${encodeURIComponent('£69 website enquiry — ' + details.business)}&body=${encodeURIComponent(enquiryText)}`;
      const summary = document.getElementById('enquiry-summary');
      summary.replaceChildren();
      [['Business', details.business], ['Trade', details.trade], ['Reply to', details.email]].forEach(([label, content]) => { const term = document.createElement('dt'); const definition = document.createElement('dd'); term.textContent = label; definition.textContent = content; summary.append(term, definition); });
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
        const checkout = document.getElementById('checkout-link');
        if (checkout) { checkout.href = url.href; document.getElementById('checkout-area').hidden = false; }
      }
    }
  } catch { /* Keep the working enquiry flow when a checkout URL is invalid. */ }
})();
