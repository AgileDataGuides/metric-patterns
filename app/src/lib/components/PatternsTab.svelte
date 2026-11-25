<script lang="ts">
	import { getContext } from 'svelte';
	import { content, families, patternsIn } from '../data';
	import { INTRO } from '../canon/instructions';
	import { CHIP, HINT, MP, TEXT } from '../ui/tokens';
	import type { LayersStore } from '../stores/layers.svelte';
	import PatternEntry from './PatternEntry.svelte';

	const store = getContext<LayersStore>('layersStore');

	// The filter changes what is shown. It stores nothing.
	let family = $state<string>('all');
	const shown = $derived(family === 'all' ? families : families.filter((f) => f.id === family));
</script>

<div class={MP.content}>
	<section class="space-y-3">
		<h2 class={MP.introHeading}>{INTRO.heading}</h2>
		<p class={MP.reading}>{INTRO.definition}</p>
		<p class={MP.reading}>{INTRO.lede}</p>
		<p class={HINT.quiet}>{content.setting}</p>
	</section>

	<section class="space-y-3">
		<h2 class={TEXT.sectionHeader}>{INTRO.wordsHeading}</h2>
		<div class={MP.words}>
			{#each content.words as word (word.name)}
				<div class={MP.wordCard}>
					<div class={MP.name}>{word.name}</div>
					<p class={MP.whatItIs}>{word.meaning}</p>
					<code class={MP.wordExample}>{word.example}</code>
				</div>
			{/each}
		</div>
	</section>

	<section class="space-y-3">
		<p class={MP.reading}>{INTRO.examplesNote}</p>
		<p class={MP.reading}>{INTRO.sketchNote} The SQL is tested on {content.sqlTestedOn}. The Excel and DAX are read, not run.</p>
		<div class={CHIP.wrapper} role="group" aria-label="Show one family">
			<button type="button" class="{CHIP.base} {family === 'all' ? CHIP.active : CHIP.inactive}" aria-pressed={family === 'all'} onclick={() => (family = 'all')}>All</button>
			{#each families as f (f.id)}
				<button type="button" class="{CHIP.base} {family === f.id ? CHIP.active : CHIP.inactive}" aria-pressed={family === f.id} onclick={() => (family = f.id)}>{f.name}</button>
			{/each}
		</div>
	</section>

	{#each shown as f (f.id)}
		<section>
			<div class={MP.familyHeader}>
				<h2 class={MP.familyName}>{f.name}</h2>
				<p class={MP.familyDesc}>{f.description}</p>
			</div>
			{#each patternsIn(f.id) as pattern (pattern.id)}
				<PatternEntry
					{pattern}
					format={store.format}
					mark={Object.hasOwn(store.marks, pattern.id) ? store.marks[pattern.id] : undefined}
					onFormat={(next) => store.setFormat(next)}
					onMark={(m) => store.toggleMark(pattern.id, m)}
				/>
			{/each}
		</section>
	{/each}
</div>
