# Teto Word of the Day

A tiny website and API that serve a new word every day, with definitions and examples.
Words come from [Wordnik](https://www.wordnik.com/), so nothing has to be maintained by hand.

## API

| Endpoint | Returns |
| --- | --- |
| `GET /v1/today` | Today's word. Optional `?tz=Europe/Zurich` (default: UTC). |
| `GET /v1/date/YYYY-MM-DD` | The word for a given day. |

Example response:

```json
{
  "date": "2026-10-29",
  "word": "example",
  "definitions": [{ "partOfSpeech": "noun", "text": "..." }],
  "examples": ["..."],
  "note": null
}
```

CORS is open, so you can call it from any website.

## Run it

1. Get a free API key at wordnik.com.
2. Copy `.env.example` to `.env` and paste in the key.
3. `npx vercel dev`

## Deploy

1. Push this repo to GitHub.
2. Import it on vercel.com.
3. Add `WORDNIK_API_KEY` under Settings > Environment Variables, then redeploy.

Every push to the main branch redeploys automatically.
