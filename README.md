# Teto Word of the Day

A tiny website and API that serve a new word every day, with definitions and examples.
Words come from [Datamuse](https://www.datamuse.com/api/) and [Dictionary](https://dictionaryapi.dev/), so nothing has to be maintained by hand.

## API

| Endpoint | Returns |
| --- | --- |
| `GET /v1/today` | Today's word. |
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
