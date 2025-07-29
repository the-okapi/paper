<script lang="ts">
	import { keydown, getText, toggleItalic, setFontSize, setTokens } from '$lib/keybindManager';
	import { Button } from '$lib/components';
	import { toggleMode } from 'mode-watcher';
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import BoldIcon from '@lucide/svelte/icons/bold';
	import ItalicIcon from '@lucide/svelte/icons/italic';
	import UnderlineIcon from '@lucide/svelte/icons/underline';
	import BiggerIcon from '@lucide/svelte/icons/a-arrow-up';
	import SmallerIcon from '@lucide/svelte/icons/a-arrow-down';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { pb } from '$lib/pocketbase';

	let editor = $state(false);

	let text = $state(getText(false));
	let name = $state('Loading...');

	let modifierPressed = false;

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
		text = getText($state.snapshot(editor));
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
		if (editor) {
			if (event.key === 'Meta') {
				modifierPressed = true;
			} else if (modifierPressed) {
				const key = event.key.toLowerCase();
				if (key === 'b') bClick();
				else if (key === 'u') uClick();
				else if (key === 'i') iClick();
			} else {
				keydown(event, $state.snapshot(formatting), $state.snapshot(size) / 10);
				text = getText($state.snapshot(editor));
			}
			event.preventDefault();
		}
	}

	function onkeyup(event: KeyboardEvent) {
		if (editor) {
			if (event.key === 'Meta') {
				modifierPressed = false;
			}
		}
	}

	function textBigger() {
		size += 1;
		setFontSize($state.snapshot(size / 10));
		text = getText($state.snapshot(editor));
	}

	function textSmaller() {
		if (size > 1) size -= 1;
		setFontSize($state.snapshot(size / 10));
		text = getText($state.snapshot(editor));
	}

	onMount(async () => {
		let text = localStorage.getItem(page.params.file);
		if (text) {
			name = localStorage.getItem(`${page.params.file}Name`) ?? '';
			setTokens(text);
			if (await pb.authStore.record?.editor) {
				editor = true;
				text = getText(true);
			} else {
				text = getText(false);
			}
		}
	});
</script>

<svelte:window {onkeydown} {onkeyup} />

<main>
	<div class="m-4 grid grid-cols-3">
		<div class="text-left">
			{#if editor}
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
			{/if}
		</div>
		<div class="m-auto text-center">
			<h1 class="text-xl font-bold">{name}</h1>
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
