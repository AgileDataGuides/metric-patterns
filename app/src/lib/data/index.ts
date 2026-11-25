// The content, typed. data/lookups/patterns.json is the single source of
// truth for every word, family and pattern the app shows. To add a pattern,
// edit that file: no code changes.
import raw from '$data/lookups/patterns.json';
import type { Family, NumberedPattern, PatternsContent } from '../types';

export const content = raw as unknown as PatternsContent;

export const families: Family[] = content.families;

/**
 * Every pattern, in the content file's order inside its family, numbered by
 * its place: the second pattern of the third family is "3.2". The number is
 * worked out, so adding a pattern needs no renumbering by hand. Marks are kept
 * by id, so a new pattern never moves an old mark.
 */
export const patterns: NumberedPattern[] = families.flatMap((family, f) =>
	content.patterns
		.filter((p) => p.family === family.id)
		.map((p, i) => ({ ...p, number: `${f + 1}.${i + 1}` }))
);

// A pattern whose family id matches no family would vanish from the page
// with no error, so say so in the browser console.
const familyIds = new Set(families.map((f) => f.id));
for (const p of content.patterns) {
	if (!familyIds.has(p.family)) console.warn(`Metric Patterns: "${p.id}" names family "${p.family}", which is not in the families list. It is not shown.`);
}

export function patternsIn(familyId: string): NumberedPattern[] {
	return patterns.filter((p) => p.family === familyId);
}
