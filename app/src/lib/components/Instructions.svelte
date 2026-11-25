<script lang="ts">
	import { content } from '../data';
	import { MP, TEXT } from '../ui/tokens';
</script>

<div class={MP.content}>
	<section class="{MP.reading} space-y-3">
		<h2 class={MP.introHeading}>How to use Metric Patterns</h2>
		<p>A metrics layer is the part of a data platform that holds the definitions and calculation rules for business numbers, so every BI tool and every GenAI tool gets the same answer. "Total sales" is easy. "Share of buyers who come back" is not. This guide lists the patterns a metrics layer should support, and the business question that makes each one necessary.</p>
		<p>It is not a test. There is no right or wrong answer and nothing is scored. Read a pattern, read the question that needs it, and see what goes wrong without it.</p>
	</section>

	<section class="{MP.reading} space-y-2">
		<h3 class={TEXT.sectionHeader}>Read the patterns</h3>
		<ul class={MP.bullets}>
			<li>The <b>Patterns</b> tab groups the patterns into families. Pick a family to show only that one.</li>
			<li>Each pattern is a <b>Measure</b> (one total over recorded values) or a <b>Metric</b> (a formula over Measures).</li>
			<li>Each example comes four ways: Plain, SQL, Excel and DAX. Pick one on any pattern and every pattern follows. The app remembers your pick.</li>
			<li>The formulas show the shape of each pattern. The SQL is tested on {content.sqlTestedOn}, and SQL differs a little between databases. The Excel and DAX are read, not run.</li>
		</ul>
	</section>

	<section class="{MP.reading} space-y-2">
		<h3 class={TEXT.sectionHeader}>Check your own layer, if you want to</h3>
		<ul class={MP.bullets}>
			<li>Mark a pattern <b>Yes</b>, <b>Partial</b> or <b>No</b> for your layer. Click the mark again to take it off.</li>
			<li>The <b>My Metric Layer Patterns</b> tab counts your marks and lists every pattern. <b>Copy as text</b> gives you the list to paste into a message.</li>
			<li>Keep more than one layer: <b>New Layer</b> in the header, for example one for the layer you run today and one you are weighing.</li>
			<li><b>Export JSON</b> saves the current layer as a file. <b>Import</b> loads a file as a new layer. It never overwrites one.</li>
			<li>Your marks are stored in this browser only. Nothing is sent anywhere.</li>
		</ul>
	</section>

	<section class="{MP.reading} space-y-2">
		<h3 class={TEXT.sectionHeader}>Add a pattern</h3>
		<p>The patterns live in one file, <code>data/lookups/patterns.json</code>. To add one, add an entry with its family, a question a real person asked, what the layer must do, what goes wrong without it, and the examples. No code changes. The number is worked out from the order.</p>
	</section>
</div>
