<script lang="ts">
	import { setContext, tick } from 'svelte';
	import { createLayersStore, readImport } from '#lib/stores/layers.svelte.ts';
	import { patterns } from '#lib/data/index.ts';
	import { exportPayload } from '#lib/model/summary.ts';
	import { APP } from '#lib/canon/instructions.ts';
	import { BUTTON, HEADER, TAB, TEXT } from '#lib/ui/tokens.ts';
	import Toolbar from '#lib/components/Toolbar.svelte';
	import PatternsTab from '#lib/components/PatternsTab.svelte';
	import MyLayerTab from '#lib/components/MyLayerTab.svelte';
	import Instructions from '#lib/components/Instructions.svelte';

	// The layers live in this browser's localStorage
	const store = createLayersStore();
	setContext('layersStore', store);

	// The first tab's name counts the patterns, so each added pattern adds one
	type TabId = 'patterns' | 'layer' | 'instructions';
	const TABS: { id: TabId; label: string }[] = [
		{ id: 'patterns', label: `${patterns.length} Patterns` },
		{ id: 'layer', label: 'My Metric Layer Patterns' },
		{ id: 'instructions', label: 'Instructions' }
	];
	let activeTab = $state<TabId>('patterns');
	let scroller = $state<HTMLElement | null>(null);

	/** A new tab opens at its top, not at the place the last tab was scrolled to */
	function openTab(id: TabId) {
		activeTab = id;
		scroller?.scrollTo(0, 0);
	}

	/** From the My Metric Layer Patterns list to the pattern's entry */
	async function goToPattern(patternId: string) {
		openTab('patterns');
		await tick();
		document.getElementById(`pattern-${patternId}`)?.scrollIntoView({ block: 'start' });
	}

	// Layer management (header), DESIGN_SYSTEM.md § 17
	let showSwitcher = $state(false);
	let showNew = $state(false);
	let newName = $state('');

	function handleClickOutsideSwitcher(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (!target.closest('[data-layer-switcher]')) showSwitcher = false;
	}

	function handleNew() {
		const name = newName.trim();
		if (!name) return;
		store.newLayer(name);
		newName = '';
		showNew = false;
	}

	function handleDelete() {
		if (!confirm(`Delete "${store.current.name}"?`)) return;
		store.deleteLayer(store.current.id);
	}

	/** Import always lands as a new layer beside the others. It never overwrites one. */
	function handleImport() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.json';
		input.onchange = async () => {
			const file = input.files?.[0];
			if (!file) return;
			if (file.size > 5 * 1024 * 1024) {
				alert('File too large (max 5MB)');
				return;
			}
			try {
				const imported = readImport(JSON.parse(await file.text()), file.name.replace(/\.json$/i, ''));
				if (!imported) {
					alert('Invalid file. Expected a file made by Export JSON in this app.');
					return;
				}
				store.importLayer(imported);
			} catch {
				alert('Could not parse JSON file');
			}
		};
		input.click();
	}

	function slugify(name: string): string {
		return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/^-+|-+$/g, '') || 'layer';
	}

	function handleExport() {
		const payload = exportPayload(patterns, $state.snapshot(store.current), new Date().toISOString());
		const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = `${slugify(store.current.name)}-metric-patterns.json`;
		link.click();
		URL.revokeObjectURL(url);
	}

	function handleClearAll() {
		if (!confirm(`Clear every mark in "${store.current.name}"?`)) return;
		store.clearAll();
	}
</script>

<svelte:window onclick={handleClickOutsideSwitcher} />

<!-- App Header (dark), DESIGN_SYSTEM.md § 17 -->
<header class="bg-slate-900 text-white px-6 py-3 shrink-0">
	<div class="flex items-center justify-between gap-4">
		<div>
			<h1 class={TEXT.appTitle}>{APP.title}</h1>
			<p class="{TEXT.appTagline} mt-0.5">{APP.tagline}</p>
		</div>
		<div class="flex items-center gap-2" data-layer-switcher>
			<div class="relative">
				<button
					type="button"
					class={HEADER.switcher}
					aria-haspopup="listbox"
					aria-expanded={showSwitcher}
					aria-label="Switch layer"
					onclick={() => (showSwitcher = !showSwitcher)}
				>
					<span class={HEADER.switcherName}>{store.current.name}</span>
					<svg class="{HEADER.chevron} {showSwitcher ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
					</svg>
				</button>
				{#if showSwitcher}
					<div class={HEADER.panel} role="listbox" aria-label="Layers">
						{#each store.savedList as item (item.id)}
							<button
								type="button"
								role="option"
								aria-selected={item.id === store.current.id}
								class="{HEADER.item} {item.id === store.current.id ? HEADER.itemActive : HEADER.itemInactive}"
								onclick={() => {
									store.switchTo(item.id);
									showSwitcher = false;
								}}
							>{item.name}</button>
						{/each}
					</div>
				{/if}
			</div>
			{#if showNew}
				<!-- svelte-ignore a11y_autofocus -->
				<input
					type="text"
					placeholder="Layer name..."
					aria-label="New layer name"
					autofocus
					bind:value={newName}
					onkeydown={(e) => {
						if (e.key === 'Enter') handleNew();
						if (e.key === 'Escape') {
							showNew = false;
							newName = '';
						}
					}}
					class={HEADER.nameInput}
				/>
				<button type="button" class={BUTTON.create} onclick={handleNew}>Create</button>
				<button
					type="button"
					class={BUTTON.headerCancel}
					onclick={() => {
						showNew = false;
						newName = '';
					}}>Cancel</button
				>
			{:else}
				<button type="button" class={BUTTON.headerNeutral} onclick={() => (showNew = true)}>New Layer</button>
				<button type="button" class={BUTTON.headerNeutral} title="Import a layer file as a new layer" onclick={handleImport}>Import</button>
			{/if}
			<button type="button" class={BUTTON.deleteHeader} onclick={handleDelete}>Delete</button>
		</div>
	</div>
</header>

<!-- Toolbar -->
<div class="px-6 py-3 border-b border-slate-200 bg-white shrink-0">
	<Toolbar onExport={handleExport} />
</div>

<!-- Tabs -->
<div class="flex gap-0 px-4 border-b border-slate-200 shrink-0" role="tablist">
	{#each TABS as tab (tab.id)}
		<button
			type="button"
			role="tab"
			aria-selected={activeTab === tab.id}
			class="{TAB.wrapper} {activeTab === tab.id ? TAB.active : TAB.inactive}"
			onclick={() => openTab(tab.id)}
		>{tab.label}</button>
	{/each}
</div>

<div class="flex-1 overflow-y-auto" data-scroller bind:this={scroller}>
	{#if activeTab === 'patterns'}
		<PatternsTab />
	{:else if activeTab === 'layer'}
		<MyLayerTab onClearAll={handleClearAll} onGoTo={goToPattern} />
	{:else}
		<Instructions />
	{/if}
</div>
