<script lang="ts">
	import { keydown, getText, toggleItalic, setFontSize } from '$lib/keybindManager';
	import { Button } from '$lib/components/ui/button/index';
	import { toggleMode } from 'mode-watcher';
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import BoldIcon from '@lucide/svelte/icons/bold';
	import ItalicIcon from '@lucide/svelte/icons/italic';
	import UnderlineIcon from '@lucide/svelte/icons/underline';
	import BiggerIcon from '@lucide/svelte/icons/a-arrow-up';
	import SmallerIcon from '@lucide/svelte/icons/a-arrow-down';

	let text = $state(getText());

	let modifierPressed = false;

	function oncontextmenu(event: Event) {
		event.preventDefault();
	}

	function ondblclick(event: Event) {
		event.preventDefault();
	}

	let bVariant: 'secondary' | 'default' = $state('secondary');
	let iVariant: 'secondary' | 'default' = $state('secondary');
	let uVariant: 'secondary' | 'default' = $state('secondary');
	let formatting = $state([false, false, false]);
	let size = $state(10);

	function bClick() {
		if (formatting[0]) {
			bVariant = 'secondary';
			formatting[0] = false;
		} else {
			bVariant = 'default';
			formatting[0] = true;
		}
	}

	function iClick() {
		if (formatting[1]) {
			iVariant = 'secondary';
			formatting[1] = false;
		} else {
			iVariant = 'default';
			formatting[1] = true;
		}
		toggleItalic();
		text = getText();
	}

	function uClick() {
		if (formatting[2]) {
			uVariant = 'secondary';
			formatting[2] = false;
		} else {
			uVariant = 'default';
			formatting[2] = true;
		}
	}

	function onkeydown(event: KeyboardEvent) {
		if (event.key === 'Meta') {
			modifierPressed = true;
		} else if (modifierPressed) {
			const key = event.key.toLowerCase();
			if (key === 'b') bClick();
			else if (key === 'u') uClick();
			else if (key === 'i') iClick();
		} else {
			keydown(event, $state.snapshot(formatting), $state.snapshot(size) / 10);
			text = getText();
		}
		event.preventDefault();
	}

	function onkeyup(event: KeyboardEvent) {
		if (event.key === 'Meta') {
			modifierPressed = false;
		}
	}

	function textBigger() {
		size += 1;
		setFontSize($state.snapshot(size / 10));
		text = getText();
	}

	function textSmaller() {
		if (size > 1) size -= 1;
		setFontSize($state.snapshot(size / 10));
		text = getText();
	}
</script>

<svelte:window {onkeydown} {onkeyup} {oncontextmenu} {ondblclick} />

<main>
	<div class="m-4 grid grid-cols-3">
		<div class="text-left">
			<Button class="m-1" size="icon" variant="outline" onclick={textBigger} title="Bigger">
				<BiggerIcon class="h-[1.2rem] w-[1.2rem]" />
			</Button>
			<Button class="m-1" size="icon" variant="outline" onclick={textSmaller} title="Smaller">
				<SmallerIcon class="h-[1.2rem] w-[1.2rem]" />
			</Button>
			<Button class="m-1 font-bold" onclick={bClick} variant={bVariant} size="icon" title="Bold">
				<BoldIcon class="h-[1.2rem] w-[1.2rem]" />
			</Button>
			<Button class="m-1 italic" onclick={iClick} variant={iVariant} size="icon" title="Italic">
				<ItalicIcon class="h-[1.2rem] w-[1.2rem]" />
			</Button>
			<Button class="m-1" onclick={uClick} variant={uVariant} size="icon" title="Underline">
				<UnderlineIcon class="h-[1.2rem] w-[1.2rem]" />
			</Button>
		</div>
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
	<pre class="m-5">{@html text}</pre>
</main>

<style>
	pre {
		font-family: system-ui;
	}
	h1 {
		font-family: system-ui;
	}
</style>
