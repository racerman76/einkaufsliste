import { merge, sameDoc, emptyDoc } from './merge.js';

const CATS = ['Obst & Gemüse', 'Brot & Backwaren', 'Kühlregal', 'Fleisch & Fisch', 'Tiefkühl',
  'Trockenwaren', 'Getränke', 'Drogerie', 'Haushalt', 'Sonstiges'];
const FILE = 'data.json';
const $ = id => document.getElementById(id);
const uid = () => crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2);

// ---------- Lokaler Zustand (bleibt offline erhalten) ----------
const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
let doc = load('ek-doc', emptyDoc());
let sha = load('ek-sha', null);
let dirty = load('ek-dirty', false);
let cfg = load('ek-cfg', {});
let cur = localStorage.getItem('ek-cur');
const save = () => {
  localStorage.setItem('ek-doc', JSON.stringify(doc));
  localStorage.setItem('ek-sha', JSON.stringify(sha));
  localStorage.setItem('ek-dirty', JSON.stringify(dirty));
};

// Einrichtungslink: #setup=<base64 JSON> (Hash wird nie an einen Server geschickt)
if (location.hash.startsWith('#setup=')) {
  try {
    cfg = { ...JSON.parse(decodeURIComponent(escape(atob(location.hash.slice(7))))), user: cfg.user || '' };
    localStorage.setItem('ek-cfg', JSON.stringify(cfg));
  } catch { alert('Einrichtungslink ist ungültig.'); }
  history.replaceState(null, '', location.pathname);
}

// ---------- Änderungen ----------
function touch(obj, changes) {
  Object.assign(obj, changes, { updatedAt: Date.now() });
  dirty = true; save(); render(); scheduleSync(1500);
}
const lists = () => Object.values(doc.lists).filter(l => !l.deleted).sort((a, b) => a.created - b.created);
const items = () => Object.values(doc.items).filter(i => !i.deleted && i.listId === cur);

function ensureList() {
  if (lists().length === 0) {
    // Feste ID: neue Geräte legen vor dem ersten Abgleich dieselbe Standardliste an → keine Dubletten
    // updatedAt 0: jeder Stand aus GitHub (auch eine Löschung) hat Vorrang
    doc.lists.standard = { id: 'standard', name: 'Einkauf', created: 0, updatedAt: 0 };
    dirty = true; save();
  }
  if (!doc.lists[cur] || doc.lists[cur].deleted) cur = lists()[0].id;
  localStorage.setItem('ek-cur', cur);
}

function addItem(name, qty, cat) {
  name = name.trim(); if (!name) return;
  // Gleicher Artikel schon auf der Liste? Dann wieder aktivieren statt doppelt anlegen.
  const ex = items().find(i => i.name.toLowerCase() === name.toLowerCase());
  if (ex) return touch(ex, { done: false, qty: qty || ex.qty, cat });
  const id = uid();
  doc.items[id] = { id, listId: cur, name, qty, cat, done: false, by: cfg.user || '' };
  touch(doc.items[id], {});
}

// Zuletzt verwendete Kategorie je Artikelname (für Vorschlag)
function lastCat(name) {
  let best = null;
  for (const i of Object.values(doc.items))
    if (i.name.toLowerCase() === name.toLowerCase() && (!best || i.updatedAt > best.updatedAt)) best = i;
  return best?.cat;
}

// ---------- Anzeige ----------
function el(tag, props = {}, ...kids) {
  const e = Object.assign(document.createElement(tag), props);
  e.append(...kids); return e;
}

function row(i) {
  const cb = el('input', { type: 'checkbox', checked: !!i.done, ariaLabel: i.name + ' erledigt' });
  cb.onchange = () => touch(i, { done: cb.checked });
  const qty = el('button', { className: 'qty', textContent: i.qty || 'Menge', title: 'Menge ändern' });
  qty.onclick = () => { const q = prompt('Menge für ' + i.name, i.qty || ''); if (q !== null) touch(i, { qty: q.trim() }); };
  const del = el('button', { className: 'del', textContent: '✕', title: 'Löschen', ariaLabel: i.name + ' löschen' });
  del.onclick = () => touch(i, { deleted: true });
  const name = el('span', { className: 'name', textContent: i.name });
  if (i.by && i.by !== cfg.user) name.append(el('span', { className: 'by', textContent: i.by }));
  return el('div', { className: 'item' }, cb, name, qty, del);
}

function render() {
  ensureList();
  $('listSel').replaceChildren(...lists().map(l => el('option', { value: l.id, textContent: l.name, selected: l.id === cur })));
  const all = items();
  const open = all.filter(i => !i.done), done = all.filter(i => i.done);
  const groups = CATS.map(c => [c, open.filter(i => (CATS.includes(i.cat) ? i.cat : 'Sonstiges') === c)])
    .filter(([, g]) => g.length);
  $('open').replaceChildren(...groups.flatMap(([c, g]) =>
    [el('h3', { textContent: c }), ...g.sort((a, b) => a.name.localeCompare(b.name, 'de')).map(row)]));
  $('empty').hidden = all.length > 0;
  $('doneBox').hidden = done.length === 0;
  $('doneCount').textContent = done.length;
  $('done').replaceChildren(...done.sort((a, b) => b.updatedAt - a.updatedAt).map(row));
  const names = [...new Set(Object.values(doc.items).map(i => i.name))].sort((a, b) => a.localeCompare(b, 'de'));
  $('known').replaceChildren(...names.map(n => el('option', { value: n })));
}

function status(kind, text) { $('syncDot').className = 'dot ' + kind; $('syncText').textContent = text; }

// ---------- Abgleich mit GitHub ----------
const api = () => `https://api.github.com/repos/${encodeURIComponent(cfg.owner)}/${encodeURIComponent(cfg.repo)}/contents/${FILE}`;
const headers = () => ({ Authorization: 'Bearer ' + cfg.token, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' });
const b64enc = s => { let b = ''; for (const c of new TextEncoder().encode(s)) b += String.fromCharCode(c); return btoa(b); };
const b64dec = s => new TextDecoder().decode(Uint8Array.from(atob(s.replace(/\s/g, '')), c => c.charCodeAt(0)));

async function ghGet() {
  const r = await fetch(api(), { headers: headers(), cache: 'no-store' });
  if (r.status === 404) return { doc: emptyDoc(), sha: null };
  if (!r.ok) throw new Error(r.status === 401 ? 'Token ungültig' : 'GitHub ' + r.status);
  const j = await r.json();
  return { doc: JSON.parse(b64dec(j.content)), sha: j.sha };
}

async function ghPut(content, prevSha) {
  const body = { message: `Einkaufsliste (${cfg.user || 'App'})`, content: b64enc(JSON.stringify(content, null, 1)) };
  if (prevSha) body.sha = prevSha;
  const r = await fetch(api(), { method: 'PUT', headers: headers(), body: JSON.stringify(body) });
  if (r.status === 409 || r.status === 422) return null; // inzwischen von anderem Gerät geändert → neu abgleichen
  if (!r.ok) throw new Error(r.status === 403 || r.status === 404 ? 'Keine Schreibrechte' : 'GitHub ' + r.status);
  return (await r.json()).content.sha;
}

let syncing = false, timer = null;
function scheduleSync(ms) { clearTimeout(timer); timer = setTimeout(sync, ms); }

async function sync() {
  if (!cfg.token || !cfg.owner || !cfg.repo) return status('err', 'Einrichten');
  if (!navigator.onLine) return status(dirty ? 'busy' : '', 'Offline');
  if (syncing) return scheduleSync(1000);
  syncing = true; status('busy', 'Abgleich…');
  try {
    for (let attempt = 0; attempt < 4; attempt++) {
      const remote = await ghGet();
      const merged = merge(doc, remote.doc);
      doc = merged; sha = remote.sha; save(); render();
      if (remote.sha && sameDoc(merged, remote.doc)) { dirty = false; break; }
      const newSha = await ghPut(merged, remote.sha);
      if (newSha) { sha = newSha; dirty = false; break; }
    }
    save();
    status(dirty ? 'err' : 'ok', dirty ? 'Konflikt' : 'Aktuell');
  } catch (e) {
    status('err', navigator.onLine ? e.message : 'Offline');
  } finally { syncing = false; }
}

// ---------- Bedienung ----------
$('cat').replaceChildren(...CATS.map(c => el('option', { value: c, textContent: c })));
$('cat').value = 'Sonstiges';
$('name').addEventListener('input', e => { const c = lastCat(e.target.value.trim()); if (c) $('cat').value = c; });
$('addForm').onsubmit = e => {
  e.preventDefault();
  addItem($('name').value, $('qty').value.trim(), $('cat').value);
  $('name').value = ''; $('qty').value = ''; $('name').focus();
};
$('listSel').onchange = e => { cur = e.target.value; localStorage.setItem('ek-cur', cur); render(); };
$('clearDone').onclick = () => {
  const t = Date.now();
  for (const i of items()) if (i.done) Object.assign(i, { deleted: true, updatedAt: t });
  dirty = true; save(); render(); scheduleSync(500);
};
$('syncBtn').onclick = () => sync();

$('listMenuBtn').onclick = () => $('listDlg').showModal();
$('newList').onclick = () => {
  const n = prompt('Name der neuen Liste', 'Baumarkt'); if (!n?.trim()) return;
  const id = uid(); doc.lists[id] = { id, name: n.trim(), created: Date.now() };
  cur = id; touch(doc.lists[id], {}); $('listDlg').close();
};
$('renameList').onclick = () => {
  const l = doc.lists[cur]; const n = prompt('Neuer Name', l.name);
  if (n?.trim()) touch(l, { name: n.trim() }); $('listDlg').close();
};
$('deleteList').onclick = () => {
  const l = doc.lists[cur];
  if (lists().length < 2) return alert('Die letzte Liste kann nicht gelöscht werden.');
  if (!confirm(`Liste „${l.name}“ mit allen Artikeln löschen?`)) return;
  const t = Date.now();
  for (const i of items()) Object.assign(i, { deleted: true, updatedAt: t });
  touch(l, { deleted: true }); $('listDlg').close();
};

$('settingsBtn').onclick = () => {
  $('cfgUser').value = cfg.user || ''; $('cfgOwner').value = cfg.owner || '';
  $('cfgRepo').value = cfg.repo || 'einkaufsliste-daten'; $('cfgToken').value = cfg.token || '';
  $('setDlg').showModal();
};
$('setDlg').addEventListener('close', () => {
  if ($('setDlg').returnValue !== 'save') return;
  const owner = $('cfgOwner').value.trim(), repo = $('cfgRepo').value.trim(), token = $('cfgToken').value.trim();
  if (cfg.owner !== owner || cfg.repo !== repo) { sha = null; dirty = true; } // anderes Repo: lokalen Stand dorthin übernehmen
  cfg = { user: $('cfgUser').value.trim(), owner, repo, token };
  localStorage.setItem('ek-cfg', JSON.stringify(cfg)); save(); render(); sync();
});
$('copyLink').onclick = async () => {
  const c = { owner: $('cfgOwner').value.trim(), repo: $('cfgRepo').value.trim(), token: $('cfgToken').value.trim() };
  const link = location.origin + location.pathname + '#setup=' + btoa(unescape(encodeURIComponent(JSON.stringify(c))));
  try { await navigator.clipboard.writeText(link); alert('Link kopiert. Nur an Familienmitglieder schicken – er enthält das Token.'); }
  catch { prompt('Link kopieren:', link); }
};

window.addEventListener('online', () => sync());
document.addEventListener('visibilitychange', () => { if (!document.hidden) sync(); });
setInterval(() => { if (!document.hidden) sync(); }, 20000);
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js');

render();
if (!cfg.token) $('settingsBtn').click(); else sync();
