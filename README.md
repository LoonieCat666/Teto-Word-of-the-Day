# Teto Word of the Day

A tiny website and API that serve a new word every day, with definitions, examples
and a spoken "Teto word of the day: ..." clip.

Words come from [Datamuse](https://www.datamuse.com/api/), definitions from the
[Free Dictionary API](https://dictionaryapi.dev/), and the voice from
[Fish Audio](https://fish.audio/).

## API

| Endpoint | Returns |
| --- | --- |
| `GET /v1/today` | Today's word (the day changes at midnight UTC). |
| `GET /v1/date/YYYY-MM-DD` | The word for a given day (2020-01-01 up to tomorrow). |
| `GET /v1/voice/YYYY-MM-DD` | An mp3 of the voice line. Only today's date works. |

Example response of `/v1/today`:

```json
{
  "date": "2026-11-11",
  "word": "example",
  "phonetic": "/ɪɡˈzɑːmpəl/",
  "audio": null,
  "definitions": [{ "partOfSpeech": "noun", "text": "..." }],
  "examples": ["..."],
  "note": null
}
```

CORS is open, so you can call it from any website or bot.

## Run it

1. Copy `.env.example` to `.env` and fill in `FISH_API_KEY`.
2. `npx vercel dev`

## Deploy

1. Push this repo to GitHub and import it on vercel.com.
2. Add `FISH_API_KEY` and `FISH_VOICE_ID` under Settings > Environment Variables, then redeploy.

Every push to the main branch redeploys automatically.

## Optional

Put an image at `public/teto.png` and she appears next to the Listen button.
