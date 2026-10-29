const strip = (s = "") => String(s).replace(/<[^>]+>/g, "").trim();

// Today's date as YYYY-MM-DD in the given IANA timezone (throws on an invalid one).
function todayIn(tz = "UTC") {
  return new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(new Date());
}

// Fetches the word of the day for a YYYY-MM-DD date from Wordnik.
async function fetchWord(date) {
  const key = process.env.WORDNIK_API_KEY;
  if (!key) throw new Error("WORDNIK_API_KEY is not set");

  const url =
    "https://api.wordnik.com/v4/words.json/wordOfTheDay" +
    `?date=${encodeURIComponent(date)}&api_key=${encodeURIComponent(key)}`;

  const r = await fetch(url);
  if (!r.ok) throw new Error(`Wordnik responded with ${r.status}`);
  const d = await r.json();

  return {
    date,
    word: d.word,
    definitions: (d.definitions || []).map((x) => ({
      partOfSpeech: x.partOfSpeech || null,
      text: strip(x.text),
    })),
    examples: (d.examples || []).map((x) => strip(x.text)),
    note: strip(d.note) || null,
  };
}

module.exports = { fetchWord, todayIn };
