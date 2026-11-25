# Contributing

Thanks for your interest in contributing to Metric Patterns!

This is an early draft. The most useful contribution is a pattern that is missing, or an example that is wrong.

## Propose a New Pattern

Open an issue, or send a pull request that edits [`data/lookups/patterns.json`](./data/lookups/patterns.json). A pattern needs:

| Field | What to write |
|---|---|
| `id` | A short name in lowercase with hyphens, for example `running-total`. Never change it once published: marks are kept by it |
| `family` | The `id` of one of the families at the top of the file |
| `kind` | `Measure` (one total over recorded values) or `Metric` (a formula over Measures) |
| `name` | The pattern, in a few words |
| `whatItIs` | One sentence |
| `plainExample` | The example in plain words |
| `question` | A question a real person asked that needs the pattern. It is the reason, not a test |
| `layerMust` | What the layer must do to answer it |
| `withoutIt` | The wrong number a person gets without it |
| `examples.sql`, `examples.excel`, `examples.dax` | The example three ways, on the tables listed in the file |

The order inside a family is the order in the file. The number shown ("3.2") is worked out from it, so you never renumber by hand.

A pattern whose `family` matches no family is not shown. The browser console says so.

### Test the SQL

Every SQL example runs against a small shop and is checked against an answer worked out by hand:

```bash
pip install duckdb
python app/tests/sql/check_sql.py
```

A new pattern needs its expected answer in `EXPECT` in that file, worked out by hand from the rows at its top. Without one, the check fails the pattern. If your example needs a row the shop does not have, add the row and check that every other answer still holds.

The most important parts are the question and what goes wrong without it. A pattern without a real question is a feature, not a pattern.

## Content Style

- Name no product, vendor or customer. The guide is for any technology setup.
- Short sentences and common words. One idea per sentence.
- The formulas show the shape of the pattern. Keep them short and use the shop's tables.
- Say when SQL needs a feature some databases lack.

## Getting Started

1. Fork the repository
2. Clone your fork
3. Run `./start-metric-patterns.sh` to install dependencies and start the dev server
4. Make your changes
5. Submit a pull request

## Development

The app is built with SvelteKit + Svelte 5 runes, Tailwind CSS 4, and TypeScript.

```bash
cd app
npm install
npm run dev -- --port 5126
```

## Code Style

- TypeScript with strict mode
- Svelte 5 runes (`$state`, `$derived`, `$effect`)
- Tailwind CSS for styling
- No unnecessary abstractions. Keep it simple

## Licensing

By contributing, you agree that your contributions will be licensed under:

- **Code**: MIT License
- **Content (the patterns and examples) and documentation**: CC BY-SA 4.0
