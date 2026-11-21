# Einkaufsliste

Web-App für PC, Android und iPhone. Die Daten liegen als `data.json` in einem **privaten** GitHub-Repo, die App selbst läuft kostenlos über **GitHub Pages**.

Funktionen: mehrere Listen, Kategorien und Mengen, mit der Familie teilen, offline abhaken. Der Abgleich passiert automatisch alle 20 Sekunden, beim Öffnen und sobald wieder Netz da ist.

## Einrichtung (einmalig, ca. 10 Minuten)

### 1. Daten-Repo anlegen (privat)
- github.com → **New repository** → Name `einkaufsliste-daten` → **Private** → Create.
- Leer lassen, die App legt `data.json` selbst an.

### 2. Zugriffstoken erstellen
- github.com → Profilbild → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**
- Name: `Einkaufsliste`, Ablauf: z. B. 1 Jahr
- **Repository access:** *Only select repositories* → `einkaufsliste-daten`
- **Permissions → Repository permissions → Contents:** *Read and write*
- Token kopieren (beginnt mit `github_pat_…`).

Das Token kann nur dieses eine Repo lesen und schreiben, sonst nichts.

### 3. App-Repo anlegen und veröffentlichen (öffentlich)
- Neues Repo `einkaufsliste`, **Public** (GitHub Pages ist für private Repos nur mit Bezahlkonto möglich – im App-Code steht nichts Geheimes).
- Alle Dateien aus diesem Ordner hochladen (*Add file → Upload files*).
- **Settings → Pages → Source:** *Deploy from a branch*, Branch `main`, Ordner `/ (root)` → Save.
- Nach 1–2 Minuten läuft die App unter `https://<dein-konto>.github.io/einkaufsliste/`.

### 4. Erster Start am PC
- Adresse öffnen, Einstellungen (⚙) erscheinen automatisch.
- Name, GitHub-Konto, Repo `einkaufsliste-daten` und Token eintragen → Speichern.
- Der Punkt oben wird grün („Aktuell“).

### 5. Aufs Handy holen
- In den Einstellungen **„Einrichtungslink für Familie kopieren“** → Link per Messenger an dich selbst / die Familie schicken.
- **Android (Chrome):** Link öffnen → Menü ⋮ → *Zum Startbildschirm hinzufügen* / *App installieren*.
- **iPhone (Safari):** Link öffnen → Teilen-Symbol → *Zum Home-Bildschirm*.
  Wichtig: Auf dem iPhone die App danach **vom Home-Bildschirm** starten und den Einrichtungslink dort noch einmal öffnen bzw. die Einstellungen ausfüllen – die installierte App hat einen eigenen Speicher getrennt von Safari.
- Unter ⚙ jeweils den eigenen Namen eintragen, dann sieht man, wer was auf die Liste gesetzt hat.

## Bedienung
- Artikel eintippen, Menge und Kategorie wählen, **+**. Die Kategorie wird beim nächsten Mal für denselben Artikel vorgeschlagen.
- Oder 🎤 antippen und mehrere Artikel ansagen („Milch, zwei Liter Saft und Brot“) – Mengen und Einheiten werden erkannt.
- Oder 🧺 antippen und Artikel per Symbol auswählen – danach Menge eintragen und mit *Speichern* bestätigen. Nochmal antippen nimmt den Artikel wieder von der Liste. Mit ✎ lässt sich die Auswahl selbst anpassen (umbenennen, Symbol aus allen vorhandenen Symbolen oder eigenes Bild, Kategorie, ausblenden, neue Einträge, Standard wiederherstellen) – gilt für alle Geräte.
- Haken setzen → Artikel wandert nach „Im Wagen“. Gleichen Artikel erneut hinzufügen holt ihn zurück.
- Artikelname oder Menge antippen zum Ändern (Name, Menge, Kategorie), ✕ zum Löschen.
- ☰ → Reihenfolge der Liste wählen (nach Kategorie, alphabetisch, neueste oder älteste zuerst). Bei „Nach Kategorie“ die Kategorien mit ↑ ↓ so ordnen, wie du durch den Laden gehst – jede Liste hat ihre eigene Reihenfolge. Außerdem: neue Liste, umbenennen, löschen. Kategorien lassen sich dort auch hinzufügen (＋), umbenennen (✎) und löschen (✕) – sie gelten für alle Listen.
- Grüner Punkt = abgeglichen, gelb = läuft/offline mit Änderungen, rot = Fehler (Text daneben). Antippen gleicht sofort ab.

## Gut zu wissen
- **Offline:** Alles funktioniert weiter, Änderungen werden später automatisch übertragen. Ändern zwei Geräte denselben Artikel, gewinnt die zuletzt gemachte Änderung.
- **Einrichtungslink enthält das Token.** Nur an Familienmitglieder schicken. Wenn er in falsche Hände gerät: Token auf GitHub löschen, neues erstellen, neu verteilen.
- **Verlauf:** Jede Änderung ist ein Commit im Daten-Repo – damit lässt sich notfalls jeder frühere Stand wiederherstellen.
- **Updates der App:** Nach Code-Änderungen in `sw.js` die Versionsnummer `einkauf-v28` hochzählen, sonst hängen Handys an der alten Version.
- **Token-Ablauf:** Läuft das Token ab, zeigt die App „Token ungültig“. Neues Token erstellen und unter ⚙ eintragen.

## Dateien
`index.html`, `style.css`, `app.js` (Oberfläche und Abgleich), `merge.js` (Zusammenführung der Stände), `sw.js` (Offline), `manifest.webmanifest` + `icons/` (Installation). `merge.test.mjs` ist ein Selbsttest: `node merge.test.mjs`.

## Android-App (APK)
Bei jeder Änderung im Repo baut GitHub automatisch eine Android-App (Workflow `.github/workflows/android-apk.yml`).
Download: https://github.com/racerman76/einkaufsliste/releases/latest/download/Einkaufsliste.apk

- Auf dem Samsung den Link öffnen, Datei herunterladen, antippen. Beim ersten Mal „Installation aus dieser Quelle erlauben“ bestätigen.
- Einrichten: ⚙ öffnen und den **Einrichtungslink** ins Feld „Zugriffstoken oder Einrichtungslink“ einfügen – Konto, Repo und Token werden übernommen.
- Alle Versionen bleiben unter https://github.com/racerman76/einkaufsliste/releases erhalten (z. B. „Einkaufsliste 1.4.0“), falls man zurück will.
- Updates: neue APK einfach über die alte installieren. Alle Versionen ab 1.5.3 sind mit demselben Schlüssel signiert (liegt im Actions-Cache und wird alle 3 Tage automatisch abgerufen, damit GitHub ihn nicht löscht).

## Versionen und Updates
- Jede Version wird in `changelog.js` beschrieben (Titel + Stichpunkte, neueste oben). Daraus entstehen die Release-Texte auf GitHub und das Fenster „Neuigkeiten“ unter ⚙. Der Selbsttest prüft, dass der neueste Eintrag zur Nummer in `version.js` passt.
- Die Versionsnummer steht in `version.js` (`VERSION = '1.18.0'`). **Bei jeder Änderung an der App hochzählen** – nur dann baut GitHub ein neues Release `v<Version>`. Änderungen ohne neue Nummer (z. B. nur README) erzeugen kein Release.
- In der App unter ⚙ steht die aktuelle Version, dazu „Nach Updates suchen“. Beim Start prüft die App selbst und zeigt oben eine Leiste, wenn es eine neuere Version gibt:
  - **Android:** „Herunterladen“ lädt die neue APK im Browser – Datei antippen und über die alte installieren.
  - **iPhone/PC:** „Neu laden“ holt die neue Version.
- Eine ältere Version auf Android installieren: erst die App deinstallieren (die Liste bleibt auf GitHub).
