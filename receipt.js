"use strict";

// Keywords are matched as whole words on accent-free, lowercase text.
// Order matters: the first category that matches wins.
const STORE_KEYWORDS = {
  Ristoranti: [
    "mcdonalds", "burger king", "old wild west", "roadhouse", "autogrill",
    "kfc", "starbucks", "telepizza", "dominos", "fosters hollywood", "vips",
    "goiko", "100 montaditos", "taco bell", "rodilla", "cerveceria",
    "osteria", "trattoria", "pizzeria", "ristorante", "restaurante",
    "birreria", "gelateria", "pasticceria", "cafeteria", "caffe", "cafe", "bar",
  ],
  Alimentari: [
    "despar", "eurospar", "interspar", "spar", "famila", "conad", "coop",
    "lidl", "eurospin", "md", "aldi", "pam", "panorama", "crai", "visotto",
    "ali", "supermercato", "supermercados", "hipermercado",
    "mercadona", "dia", "carrefour", "consum", "alcampo", "eroski", "hipercor",
    "supercor", "condis", "bonpreu", "caprabo", "ahorramas", "froiz", "gadis",
    "simply", "coviran", "panaderia", "panificio", "macelleria", "carniceria",
  ],
  Trasporti: [
    "eni", "agip", "q8", "ip", "tamoil", "esso", "shell", "api", "repsol",
    "cepsa", "moeve", "bp", "galp", "petronor", "ballenoil", "plenergy",
    "trenitalia", "italo", "arriva", "tpl fvg", "atap", "autovie venete",
    "telepass", "autostrade", "renfe", "alsa", "metro", "cabify", "uber",
    "bolt", "fgv", "tram", "avanza", "ouigo", "iryo", "vueling", "ryanair",
    "benzina", "gasolina", "gasolinera", "parcheggio", "parking",
  ],
  Casa: [
    "ikea", "leroy merlin", "brico io", "bricoman", "self", "mercatone uno",
    "bricomart", "bauhaus", "brico depot", "conforama", "maisons du monde",
    "tiger", "action", "iberdrola", "endesa", "naturgy", "aguas",
  ],
  Abbigliamento: [
    "decathlon", "ovs", "zara", "h and m", "calzedonia", "intimissimi",
    "tezenis", "piazza italia", "scarpe and scarpe", "foot locker",
    "pull bear", "bershka", "stradivarius", "mango", "primark", "kiabi",
    "springfield", "sfera", "massimo dutti",
  ],
  Salute: [
    "farmacia", "parafarmacia", "dottor taffi", "ottica", "optica",
    "dentista", "clinica", "sanitas",
  ],
  Svago: [
    "cinema", "the space cinema", "uci", "cinesa", "yelmo", "kinepolis",
    "feltrinelli", "mondadori", "ubik", "casa del libro", "gardaland",
    "steam", "playstation",
  ],
  Abbonamenti: [
    "netflix", "spotify", "disney", "prime video", "hbo", "movistar",
    "vodafone", "orange", "digi", "wind tre", "iliad", "fastweb",
  ],
};

function normalizeText(text) {
  return String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function containsWord(normalizedText, keyword) {
  return (" " + normalizedText + " ").includes(" " + normalizeText(keyword) + " ");
}

// Short or ambiguous names (bar, ip, md...) are only trusted in the header,
// where the store name is printed. Long names are searched in the whole text.
function detectCategory(text) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const header = normalizeText(lines.slice(0, 6).join(" "));
  const full = normalizeText(text);

  for (const [category, words] of Object.entries(STORE_KEYWORDS)) {
    if (words.some((w) => containsWord(header, w))) return category;
  }
  for (const [category, words] of Object.entries(STORE_KEYWORDS)) {
    if (words.some((w) => w.length >= 5 && containsWord(full, w))) return category;
  }
  return null;
}

const AMOUNT_REGEX = /(?<!\d)(?:\d{1,3}(?:[.,]\d{3})+|\d+)[.,]\d{2}(?!\d)/g;

function toNumber(raw) {
  const m = raw.match(/^(.*)[.,](\d{2})$/);
  return Number(m[1].replace(/[.,]/g, "") + "." + m[2]);
}

function amountsIn(line) {
  return (line.match(AMOUNT_REGEX) || []).map(toNumber);
}

function detectTotal(text) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const plain = lines.map((l) => l.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
  const keyRegex = /\b(totale|total|importo|importe|a pagare|da pagare|a pagar)\b/;
  const skipRegex = /iva|imponibile|tax|resto|cambio|change|contant|efectivo|entregado|sconto|descuento/;

  const candidates = [];
  plain.forEach((line, i) => {
    if (!keyRegex.test(line) || skipRegex.test(line)) return;
    let found = amountsIn(lines[i]);
    // The value is sometimes read on the next line.
    if (!found.length && i + 1 < lines.length) found = amountsIn(lines[i + 1]);
    if (found.length) candidates.push(found[found.length - 1]);
  });
  if (candidates.length) return Math.max(...candidates);

  // Fallback: largest amount that is not a cash/change line.
  const fallback = [];
  plain.forEach((line, i) => {
    if (/resto|cambio|change|contant|cash|efectivo|entregado/.test(line)) return;
    fallback.push(...amountsIn(lines[i]));
  });
  return fallback.length ? Math.max(...fallback) : null;
}

function detectDate(text, todayISO) {
  const regex = /\b(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4}|\d{2})\b/g;
  let m;
  while ((m = regex.exec(text)) !== null) {
    const day = Number(m[1]);
    const month = Number(m[2]);
    const year = m[3].length === 2 ? 2000 + Number(m[3]) : Number(m[3]);
    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 2000) continue;
    const iso = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    if (Number.isNaN(Date.parse(iso)) || iso > todayISO) continue;
    return iso;
  }
  return null;
}

function detectStoreName(text) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const line = lines.slice(0, 6).find((l) => (l.match(/[A-Za-zÀ-ÿ]/g) || []).length >= 3);
  if (!line) return "";
  return line
    .replace(/[^A-Za-zÀ-ÿ0-9 '&.\-]/g, "")
    .toLowerCase()
    .replace(/\b\p{L}/gu, (c) => c.toUpperCase())
    .slice(0, 40)
    .trim();
}

function parseReceipt(text, todayISO) {
  return {
    total: detectTotal(text),
    date: detectDate(text, todayISO),
    category: detectCategory(text),
    storeName: detectStoreName(text),
  };
}

if (typeof module !== "undefined") {
  module.exports = { parseReceipt, detectCategory, detectTotal, detectDate };
}
