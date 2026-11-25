// The app's own wording. The patterns themselves live in data/lookups/patterns.json.

export const APP = {
	title: 'Metric Patterns',
	tagline: 'The patterns a metrics layer should support, and why',
	description:
		'A metric is not one thing. This guide lists the patterns a metrics layer should support. Beside each one is the business question that makes it necessary.'
};

export const INTRO = {
	heading: 'The patterns a metrics layer should support',
	definition:
		'A metrics layer is the part of a data platform that holds the definitions and calculation rules for business numbers, so every BI tool and every GenAI tool gets the same answer.',
	lede: 'A metric is not one thing. "Total sales" and "share of buyers who come back" need very different things from the layer under them. This guide lists the patterns. Beside each one is the business question that makes it necessary.',
	wordsHeading: 'Three bits of context first',
	examplesNote:
		'Each example comes four ways: in plain words, as SQL, as an Excel formula and as a DAX measure (the formula language of Power BI). Pick one on any pattern and every pattern follows.',
	sketchNote:
		'The formulas show the shape of each pattern. They are not ready to paste into your own setup. SQL differs a little between databases.'
};

export const PATTERN_LABELS = {
	why: 'Why a layer needs it. Someone asks:',
	must: 'The layer must',
	without: 'Without it',
	myLayer: 'My layer'
};

export const FORMATS: { id: 'plain' | 'sql' | 'excel' | 'dax'; label: string }[] = [
	{ id: 'plain', label: 'Plain' },
	{ id: 'sql', label: 'SQL' },
	{ id: 'excel', label: 'Excel' },
	{ id: 'dax', label: 'DAX' }
];

export const MARK_LABELS = { yes: 'Yes', partial: 'Partial', no: 'No' } as const;

export const MY_LAYER = {
	heading: 'Check your own layer, if you want to',
	meaning: [
		{ mark: 'yes', text: 'The layer does it from one definition.' },
		{ mark: 'partial', text: 'It needs extra steps, a helper table or hand-written SQL.' },
		{ mark: 'no', text: 'It cannot, or it gives a number with no protection.' }
	] as const,
	notMarked: 'Not marked',
	copy: 'Copy as text',
	copied: 'Copied',
	clearAll: 'Clear all marks',
	use: 'Use the list to brief a vendor, to plan a build, or to explain to a business person why "just add it up" is not always possible.'
};
