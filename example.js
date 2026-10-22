(() => {
  'use strict';
  // Fictional businesses used to show what a SitePilots website could look like.
  // Pick one with ?site=<key> (the older ?trade=<key> links still work).
  const sites = {
    landscaping: {
      name: 'Green & Ground', brand: 'green<em>&amp;</em>ground', switchLabel: 'Landscaper',
      phone: '01737 000 101', email: 'hello@greenandground.example', area: 'Reigate, Dorking, Epsom & across Surrey', hours: 'Mon–Fri 8am–6pm · Sat 9am–1pm',
      kicker: 'Garden design & landscaping · Surrey',
      headline: 'A little more <em>outdoors.</em>',
      intro: 'Thoughtful gardens, patios and planting, designed around how you actually want to use your space, and built to last.',
      cta: 'Get a free quote', ctaShort: 'Free quote', rating: '5.0 from 62 local reviews',
      hero: 'img/garden.webp',
      trust: ['Free design consultation', 'Fully insured', 'All work guaranteed', 'Local, family run'],
      servicesTitle: 'Good gardens start from the ground.',
      servicesIntro: 'From a complete redesign to a tidy new patio, we handle the whole job so you only deal with one team.',
      services: [
        ['leaf', 'Garden design', 'A plan built around your space, the way you live and what you’d love to grow.'],
        ['grid', 'Patios & paving', 'Porcelain, sandstone and natural stone terraces, laid level and built to last.'],
        ['fence', 'Fencing & decking', 'Sturdy boundaries and decks that add privacy and space to sit out.'],
        ['sprout', 'Planting & turf', 'Seasonal colour, year-round structure and fresh lawns that settle in fast.'],
        ['drop', 'Drainage & groundwork', 'Sorting the boring bits properly so the garden stays dry and usable.'],
        ['spark', 'Garden lighting', 'Low-voltage lighting that makes evenings outside feel special.']
      ],
      workTitle: 'Gardens we’ve transformed', workLink: 'Start your project',
      gallery: [['img/garden.webp', 'Stone terrace with layered planting'], ['img/garden-path.webp', 'Planted walkway with flowering borders'], ['img/garden-lawn.webp', 'Freshly laid lawn']],
      aboutImg: 'img/garden-path.webp', aboutKicker: 'About us', aboutTitle: 'A conversation first. A garden you’ll love.',
      aboutCopy: 'We’re a small, local team. We start by listening, then put together a clear plan and an honest price, so you always know what’s happening and what comes next.',
      aboutPoints: ['Free, no-pressure site visit', 'Fixed written quotes', 'We leave the site tidy every day'],
      reviewsTitle: 'What our customers say',
      reviews: [['The garden is unrecognisable. Neat, friendly team and they finished when they said they would.', 'Helen R.', 'Patio & planting, Reigate'], ['Clear quote, no surprises, and they cleaned up every single day. Couldn’t recommend more.', 'Mark T.', 'Full redesign, Dorking'], ['Our kids practically live outside now. Worth every penny.', 'Priya S.', 'Lawn & decking, Epsom']],
      contactKicker: 'Free quotes', contactTitle: 'What could your garden become?', contactCopy: 'Tell us a little about your space and we’ll arrange a free visit to talk it through.',
      formTitle: 'Request a free quote', formLabel: 'About your garden', formPlaceholder: 'Rough size, what you’d like done, any photos to share…', formButton: 'Request my quote'
    },
    electrical: {
      name: 'Volt Electrical', brand: 'VOLT<span>/</span>ELECTRICAL', switchLabel: 'Electrician',
      phone: '07700 900 202', email: 'jobs@voltelectrical.example', area: 'Sutton, Croydon, Epsom & Banstead', hours: 'Mon–Sat 7:30am–6pm · 24/7 emergencies',
      kicker: 'Domestic & commercial electricians',
      headline: 'Wired properly.<br><span>First time.</span>',
      intro: 'Rewires, consumer units, EV chargers and lighting, done safely, certified and explained in plain English.',
      cta: 'Get a free quote', ctaShort: 'Get a quote', rating: '4.9 from 120+ reviews',
      hero: 'img/volt-hero.webp',
      trust: ['Part P registered', 'Fully certified work', 'Same-week callouts', '12-month guarantee'],
      servicesTitle: 'Everything electrical, under one roof.',
      servicesIntro: 'No job too small. We turn up when we say we will and leave everything certified and tidy.',
      services: [
        ['bolt', 'Full & partial rewires', 'Safe, modern wiring for older homes, with minimal mess and disruption.'],
        ['board', 'Consumer units', 'Fuse board upgrades to current regulations, with full certification.'],
        ['car', 'EV charger installs', 'Home charge points fitted neatly, with help on grants where available.'],
        ['bulb', 'Lighting', 'Downlights, pendants and outdoor lighting that change how a room feels.'],
        ['check', 'EICR & testing', 'Landlord certificates and safety inspections, booked fast.'],
        ['alert', 'Fault finding', 'Tripping circuits and dead sockets traced and fixed, same week.']
      ],
      workTitle: 'Recent jobs', workLink: 'Book your job in',
      gallery: [['img/volt-kitchen.webp', 'Kitchen pendant lighting installation'], ['img/volt-lounge.webp', 'Living room lighting and sockets'], ['img/volt-solar.webp', 'Solar panel installation']],
      aboutImg: 'img/volt-portrait.webp', aboutKicker: 'Meet the team', aboutTitle: 'Straight answers. Safe, tidy work.',
      aboutCopy: 'We’re a local, independent firm. You’ll get a clear quote before we start, a fixed price, and an electrician who explains what they’re doing and why.',
      aboutPoints: ['Fixed prices, agreed upfront', 'Dust sheets down, mess cleared up', 'Certificates emailed same day'],
      reviewsTitle: 'Trusted by homeowners and landlords',
      reviews: [['Came out the same day for a tripping circuit, found the fault in minutes. Honest and fairly priced.', 'James W.', 'Fault finding, Sutton'], ['Full rewire on a 1930s semi. Tidy, on time, and kept us updated every day.', 'Sarah & Tom', 'Rewire, Banstead'], ['EV charger fitted neatly and they sorted all the paperwork. Brilliant service.', 'Daniel K.', 'EV charger, Epsom']],
      contactKicker: 'Get a quote', contactTitle: 'Need an electrician? Let’s talk.', contactCopy: 'Call for urgent jobs or send us a few details and we’ll get back to you the same day.',
      formTitle: 'Get a free quote', formLabel: 'What do you need doing?', formPlaceholder: 'e.g. New consumer unit, extra sockets in the kitchen…', formButton: 'Send my request'
    },
    building: {
      name: 'Hart & Co. Builders', brand: 'HART <span>&amp;</span> CO.', switchLabel: 'Builder',
      phone: '01372 000 303', email: 'projects@hartandco.example', area: 'Leatherhead, Cobham, Esher & Guildford', hours: 'Mon–Fri 8am–5:30pm',
      kicker: 'Extensions · Renovations · Loft conversions',
      headline: 'More space.<br>Built properly.',
      intro: 'Extensions, kitchens and full renovations across Surrey, managed from first sketch to final finish by one trusted team.',
      cta: 'Book a free survey', ctaShort: 'Free survey', rating: '5.0 from 38 reviews',
      hero: 'img/hart-hero.webp',
      trust: ['15+ years’ experience', 'Fully insured', 'Fixed-price quotes', 'Building control signed off'],
      servicesTitle: 'Your home. Its next chapter.',
      servicesIntro: 'Whether it’s a single room or the whole house, we look after the planning, the build and the finishing.',
      services: [
        ['home', 'Extensions', 'Single and double storey extensions that make space for the way you live now.'],
        ['stairs', 'Loft conversions', 'Turn wasted roof space into a bedroom, office or ensuite.'],
        ['kitchen', 'Kitchens', 'Open-plan kitchens fitted from the bare walls up.'],
        ['hammer', 'Full renovations', 'Whole-house refurbishments run as one well-managed project.'],
        ['ruler', 'Planning & drawings', 'We work with local architects to get your plans approved.'],
        ['brush', 'Finishing', 'Plastering, flooring and decorating for a truly finished result.']
      ],
      workTitle: 'Recent projects', workLink: 'Talk to us about yours',
      gallery: [['img/hart-interior.webp', 'Open-plan living room in a rear extension'], ['img/hart-kitchen.webp', 'New fitted kitchen'], ['img/hart-front.webp', 'Timber-clad house renovation'], ['img/hart-kitchen2.webp', 'Kitchen island with pendant lights']],
      aboutImg: 'img/volt-lounge.webp', aboutKicker: 'Why Hart & Co.', aboutTitle: 'One team. One clear plan. No surprises.',
      aboutCopy: 'A good build starts with a proper conversation. We agree a detailed, fixed-price quote, give you a dedicated project lead and keep you updated every week.',
      aboutPoints: ['Detailed, fixed-price quotes', 'Weekly progress updates', 'Clean, respectful site team'],
      reviewsTitle: 'Homes we’ve helped grow',
      reviews: [['Our extension came in on budget and on time. The team were tidy and a pleasure to have around.', 'The Collins family', 'Rear extension, Cobham'], ['They handled everything from planning to the final coat of paint. Stress-free.', 'Andrew P.', 'Loft conversion, Esher'], ['Honest advice, quality work and they actually answer the phone!', 'Louise M.', 'Kitchen renovation, Leatherhead']],
      contactKicker: 'Free survey', contactTitle: 'Let’s build what comes next.', contactCopy: 'Tell us about your project and we’ll arrange a free survey and a no-obligation quote.',
      formTitle: 'Book a free survey', formLabel: 'About your project', formPlaceholder: 'e.g. Single storey rear extension, about 4m deep…', formButton: 'Book my survey'
    },
    salon: {
      name: 'Fern Hair Studio', brand: 'Fern<em>.</em>', switchLabel: 'Hair salon',
      phone: '01306 000 404', email: 'hello@fernhair.example', area: '12 West Street, Dorking', hours: 'Tue–Sat 9am–6pm · Thu late until 8pm',
      kicker: 'Hair studio · Dorking',
      headline: 'Hair that feels<br><em>like you.</em>',
      intro: 'Colour, cuts and treatments in a calm, friendly studio. Take your time, have a coffee and leave feeling brilliant.',
      cta: 'Book an appointment', ctaShort: 'Book now', rating: '4.9 from 210 reviews',
      hero: 'img/salon-hero.webp',
      trust: ['Free consultations', 'Vegan-friendly products', 'Late night Thursdays', 'Online booking'],
      servicesTitle: 'Our services',
      servicesIntro: 'Every appointment starts with a proper chat about what you want, so there are no surprises in the mirror.',
      services: [
        ['scissors', 'Cut & finish', 'Restyles, trims and blow-dries. From £38'],
        ['drop', 'Colour', 'Full colour, root touch-ups and glosses. From £65'],
        ['spark', 'Balayage & highlights', 'Soft, lived-in colour that grows out beautifully. From £120'],
        ['leaf', 'Treatments', 'Bond repair and deep conditioning for healthier hair. From £25'],
        ['heart', 'Bridal & occasions', 'Trials and on-the-day styling for your big day. From £85'],
        ['user', 'Men’s cuts', 'Clean, classic and modern cuts. From £26']
      ],
      workTitle: 'Inside the studio', workLink: 'Book your visit',
      gallery: [['img/salon-interior.webp', 'Salon styling stations'], ['img/salon-hair.webp', 'Freshly coloured, styled waves'], ['img/salon-more.webp', 'Modern salon interior with mirrors']],
      aboutImg: 'img/salon-chairs.webp', aboutKicker: 'About Fern', aboutTitle: 'A relaxed studio with a big heart.',
      aboutCopy: 'Fern is an independent studio with a small team of experienced stylists. We take the time to understand your hair and give honest advice on what will suit you.',
      aboutPoints: ['Experienced, friendly stylists', 'Free skin tests and consultations', 'Gift vouchers available'],
      reviewsTitle: 'Loved by our clients',
      reviews: [['Best balayage I’ve ever had. They really listened to what I wanted.', 'Emma L.', 'Balayage'], ['Such a lovely calm salon, and my cut has never grown out so well.', 'Sophie H.', 'Cut & finish'], ['Did my bridal trial and wedding day hair. Absolutely perfect.', 'Rachel D.', 'Bridal']],
      contactKicker: 'Bookings', contactTitle: 'Ready for a fresh look?', contactCopy: 'Book online in a minute, or send us a message and we’ll find a time that suits you.',
      formTitle: 'Request an appointment', formLabel: 'What would you like?', formPlaceholder: 'e.g. Cut and colour, any Saturday morning…', formButton: 'Request appointment'
    }
  };

  const icons = {
    leaf: '<path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15M5 19l7-7" />',
    grid: '<rect x="4" y="4" width="16" height="16" rx="1"/><path d="M4 12h16M12 4v16"/>',
    fence: '<path d="M6 21V7l2-3 2 3v14M14 21V7l2-3 2 3v14M4 11h16M4 16h16"/>',
    sprout: '<path d="M12 21v-9M12 12C12 8 9 6 5 6c0 4 3 6 7 6zM12 10c0-4 3-6 7-6 0 4-3 6-7 6"/>',
    drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
    spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    board: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8v4M12 8v4M16 8v4M8 16h8"/>',
    car: '<path d="M5 16V11l2-5h10l2 5v5M5 16h14M5 16v2M19 16v2"/><circle cx="8" cy="13" r="1"/><circle cx="16" cy="13" r="1"/>',
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.5.4.5 1 .5 1.6V16h6v-.5c0-.6 0-1.2.5-1.6A6 6 0 0 0 12 3z"/>',
    check: '<path d="M12 3l7 3v5c0 4.5-3 8.4-7 10-4-1.6-7-5.5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
    alert: '<path d="M12 3 2 20h20zM12 10v4M12 17h.01"/>',
    home: '<path d="M3 11 12 4l9 7M5 10v10h14V10M10 20v-6h4v6"/>',
    stairs: '<path d="M4 20h4v-4h4v-4h4V8h4V4"/>',
    kitchen: '<rect x="4" y="3" width="16" height="18" rx="1"/><path d="M4 10h16M8 6.5h2M8 14v3"/>',
    hammer: '<path d="M14 6 4 16l4 4 10-10M13 3h4l4 4-3 3-5-5z"/>',
    ruler: '<path d="M3 17 17 3l4 4L7 21zM7 13l2 2M10 10l2 2M13 7l2 2"/>',
    brush: '<path d="M18 3l3 3-9 9-3-3zM9 12c-3 0-5 2-5 5 0 1.5-1 2.5-2 3 4 1 9 0 9-4"/>',
    scissors: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.5 7.5 20 19M8.5 16.5 20 5"/>',
    heart: '<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>'
  };

  const params = new URLSearchParams(window.location.search);
  const key = sites[params.get('site')] ? params.get('site') : sites[params.get('trade')] ? params.get('trade') : 'landscaping';
  const site = sites[key];
  document.body.dataset.example = key;
  document.title = `${site.name} | Example website by SitePilots`;

  const slots = name => document.querySelectorAll(`[data-slot="${name}"]`);
  const text = (name, value) => slots(name).forEach(el => { el.textContent = value; });
  // Only our own hard-coded strings above are written as HTML.
  const html = (name, value) => slots(name).forEach(el => { el.innerHTML = value; });
  const make = (tag, className, content) => { const el = document.createElement(tag); if (className) el.className = className; if (content) el.textContent = content; return el; };
  const icon = (name, cls = 'svc-ic') => { const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('viewBox', '0 0 24 24'); s.setAttribute('class', cls); s.setAttribute('aria-hidden', 'true'); s.innerHTML = icons[name] || ''; return s; };
  const useIcon = id => { const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('class', 'ic'); s.setAttribute('aria-hidden', 'true'); const u = document.createElementNS('http://www.w3.org/2000/svg', 'use'); u.setAttribute('href', id); s.append(u); return s; };

  html('brand', site.brand); html('brand-foot', site.brand); html('headline', site.headline);
  text('kicker', site.kicker); text('intro', site.intro); text('cta', site.cta); text('cta-short', site.ctaShort); text('rating', site.rating);
  text('phone', site.phone); text('email', site.email); text('area', site.area); text('hours', site.hours);
  slots('phone-link').forEach(a => { a.href = `tel:${site.phone.replace(/\s/g, '')}`; });
  slots('hero-img').forEach(img => { img.src = site.hero; });
  slots('about-img').forEach(img => { img.src = site.aboutImg; });
  text('services-title', site.servicesTitle); text('services-intro', site.servicesIntro);
  text('work-title', site.workTitle); text('work-link', site.workLink);
  text('about-kicker', site.aboutKicker); text('about-title', site.aboutTitle); text('about-copy', site.aboutCopy);
  text('reviews-title', site.reviewsTitle);
  text('contact-kicker', site.contactKicker); text('contact-title', site.contactTitle); text('contact-copy', site.contactCopy);
  text('form-title', site.formTitle); text('form-label', site.formLabel); text('form-button', site.formButton);
  slots('form-placeholder').forEach(el => { el.placeholder = site.formPlaceholder; });

  slots('trust').forEach(list => list.replaceChildren(...site.trust.map(t => { const li = make('li'); li.append(useIcon('#ic-check'), document.createTextNode(t)); return li; })));
  slots('services').forEach(grid => grid.replaceChildren(...site.services.map(([ic, title, copy]) => {
    const card = make('article', 'svc');
    card.append(icon(ic), make('h3', '', title), make('p', '', copy));
    return card;
  })));
  slots('gallery').forEach(grid => {
    grid.dataset.count = site.gallery.length;
    grid.replaceChildren(...site.gallery.map(([src, alt]) => { const fig = make('figure'); const img = make('img'); img.src = src; img.alt = alt; img.loading = 'lazy'; fig.append(img, make('figcaption', '', alt)); return fig; }));
  });
  slots('about-points').forEach(list => list.replaceChildren(...site.aboutPoints.map(t => { const li = make('li'); li.append(useIcon('#ic-check'), document.createTextNode(t)); return li; })));
  slots('reviews').forEach(grid => grid.replaceChildren(...site.reviews.map(([quote, who, job]) => {
    const card = make('figure', 'review');
    const q = make('blockquote'); q.append(make('span', 'stars', '★★★★★'), make('p', '', `“${quote}”`));
    const cap = make('figcaption'); cap.append(make('strong', '', who), make('span', '', job));
    card.append(q, cap);
    return card;
  })));

  const switcher = document.getElementById('sp-switch');
  switcher?.replaceChildren(...Object.entries(sites).map(([k, s]) => {
    const a = make('a', k === key ? 'is-current' : '', s.switchLabel);
    a.href = `example.html?site=${k}`;
    if (k === key) a.setAttribute('aria-current', 'page');
    return a;
  }));

  const form = document.getElementById('demo-form');
  form?.addEventListener('submit', e => { e.preventDefault(); form.reset(); document.getElementById('form-demo').hidden = false; });
})();
