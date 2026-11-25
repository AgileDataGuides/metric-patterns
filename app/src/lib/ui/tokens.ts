// The design tokens this app uses, copied from design/tokens.md.
//
// tokens.md is AUTHORITATIVE: if this file and tokens.md disagree, tokens.md
// wins. They live here, not imported from @context-plane/shared, because
// scripts/publish-app.sh does not bundle that module into the public repo.
// The other standalone apps keep their own copies for the same reason.

/** tokens.md typography */
export const TEXT = {
	/** typography.h1_app_header */
	appTitle: 'text-lg font-bold tracking-tight',
	/** typography.h1_app_tagline */
	appTagline: 'text-xs text-slate-400',
	/** typography.label_section_header */
	sectionHeader: 'text-sm font-semibold text-slate-700',
	/** typography.label_tier2b */
	label: 'text-[10px] font-semibold uppercase tracking-wider text-slate-500'
};

/** tokens.md buttons */
export const BUTTON = {
	/** buttons.secondary_slate */
	secondary:
		'px-3 py-1.5 text-sm font-medium rounded-lg bg-white text-slate-600 border border-slate-300 hover:bg-slate-50 transition-colors',
	/** buttons.header_neutral */
	headerNeutral: 'px-3 py-1.5 text-sm font-medium rounded-lg text-slate-300 border border-slate-600 hover:bg-slate-800 transition-colors',
	/** buttons.success_create */
	create: 'px-3 py-1.5 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-colors',
	/** buttons.danger_delete_header */
	deleteHeader: 'px-3 py-1.5 text-sm font-medium rounded-lg text-red-400 border border-slate-600 hover:bg-slate-800 transition-colors',
	/** app_header.cancel */
	headerCancel: 'px-3 py-1.5 text-sm font-medium rounded-lg text-slate-400 hover:text-slate-200 transition-colors'
};

/** tokens.md app_header (DESIGN_SYSTEM.md § 17) */
export const HEADER = {
	switcher: 'flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors hover:bg-slate-800 text-sm',
	switcherName: 'text-slate-300',
	chevron: 'w-3.5 h-3.5 text-slate-400 transition-transform',
	panel: 'absolute top-full right-0 mt-1.5 bg-white rounded-xl border border-slate-200 shadow-xl z-50 py-1 min-w-[200px]',
	item: 'w-full text-left px-4 py-2 text-sm transition-colors',
	itemActive: 'bg-slate-100 font-semibold text-slate-800',
	itemInactive: 'text-slate-600 hover:bg-slate-50',
	nameInput:
		'px-3 py-1.5 border border-slate-600 bg-slate-800 text-white rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-44 placeholder-slate-500'
};

/** tokens.md tier2_toolbar_fields (DESIGN_SYSTEM.md § 17) */
export const TOOLBAR = {
	/** cards.tier2_toolbar */
	card: 'bg-white border border-slate-200 rounded-lg',
	/** spacing.tier2_padding_row */
	row: 'px-4 py-2.5',
	name: 'block text-sm font-semibold text-slate-800 leading-tight cursor-pointer hover:text-slate-600 transition-colors text-left truncate max-w-md',
	nameInput: 'text-sm font-semibold text-slate-800 px-1 border border-blue-400 rounded outline-none w-64',
	desc: 'block text-[10px] leading-tight mt-0.5 truncate max-w-md text-left cursor-pointer transition-colors',
	descSet: 'text-slate-400 hover:text-slate-600',
	descUnset: 'text-slate-300 italic hover:text-slate-500',
	descInput: 'block text-[10px] text-slate-500 px-1 border border-blue-400 rounded outline-none w-96 max-w-full mt-0.5'
};

/** tokens.md cards */
export const CARD = {
	/** cards.default */
	base: 'bg-white rounded-lg shadow-sm border border-slate-200',
	/** cards.list_divider */
	listDivider: 'divide-y divide-slate-100'
};

/** tokens.md tier3_tabs */
export const TAB = {
	wrapper: 'flex items-center px-3.5 py-2 text-xs font-medium border-b-2 -mb-px transition-colors',
	active: 'text-blue-600 border-blue-600',
	inactive: 'text-slate-400 border-transparent hover:text-slate-600'
};

/** tokens.md choice_chips */
export const CHIP = {
	wrapper: 'inline-flex flex-wrap gap-1',
	base: 'px-2 py-0.5 text-[11px] font-medium rounded-md border transition-colors',
	active: 'bg-blue-50 text-blue-700 border-blue-300',
	inactive: 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
};

/** tokens.md state_chips */
export const STATE_CHIP = {
	base: 'inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold border',
	neutral: 'bg-slate-50 text-slate-600 border-slate-200',
	positive: 'bg-emerald-50 text-emerald-700 border-emerald-200',
	warning: 'bg-amber-50 text-amber-700 border-amber-200',
	negative: 'bg-red-50 text-red-700 border-red-200'
};

/** tokens.md row_actions */
export const ROW_ACTION = {
	danger: 'text-[11px] font-medium text-red-600 hover:text-red-700 transition-colors'
};

/** tokens.md hint: Heroicons outline information-circle */
export const HINT = {
	quiet: 'flex items-start gap-1.5 text-[11px] text-slate-500 leading-snug',
	icon: 'w-3.5 h-3.5 shrink-0 mt-px text-slate-400'
};

/** tokens.md metric_patterns (DESIGN_SYSTEM.md § 24) */
export const MP = {
	content: 'max-w-5xl mx-auto px-6 py-6 space-y-8',
	reading: 'max-w-3xl text-sm text-slate-700 leading-relaxed',
	introHeading: 'text-xl font-bold tracking-tight text-slate-900',
	words: 'grid grid-cols-1 sm:grid-cols-3 gap-3',
	wordCard: 'bg-white rounded-lg shadow-sm border border-slate-200 p-3',
	wordExample: 'font-mono text-[11px] text-blue-700',
	code: 'font-mono text-[11px] leading-relaxed text-slate-700 bg-slate-50 border border-slate-200 rounded-md px-3 py-2 whitespace-pre-wrap break-words',
	copyOutput: 'max-h-72 overflow-auto select-all',
	familyHeader: 'pb-2 border-b-2 border-slate-800',
	familyName: 'text-base font-semibold text-slate-800',
	familyDesc: 'text-xs text-slate-500',
	entry: 'grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-3 py-5 border-b border-slate-200',
	entryWhat: 'md:col-span-5 flex flex-col gap-2 min-w-0',
	entryWhy: 'md:col-span-7 flex flex-col gap-3 min-w-0',
	number: 'font-mono text-[10px] text-slate-400',
	kindMetric: 'inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold border bg-blue-50 text-blue-700 border-blue-200',
	name: 'text-sm font-semibold text-slate-800',
	whatItIs: 'text-xs text-slate-600',
	question: 'text-sm font-medium text-slate-800 leading-snug border-l-2 border-blue-500 pl-3',
	must: 'text-xs text-slate-700',
	without: 'text-xs text-slate-500',
	mark: {
		yes: 'bg-emerald-50 text-emerald-700 border-emerald-200',
		partial: 'bg-amber-50 text-amber-700 border-amber-200',
		no: 'bg-red-50 text-red-700 border-red-200'
	},
	tally: 'flex flex-wrap gap-x-8 gap-y-3',
	tallyNumber: 'block text-2xl font-semibold text-slate-800 tabular-nums',
	listRow: 'flex items-center gap-3 px-3 py-1.5 text-xs',
	listNumber: 'w-8 shrink-0',
	listLink: 'flex-1 text-left text-slate-700 hover:underline',
	meaningRow: 'flex items-start gap-2 text-sm text-slate-700',
	meaningChip: 'w-14 text-center shrink-0',
	bullets: 'list-disc pl-5 space-y-1'
};
