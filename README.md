# Metric Patterns

Understand the patterns a metrics layer should support, and why. Each pattern comes with the business question that makes it necessary, what the layer must do, what goes wrong without it, and an example in plain words, SQL, Excel and DAX.

An [AgileDataGuides](https://agiledataguides.com/agiledata-templates/) Pattern Template app.

> **Early draft, shared for feedback.** If a pattern is missing, or an example is wrong, please [open an issue](https://github.com/AgileDataGuides/metric-patterns/issues).

## Try It Online

**[Launch the Live Demo](https://agiledataguides.github.io/metric-patterns)**. No install required. The demo runs entirely in your browser. Your marks are saved in localStorage and never leave your device.

## Why It Exists

A metric is not one thing. "Total sales" and "share of buyers who come back" need very different things from the layer under them. Most talk about metrics layers stops at sums and ratios. This guide lists the 32 patterns a layer meets in real use, from a plain total to a cohort, and the question a real person asks that needs each one.

It is not a test. It has no right or wrong answers and no score. The patterns name no metrics-layer product, and the guide rates no tool. Use it to brief a vendor, to plan a build, or to explain to a business person why "just add it up" is not always possible.

## What It Does

| Tab | Purpose |
|-----|---------|
| **32 Patterns** | Every pattern, grouped into 7 families. Each one leads with the pattern, with the question that needs it beside it. Pick Plain, SQL, Excel or DAX on any pattern and every pattern follows |
| **My Metric Layer Patterns** | Your marks on one page: how many patterns your layer does (Yes), does with extra work (Partial) or cannot do (No), and the list to copy |
| **Instructions** | What a metrics layer is, and how to use the app |

The 7 families: Simple totals, Totals with a rule inside, Formulas over totals, Compared with a whole, Over time, Things that do not add up, and Across more than one list of events.

## Install and Run

Run `./start-metric-patterns.sh` from the terminal.

The app starts at [http://localhost:5126](http://localhost:5126).

**Requires**: [Node.js](https://nodejs.org/) 22.17+ or 24+ (not 23).

## Features

- **Pattern first**: each entry leads with the pattern, and the business question is the reason the layer needs it
- **Four kinds of example**: plain words, SQL, Excel and DAX. One pick switches every pattern, and the app remembers it
- **What goes wrong without it**: every pattern names the wrong number a layer gives when it lacks the pattern
- **Mark your own layer**: Yes, Partial or No on each pattern, with a tally
- **Multiple layers**: create, switch between and delete named layers, for example the one you run today and one you are weighing
- **Auto-save**: marks persist to browser localStorage
- **Export JSON**: download a layer's marks to share or to keep
- **Import JSON**: load an exported file as a new layer
- **Copy as text**: the list of patterns and marks, to paste into a message

## The Content

The words, families and patterns live in one file, [`data/lookups/patterns.json`](./data/lookups/patterns.json). To change the wording or add a pattern, edit that file. No code changes. See [CONTRIBUTING.md](./CONTRIBUTING.md).

The examples use a small online shop: order items, products, customers, web sessions, stock and a budget. The formulas show the shape of each pattern. They are not ready to paste into your own setup.

- **SQL**: every SQL example is tested on DuckDB 1.2.1 against a small data set, and each answer is checked against one worked out by hand. Run the check yourself with `pip install duckdb` then `python app/tests/sql/check_sql.py`. SQL differs a little between databases, so a query can need small changes on yours.
- **Excel and DAX**: read with care, not run. Excel examples use dynamic array functions (`UNIQUE`, `FILTER`, `BYROW`, `LAMBDA`, `GROUPBY`), so they need Excel for Microsoft 365. DAX examples assume a model with a Calendar table marked as a date table.

## Related Work

Other people test metrics layers and semantic layers in other ways. This guide asks "what must a layer be able to say, and why". The work below asks "does a layer, or an AI agent on top of it, give the right number". Read each at its source. We read them, and ran none of them.

| Work | What it is |
|---|---|
| [SLayer comparisons](https://github.com/MotleyAI/slayer/tree/1.x/examples/comparisons) ([summary page](https://motley.ai/compare/)) | A matrix of what four semantic layers can express (SLayer, Malloy, Cube Core, MetricFlow), with yes, partial or no on each row, each backed by queries run on DuckDB. Written by the maker of one of the four. The closest in kind to this guide |
| [ossie_bench](https://github.com/djouallah/ossie_bench) | One small sales model built on three platforms and asked the same 13 questions, each answer compared with plain SQL. It calls itself an educational repo, not a benchmark |
| [dbt LLM Semantic Layer Benchmark](https://github.com/dbt-labs/dbt-llm-sl-bench) | The same questions asked three ways: as text-to-SQL, through the dbt Semantic Layer, and through the dbt MCP server |
| [Cube semantic layer benchmark](https://github.com/cubedevinc/semantic-layer-benchmark) | The same questions with and without a document of measures and rules, on a retail model |
| [LiveSQLBench](https://github.com/bird-bench/livesqlbench) | A text-to-SQL set with new releases, so a model cannot have learned the answers |
| [BIRD-Ent](https://aclanthology.org/2026.findings-emnlp.1971/) | BIRD's questions moved into an enterprise-size setting, with business knowledge spread over many documents |
| [BEAVER](https://beaverbench.github.io) | Questions from real private data warehouses, made anonymous |

## Works With Claude

Export a layer as JSON and use it with [Claude Code](https://claude.ai/claude-code) or [Claude Chat](https://claude.ai):

- *"Which of these gaps will hurt our board report first?"*
- *"Write a brief for a vendor that asks how they do each pattern we marked No"*
- *"Turn the Partial marks into a list of work for the data team"*

## Data Storage

Everything is stored in your browser's localStorage. There is no server. **Export JSON** downloads a file to your downloads folder for sharing or backup.

## Tech Stack

- [SvelteKit](https://svelte.dev/) with Svelte 5 runes
- [Tailwind CSS 4](https://tailwindcss.com/)
- TypeScript

## Licensing

- **Code**: [MIT](./LICENSE)
- **Content (the patterns and examples) and documentation**: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
