// Artikel mit Symbol für die Symbol-Auswahl (Emoji – laufen auf iPhone, Android und PC ohne Bilddateien)
export const CAT_ICON = {
  'Obst & Gemüse': '🥕', 'Brot & Backwaren': '🥖', 'Kühlregal': '🧀', 'Fleisch & Fisch': '🥩', 'Tiefkühl': '🧊',
  'Trockenwaren': '🍝', 'Getränke': '🥤', 'Drogerie': '🧴', 'Haushalt': '🧽', 'Sonstiges': '🛒',
};

const k = (cat, liste) => liste.trim().split(/\s*,\s*/).map(e => {
  const [icon, ...n] = e.split(' ');
  return { name: n.join(' '), icon, cat };
});

export const CATALOG = [
  ...k('Obst & Gemüse', `🍎 Äpfel, 🍌 Bananen, 🍐 Birnen, 🍊 Orangen, 🍋 Zitronen, 🍇 Trauben, 🍓 Erdbeeren, 🥝 Kiwi,
    🍅 Tomaten, 🥒 Gurke, 🫑 Paprika, 🥕 Karotten, 🥔 Kartoffeln, 🧅 Zwiebeln, 🧄 Knoblauch, 🥬 Salat, 🥦 Brokkoli,
    🍄 Pilze, 🌽 Mais, 🥑 Avocado`),
  ...k('Brot & Backwaren', `🍞 Brot, 🥖 Brötchen, 🍞 Toast, 🥐 Croissants, 🥨 Brezeln, 🍰 Kuchen`),
  ...k('Kühlregal', `🥛 Milch, 🧈 Butter, 🧀 Käse, 🥣 Joghurt, 🥣 Quark, 🥛 Sahne, 🥚 Eier, 🧈 Margarine, 🧀 Frischkäse`),
  ...k('Fleisch & Fisch', `🍗 Hähnchen, 🥩 Hackfleisch, 🥩 Steak, 🌭 Wurst, 🥓 Schinken, 🥓 Speck, 🐟 Fisch, 🐟 Lachs, 🦐 Garnelen`),
  ...k('Tiefkühl', `🍕 Pizza, 🍟 Pommes, 🍨 Eis, 🐟 Fischstäbchen, 🧊 TK-Gemüse`),
  ...k('Trockenwaren', `🍝 Nudeln, 🍚 Reis, 🌾 Mehl, 🍬 Zucker, 🧂 Salz, 🫒 Öl, 🥣 Müsli, ☕ Kaffee, 🍵 Tee, 🍯 Honig,
    🫙 Marmelade, 🍫 Schokolade, 🍿 Chips, 🍪 Kekse, 🥫 Konserven, 🥫 Ketchup`),
  ...k('Getränke', `💧 Wasser, 🧃 Saft, 🥤 Cola, 🍺 Bier, 🍷 Wein, 🍾 Sekt`),
  ...k('Drogerie', `🪥 Zahnpasta, 🧴 Shampoo, 🧴 Duschgel, 🧼 Seife, 🧻 Toilettenpapier, 🤧 Taschentücher, 🧴 Deo, 🪒 Rasierer`),
  ...k('Haushalt', `🧽 Spülmittel, 🧺 Waschmittel, 🗑️ Müllbeutel, 🧻 Küchenrolle, 🔋 Batterien, 💡 Glühbirne, 🕯️ Kerzen`),
  ...k('Sonstiges', `💐 Blumen, 🐾 Tierfutter, 📰 Zeitung`),
];

const byName = new Map(CATALOG.map(e => [e.name.toLowerCase(), e]));
export const findCatalog = name => byName.get(String(name).trim().toLowerCase());

// Symbol für einen Artikel: aus dem Katalog, sonst das Symbol seiner Kategorie
export const iconFor = (name, cat) => findCatalog(name)?.icon || CAT_ICON[cat] || '🛒';
