// Änderungsliste – neueste Version oben. Bei jeder neuen Version hier einen Eintrag ergänzen
// und VERSION in version.js auf dieselbe Nummer setzen (der Selbsttest prüft das).
// Aus diesen Texten entstehen die Release-Beschreibungen auf GitHub und das Fenster „Neuigkeiten“ in der App.
export const AENDERUNGEN = [
  {
    version: '1.18.0', titel: 'Einkaufswagen als Standardsymbol',
    punkte: [
      'Selbst angelegte Artikel ohne eigenes Symbol zeigen jetzt immer den Einkaufswagen 🛒 – in der Liste und in der Symbol-Auswahl. Bisher bekamen sie das Symbol ihrer Kategorie (z. B. 🧽 für Haushalt), was leicht mit anderen Artikeln zu verwechseln war.',
      'Wer ein anderes Symbol möchte, wählt es wie gewohnt unter 🧺 → ✎ → „🍎 Symbole“ oder hinterlegt ein Foto.',
    ],
  },
  {
    version: '1.17.0', titel: 'Kürbis',
    punkte: [
      'Neu in der Symbol-Auswahl unter „Obst & Gemüse“: Kürbis 🎃. Das Symbol steht auch unter „🍎 Symbole“ für eigene Artikel zur Wahl.',
    ],
  },
  {
    version: '1.16.0', titel: 'Alle Lebensmittel-Symbole',
    punkte: [
      'Unter „🍎 Symbole“ stehen jetzt alle Lebensmittel-Symbole zur Wahl – zusammen fast 150 Symbole: Obst, Gemüse, Kräuter, Nüsse, Backwaren, Fleisch, Fisch und Meeresfrüchte, Gerichte, Asiatisches, Süßes und Getränke.',
      'Zuerst kommen weiterhin die Symbole aus der Auswahl, danach die übrigen Lebensmittel, am Ende die Kategorie-Symbole.',
    ],
  },
  {
    version: '1.15.0', titel: 'Symbole für eigene Artikel',
    punkte: [
      'Beim Anlegen oder Ändern eines Eintrags in der Symbol-Auswahl (🧺 → ✎) gibt es den Knopf „🍎 Symbole“. Er zeigt alle vorhandenen Symbole der App zum Antippen – so bekommen auch selbst erstellte Artikel ein passendes Bild, ohne Foto.',
      'Das angetippte Symbol erscheint sofort in der Vorschau und ersetzt ein vorher gewähltes eigenes Bild. Foto und Galerie gibt es weiterhin.',
    ],
  },
  {
    version: '1.14.0', titel: 'Menge bei der Symbol-Auswahl',
    punkte: [
      'Wer in der Symbol-Auswahl 🧺 einen Artikel antippt, bekommt jetzt gleich das Fenster für die Menge – auf dem Handy mit Zahlentastatur. Einheit und Kategorie lassen sich dort mit einstellen.',
      'Die Menge muss eingetragen werden; erst mit „Speichern“ kommt der Artikel auf die Liste. „Abbrechen“ oder ✕ fügt nichts hinzu.',
    ],
  },
  {
    version: '1.13.0', titel: 'Eigene Kategorienliste je Liste',
    punkte: [
      'Unter ☰ gibt es „Kategorienliste für …“: Jede Einkaufsliste kann ihre eigene Kategorienliste nutzen, z. B. „Supermarkt“ für den Einkauf und „Baumarkt“ für die Baumarkt-Liste.',
      'Neue Kategorienlisten lassen sich leer („＋ Neue“) oder als Kopie der aktuellen („⧉ Als Kopie“) anlegen, umbenennen (✎) und löschen (✕). Mehrere Listen können dieselbe Kategorienliste nutzen; darunter steht, welche.',
      'Die bisherigen Kategorien bilden die Kategorienliste „Standard“ – alle bestehenden Listen nutzen sie weiter, es geht nichts verloren. Auch „Standard“ lässt sich umbenennen.',
      'Hinzufügen, Umbenennen und Löschen von Kategorien wirkt jetzt nur in der gewählten Kategorienliste.',
      'Die Symbol-Auswahl 🧺 zeigt nur Artikel, die zur Kategorienliste der Liste passen – in einer Baumarkt-Liste also keine Lebensmittel.',
    ],
  },
  {
    version: '1.12.0', titel: 'Eigene Kategorien',
    punkte: [
      'Unter ☰ → „Nach Kategorie (Ladenweg)“ lassen sich Kategorien jetzt hinzufügen („＋ Kategorie hinzufügen“), umbenennen (✎) und löschen (✕).',
      'Kategorien gelten für alle Listen und werden auf allen Geräten abgeglichen. Die Reihenfolge stellt weiterhin jede Liste selbst ein; neue Kategorien stehen zunächst am Ende.',
      'Beim Umbenennen bleiben alle Artikel in ihrer Kategorie. Beim Löschen landen sie unter „Sonstiges“ – mit „Rückgängig“, falls es ein Versehen war.',
      '„Sonstiges“ ist die Auffang-Kategorie und kann umbenannt, aber nicht gelöscht werden.',
      'Neue Kategorien stehen überall zur Auswahl: beim Hinzufügen, in „Artikel ändern“ und in der Symbol-Auswahl.',
    ],
  },
  {
    version: '1.11.0', titel: 'Auswahl-Einträge mit einem Tipp entfernen',
    punkte: [
      'Im Bearbeiten-Modus der Symbol-Auswahl (🧺 → ✎) hat jede Kachel oben rechts ein rotes ✕.',
      'Ein Tipp darauf entfernt den Eintrag sofort aus der Auswahl – ohne das Bearbeiten-Fenster zu öffnen.',
      'Unten erscheint „Rückgängig“, falls es der falsche war. Entfernte Einträge lassen sich außerdem jederzeit über „Ausgeblendete zurückholen“ wiederherstellen.',
    ],
  },
  {
    version: '1.10.3', titel: 'Spracheingabe: „einpacken“ wird erkannt',
    punkte: [
      'Die Spracherkennung schreibt „ein Pack“ auch als „einpacken“. Das wird jetzt ebenfalls als Menge erkannt: „Brötchen einpacken“ ergibt Brötchen mit 1 Pck.',
      'Dadurch landet der Artikel auch wieder in der richtigen Kategorie (Brötchen unter Brot & Backwaren statt Sonstiges).',
      '„Packen“ zählt jetzt generell als Packung, z. B. „Brötchen zwei Packen“.',
    ],
  },
  {
    version: '1.10.2', titel: 'Spracheingabe: „einpack“ wird erkannt',
    punkte: [
      'Die Spracherkennung schreibt „ein Pack“ manchmal als ein Wort („einpack“). Das wird jetzt als Menge erkannt: „Brötchen einpack“ ergibt Brötchen mit 1 Pck.',
      'Gilt für alle Zahlwörter und Einheiten, z. B. „Milch einliter“ oder „Wasser zweikästen“.',
    ],
  },
  {
    version: '1.10.1', titel: 'Spracheingabe versteht Mengen hinter dem Artikel',
    punkte: [
      'Mengen werden jetzt auch erkannt, wenn sie nach dem Artikel gesagt werden: „Milch 2 Liter“ ergibt Milch mit Menge 2 l – vorher landete alles im Namen.',
      'Auch ohne Pausen: „Milch 2 Liter Saft 1 Liter Hack 500 Gramm“ wird zu drei Artikeln mit ihren Mengen.',
      'Bekannte Artikel werden getrennt, auch wenn sie ohne Pause gesagt werden („Milch Butter Brot“). Zusammengehörige Namen wie „Rote Bete“ bleiben zusammen.',
      '„ein halbes Pfund Butter“ ergibt jetzt Butter mit 0,5 Pfund.',
    ],
  },
  {
    version: '1.10.0', titel: 'Spracheingabe',
    punkte: [
      'Neuer Knopf 🎤 neben 🧺: antippen und mehrere Artikel auf einmal ansagen, z. B. „Milch, zwei Liter Saft, 500 Gramm Hack und Brot“.',
      'Mengen und Einheiten werden erkannt (Liter, Gramm, Kilo, Packung, Flasche, Dose, Becher, Kasten …), auch Kommazahlen wie „1,5 Kilo“.',
      'Die Artikel landen mit Kategorie und Symbol bzw. eigenem Bild aus der Auswahl auf der Liste – auch bei Einzahl/Mehrzahl („Apfel“ findet „Äpfel“).',
      'Unten erscheint, was hinzugefügt wurde, mit „Rückgängig“, falls etwas falsch verstanden wurde.',
      'Android-App: nutzt das Google-Sprachfenster und fragt beim ersten Mal nach der Mikrofon-Erlaubnis. Am PC und im Handy-Browser läuft die Erkennung im Browser.',
    ],
  },
  {
    version: '1.9.0', titel: 'Eigene Bilder für Artikel',
    punkte: [
      'Im Fenster „Auswahl-Eintrag ändern“ (🧺 → ✎ → Eintrag antippen) gibt es „📷 Foto“ für ein Foto mit der Kamera und „🖼 Galerie“ für ein vorhandenes Bild.',
      'Das Bild ersetzt das Emoji – in der Symbol-Auswahl und in der Einkaufsliste. Eine Vorschau zeigt vor dem Speichern, wie es aussieht.',
      'Bilder werden automatisch quadratisch zugeschnitten und stark verkleinert (wenige KB), damit der Abgleich schnell bleibt. Sie gelten auf allen Geräten.',
      'Das ✕ neben dem Bild stellt wieder das Emoji her. Das geht auch bei den Standard-Einträgen, nicht nur bei selbst angelegten.',
    ],
  },
  {
    version: '1.8.3', titel: '„Fertig“ in der Symbol-Auswahl ist zurück',
    punkte: [
      'Die Symbol-Auswahl 🧺 hat wieder den Knopf „Fertig“ – zusätzlich zum ✕ oben rechts. Beide schließen die Auswahl.',
    ],
  },
  {
    version: '1.8.2', titel: 'Symbol-Auswahl mit ✕ schließen',
    punkte: [
      'Die Symbol-Auswahl 🧺 hat oben rechts jetzt ebenfalls ein ✕ und schließt damit sofort, ohne etwas zu bestätigen.',
      'Das ✕ ersetzt den bisherigen Knopf „Fertig“ – so ist im Kopf der Auswahl mehr Platz für das Suchfeld.',
    ],
  },
  {
    version: '1.8.1', titel: 'Fenster schnell schließen',
    punkte: [
      'Alle verschiebbaren Fenster haben oben rechts ein ✕ zum schnellen Schließen: „Artikel ändern“, „Einstellungen“, „Listen“, „Neuigkeiten“ und „Auswahl-Eintrag ändern“.',
      'Das ✕ wirkt wie „Abbrechen“ – nicht gespeicherte Eingaben werden verworfen.',
      'Im Fenster „Neuigkeiten“ ersetzt das ✕ den bisherigen Knopf „Schließen“.',
    ],
  },
  {
    version: '1.8.0', titel: 'Symbol-Auswahl selbst anpassen',
    punkte: [
      'In der Symbol-Auswahl 🧺 schaltet ✎ in den Bearbeiten-Modus. Ein Eintrag lässt sich dann umbenennen, mit anderem Symbol versehen oder einer anderen Kategorie zuordnen.',
      'Einträge, die ihr nie braucht, lassen sich aus der Auswahl entfernen – auch selbst eingetippte Artikel unter „Eigene Artikel“.',
      '„＋ Neuen Eintrag anlegen“ fügt eigene Artikel mit Symbol dauerhaft zur Auswahl hinzu.',
      'Ausgeblendete Einträge lassen sich zurückholen, und „Ganze Auswahl auf Standard zurücksetzen“ verwirft alle Änderungen.',
      'Die Anpassungen werden über GitHub abgeglichen und gelten auf allen Geräten der Familie.',
    ],
  },
  {
    version: '1.7.2', titel: 'Fenster verschieben',
    punkte: [
      'Die Fenster „Artikel ändern“, „Einstellungen“, „Listen“ und „Neuigkeiten“ lassen sich verschieben: am Titel mit dem Griff ⠿ ziehen, mit dem Finger oder der Maus.',
      'Praktisch auf dem Handy, wenn die Tastatur das Fenster verdeckt.',
      'Der Titel bleibt dabei immer auf dem Bildschirm. Doppeltippen auf den Titel holt das Fenster zurück in die Mitte.',
    ],
  },
  {
    version: '1.7.1', titel: 'Zahlentastatur für die Menge',
    punkte: [
      'Beim Eintippen der Menge öffnet das Handy jetzt die Zahlentastatur statt der normalen Tastatur.',
      'Im Fenster „Artikel ändern“ gibt es neben der Menge eine Auswahl für die Einheit (Stück, g, kg, ml, l, Pck., Fl., Dose, Becher, Bund, Glas).',
      'Bestehende Mengen wie „2 kg“ werden dabei automatisch in Zahl und Einheit aufgeteilt.',
    ],
  },
  {
    version: '1.7.0', titel: 'Neuigkeiten in der App',
    punkte: [
      'Unter ⚙ gibt es jetzt „Neuigkeiten“: eine Übersicht aller Versionen mit ihren Änderungen.',
      'Meldet die App ein Update, zeigt „Was ist neu?“ in der Update-Leiste vor dem Aktualisieren, was die neue Version bringt.',
      'Die Beschreibungen der Versionen auf GitHub sind ausführlicher und stammen aus derselben Liste wie in der App.',
    ],
  },
  {
    version: '1.6.0', titel: 'Artikel auf der Liste bearbeiten',
    punkte: [
      'Name oder Menge eines Artikels antippen öffnet „Artikel ändern“ – dort lassen sich Name, Menge und Kategorie ändern.',
      'Bei bekannten Artikeln passt sich die Kategorie beim Umbenennen von selbst an (aus „Milk“ wird „Milch“ im Kühlregal).',
      'Im selben Fenster lässt sich der Artikel auch von der Liste löschen.',
      'Ersetzt die bisherige Mengenabfrage über ein einfaches Eingabefenster.',
    ],
  },
  {
    version: '1.5.4', titel: 'Eigene Artikel ohne störende Vorschlagsliste eintippen',
    punkte: [
      'Die Vorschlagsliste unter dem Eingabefeld ist entfernt. Sie hat auf Android Tastatur und Knopf verdeckt, sodass sich eigene Artikel kaum hinzufügen ließen.',
      'Die Tastatur zeigt „Fertig“ – damit wird der Artikel direkt auf die Liste gesetzt.',
      'Vorschläge zum Antippen gibt es weiterhin in der Symbol-Auswahl 🧺, dort auch für selbst eingetippte Artikel.',
    ],
  },
  {
    version: '1.5.3', titel: 'Updates ohne Neuinstallation',
    punkte: [
      'Die Android-App wird ab dieser Version immer mit demselben Schlüssel signiert. Neue Versionen lassen sich direkt über die installierte App spielen, die Meldung „App nicht installiert“ tritt nicht mehr auf.',
      'Einmalig: Wer von einer älteren Version kommt, muss die App vorher deinstallieren. Die Liste bleibt dabei erhalten, sie liegt auf GitHub.',
    ],
  },
  {
    version: '1.5.2', titel: 'Symbol-Auswahl erweitert',
    punkte: [
      'Neue Wurstsorten in „Fleisch & Fisch“: Aufschnitt, Salami, Bratwurst, Wiener und Leberwurst.',
      '„Glühbirne“ heißt jetzt richtig „Glühlampe“.',
    ],
  },
  {
    version: '1.5.1', titel: 'Hinweis während des Update-Downloads',
    punkte: [
      'Nach „Herunterladen“ zeigt die Update-Leiste, dass der Download im Browser läuft, bis zu einer Minute dauern kann und wie danach installiert wird.',
      'Der Knopf ist währenddessen gesperrt, damit der Download nicht mehrfach startet; nach einer Minute heißt er „Nochmal laden“.',
    ],
  },
  {
    version: '1.5.0', titel: 'Artikel per Symbol auswählen',
    punkte: [
      'Neuer Knopf 🧺 öffnet ein Raster mit rund 90 gängigen Artikeln mit Symbol, nach Kategorien in der Reihenfolge der Liste.',
      'Antippen setzt einen Artikel auf die Liste, nochmal antippen nimmt ihn wieder herunter. Mit Suchfeld, eigenen Artikeln und „hinzufügen“ für Neues.',
      'Jeder Artikel in der Liste zeigt jetzt sein Symbol.',
      'Behoben: Die grüne Update-Leiste war in 1.4.0 auch ohne Update als leere Fläche zu sehen.',
    ],
  },
  {
    version: '1.4.0', titel: 'Versionsnummern und Update-Knopf',
    punkte: [
      'Unter ⚙ steht die Version der App, dazu „Nach Updates suchen“.',
      'Beim Start prüft die App selbst und zeigt eine Leiste, wenn es eine neue Version gibt – Android lädt sie herunter, iPhone und PC laden neu.',
      'Releases auf GitHub tragen jetzt Versionsnummern statt Build-Nummern.',
    ],
  },
  {
    version: '1.3', titel: 'Frühere Versionen (vor den Versionsnummern)', ohneRelease: true,
    punkte: [
      'Einstellbare Reihenfolge je Liste: nach Kategorie im Ladenweg, alphabetisch, neueste oder älteste zuerst.',
      'Kompaktere Ansicht fürs Handy, angepasst ans iPhone.',
      'Android-App zum Installieren, mit eingebautem Einrichtungslink.',
      'Grundfunktionen: mehrere Listen, Kategorien und Mengen, Abgleich über GitHub, mit der Familie teilen, offline abhaken.',
    ],
  },
];

// Release-Text für GitHub (Markdown)
export function releaseText(version) {
  const e = AENDERUNGEN.find(a => a.version === version);
  if (!e) return null;
  return `### ${e.titel}\n\n${e.punkte.map(p => `- ${p}`).join('\n')}\n\n` +
    '**Installieren:** Android – in der App „Herunterladen“ antippen oder die Datei unten laden und über die alte Version installieren. ' +
    'iPhone/PC – App neu öffnen bzw. „Neu laden“.';
}
