const { fetchWord } = require("../../lib/wotd");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const { date } = req.query;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || isNaN(Date.parse(date))) {
    return res.status(400).json({ error: "use YYYY-MM-DD" });
  }

  try {
    const word = await fetchWord(date);
    res.setHeader("Cache-Control", "s-maxage=86400, stale-while-revalidate");
    res.status(200).json(word);
  } catch (e) {
    console.error(e);
    res.status(502).json({ error: "could not fetch the word", detail: e.message });
  }
};