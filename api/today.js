const { fetchWord, todayIn } = require("../lib/wotd");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  try {
    const word = await fetchWord(todayIn());
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    res.status(200).json(word);
  } catch (e) {
    console.error(e);
    res.status(502).json({ error: "could not fetch the word", detail: e.message });
  }
};