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
