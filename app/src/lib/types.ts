// The content file's shape (data/lookups/patterns.json) and a person's marks.

/** Fact, Measure, Metric: the three bits of context the guide starts with */
export interface Word {
	name: string;
	meaning: string;
	example: string;
}

/** A group of patterns that need the same kind of thing from a layer */
export interface Family {
	id: string;
	name: string;
	description: string;
}

/** The same example, three ways */
export interface Examples {
	sql: string;
	excel: string;
	dax: string;
}

/** One pattern a metrics layer should support */
export interface Pattern {
	id: string;
	/** A Family id */
	family: string;
	kind: 'Measure' | 'Metric';
	name: string;
	whatItIs: string;
	plainExample: string;
	/** The question a person asks. It is the reason the layer needs the pattern, never a test */
	question: string;
	layerMust: string;
	withoutIt: string;
	examples: Examples;
}

export interface PatternsContent {
	version: number;
	sqlTestedOn: string;
	setting: string;
	words: Word[];
	tables: string;
	families: Family[];
	patterns: Pattern[];
}

/** The four ways an example is shown */
export type ExampleFormat = 'plain' | 'sql' | 'excel' | 'dax';

/** What a person says their layer does for one pattern */
export type Mark = 'yes' | 'partial' | 'no';

/** Marks, by Pattern id. A pattern with no entry is not marked */
export type Marks = Record<string, Mark>;

/** One metrics layer a person checks. A person can keep more than one */
export interface Layer {
	version: 1;
	id: string;
	name: string;
	description: string;
	marks: Marks;
}

/** A pattern with its place in the guide, for example "3.2" */
export interface NumberedPattern extends Pattern {
	number: string;
}
