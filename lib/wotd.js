// Keyless word of the day:
//   1. Datamuse (api.datamuse.com) supplies candidate words.
//   2. Free Dictionary API (dictionaryapi.dev) supplies definitions and examples.
// The word for a date is picked deterministically, so everyone gets the same
// word on the same day and nothing has to be stored.

const LETTERS = "abcdefghilmnoprstuvw";

// Today's date (UTC) as YYYY-MM-DD.
function todayIn() {
  return new Date().toISOString().slice(0, 10);
}

// Small deterministic hash: the same string always gives the same number.
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

async function getJson(url) {
  const r = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "teto-wotd/1.0 (hobby project)",
    },
  });
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`${new URL(url).host} responded with ${r.status}`);
  return r.json();
}

// Words starting with a date-dependent letter, filtered to moderately
// uncommon, plain lowercase words, and sorted so the order is stable.
async function candidates(date) {
  const letter = LETTERS[hash(date + "letter") % LETTERS.length];
  const list = await getJson(
    `https://api.datamuse.com/words?sp=${letter}*&md=f&max=1000`
  );
  return (list || [])
    .map((w) => {
      const tag = (w.tags || []).find((t) => t.startsWith("f:"));
      return { word: w.word, freq: tag ? parseFloat(tag.slice(2)) : 0 };
    })
    .filter((w) => /^[a-z]{5,12}$/.test(w.word) && w.freq >= 0.2 && w.freq <= 10)
    .map((w) => w.word)
    .sort();
}

// Returns { phonetic, definitions, examples } or null if the word has no entry.
async function define(word) {
  const data = await getJson(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
  );
  if (!Array.isArray(data) || data.length === 0) return null;

  const meanings = data.flatMap((e) => e.meanings || []);
  const definitions = [];
  const examples = [];

  for (const m of meanings) {
    const first = (m.definitions || [])[0];
    if (first && definitions.length < 3) {
      definitions.push({ partOfSpeech: m.partOfSpeech || null, text: first.definition });
    }
    for (const d of m.definitions || []) {
      if (d.example && examples.length < 2) examples.push(d.example);
    }
  }
  if (definitions.length === 0) return null;

  const phonetic =
    data[0].phonetic || (data[0].phonetics || []).find((p) => p.text)?.text || null;
  return { phonetic, definitions, examples };
}

async function fetchWord(date) {
  const words = await candidates(date);
  if (words.length === 0) throw new Error("no candidate words");

  // Start at the date's slot and move on if a word has no dictionary entry
  // or its lookup fails.
  const start = hash(date) % words.length;
  let lastError = null;
  for (let i = 0; i < 8; i++) {
    const word = words[(start + i) % words.length];
    try {
      const info = await define(word);
      if (info) {
        return {
          date,
          word,
          phonetic: info.phonetic,
          definitions: info.definitions,
          examples: info.examples,
          note: null,
        };
      }
    } catch (e) {
      lastError = e; // skip this word and try the next one
    }
  }
  throw lastError || new Error("no definition found");
}

module.exports = { fetchWord, todayIn };