<script lang="ts">
	// One pattern. The pattern leads, on the left. The question a person asks
	// sits on the right as the reason a layer needs it: it is never a test.
	import { tick } from 'svelte';
	import { FORMATS, MARK_LABELS, PATTERN_LABELS } from '../canon/instructions';
	import { CHIP, MP, STATE_CHIP, TEXT } from '../ui/tokens';
	import type { ExampleFormat, Mark, NumberedPattern } from '../types';

	let {
		pattern,
		format,
		mark,
		onFormat,
		onMark
	}: {
		pattern: NumberedPattern;
		format: ExampleFormat;
		mark: Mark | undefined;
		onFormat: (format: ExampleFormat) => void;
		onMark: (mark: Mark) => void;
	} = $props();

	const example = $derived(format === 'plain' ? pattern.plainExample : pattern.examples[format] || pattern.plainExample);
	const MARKS: Mark[] = ['yes', 'partial', 'no'];

	/**
	 * Every entry's example changes length when the format changes, so the
	 * page would jump. Keep the clicked button where it was on screen.
	 */
	async function pick(next: ExampleFormat, e: MouseEvent) {
		const button = e.currentTarget as HTMLElement;
		const scroller = button.closest('[data-scroller]');
		const before = button.getBoundingClientRect().top;
		onFormat(next);
		await tick();
		scroller?.scrollBy(0, button.getBoundingClientRect().top - before);
	}
</script>

<article class={MP.entry} id="pattern-{pattern.id}">
	<div class={MP.entryWhat}>
		<div class="flex items-center gap-2">
			<span class={MP.number}>{pattern.number}</span>
			<span class={pattern.kind === 'Metric' ? MP.kindMetric : `${STATE_CHIP.base} ${STATE_CHIP.neutral}`}>{pattern.kind}</span>
		</div>
		<h3 class={MP.name}>{pattern.name}</h3>
		<p class={MP.whatItIs}>{pattern.whatItIs}</p>
		<div class={CHIP.wrapper} role="group" aria-label="Example format">
			{#each FORMATS as f (f.id)}
				<button
					type="button"
					class="{CHIP.base} {format === f.id ? CHIP.active : CHIP.inactive}"
					aria-pressed={format === f.id}
					onclick={(e) => pick(f.id, e)}>{f.label}</button
				>
			{/each}
		</div>
		<pre class={MP.code}>{example}</pre>
	</div>
	<div class={MP.entryWhy}>
		<div class="space-y-1">
			<div class={TEXT.label}>{PATTERN_LABELS.why}</div>
			<p class={MP.question}>{pattern.question}</p>
		</div>
		<div class="space-y-0.5">
			<div class={TEXT.label}>{PATTERN_LABELS.must}</div>
			<p class={MP.must}>{pattern.layerMust}</p>
		</div>
		<div class="space-y-0.5">
			<div class={TEXT.label}>{PATTERN_LABELS.without}</div>
			<p class={MP.without}>{pattern.withoutIt}</p>
		</div>
		<div class="flex items-center gap-2" role="group" aria-label="Does your layer support {pattern.name}?">
			<span class={TEXT.label}>{PATTERN_LABELS.myLayer}</span>
			<div class={CHIP.wrapper}>
				{#each MARKS as m (m)}
					<button
						type="button"
						class="{CHIP.base} {mark === m ? MP.mark[m] : CHIP.inactive}"
						aria-pressed={mark === m}
						onclick={() => onMark(m)}>{MARK_LABELS[m]}</button
					>
				{/each}
			</div>
		</div>
	</div>
</article>
