// Counts, the text list and the export file, worked out from the marks.
import type { Layer, Mark, Marks, NumberedPattern } from '../types';
import { MARK_LABELS } from '../canon/instructions';

export interface Tally {
	total: number;
	yes: number;
	partial: number;
	no: number;
	notMarked: number;
}

/** Counts only the patterns this guide shows, so a mark kept from a newer file never inflates a count */
export function tally(patterns: NumberedPattern[], marks: Marks): Tally {
	const t: Tally = { total: patterns.length, yes: 0, partial: 0, no: 0, notMarked: 0 };
	for (const p of patterns) {
		const m = Object.hasOwn(marks, p.id) ? marks[p.id] : undefined;
		if (m) t[m]++;
		else t.notMarked++;
	}
	return t;
}

function label(mark: Mark | undefined): string {
	return mark ? MARK_LABELS[mark] : '-';
}

/** The marks as plain text, one line per pattern, to paste into a message or a document */
export function asText(patterns: NumberedPattern[], layer: Layer): string {
	const t = tally(patterns, layer.marks);
	return [
		'Metric Patterns',
		`Layer: ${layer.name}`,
		...(layer.description ? [layer.description] : []),
		`Yes ${t.yes}. Partial ${t.partial}. No ${t.no}. Not marked ${t.notMarked}. Of ${t.total}.`,
		'',
		...patterns.map((p) => `${p.number.padEnd(5)} ${label(layer.marks[p.id]).padEnd(8)} ${p.name}`)
	].join('\n');
}

/** The Export JSON file. Import reads name, description and marks back. The patterns list is there for a reader, or for Claude */
export function exportPayload(patterns: NumberedPattern[], layer: Layer, exportedAt: string) {
	return {
		app: 'metric-patterns',
		version: 1,
		exportedAt,
		name: layer.name,
		description: layer.description,
		summary: tally(patterns, layer.marks),
		marks: layer.marks,
		patterns: patterns.map((p) => ({
			number: p.number,
			id: p.id,
			name: p.name,
			kind: p.kind,
			family: p.family,
			question: p.question,
			mark: layer.marks[p.id] ?? null
		}))
	};
}
