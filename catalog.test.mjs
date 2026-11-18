// Selbsttest: node catalog.test.mjs
import assert from 'node:assert/strict';
import { CATALOG, CAT_ICON, iconFor, findCatalog } from './catalog.js';

const CATS = Object.keys(CAT_ICON);
assert.ok(CATALOG.length > 80);
for (const e of CATALOG) {
  assert.ok(e.name && e.icon && CATS.includes(e.cat), JSON.stringify(e));
  assert.ok(!/\s{2,}|^\s|\s$/.test(e.name), 'Leerzeichen im Namen: ' + e.name);
}
assert.equal(new Set(CATALOG.map(e => e.name.toLowerCase())).size, CATALOG.length, 'doppelte Namen');
assert.equal(iconFor('milch'), '🥛');
assert.equal(iconFor(' Äpfel '), '🍎');
assert.equal(iconFor('Schrauben', 'Haushalt'), '🧽');
assert.equal(iconFor('Unbekannt'), '🛒');
assert.equal(findCatalog('Toilettenpapier').cat, 'Drogerie');
console.log('catalog: alle Tests ok (' + CATALOG.length + ' Artikel)');

// Anpassbare Auswahl
import { KAT_LISTE, wirksamerKatalog, eigeneArtikel, sucheKat, symbolFuer, ausgeblendet } from './catalog.js';
const ov = (basis, x) => ({ id: 'kat:' + basis, listId: KAT_LISTE, basis, updatedAt: 1, ...x });
const items = {
  a: ov('milch', { name: 'Vollmilch', icon: '🐄' }),                 // umbenannt + neues Symbol
  b: ov('kiwi', { aus: true }),                                       // ausgeblendet
  c: ov('grillkohle', { name: 'Grillkohle', icon: '🔥', cat: 'Haushalt' }), // neu angelegt
  d: ov('salz', { aus: true, deleted: true }),                        // zurückgesetzt → wieder da
  e: { id: 'e', listId: 'L', name: 'Hundeleine', cat: 'Sonstiges', updatedAt: 5 },
  f: { id: 'f', listId: 'L', name: 'Kiwi', cat: 'Obst & Gemüse', updatedAt: 6 },
  g: { id: 'g', listId: 'L', name: 'Vollmilch', cat: 'Kühlregal', updatedAt: 7 },
};
const kat = wirksamerKatalog(items);
assert.equal(sucheKat(kat, 'vollmilch').icon, '🐄');
assert.equal(sucheKat(kat, 'Milch'), undefined);
assert.equal(sucheKat(kat, 'Kiwi'), undefined);
assert.equal(sucheKat(kat, 'Grillkohle').cat, 'Haushalt');
assert.ok(sucheKat(kat, 'Salz'));
assert.equal(kat.length, CATALOG.length);                 // -Kiwi +Grillkohle
assert.equal(symbolFuer(kat, 'grillkohle'), '🔥');
assert.equal(symbolFuer(kat, 'Schrauben', 'Haushalt'), '🧽');
assert.deepEqual(eigeneArtikel(items, kat).map(e => e.name), ['Hundeleine']); // Kiwi ausgeblendet, Vollmilch im Katalog
assert.deepEqual(ausgeblendet(items).map(o => o.basis), ['kiwi']);
console.log('catalog (anpassbar): alle Tests ok');

// Eigene Kategorien
import { KATG_LISTE, wirksameKategorien, STANDARD_KATEGORIEN } from './catalog.js';
const kg = (basis, x) => ({ id: 'katg:' + basis, listId: KATG_LISTE, basis, updatedAt: 1, ...x });
const kitems = {
  a: kg('Tiefkühl', { name: 'Gefriertruhe' }),        // umbenannt
  b: kg('Drogerie', { aus: true }),                    // gelöscht
  c: kg('Sonstiges', { aus: true }),                   // Auffang-Kategorie bleibt trotzdem
  d: kg('Tierbedarf', { name: 'Tierbedarf', created: 2 }),
  e: kg('Baumarkt', { name: 'Baumarkt', created: 1 }),
  f: kg('Weg', { name: 'Weg', aus: true, created: 3 }),
  g: kg('Getränke', { name: 'Durst', deleted: true }), // zurückgesetzt
};
const ks = wirksameKategorien(kitems);
assert.equal(ks.find(k => k.key === 'Tiefkühl').name, 'Gefriertruhe');
assert.ok(!ks.some(k => k.key === 'Drogerie'));
assert.ok(ks.some(k => k.key === 'Sonstiges'));
assert.equal(ks.find(k => k.key === 'Getränke').name, 'Getränke');
assert.deepEqual(ks.slice(-2).map(k => k.key), ['Baumarkt', 'Tierbedarf']);
assert.ok(!ks.some(k => k.key === 'Weg'));
assert.equal(wirksameKategorien({}).length, STANDARD_KATEGORIEN.length);
console.log('catalog (Kategorien): alle Tests ok');
