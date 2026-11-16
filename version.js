// Versionsnummer der App. Bei jeder Änderung an der App hochzählen –
// der Android-Build erstellt nur dann ein neues Release (Tag v<VERSION>).
export const VERSION = '1.4.0';

// Ist Version a neuer als b? ("1.10.0" > "1.9.2"); Unlesbares (z. B. alte Tags) gilt nie als neuer
export function neuer(a, b) {
  const pa = String(a).replace(/^v/, '').split('.').map(Number);
  const pb = String(b).replace(/^v/, '').split('.').map(Number);
  if (pa.some(isNaN) || pb.some(isNaN)) return false;
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const d = (pa[i] || 0) - (pb[i] || 0);
    if (d) return d > 0;
  }
  return false;
}
