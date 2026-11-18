// Selbsttest: node sprache.test.mjs
import assert from 'node:assert/strict';
import { zerlegen, normiert } from './sprache.js';

const z = t => zerlegen(t).map(a => a.qty ? `${a.name} (${a.qty})` : a.name);
assert.deepEqual(z('Milch, zwei Liter Saft, 500 Gramm Hack und Brot'), ['Milch', 'Saft (2 l)', 'Hack (500 g)', 'Brot']);
assert.deepEqual(z('3 Äpfel und eine Gurke'), ['Äpfel (3)', 'Gurke']);
assert.deepEqual(z('1,5 kg Kartoffeln'), ['Kartoffeln (1,5 kg)']);
assert.deepEqual(z('500g Mehl und zwei Packungen Nudeln'), ['Mehl (500 g)', 'Nudeln (2 Pck.)']);
assert.deepEqual(z('ich brauche noch Butter, bitte auch Eier'), ['Butter', 'Eier']);
assert.deepEqual(z('einen Kasten Wasser'), ['Wasser (1 Kasten)']);
assert.deepEqual(z('ein halbes Pfund Butter'), ['Halbes Pfund Butter']); // zweite Zahl wird nicht erraten – bleibt lesbar
assert.deepEqual(z('Salz; Pfeffer. Zucker'), ['Salz', 'Pfeffer', 'Zucker']);
assert.deepEqual(z('toilettenpapier'), ['Toilettenpapier']);
assert.deepEqual(z('   und , '), []);
assert.deepEqual(z('Liter Milch'), ['Milch (1 l)']);  // Einheit ohne Zahl = 1
assert.deepEqual(z('zwei Liter'), ['Liter (2)']);    // nur Zahl + Einheit: nichts verschlucken

assert.equal(normiert('Apfel'), normiert('Äpfel'));
assert.equal(normiert('Banane'), normiert('Bananen'));
assert.equal(normiert('Tomate'), normiert('Tomaten'));
assert.notEqual(normiert('Milch'), normiert('Mehl'));
console.log('sprache: alle Tests ok');
