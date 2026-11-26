# Metric Patterns Sorts Measures and Metrics by One Rule

**26 November 2026**

AgileDataGuides today gave Metric Patterns one rule that tells a Measure from a Metric, and changed the tag on twelve patterns to follow it.

## The Problem

Each pattern in the guide carries a tag, Measure or Metric. A reader found that the tags did not follow the guide's own rule. "Filtered measure" was a Measure, and "Time window" was a Metric, though both are one sum with a filter. A person who tried to use the tags to sort their own numbers could not tell which way a number should go. The three words on the first screen also differed a little from the way the AgileData series on metrics layers defines them.

## The Solution

The guide now uses one rule. One calculation over one Fact is a Measure: a sum, a count, an average, a smallest, a largest or a middle value. A filter, a date, a split, a rank or an order does not change that. A formula that combines two or more Measures or Facts is a Metric. Three patterns about the definition behind a number can be either kind, so they now say Either.

## How It Works

Nine patterns move from Metric to Measure: a wider total on narrower rows, top N and rank, time window, period to date, running total, one measure with a second date, periods with nothing in them, distinct count across a split, and a detail as it was then. Three patterns move from Metric to Either: two metrics that are nearly the same, a retired metric, and a definition that changed. The guide now holds 20 Measures, 13 Metrics and 3 marked Either. The Fact, Measure and Metric cards use the series' words: a Fact is a recorded value, a Measure is a basic calculation over Facts, and a Metric is a formula that combines Facts or Measures. The "without it" line of "Ratio across two tables" now names both ways a cost goes wrong: added once for each product, or an item with no product drops out. The guide also says "the question a person asks" and "a stakeholder" where it said "business question" and "a business person".

## Key Benefits

- **One rule, the same answer every time**: a reader can sort any number as a Measure or a Metric without a judgement call
- **The same words as the series**: the three cards match the published article, so a reader meets one set of definitions
- **Honest about the edge**: a pattern that can be either kind says so
- **Outside work checked at source**: each related work was read at its source on 26 November 2026, and the count of ossie_bench questions is now 15

The change is available now at [github.com/AgileDataGuides/metric-patterns](https://github.com/AgileDataGuides/metric-patterns).
