<script lang="ts">
	// The marks on the current layer: the tally, what each mark means, one
	// row per pattern, and the list as text to copy.
	import { getContext } from 'svelte';
	import { patterns } from '../data';
	import { MARK_LABELS, MY_LAYER } from '../canon/instructions';
	import { asText, tally } from '../model/summary';
	import { BUTTON, CARD, MP, ROW_ACTION, STATE_CHIP, TEXT } from '../ui/tokens';
	import type { LayersStore } from '../stores/layers.svelte';
	import type { Mark } from '../types';

	let { onClearAll, onGoTo }: { onClearAll: () => void; onGoTo: (patternId: string) => void } = $props();

	const store = getContext<LayersStore>('layersStore');
	const counts = $derived(tally(patterns, store.marks));
	const TONE: Record<Mark, string> = { yes: STATE_CHIP.positive, partial: STATE_CHIP.warning, no: STATE_CHIP.negative };

	let copiedText = $state('');
	let copied = $state(false);

	async function copy() {
		copiedText = asText(patterns, $state.snapshot(store.current));
		try {
			await navigator.clipboard.writeText(copiedText);
			copied = true;
			setTimeout(() => (copied = false), 1600);
		} catch {
			// no clipboard: the text is shown below, selected on one click
		}
	}

	function markOf(id: string): Mark | undefined {
		return Object.hasOwn(store.marks, id) ? store.marks[id] : undefined;
	}
</script>

<div class={MP.content}>
	<section class="space-y-3">
		<h2 class={MP.introHeading}>{MY_LAYER.heading}</h2>
		<ul class="space-y-1">
			{#each MY_LAYER.meaning as m (m.mark)}
				<li class={MP.meaningRow}>
					<span class="{STATE_CHIP.base} {TONE[m.mark]} {MP.meaningChip}">{MARK_LABELS[m.mark]}</span>
					<span>{m.text}</span>
				</li>
			{/each}
		</ul>
		<p class={MP.reading}>{MY_LAYER.use}</p>
	</section>

	<section class="{CARD.base} p-4 space-y-4">
		<div class={MP.tally}>
			<div><span class={MP.tallyNumber}>{counts.total}</span><span class={TEXT.label}>Patterns</span></div>
			<div><span class={MP.tallyNumber}>{counts.yes}</span><span class={TEXT.label}>{MARK_LABELS.yes}</span></div>
			<div><span class={MP.tallyNumber}>{counts.partial}</span><span class={TEXT.label}>{MARK_LABELS.partial}</span></div>
			<div><span class={MP.tallyNumber}>{counts.no}</span><span class={TEXT.label}>{MARK_LABELS.no}</span></div>
			<div><span class={MP.tallyNumber}>{counts.notMarked}</span><span class={TEXT.label}>{MY_LAYER.notMarked}</span></div>
		</div>
		<div class="flex items-center gap-4">
			<button type="button" class={BUTTON.secondary} onclick={copy}>{copied ? MY_LAYER.copied : MY_LAYER.copy}</button>
			<button type="button" class={ROW_ACTION.danger} onclick={onClearAll}>{MY_LAYER.clearAll}</button>
		</div>
		{#if copiedText}
			<pre class="{MP.code} {MP.copyOutput}">{copiedText}</pre>
		{/if}
	</section>

	<section class="{CARD.base} {CARD.listDivider}">
		{#each patterns as p (p.id)}
			{@const m = markOf(p.id)}
			<div class={MP.listRow}>
				<span class="{MP.number} {MP.listNumber}">{p.number}</span>
				<button type="button" class={MP.listLink} onclick={() => onGoTo(p.id)}>{p.name}</button>
				{#if m}
					<span class="{STATE_CHIP.base} {TONE[m]}">{MARK_LABELS[m]}</span>
				{:else}
					<span class="{STATE_CHIP.base} {STATE_CHIP.neutral}">{MY_LAYER.notMarked}</span>
				{/if}
			</div>
		{/each}
	</section>
</div>
