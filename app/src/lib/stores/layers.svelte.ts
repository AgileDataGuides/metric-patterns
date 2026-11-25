// The metrics layers a person checks. Each layer is one named set of marks,
// one mark per pattern, so a person can keep more than one: the layer they
// run today, and one they are weighing.
//
// The store factory pattern: createLayersStore takes optional load and
// persist callbacks. With none, the layers live in this browser's
// localStorage. A host that keeps them somewhere else passes its own.
import type { ExampleFormat, Layer, Mark, Marks } from '../types';

const SAVED_KEY = 'metric-patterns-layers';
const CURRENT_KEY = 'metric-patterns-current-layer';
const FORMAT_KEY = 'metric-patterns-example-format';

export const DEFAULT_NAME = 'My Metrics Layer';

const MARKS: readonly Mark[] = ['yes', 'partial', 'no'];
const FORMATS: readonly ExampleFormat[] = ['plain', 'sql', 'excel', 'dax'];

export interface SavedLayers {
	saved: Record<string, Layer>;
	currentId?: string;
	format?: ExampleFormat;
}

export interface LayersStoreOptions {
	load?: () => SavedLayers;
	onPersist?: (saved: Record<string, Layer>, currentId: string, format: ExampleFormat) => void;
}

function createId(name: string): string {
	return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'layer';
}

function uniqueId(name: string, existing: string[]): string {
	const base = createId(name);
	if (!existing.includes(base)) return base;
	let i = 2;
	while (existing.includes(`${base}-${i}`)) i++;
	return `${base}-${i}`;
}

function blank(id: string, name: string, marks: Marks = {}): Layer {
	return { version: 1, id, name, description: '', marks };
}

/** Ids that would read or change an object's prototype instead of naming a pattern */
const UNSAFE_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/** The layer stored under an id, from the object's own entries only */
function own(saved: Record<string, Layer>, id: string | undefined): Layer | undefined {
	return id !== undefined && Object.hasOwn(saved, id) ? saved[id] : undefined;
}

/**
 * The marks in a stored or imported value. A mark is yes, partial or no.
 * With `strict`, one damaged mark rejects the lot (null). Without it, a
 * damaged mark is left out and the rest are kept. A mark on a pattern this
 * content file does not have is kept, so a file from a newer guide loses
 * nothing.
 */
function readMarks(value: unknown, strict: boolean): Marks | null {
	if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
	const marks: Marks = {};
	for (const [patternId, mark] of Object.entries(value as Record<string, unknown>)) {
		if (UNSAFE_KEYS.has(patternId)) continue;
		if (typeof mark !== 'string' || !MARKS.includes(mark as Mark)) {
			if (strict) return null;
			continue;
		}
		marks[patternId] = mark as Mark;
	}
	return marks;
}

function readStored(value: unknown): Layer | null {
	if (!value || typeof value !== 'object') return null;
	const stored = value as Record<string, unknown>;
	if (typeof stored.id !== 'string' || typeof stored.name !== 'string') return null;
	const marks = readMarks(stored.marks, false);
	if (!marks) return null;
	return {
		version: 1,
		id: stored.id,
		name: stored.name,
		description: typeof stored.description === 'string' ? stored.description : '',
		marks
	};
}

function loadFromBrowser(): SavedLayers {
	let format: ExampleFormat | undefined;
	try {
		const f = localStorage.getItem(FORMAT_KEY);
		if (f && FORMATS.includes(f as ExampleFormat)) format = f as ExampleFormat;
		const text = localStorage.getItem(SAVED_KEY);
		if (text) {
			const parsed = JSON.parse(text);
			if (parsed && typeof parsed === 'object') {
				const saved: Record<string, Layer> = {};
				for (const value of Object.values(parsed)) {
					const layer = readStored(value);
					if (layer && layer.id !== '__proto__') saved[layer.id] = layer;
				}
				return { saved, currentId: localStorage.getItem(CURRENT_KEY) ?? undefined, format };
			}
		}
	} catch {
		// no storage, or text that is not JSON: start with one empty layer
	}
	return { saved: {}, format };
}

function persistToBrowser(saved: Record<string, Layer>, currentId: string, format: ExampleFormat): void {
	try {
		localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
		localStorage.setItem(CURRENT_KEY, currentId);
		localStorage.setItem(FORMAT_KEY, format);
	} catch {
		// no storage: the marks last until reload
	}
}

/** What a file must hold to be imported: an object of marks, each yes, partial or no. One damaged mark rejects the file. */
export function readImport(data: unknown, fallbackName: string): { name: string; description: string; marks: Marks } | null {
	if (!data || typeof data !== 'object') return null;
	const file = data as Record<string, unknown>;
	const marks = readMarks(file.marks, true);
	if (!marks) return null;
	return {
		name: typeof file.name === 'string' && file.name.trim() ? file.name.trim() : fallbackName,
		description: typeof file.description === 'string' ? file.description : '',
		marks
	};
}

export function createLayersStore(options: LayersStoreOptions = {}) {
	const loaded = (options.load ?? loadFromBrowser)();

	let saved = $state<Record<string, Layer>>(loaded.saved);
	if (Object.keys(saved).length === 0) {
		const first = blank(createId(DEFAULT_NAME), DEFAULT_NAME);
		saved[first.id] = first;
	}
	// The entry in saved, never a copy: an edit to a copy would never reach saved
	let current = $state<Layer>(own(saved, loaded.currentId) ?? Object.values(saved)[0]);
	let format = $state<ExampleFormat>(loaded.format ?? 'plain');

	function persist() {
		// $state.snapshot, never structuredClone: a $state value is a proxy
		const snapshot = $state.snapshot(saved);
		if (options.onPersist) options.onPersist(snapshot, current.id, format);
		else persistToBrowser(snapshot, current.id, format);
	}

	function add(layer: Layer) {
		saved[layer.id] = layer;
		current = saved[layer.id];
		persist();
	}

	return {
		/** The layer on screen */
		get current(): Layer {
			return current;
		},

		get marks(): Marks {
			return current.marks;
		},

		get savedList(): { id: string; name: string }[] {
			return Object.values(saved).map((l) => ({ id: l.id, name: l.name }));
		},

		/** The way every example is shown. One pick switches every pattern, and the pick is remembered */
		get format(): ExampleFormat {
			return format;
		},

		setFormat(next: ExampleFormat) {
			format = next;
			persist();
		},

		switchTo(id: string) {
			const target = own(saved, id);
			if (!target) return;
			current = target;
			persist();
		},

		/** A new layer with no marks. It becomes the current one. */
		newLayer(name: string) {
			const title = name.trim() || 'New Layer';
			add(blank(uniqueId(title, Object.keys(saved)), title));
		},

		/** A file's layer lands as a new one beside the others. It never overwrites one. */
		importLayer(imported: { name: string; description: string; marks: Marks }) {
			const layer = blank(uniqueId(imported.name, Object.keys(saved)), imported.name, imported.marks);
			layer.description = imported.description;
			add(layer);
		},

		/** Deletes a layer. The last one is replaced by an empty one, so there is always one. */
		deleteLayer(id: string) {
			if (!own(saved, id)) return;
			delete saved[id];
			const remaining = Object.values(saved);
			if (remaining.length === 0) {
				add(blank(createId(DEFAULT_NAME), DEFAULT_NAME));
				return;
			}
			if (current.id === id) current = remaining[0];
			persist();
		},

		/** The id stays the same when the name changes */
		setMeta(name: string, description: string) {
			current.name = name;
			current.description = description;
			persist();
		},

		/** A click on the mark a pattern already has takes the mark off */
		toggleMark(patternId: string, mark: Mark) {
			if (UNSAFE_KEYS.has(patternId)) return;
			if (current.marks[patternId] === mark) delete current.marks[patternId];
			else current.marks[patternId] = mark;
			persist();
		},

		/** Clears every mark in the current layer. The layer stays. */
		clearAll() {
			current.marks = {};
			persist();
		}
	};
}

export type LayersStore = ReturnType<typeof createLayersStore>;
