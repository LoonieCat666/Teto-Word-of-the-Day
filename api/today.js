const { fetchWord, todayIn } = require("../lib/wotd");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  let date;
  try {
    date = todayIn(req.query.tz || "UTC");
  } catch {
    return res
      .status(400)
      .json({ error: "invalid timezone, e.g. ?tz=Europe/Zurich" });
  }

  try {
    const word = await fetchWord(date);
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate");
    res.status(200).json(word);
  } catch (e) {
    console.error(e);
    res.status(502).json({ error: "could not fetch the word", detail: e.message });
  }
};
