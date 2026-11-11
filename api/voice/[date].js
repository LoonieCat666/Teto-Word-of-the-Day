const { fetchWord, todayIn } = require("../../lib/wotd");

// Renders "Teto word of the day: <word>" as an mp3 with Fish Audio.
// The result is cached by Vercel, so it is generated about once per day.
module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Only today's date (give or take a day), so nobody can make it render
  // hundreds of different clips.
  const { date } = req.query;
  const valid = /^\d{4}-\d{2}-\d{2}$/.test(date) && !isNaN(Date.parse(date));
  if (!valid || Math.abs(Date.parse(date) - Date.parse(todayIn())) > 86400000) {
    return res.status(400).json({ error: "only today's date is available" });
  }

  try {
    if (!process.env.FISH_API_KEY || !process.env.FISH_VOICE_ID) {
      throw new Error("FISH_API_KEY or FISH_VOICE_ID is not set");
    }

    const d = await fetchWord(date);
    const text = `Teto word of the day: ${d.word}.`;

    const r = await fetch("https://api.fish.audio/v1/tts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.FISH_API_KEY.trim()}`,
        "Content-Type": "application/json",
        model: "s2.1-pro-free",
      },
      body: JSON.stringify({
        text,
        reference_id: process.env.FISH_VOICE_ID.trim(),
        format: "mp3",
      }),
    });
    if (!r.ok) throw new Error(`Fish Audio responded with ${r.status}`);

    const audio = Buffer.from(await r.arrayBuffer());
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "public, s-maxage=86400");
    res.status(200).send(audio);
  } catch (e) {
    console.error(e);
    res.status(502).json({ error: "could not render the voice", detail: e.message });
  }
};