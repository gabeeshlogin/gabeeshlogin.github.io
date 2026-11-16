/**
 * Carlo Italia table bookings, built by SitePilots.
 * Runs as a Google Apps Script web app. Data lives in the Google Sheet this script is attached to.
 *
 * Script properties (Project Settings > Script properties):
 *   STAFF_PIN        PIN for the staff page (required)
 *   CALLMEBOT_PHONE  Jo's WhatsApp number in international format, e.g. 447700900123 (optional)
 *   CALLMEBOT_KEY    API key CallMeBot sends back to Jo (optional)
 * Run setup() once from the editor to create the sheets.
 */

var CFG = {
  tz: 'Europe/London',
  name: 'Carlo Italia',
  phone: '01372 650293',
  site: 'https://www.carloitalia.com',
  notifyEmail: 'carlorestaurantgreatbookham@gmail.com',
  // minutes from midnight; 0 = Sunday
  hours: { 2: [720, 1260], 3: [720, 1260], 4: [720, 1260], 5: [720, 1290], 6: [720, 1290] },
  lastSeatBeforeClose: 60,
  step: 30,
  duration: 120,
  leadMins: 60,
  maxDays: 120,
  maxOnline: 8,
  tables: [
    { id: 'T1', seats: 5 }, { id: 'T2', seats: 4 }, { id: 'T3', seats: 2 }, { id: 'T4', seats: 2 },
    { id: 'T5', seats: 6 }, { id: 'T6', seats: 2 }, { id: 'T7', seats: 2 }
  ],
  // tables that can be pushed together for bigger groups
  combos: [['T3', 'T4'], ['T6', 'T7'], ['T5', 'T3'], ['T1', 'T2'], ['T5', 'T2'], ['T5', 'T1']]
};

var COLS = ['id', 'token', 'created', 'date', 'time', 'size', 'name', 'email', 'phone', 'notes', 'tables', 'status', 'source', 'leftAt', 'updated'];
var ACTIVE = { confirmed: 1, seated: 1, left: 1 };

/* ---------- setup ---------- */
function setup() {
  var ss = SpreadsheetApp.getActive();
  var b = ss.getSheetByName('Bookings') || ss.insertSheet('Bookings');
  b.getRange(1, 1, 1, COLS.length).setValues([COLS]).setFontWeight('bold');
  b.getRange('A:O').setNumberFormat('@');
  b.setFrozenRows(1);
  var c = ss.getSheetByName('Closures') || ss.insertSheet('Closures');
  c.getRange(1, 1, 1, 2).setValues([['date', 'note']]).setFontWeight('bold');
  c.getRange('A:B').setNumberFormat('@');
  c.setFrozenRows(1);
  var s1 = ss.getSheetByName('Sheet1'); if (s1 && ss.getSheets().length > 2) ss.deleteSheet(s1);
  PropertiesService.getScriptProperties().setProperty('SHEET_ID', ss.getId());
}

function ss_() {
  var id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  return id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActive();
}

/* ---------- helpers ---------- */
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function nowLondon_() {
  var d = new Date();
  return { date: Utilities.formatDate(d, CFG.tz, 'yyyy-MM-dd'), mins: +Utilities.formatDate(d, CFG.tz, 'H') * 60 + +Utilities.formatDate(d, CFG.tz, 'm'), iso: Utilities.formatDate(d, CFG.tz, "yyyy-MM-dd HH:mm") };
}
function toMins_(t) { var p = String(t).split(':'); return +p[0] * 60 + +p[1]; }
function hhmm_(m) { return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2); }
function dow_(date) { var p = date.split('-'); return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])).getUTCDay(); }
function daysBetween_(a, b) { var pa = a.split('-'), pb = b.split('-'); return Math.round((Date.UTC(+pb[0], +pb[1] - 1, +pb[2]) - Date.UTC(+pa[0], +pa[1] - 1, +pa[2])) / 864e5); }
function nice_(date, time) {
  var p = date.split('-'), d = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2], 12));
  var s = Utilities.formatDate(d, 'UTC', 'EEEE d MMMM');
  if (!time) return s;
  var m = toMins_(time), h = Math.floor(m / 60), mm = m % 60, ap = h >= 12 ? 'pm' : 'am'; h = h % 12 || 12;
  return s + ' at ' + h + (mm ? ':' + ('0' + mm).slice(-2) : '') + ap;
}
function clean_(s, n) { return String(s == null ? '' : s).replace(/[<>]/g, '').trim().slice(0, n || 200); }
function newId_() { var a = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', s = ''; for (var i = 0; i < 6; i++) s += a[Math.floor(Math.random() * a.length)]; return s.slice(0, 3) + '-' + s.slice(3); }

function cell_(c, v) {
  if (v instanceof Date) {
    if (c === 'date') return Utilities.formatDate(v, CFG.tz, 'yyyy-MM-dd');
    if (c === 'time' || c === 'leftAt') return Utilities.formatDate(v, CFG.tz, 'HH:mm');
    return Utilities.formatDate(v, CFG.tz, 'yyyy-MM-dd HH:mm');
  }
  return String(v);
}
function rows_() {
  var sh = ss_().getSheetByName('Bookings'), v = sh.getDataRange().getValues(), out = [];
  for (var i = 1; i < v.length; i++) { var o = { _row: i + 1 }; COLS.forEach(function (c, j) { o[c] = cell_(c, v[i][j]); }); if (o.id) out.push(o); }
  return out;
}
function writeRow_(o) {
  var sh = ss_().getSheetByName('Bookings'), vals = [COLS.map(function (c) { return o[c] == null ? '' : String(o[c]); })];
  var r = o._row || sh.getLastRow() + 1;
  var rng = sh.getRange(r, 1, 1, COLS.length); rng.setNumberFormat('@'); rng.setValues(vals);
}
function closures_() {
  var v = ss_().getSheetByName('Closures').getDataRange().getValues(), m = {};
  for (var i = 1; i < v.length; i++) if (v[i][0]) m[cell_('date', v[i][0]).slice(0, 10)] = String(v[i][1] || '');
  return m;
}

/* ---------- availability ---------- */
function busy_(rows, date, exceptId) {
  // returns {tableId: [[start,end],...]}
  var b = {};
  rows.forEach(function (r) {
    if (r.date !== date || !ACTIVE[r.status] || r.id === exceptId) return;
    var s = toMins_(r.time), e = s + CFG.duration;
    if (r.status === 'left' && r.leftAt) e = Math.min(e, toMins_(r.leftAt));
    r.tables.split('+').forEach(function (t) { if (t) (b[t] = b[t] || []).push([s, e]); });
  });
  return b;
}
function free_(busy, ids, s, e) {
  return ids.every(function (t) { return !(busy[t] || []).some(function (x) { return x[0] < e && s < x[1]; }); });
}
function options_(size) {
  var o = [];
  CFG.tables.forEach(function (t) { if (t.seats >= size) o.push({ ids: [t.id], seats: t.seats }); });
  CFG.combos.forEach(function (c) {
    var seats = c.reduce(function (a, id) { return a + CFG.tables.filter(function (t) { return t.id === id; })[0].seats; }, 0);
    if (seats >= size) o.push({ ids: c, seats: seats + 0.5 }); // prefer single tables at equal size
  });
  return o.sort(function (a, b) { return a.seats - b.seats; });
}
function allocate_(busy, size, start) {
  var opts = options_(size), e = start + CFG.duration;
  for (var i = 0; i < opts.length; i++) if (free_(busy, opts[i].ids, start, e)) return opts[i].ids.join('+');
  return '';
}
function dayStatus_(date, size, online) {
  var now = nowLondon_(), h = CFG.hours[dow_(date)], cl = closures_();
  if (cl[date] !== undefined) return { open: false, reason: 'closed' };
  if (!h) return { open: false, reason: 'closed' };
  var diff = daysBetween_(now.date, date);
  if (online && (diff < 0 || diff > CFG.maxDays)) return { open: false, reason: 'range' };
  return { open: true, h: h, diff: diff, now: now };
}
function slots_(date, size) {
  var st = dayStatus_(date, size, true);
  if (!st.open) return [];
  var rows = rows_(), busy = busy_(rows, date), out = [];
  for (var m = st.h[0]; m <= st.h[1] - CFG.lastSeatBeforeClose; m += CFG.step) {
    if (st.diff === 0 && m < st.now.mins + CFG.leadMins) continue;
    if (allocate_(busy, size, m)) out.push(hhmm_(m));
  }
  return out;
}

/* ---------- web endpoints ---------- */
function doGet(e) {
  var p = e.parameter || {};
  try {
    if (p.a === 'slots') {
      var size = Math.max(1, Math.min(CFG.maxOnline, +p.size || 2));
      if (!/^\d{4}-\d{2}-\d{2}$/.test(p.date || '')) return json_({ ok: false, error: 'date' });
      return json_({ ok: true, date: p.date, times: slots_(p.date, size) });
    }
    if (p.a === 'cfg') {
      var cl = closures_(), now = nowLondon_(), closed = [];
      Object.keys(cl).forEach(function (d) { if (d >= now.date) closed.push(d); });
      return json_({ ok: true, maxOnline: CFG.maxOnline, maxDays: CFG.maxDays, openDays: Object.keys(CFG.hours).map(Number), closed: closed, today: now.date, phone: CFG.phone });
    }
    if (p.a === 'lookup') { // guest cancel page
      var r = find_(p.id, p.t);
      if (!r) return json_({ ok: false, error: 'notfound' });
      return json_({ ok: true, booking: { id: r.id, when: nice_(r.date, r.time), size: r.size, name: r.name, status: r.status } });
    }
    return json_({ ok: true, service: 'Carlo Italia bookings' });
  } catch (err) { return json_({ ok: false, error: 'server', detail: String(err) }); }
}

function doPost(e) {
  var d = {};
  try { d = JSON.parse(e.postData.contents || '{}'); } catch (x) { return json_({ ok: false, error: 'bad json' }); }
  try {
    if (d.a === 'book') return json_(book_(d));
    if (d.a === 'cancel') return json_(guestCancel_(d));
    // staff actions below
    if (!pinOk_(d.pin)) return json_({ ok: false, error: 'pin' });
    if (d.a === 'list') return json_(list_(d.date));
    if (d.a === 'upcoming') return json_(upcoming_());
    if (d.a === 'set') return json_(setStatus_(d));
    if (d.a === 'add') return json_(staffAdd_(d));
    if (d.a === 'move') return json_(move_(d));
    if (d.a === 'closure') return json_(closure_(d));
    if (d.a === 'ping') return json_({ ok: true });
    return json_({ ok: false, error: 'action' });
  } catch (err) { return json_({ ok: false, error: 'server', detail: String(err) }); }
}

/* ---------- guest booking ---------- */
function book_(d) {
  if (d.website) return { ok: true, id: 'OK' }; // honeypot
  var size = +d.size, date = clean_(d.date, 10), time = clean_(d.time, 5);
  var name = clean_(d.name, 80), email = clean_(d.email, 120).toLowerCase(), phone = clean_(d.phone, 30), notes = clean_(d.notes, 500);
  if (!(size >= 1 && size <= CFG.maxOnline)) return { ok: false, error: 'size', msg: 'For more than ' + CFG.maxOnline + ' people, please call us on ' + CFG.phone + '.' };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return { ok: false, error: 'when' };
  if (name.length < 2) return { ok: false, error: 'name', msg: 'Please add your name.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: 'email', msg: 'Please check your email address.' };
  if (phone.replace(/\D/g, '').length < 10) return { ok: false, error: 'phone', msg: 'Please check your phone number.' };
  if (d.consent !== true) return { ok: false, error: 'consent' };

  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    if (slots_(date, size).indexOf(time) < 0) return { ok: false, error: 'taken', msg: 'Sorry, that time has just gone. Please pick another.' };
    var rows = rows_();
    // stop accidental double submits
    var dup = rows.filter(function (r) { return r.email === email && r.date === date && r.time === time && ACTIVE[r.status]; })[0];
    if (dup) return { ok: true, id: dup.id, when: nice_(dup.date, dup.time), size: dup.size, dup: true };
    var tables = allocate_(busy_(rows, date), size, toMins_(time));
    if (!tables) return { ok: false, error: 'taken', msg: 'Sorry, that time has just gone. Please pick another.' };
    var b = { id: newId_(), token: Utilities.getUuid().replace(/-/g, ''), created: nowLondon_().iso, date: date, time: time, size: size, name: name, email: email, phone: phone, notes: notes, tables: tables, status: 'confirmed', source: 'online', leftAt: '', updated: nowLondon_().iso };
    writeRow_(b);
    SpreadsheetApp.flush();
  } finally { lock.releaseLock(); }
  guestEmail_(b);
  notify_(b, 'new');
  return { ok: true, id: b.id, when: nice_(b.date, b.time), size: b.size };
}

function find_(id, token) {
  if (!id || !token) return null;
  return rows_().filter(function (r) { return r.id === id && r.token === token; })[0] || null;
}
function guestCancel_(d) {
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var r = find_(d.id, d.t);
    if (!r) return { ok: false, error: 'notfound' };
    if (r.status === 'cancelled') return { ok: true, already: true };
    r.status = 'cancelled'; r.updated = nowLondon_().iso; writeRow_(r);
  } finally { lock.releaseLock(); }
  notify_(r, 'cancel');
  return { ok: true };
}

/* ---------- staff ---------- */
function pinOk_(pin) {
  var cache = CacheService.getScriptCache(), fails = +(cache.get('pinfails') || 0);
  if (fails > 30) return false; // slows down guessing, resets after 10 minutes
  var ok = String(pin || '') !== '' && String(pin) === PropertiesService.getScriptProperties().getProperty('STAFF_PIN');
  if (!ok) cache.put('pinfails', String(fails + 1), 600);
  return ok;
}
function upcoming_() {
  var now = nowLondon_();
  var rows = rows_().filter(function (r) { return r.date >= now.date && (r.status === 'confirmed' || r.status === 'seated'); }).map(function (r) {
    return { id: r.id, date: r.date, nice: nice_(r.date), time: r.time, size: +r.size, name: r.name, email: r.email, phone: r.phone, notes: r.notes, tables: r.tables, status: r.status, source: r.source, leftAt: r.leftAt, created: r.created };
  }).sort(function (a, b) { return (a.date + a.time) < (b.date + b.time) ? -1 : 1; });
  var cl = closures_(), up = [];
  Object.keys(cl).sort().forEach(function (k) { if (k >= now.date) up.push({ date: k, note: cl[k] }); });
  return { ok: true, upcoming: true, date: now.date, now: now, tables: CFG.tables, duration: CFG.duration, closures: up, bookings: rows.slice(0, 300) };
}
function list_(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) date = nowLondon_().date;
  var rows = rows_().filter(function (r) { return r.date === date; }).map(function (r) {
    return { id: r.id, time: r.time, size: +r.size, name: r.name, email: r.email, phone: r.phone, notes: r.notes, tables: r.tables, status: r.status, source: r.source, leftAt: r.leftAt, created: r.created };
  }).sort(function (a, b) { return a.time < b.time ? -1 : 1; });
  var cl = closures_(), up = [];
  Object.keys(cl).sort().forEach(function (k) { if (k >= nowLondon_().date) up.push({ date: k, note: cl[k] }); });
  return { ok: true, date: date, nice: nice_(date), now: nowLondon_(), hours: CFG.hours[dow_(date)] || null, closed: cl[date] !== undefined, closures: up, tables: CFG.tables, duration: CFG.duration, bookings: rows };
}
function setStatus_(d) {
  var allowed = { confirmed: 1, seated: 1, left: 1, cancelled: 1, noshow: 1 };
  if (!allowed[d.status]) return { ok: false, error: 'status' };
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var r = rows_().filter(function (x) { return x.id === d.id; })[0];
    if (!r) return { ok: false, error: 'notfound' };
    r.status = d.status;
    r.leftAt = d.status === 'left' ? hhmm_(nowLondon_().mins) : '';
    r.updated = nowLondon_().iso; writeRow_(r);
  } finally { lock.releaseLock(); }
  return { ok: true };
}
function staffAdd_(d) {
  var size = +d.size, date = clean_(d.date, 10), time = clean_(d.time, 5);
  if (!(size >= 1 && size <= 40)) return { ok: false, error: 'size' };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return { ok: false, error: 'when' };
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var rows = rows_(), tables = clean_(d.tables, 30);
    if (!tables) tables = allocate_(busy_(rows, date), size, toMins_(time));
    if (!tables && !d.force) return { ok: false, error: 'full', msg: 'No table free for ' + size + ' at ' + time + '. Pick a table to add it anyway.' };
    var b = { id: newId_(), token: Utilities.getUuid().replace(/-/g, ''), created: nowLondon_().iso, date: date, time: time, size: size, name: clean_(d.name, 80) || 'Walk-in', email: clean_(d.email, 120).toLowerCase(), phone: clean_(d.phone, 30), notes: clean_(d.notes, 500), tables: tables || '', status: d.walkin ? 'seated' : 'confirmed', source: d.walkin ? 'walk-in' : (d.source || 'phone'), leftAt: '', updated: nowLondon_().iso };
    writeRow_(b);
  } finally { lock.releaseLock(); }
  if (b.email && d.sendEmail) guestEmail_(b);
  return { ok: true, id: b.id, tables: b.tables };
}
function move_(d) {
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var r = rows_().filter(function (x) { return x.id === d.id; })[0];
    if (!r) return { ok: false, error: 'notfound' };
    r.tables = clean_(d.tables, 30); r.updated = nowLondon_().iso; writeRow_(r);
  } finally { lock.releaseLock(); }
  return { ok: true };
}
function closure_(d) {
  var sh = ss_().getSheetByName('Closures'), v = sh.getDataRange().getValues(), date = clean_(d.date, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { ok: false, error: 'date' };
  for (var i = v.length - 1; i >= 1; i--) if (cell_('date', v[i][0]).slice(0, 10) === date) sh.deleteRow(i + 1);
  if (!d.remove) { var rg = sh.getRange(sh.getLastRow() + 1, 1, 1, 2); rg.setNumberFormat('@'); rg.setValues([[date, clean_(d.note, 100)]]); }
  return { ok: true };
}

/* ---------- messages ---------- */
function guestEmail_(b) {
  var cancel = CFG.site + '/cancel.html?id=' + encodeURIComponent(b.id) + '&t=' + b.token;
  var when = nice_(b.date, b.time);
  var html = '<div style="font-family:Arial,sans-serif;max-width:520px;color:#1d2820">' +
    '<h2 style="font-family:Georgia,serif;font-weight:normal;color:#1f3328;margin:0 0 12px">Your table is booked</h2>' +
    '<p>Hello ' + b.name + ',</p><p>Thank you for booking with Carlo Italia. Here are your details:</p>' +
    '<table style="border-collapse:collapse;margin:10px 0 18px">' +
    '<tr><td style="padding:4px 14px 4px 0;color:#535d4e">When</td><td><b>' + when + '</b></td></tr>' +
    '<tr><td style="padding:4px 14px 4px 0;color:#535d4e">Guests</td><td><b>' + b.size + '</b></td></tr>' +
    '<tr><td style="padding:4px 14px 4px 0;color:#535d4e">Reference</td><td><b>' + b.id + '</b></td></tr></table>' +
    (b.notes ? '<p style="color:#535d4e">Your note: ' + b.notes + '</p>' : '') +
    '<p>Carlo Italia, 23 High Street, Great Bookham KT23 4AA. Call us on ' + CFG.phone + ' if anything changes.</p>' +
    '<p>Can\'t make it? <a href="' + cancel + '" style="color:#b5321e">Cancel your booking here</a>, so we can give the table to someone else.</p>' +
    '<p>See you soon,<br>Carlo Italia</p></div>';
  var text = 'Your table at Carlo Italia is booked.\n\nWhen: ' + when + '\nGuests: ' + b.size + '\nReference: ' + b.id + '\n\nCarlo Italia, 23 High Street, Great Bookham KT23 4AA. Call ' + CFG.phone + ' if anything changes.\nCancel: ' + cancel;
  try { MailApp.sendEmail({ to: b.email, subject: 'Your table at Carlo Italia, ' + when, body: text, htmlBody: html, name: 'Carlo Italia', replyTo: CFG.notifyEmail }); } catch (e) { console.error(e); }
}
function notify_(b, kind) {
  var when = nice_(b.date, b.time);
  var head = kind === 'cancel' ? 'Booking CANCELLED' : 'New booking';
  var msg = head + ' (' + b.id + ')\n' + b.name + ', ' + b.size + (b.size == 1 ? ' person' : ' people') + '\n' + when + '\nTable ' + (b.tables || '?') + '\nPhone ' + b.phone + (b.notes ? '\nNote: ' + b.notes : '') + '\n\nAll bookings: ' + CFG.site + '/bookings/';
  try { MailApp.sendEmail({ to: CFG.notifyEmail, subject: head + ': ' + b.name + ', ' + b.size + ', ' + when, body: msg, name: 'Carlo Italia bookings' }); } catch (e) { console.error(e); }
  var pr = PropertiesService.getScriptProperties(), ph = pr.getProperty('CALLMEBOT_PHONE'), key = pr.getProperty('CALLMEBOT_KEY');
  if (ph && key) {
    try { UrlFetchApp.fetch('https://api.callmebot.com/whatsapp.php?phone=' + encodeURIComponent(ph) + '&text=' + encodeURIComponent(msg) + '&apikey=' + encodeURIComponent(key), { muteHttpExceptions: true }); } catch (e) { console.error(e); }
  }
  whatsapp_(msg);
}
/* TextMeBot: script properties TEXTMEBOT_KEY and TEXTMEBOT_TO (number in international format, e.g. +447700900123) */
function whatsapp_(msg) {
  var pr = PropertiesService.getScriptProperties(), k = pr.getProperty('TEXTMEBOT_KEY'), to = pr.getProperty('TEXTMEBOT_TO');
  if (!k || !to) return 'not set up';
  try {
    var r = UrlFetchApp.fetch('https://api.textmebot.com/send.php?recipient=' + encodeURIComponent(to) + '&apikey=' + encodeURIComponent(k) + '&text=' + encodeURIComponent(msg), { muteHttpExceptions: true });
    return r.getResponseCode() + ' ' + r.getContentText().slice(0, 200);
  } catch (e) { console.error(e); return String(e); }
}
function testWhatsApp() { console.log(whatsapp_('Carlo Italia bookings: WhatsApp alerts are working. You will get a message like this for every new booking.')); }

/* run once from the editor to check email works */
function testNotify() { notify_({ id: 'TEST', name: 'Test booking', size: 2, date: nowLondon_().date, time: '19:00', tables: 'T3', phone: '0000', notes: 'Ignore, just a test' }, 'new'); }
