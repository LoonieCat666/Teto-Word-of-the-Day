const { fetchWord, todayIn, voiceUrl } = require("../lib/wotd");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    const word = await fetchWord(todayIn());
    // Cache until midnight UTC, when the next word starts.
    const secs = 86400 - Math.floor((Date.now() / 1000) % 86400);
    res.setHeader("Cache-Control", `s-maxage=${secs}, stale-while-revalidate`);
    res.status(200).json({ ...word, voice: voiceUrl(req, word.date) });
  } catch (e) {
    console.error(e);
    res.status(502).json({ error: "could not fetch the word", detail: e.message });
  }
};