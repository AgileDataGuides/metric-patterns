# Metric Patterns Shows What a Metrics Layer Should Support, and Why

**25 November 2026**

AgileDataGuides today released Metric Patterns, an open source guide that lists the 32 patterns a metrics layer should support, with the business question that makes each one necessary.

## The Problem

A metrics layer holds the definitions of a business's numbers, so every report and every AI agent gets the same answer. Most talk about metrics layers stops at sums and ratios. Then a person asks "what share of our buyers come back?" or "what were sales by the customer's tier at the time they bought?", and the layer gives a number that looks right and is wrong. A team choosing or building a layer has no plain list of what it must handle. Each vendor shows the patterns it does well. Nobody shows the ones a layer gets wrong without a warning.

## The Solution

Metric Patterns lists 32 patterns in 7 families, from a plain total to a cohort. Each entry leads with the pattern and says what it is. Beside it sits the question a real person asks that needs it, what the layer must do to answer it, and the wrong number a person gets without it. Each pattern has an example four ways: in plain words, as SQL, as an Excel formula and as a DAX measure. The patterns name no metrics-layer product, so a team can use them with any technology setup.

It is not a test, and nothing is scored. A team that wants to check its own layer can mark each pattern Yes, Partial or No, and see the tally.

## How It Works

The **Patterns** tab shows every pattern, with a filter for each family. A pick of Plain, SQL, Excel or DAX on any pattern switches every pattern, and the app remembers it. The **My Metric Layer Patterns** tab counts the marks and lists every pattern with its mark. A person can keep more than one layer, export a layer as a JSON file, import one back, or copy the list as text. Everything is stored in the browser.

The patterns live in one data file. Anyone can add a pattern by editing that file, with no code changes. Every SQL example runs against a small test shop on DuckDB, and each answer is checked against one worked out by hand.

## Key Benefits

- **Know what to ask for** — a plain list of what a metrics layer must handle, before a team buys or builds one
- **See the wrong number before it happens** — every pattern names the error a layer gives without it
- **Read it your way** — plain words for a business person, SQL, Excel or DAX for the person who builds it
- **Brief a vendor** — mark a layer Yes, Partial or No and send the list
- **Open to change** — add a pattern by editing one data file

Metric Patterns is available now at [github.com/AgileDataGuides/metric-patterns](https://github.com/AgileDataGuides/metric-patterns).
