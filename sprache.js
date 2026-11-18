// Gesprochenen Text in Artikel zerlegen:
// "Milch, zwei Liter Saft, 500 Gramm Hack und Brot" →
//   [{name:'Milch',qty:''}, {name:'Saft',qty:'2 l'}, {name:'Hack',qty:'500 g'}, {name:'Brot',qty:''}]

const ZAHLWOERTER = {
  ein: 1, eine: 1, einen: 1, einem: 1, einer: 1, eins: 1, zwei: 2, drei: 3, vier: 4, fünf: 5, sechs: 6,
  sieben: 7, acht: 8, neun: 9, zehn: 10, elf: 11, zwölf: 12, fünfzehn: 15, zwanzig: 20, dreißig: 30,
  vierzig: 40, fünfzig: 50, hundert: 100, zweihundert: 200, dreihundert: 300, fünfhundert: 500,
  halb: 0.5, halbe: 0.5, halben: 0.5, halbes: 0.5, anderthalb: 1.5, eineinhalb: 1.5,
};
const EINHEITEN = [
  [/^(liter|l)$/, 'l'], [/^(milliliter|ml)$/, 'ml'], [/^(gramm|g|gr)$/, 'g'],
  [/^(kilo|kilogramm|kg)$/, 'kg'], [/^pfund$/, 'Pfund'],
  [/^(packung|packungen|päckchen|pack|packs|pck\.?|pkg)$/, 'Pck.'], [/^(flasche|flaschen|fl\.?)$/, 'Fl.'],
  [/^(dose|dosen)$/, 'Dose'], [/^becher$/, 'Becher'], [/^(bund|bündel)$/, 'Bund'], [/^(glas|gläser)$/, 'Glas'],
  [/^(stück|stk\.?)$/, 'Stück'], [/^(kasten|kästen|kiste|kisten)$/, 'Kasten'], [/^(beutel|tüte|tüten|netz)$/, 'Beutel'],
];
// Füllwörter, die nicht zum Artikel gehören
const FUELL = /\b(bitte|noch|auch|ich brauche|wir brauchen|brauchen|brauche|kaufen|besorgen|auf die liste|setze|setz|schreib|schreibe|mal|etwas|etwa)\b/gi;

const zahlVon = w => {
  const t = w.toLowerCase();
  if (/^\d+([.,]\d+)?$/.test(t)) return Number(t.replace(',', '.'));
  return ZAHLWOERTER[t];
};
const einheitVon = w => EINHEITEN.find(([re]) => re.test(w.toLowerCase()))?.[1];
const zahlText = z => String(z).replace('.', ',');
const gross = s => s.charAt(0).toUpperCase() + s.slice(1);

export function zerlegen(text) {
  return String(text || '')
    .replace(FUELL, ' ')
    .split(/\s*(?:(?<!\d),|,(?!\d)|;|\.(?!\d)|\bund\b|\bsowie\b|\bplus\b|\bdazu\b|\bdann\b)\s*/i) // Komma in „1,5“ trennt nicht
    .map(teil => {
      let w = teil.trim().split(/\s+/).filter(Boolean);
      let zahl, einheit;
      if (w.length && zahlVon(w[0]) !== undefined) zahl = zahlVon(w.shift());
      if (w.length > 1 && einheitVon(w[0])) einheit = einheitVon(w.shift());
      // "500g Hack" – Zahl und Einheit zusammengeschrieben
      if (zahl === undefined && w.length > 1) {
        const m = w[0].match(/^(\d+(?:[.,]\d+)?)([a-zäöü.]+)$/i);
        if (m && einheitVon(m[2])) { zahl = Number(m[1].replace(',', '.')); einheit = einheitVon(m[2]); w.shift(); }
      }
      const name = w.join(' ').trim();
      if (!name) return null;
      let qty = '';
      if (einheit) qty = `${zahlText(zahl ?? 1)} ${einheit}`;
      else if (zahl !== undefined && zahl !== 1) qty = zahlText(zahl);
      return { name: gross(name), qty };
    })
    .filter(Boolean);
}

// Für den Abgleich mit der Auswahl: "Apfel" ≈ "Äpfel", "Banane" ≈ "Bananen", "Tomate" ≈ "Tomaten"
export const normiert = s => String(s).toLowerCase().trim()
  .replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/ü/g, 'u').replace(/ß/g, 'ss')
  .replace(/(en|n|e|s)$/, '');
