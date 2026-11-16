import { merge, sameDoc, emptyDoc } from './merge.js';
import { SORTS, catOrder, ordnen, verschieben } from './sort.js';
import { VERSION, neuer } from './version.js';
import { CATALOG, iconFor, findCatalog } from './catalog.js';

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
const parseSetup = s => JSON.parse(decodeURIComponent(escape(atob(s.split('#setup=')[1].trim()))));
if (location.hash.startsWith('#setup=')) {
  try {
    cfg = { ...parseSetup(location.hash), user: cfg.user || '' };
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
  doc.items[id] = { id, listId: cur, name, qty, cat, done: false, by: cfg.user || '', created: Date.now() };
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
  const qty = el('button', { className: 'qty', textContent: i.qty || 'Menge', title: 'Ändern' });
  qty.onclick = () => editItem(i);
  const del = el('button', { className: 'del', textContent: '✕', title: 'Löschen', ariaLabel: i.name + ' löschen' });
  del.onclick = () => touch(i, { deleted: true });
  // Name antippen = Artikel bearbeiten
  const name = el('button', { type: 'button', className: 'name', textContent: i.name, title: 'Ändern', ariaLabel: i.name + ' ändern' });
  name.onclick = () => editItem(i);
  if (i.by && i.by !== cfg.user) name.append(el('span', { className: 'by', textContent: i.by }));
  const ic = el('span', { className: 'ic', textContent: iconFor(i.name, i.cat), ariaHidden: 'true' });
  return el('div', { className: 'item' }, cb, ic, name, qty, del);
}

function render() {
  ensureList();
  $('listSel').replaceChildren(...lists().map(l => el('option', { value: l.id, textContent: l.name, selected: l.id === cur })));
  const all = items();
  const open = all.filter(i => !i.done), done = all.filter(i => i.done);
  $('open').replaceChildren(...ordnen(open, doc.lists[cur], CATS).flatMap(([c, g]) =>
    [...(c ? [el('h3', { textContent: c })] : []), ...g.map(row)]));
  // Kategorie-Auswahl beim Hinzufügen in derselben Reihenfolge wie die Liste
  const sel = $('cat').value || 'Sonstiges';
  $('cat').replaceChildren(...catOrder(doc.lists[cur], CATS).map(c => el('option', { value: c, textContent: c })));
  $('cat').value = sel;
  $('empty').hidden = all.length > 0;
  $('doneBox').hidden = done.length === 0;
  $('doneCount').textContent = done.length;
  $('done').replaceChildren(...done.sort((a, b) => b.updatedAt - a.updatedAt).map(row));
  if ($('pickDlg').open) renderPicker();
}

// ---------- Artikel bearbeiten ----------
let editing = null;
function editItem(i) {
  editing = i;
  $('edName').value = i.name; $('edQty').value = i.qty || '';
  $('edCat').replaceChildren(...catOrder(doc.lists[cur], CATS).map(c => el('option', { value: c, textContent: c })));
  $('edCat').value = CATS.includes(i.cat) ? i.cat : 'Sonstiges';
  $('editDlg').returnValue = ''; // sonst gilt bei Esc/Zurück noch der Knopf vom letzten Mal
  $('editDlg').showModal();
}
$('edName').addEventListener('input', e => { const c = findCatalog(e.target.value)?.cat; if (c) $('edCat').value = c; });
$('editDlg').addEventListener('close', () => {
  const i = editing; editing = null;
  if (!i) return;
  const r = $('editDlg').returnValue;
  if (r === 'del') return touch(i, { deleted: true });
  const name = $('edName').value.trim();
  if (r !== 'save' || !name) return;
  touch(i, { name, qty: $('edQty').value.trim(), cat: $('edCat').value });
});

// ---------- Symbol-Auswahl ----------
// Kachel antippen: Artikel auf die Liste; ist er schon offen drauf, wieder entfernen
function renderPicker() {
  const q = $('pickSearch').value.trim().toLowerCase();
  const offen = new Map(items().filter(i => !i.done).map(i => [i.name.toLowerCase(), i]));
  // Eigene Artikel (nicht im Katalog), zuletzt benutzte zuerst
  const eigene = new Map();
  for (const i of Object.values(doc.items).sort((a, b) => b.updatedAt - a.updatedAt))
    if (!findCatalog(i.name) && !eigene.has(i.name.toLowerCase())) eigene.set(i.name.toLowerCase(), { name: i.name, cat: i.cat || 'Sonstiges' });
  const alle = [...[...eigene.values()].slice(0, 24).map(e => ({ ...e, eigen: true })), ...CATALOG]
    .filter(e => !q || e.name.toLowerCase().includes(q));
  const tile = e => {
    const on = offen.get(e.name.toLowerCase());
    const b = el('button', { type: 'button', className: 'tile' + (on ? ' on' : ''), ariaPressed: on ? 'true' : 'false' },
      el('span', { className: 'ic', textContent: e.icon || iconFor(e.name, e.cat) }), el('span', { textContent: e.name }));
    b.onclick = () => on ? touch(on, { deleted: true }) : addItem(e.name, '', e.cat);
    return b;
  };
  const gruppen = [['Eigene Artikel', alle.filter(e => e.eigen)],
    ...catOrder(doc.lists[cur], CATS).map(c => [c, alle.filter(e => !e.eigen && e.cat === c)])];
  const teile = gruppen.filter(([, g]) => g.length)
    .flatMap(([c, g]) => [el('h3', { textContent: c }), el('div', { className: 'tiles' }, ...g.map(tile))]);
  // Suchbegriff ohne Treffer: als neuen Artikel anbieten
  if (q && !alle.some(e => e.name.toLowerCase() === q)) {
    const neu = el('button', { type: 'button', className: 'secondary', textContent: `„${$('pickSearch').value.trim()}“ hinzufügen` });
    neu.onclick = () => { addItem($('pickSearch').value, '', 'Sonstiges'); $('pickSearch').value = ''; renderPicker(); };
    teile.unshift(neu);
  }
  $('pickGrid').replaceChildren(...teile);
}
$('pickBtn').onclick = () => { $('pickSearch').value = ''; renderPicker(); $('pickDlg').showModal(); };
$('pickSearch').oninput = renderPicker;
$('pickDone').onclick = () => $('pickDlg').close();

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
$('name').addEventListener('input', e => { const v = e.target.value.trim(); const c = lastCat(v) || findCatalog(v)?.cat; if (c) $('cat').value = c; });
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

// Sortierung der aktuellen Liste (☰-Dialog)
$('sortSel').replaceChildren(...Object.entries(SORTS).map(([v, t]) => el('option', { value: v, textContent: t })));
function renderSortDlg() {
  const l = doc.lists[cur];
  $('sortList').textContent = l.name;
  $('sortSel').value = l.sort || 'kat';
  $('catBox').hidden = $('sortSel').value !== 'kat';
  const order = catOrder(l, CATS);
  const btn = (txt, label, dir, c, off) => {
    const b = el('button', { type: 'button', className: 'icon', textContent: txt, ariaLabel: `${c} ${label}`, disabled: off });
    b.onclick = () => { touch(l, { cats: verschieben(order, c, dir) }); renderSortDlg(); };
    return b;
  };
  $('catOrder').replaceChildren(...order.map((c, i) => el('div', { className: 'catrow' },
    el('span', { textContent: `${i + 1}. ${c}` }), btn('↑', 'nach oben', -1, c, i === 0), btn('↓', 'nach unten', 1, c, i === order.length - 1))));
}
$('sortSel').onchange = e => { touch(doc.lists[cur], { sort: e.target.value }); renderSortDlg(); };
$('resetCats').onclick = () => { touch(doc.lists[cur], { cats: [] }); renderSortDlg(); };
$('listMenuBtn').onclick = () => { renderSortDlg(); $('listDlg').showModal(); };
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
  // Konto aus der Pages-Adresse (racerman76.github.io → racerman76) vorbelegen
  const pagesOwner = location.hostname.endsWith('.github.io') ? location.hostname.split('.')[0] : '';
  $('cfgUser').value = cfg.user || ''; $('cfgOwner').value = cfg.owner || pagesOwner;
  $('cfgRepo').value = cfg.repo || 'einkaufsliste-daten'; $('cfgToken').value = cfg.token || '';
  $('setDlg').showModal();
};
const tokenOk = t => /^(github_pat_|ghp_)\w+$/.test(t);
$('cfgToken').addEventListener('input', e => {
  // In der Android-App öffnet der Einrichtungslink den Browser – daher Link hier einfügen können
  if (e.target.value.includes('#setup=')) try {
    const c = parseSetup(e.target.value);
    $('cfgOwner').value = c.owner; $('cfgRepo').value = c.repo; e.target.value = c.token;
  } catch {}
  e.target.setCustomValidity(tokenOk(e.target.value.trim()) ? '' : 'Das ist kein GitHub-Token (beginnt mit github_pat_…) und kein Einrichtungslink.');
});
$('setDlg').addEventListener('close', () => {
  if ($('setDlg').returnValue !== 'save') return;
  const owner = $('cfgOwner').value.trim(), repo = $('cfgRepo').value.trim(), token = $('cfgToken').value.trim();
  if (cfg.owner !== owner || cfg.repo !== repo) { sha = null; dirty = true; } // anderes Repo: lokalen Stand dorthin übernehmen
  cfg = { user: $('cfgUser').value.trim(), owner, repo, token };
  localStorage.setItem('ek-cfg', JSON.stringify(cfg)); save(); render(); sync();
});
$('copyLink').onclick = async () => {
  const c = { owner: $('cfgOwner').value.trim(), repo: $('cfgRepo').value.trim(), token: $('cfgToken').value.trim() };
  if (!c.owner || !c.repo || !tokenOk(c.token)) return alert('Erst Konto, Repo und ein gültiges Token (github_pat_…) eintragen.');
  // In der Android-App ist die Adresse "localhost" – dann auf die GitHub-Pages-Adresse verlinken
  const base = location.hostname.endsWith('.github.io') ? location.origin + location.pathname : `https://${c.owner}.github.io/einkaufsliste/`;
  const link = base + '#setup=' + btoa(unescape(encodeURIComponent(JSON.stringify(c))));
  try { await navigator.clipboard.writeText(link); alert('Link kopiert. Nur an Familienmitglieder schicken – er enthält das Token.'); }
  catch { prompt('Link kopieren:', link); }
};

// ---------- Version und Update ----------
const APP_REPO = 'racerman76/einkaufsliste';
const isApk = !!window.Capacitor?.isNativePlatform?.();
let updVer = null;
$('verText').textContent = `Version ${VERSION} (${isApk ? 'Android-App' : 'Web-App'})`;

async function checkUpdate(manual) {
  try {
    const r = await fetch(`https://api.github.com/repos/${APP_REPO}/releases/latest`, { cache: 'no-store' });
    if (!r.ok) throw new Error(r.status);
    const tag = (await r.json()).tag_name || '';
    updVer = neuer(tag, VERSION) ? tag.replace(/^v/, '') : null;
  } catch { if (manual) alert('Update-Prüfung nicht möglich – keine Verbindung zu GitHub?'); return; }
  $('updBar').hidden = !updVer;
  if (updVer) {
    $('updText').textContent = `Version ${updVer} ist da (du hast ${VERSION}).`;
    $('updBtn').textContent = isApk ? 'Herunterladen' : 'Neu laden';
  } else if (manual) alert(`Du hast die neueste Version (${VERSION}).`);
}
$('checkUpd').onclick = () => checkUpdate(true);
$('updBtn').onclick = async () => {
  if (isApk) {
    // Öffnet den Browser; GitHub leitet weiter, der Download startet erst nach einigen Sekunden
    $('updText').textContent = `Download von ${updVer} läuft im Browser – das kann bis zu einer Minute dauern. ` +
      'Danach oben die Download-Meldung antippen und „Installieren“ wählen.';
    $('updBtn').disabled = true; $('updBtn').textContent = 'Lädt …';
    setTimeout(() => { $('updBtn').disabled = false; $('updBtn').textContent = 'Nochmal laden'; }, 60000);
    location.href = `https://github.com/${APP_REPO}/releases/download/v${updVer}/Einkaufsliste.apk`;
  } else {
    try { await (await navigator.serviceWorker?.getRegistration())?.update(); } catch {}
    location.reload();
  }
};

window.addEventListener('online', () => sync());
document.addEventListener('visibilitychange', () => { if (!document.hidden) sync(); });
setInterval(() => { if (!document.hidden) sync(); }, 20000);
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {}); // in der Android-App gibt es kein sw.js

// Android-App: beim Bauen eingebauter Einrichtungslink (preset.json, nur in der APK vorhanden)
if (!cfg.token) try {
  const r = await fetch('preset.json');
  if (r.ok) { cfg = { ...parseSetup((await r.json()).link), user: cfg.user || '' }; localStorage.setItem('ek-cfg', JSON.stringify(cfg)); }
} catch {}

render();
if (!cfg.token) $('settingsBtn').click(); else sync();
checkUpdate(false);
