<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	let { children } = $props();

	function preventDefault(event: Event) {
		event.preventDefault();
	}
</script>

<svelte:window ondblclick={preventDefault} oncontextmenu={preventDefault} />

<ModeWatcher />
{@render children()}
