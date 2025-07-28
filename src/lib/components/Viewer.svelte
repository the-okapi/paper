<script lang="ts">
	import { getText } from '$lib/keybindManager';
	import { Button } from '$lib/components';
	import { toggleMode } from 'mode-watcher';
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';

	let text = $state(getText(false));
</script>

<svelte:window {onkeydown} {onkeyup} {oncontextmenu} {ondblclick} />

<main>
	<div class="m-4 grid grid-cols-3">
		<div></div>
		<div class="m-auto text-center">
			<h1 class="text-xl font-bold">Repaper</h1>
		</div>
		<div class="text-right">
			<Button onclick={toggleMode} variant="outline" size="icon" class="m-1">
				<SunIcon
					class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 !transition-all dark:scale-0 dark:-rotate-90"
				/>
				<MoonIcon
					class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 !transition-all dark:scale-100 dark:rotate-0"
				/>
				<span class="sr-only">Toggle theme</span>
			</Button>
		</div>
	</div>
	<hr />
	<div class="prewrap m-5">{@html text}</div>
</main>

<style>
	.prewrap {
		font-family: system-ui;
		max-width: calc(100vw - 2.5rem);
		white-space: normal;
	}
	h1 {
		font-family: system-ui;
	}
</style>
