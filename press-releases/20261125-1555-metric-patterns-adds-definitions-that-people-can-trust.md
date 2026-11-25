# Metric Patterns Adds the Patterns That Make a Definition Trusted

**25 November 2026**

AgileDataGuides today added a new family to Metric Patterns, "Definitions that people can trust", with four patterns about the definition behind a number rather than its arithmetic.

## The Problem

A metrics layer can add up every row correctly and still give a person the wrong number. Two saved metrics both answer "what is our revenue?", and which one a person gets depends on luck. A retired metric still answers, and looks as trusted as the new one. A question whose true answer is none comes back as an error or an empty screen. A metric's formula changes, and last month's remembered number no longer matches today's, with nobody able to say why. Reviews of other metrics-layer test suites kept finding these cases, and the guide's first 32 patterns did not cover them.

## The Solution

Metric Patterns now has 36 patterns in 8 families. The new family holds four patterns: two metrics that are nearly the same, a retired metric, a right answer of nothing, and a definition that changed. Each one has the question a person asks, what the layer must do, and what goes wrong without it, the same as every other pattern.

## How It Works

Three of the new patterns work over a small table of metric definitions, with a status and the dates each version applied, and show it in SQL, Excel and DAX alike. The fourth counts refunds. Where Power BI has no native way to hold a pattern, for example a retired state for a measure, the DAX example says so beside its query. Every SQL example still passes the app's SQL check against answers worked out by hand, and the check now runs two of the new examples again on changed data or a changed date, and adds rows that catch a careless version of the other two, so a query that is right only by luck fails.

## Key Benefits

- **Check the definitions, not only the sums**: a team can see whether its layer protects people from the wrong definition
- **Plain about tool limits**: where a tool has no native way to hold a pattern, the guide says so beside a working query
- **Zero counts as an answer**: the guide makes "none" a result a layer must give, not an error
- **Same shape as before**: the new patterns read, filter and mark like the other 32

The new family is available now at [github.com/AgileDataGuides/metric-patterns](https://github.com/AgileDataGuides/metric-patterns).
