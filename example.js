(() => {
  'use strict';
  const variants = {
    electrical: {
      brand: 'VOLT / ELECTRICAL', title: 'Volt Electrical', kicker: 'ELECTRICAL SERVICES · SURREY', headline: ['Wired', 'properly.'], intro: 'Power where you need it. Lighting that makes the room. Electrical work with a clear plan and a tidy finish.', cta: 'Tell us about your project', footnote: 'Your home. Connected.', servicesTitle: ['The details matter.', 'So does the wiring.'],
      services: [['Lighting & power', 'From a better-lit kitchen to sockets where you actually need them. Practical electrical updates for everyday living.'], ['Home renovations', 'Planning an extension or a new layout? Bring the electrics into the conversation from the beginning.'], ['Repairs & improvements', 'Tell us what isn’t working and what you want to change. We’ll help you plan the next step.']], approachTitle: ['Clear advice.', 'Work done with care.'], approachCopy: 'Tell us what you need, and we’ll talk through the options. We agree the work before starting, keep you informed along the way and leave your space ready to use.', contactTitle: ['Time to switch', 'things up?']
    },
    building: {
      brand: 'HART & CO.', title: 'Hart & Co. Builders', kicker: 'BUILDING & RENOVATION · SURREY', headline: ['Built for', 'living.'], intro: 'More room for the everyday. A better use of the space you have. We help turn ideas for your home into places that feel right.', cta: 'Let’s talk about your home', footnote: 'Care in every detail.', servicesTitle: ['Your home.', 'Its next chapter.'],
      services: [['Extensions', 'Make space for a bigger kitchen, a growing family or simply a different way of living.'], ['Renovations', 'Thoughtful changes to the home you already love, with a plan that brings the details together.'], ['Finishing touches', 'The smaller improvements that make a room feel complete. Careful work, from first fix to final finish.']], approachTitle: ['Built on a clear plan.', 'Finished with care.'], approachCopy: 'A good project starts with a proper conversation. We look at the space, understand your priorities and agree a clear scope of work. Then we keep you in the picture as your home takes shape.', contactTitle: ['Let’s build', 'what comes next.']
    }
  };
  const key = new URLSearchParams(window.location.search).get('trade');
  const data = variants[key];
  if (!data) return;
  document.body.dataset.example = key;
  document.title = `${data.title} | SitePilots website example`;
  const set = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
  const multiline = (id, lines, italic = false) => { const el = document.getElementById(id); const last = document.createElement(italic ? 'em' : 'span'); last.textContent = lines[1]; el.replaceChildren(document.createTextNode(lines[0]), document.createElement('br'), last); };
  set('demo-brand', data.brand); set('footer-brand', data.brand); set('demo-kicker', data.kicker); multiline('demo-headline', data.headline, key === 'building'); set('demo-intro', data.intro); set('demo-cta', data.cta); set('demo-footnote', data.footnote); multiline('services-title', data.servicesTitle); multiline('approach-title', data.approachTitle); set('approach-copy', data.approachCopy); multiline('contact-title', data.contactTitle);
  data.services.forEach(([title, copy], i) => { set(`service-${i + 1}-title`, title); set(`service-${i + 1}-copy`, copy); });
  if (key === 'electrical') document.querySelector('.demo-hero-image').setAttribute('aria-label', 'Orange and charcoal typography: Power, Light, Possibility');
})();
