<script lang="ts">
	import {
		keydown,
		getText,
		toggleItalic,
		setFontSize,
		setTokens,
		getTokensText
	} from '$lib/keybindManager';
	import { Button, AlertDialog, Input } from '$lib/components';
	import BoldIcon from '@lucide/svelte/icons/bold';
	import ItalicIcon from '@lucide/svelte/icons/italic';
	import UnderlineIcon from '@lucide/svelte/icons/underline';
	import BiggerIcon from '@lucide/svelte/icons/a-arrow-up';
	import SmallerIcon from '@lucide/svelte/icons/a-arrow-down';
	import SaveIcon from '@lucide/svelte/icons/save';
	import DeleteIcon from '@lucide/svelte/icons/trash-2';
	import RenameIcon from '@lucide/svelte/icons/square-pen';
	import ReloadIcon from '@lucide/svelte/icons/rotate-cw';
	import ShareIcon from '@lucide/svelte/icons/share';
	import HomeIcon from '@lucide/svelte/icons/house';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { pb, deleteFilePB, saveFile, renameFilePB } from '$lib/pocketbase';
	import { goto } from '$app/navigation';

	let editor = $state(false);

	let deleteAlertOpen = $state(false);
	let renameDialogOpen = $state(false);
	let reloadWarningOpen = $state(false);

	let editorShareDialogOpen = $state(false);
	let viewerShareDialogOpen = $state(false);

	let editCode = $state('');
	let viewCode = $state('');

	let file: string;

	let text = $state(getText(false));
	let name = $state('Loading...');
	let saveText = $state('');
	let errorText = $state('');
	let renameErrorText = $state('');

	let renameValue = $state('');

	let modifierPressed = false;

	let bVariant: 'secondary' | 'default' = $state('secondary');
	let iVariant: 'secondary' | 'default' = $state('secondary');
	let uVariant: 'secondary' | 'default' = $state('secondary');
	let formatting = $state([false, false, false]);
	let size = $state(10);

	let cursorVisible = true;

	const blinkingInterval = setInterval(() => {
		if (document.hasFocus()) {
			if (cursorVisible) cursorVisible = false;
			else cursorVisible = true;
			text = getText(cursorVisible);
		} else {
			text = getText(true);
		}
	}, 500);

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
		if (editor && !renameDialogOpen) {
			if (event.key === 'Meta') {
				modifierPressed = true;
			} else if (modifierPressed) {
				const key = event.key.toLowerCase();
				if (key === 'b') bClick();
				else if (key === 'u') uClick();
				else if (key === 'i') iClick();
				else if (key === 's') save();
			} else {
				keydown(event, $state.snapshot(formatting), $state.snapshot(size) / 10);
				text = getText($state.snapshot(editor));
			}
		}
		if (!renameDialogOpen) event.preventDefault();
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

	function deleteButton() {
		deleteAlertOpen = true;
	}

	async function deleteFile() {
		const result = await deleteFilePB(localStorage.getItem(`${page.params.file}File`) ?? '');
		if (result.success) {
			pb.authStore.clear();
			localStorage.clear();
			deleteAlertOpen = false;
			goto('/?deleted');
		} else {
			goto(`/?error=${result.error}`);
		}
	}

	async function save() {
		errorText = '';
		saveText = 'Saving...';
		const result = await saveFile(getTokensText(), file);
		if (result.success) {
			window.setTimeout(() => (saveText = ''), 3000);
			reloadButton(false);
		} else {
			saveText = '';
			errorText = result.error;
		}
	}

	async function renameFile() {
		if (renameValue !== '') {
			renameErrorText = '';
			const result = await renameFilePB(renameValue, file);
			if (result.success) {
				name = renameValue;
				window.setTimeout(() => (saveText = ''), 3000);
				reloadButton(false);
			} else {
				errorText = result.error;
			}
			renameDialogOpen = false;
			renameValue = '';
		} else {
			renameErrorText = 'Name cannot be empty.';
		}
	}

	function renameButton() {
		renameDialogOpen = true;
	}

	function reloadButton(warning: boolean) {
		if (warning && editor) {
			reloadWarningOpen = true;
		} else reload();
	}

	function reload() {
		reloadWarningOpen = false;
		goto('/?reload');
	}

	function editorShare() {
		editorShareDialogOpen = true;
	}

	function viewerShare() {
		viewerShareDialogOpen = true;
	}

	function closeEditorShare() {
		editorShareDialogOpen = false;
	}

	function closeViewerShare() {
		viewerShareDialogOpen = false;
	}

	onMount(() => {
		let text = localStorage.getItem(page.params.file ?? '');
		if (text) {
			setTokens(text);
			name = localStorage.getItem(`${page.params.file}Name`) ?? '';
			file = localStorage.getItem(`${page.params.file}File`) ?? '';
			const fileObj = JSON.parse(file);
			if (pb.authStore.record?.editor) {
				editor = true;
				text = getText(true);
				editCode = fileObj.expand.editUser.username;
			} else {
				text = getText(false);
			}
			viewCode = fileObj.expand.viewUser.username;
			textBigger();
			textSmaller();
		} else {
			goto('/?invalid');
		}
		return () => clearInterval(blinkingInterval);
	});
</script>

<svelte:window {onkeydown} {onkeyup} />

<svelte:head>
	<title>{name} - Repaper</title>
</svelte:head>

<AlertDialog.Root bind:open={deleteAlertOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you absolutely sure you want to delete this file?</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete this file from our servers. No
				one will be able to access this file after you click continue.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action onclick={deleteFile}>Continue</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<AlertDialog.Root bind:open={reloadWarningOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Are you sure you want to reload this file?</AlertDialog.Title>
			<AlertDialog.Description
				>This will discard any unsaved changes you may have. These changes cannot be retrieved once
				this file is reloaded.</AlertDialog.Description
			>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action onclick={reload}>Continue</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<AlertDialog.Root bind:open={renameDialogOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Rename File</AlertDialog.Title>
			<AlertDialog.Description
				>Rename this file. Continue when you're ready.</AlertDialog.Description
			>
		</AlertDialog.Header>
		<Input
			id="renameInput"
			class="h-10 text-sm"
			type="text"
			placeholder="New Name"
			bind:value={renameValue}
		/>
		<p class="text-red-500">{renameErrorText}</p>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action onclick={renameFile}>Continue</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<AlertDialog.Root bind:open={editorShareDialogOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Share this file</AlertDialog.Title>
			<AlertDialog.Description
				>Use the codes below along with the file password to share this file to other people.</AlertDialog.Description
			>
		</AlertDialog.Header>
		<div>
			<p>File Code for Editors (can edit, rename and delete):</p>
			<p class="text-[1.3rem] font-black">{editCode}</p>
		</div>
		<div>
			<p>File Code for Viewers (can only view):</p>
			<p class="text-[1.3rem] font-black">{viewCode}</p>
		</div>
		<AlertDialog.Footer>
			<AlertDialog.Action onclick={closeEditorShare}>Close</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<AlertDialog.Root bind:open={viewerShareDialogOpen}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Share this file</AlertDialog.Title>
			<AlertDialog.Description
				>Use the code below along with the file password to share this file to other people.</AlertDialog.Description
			>
		</AlertDialog.Header>
		<div>
			<p>File Code for Viewers (can only view):</p>
			<p class="text-[1.3rem] font-black">{viewCode}</p>
		</div>
		<AlertDialog.Footer>
			<AlertDialog.Action onclick={closeViewerShare}>Close</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>

<main>
	<div class="m-4 grid grid-cols-3">
		<div class="text-left">
			{#if editor}
				<Button class="m-1" size="icon" variant="outline" onclick={textBigger} title="Bigger">
					<BiggerIcon class="h-[1.2rem] w-[1.2rem]" />
				</Button>
				<button class="font-black">{size}</button>
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
			<h1 class="text-[1.8rem] font-bold">{name}</h1>
		</div>
		<div class="text-right">
			{#if editor}
				<span class="mr-3 text-red-500">{errorText}</span>
				<span class="mr-3">{saveText}</span>
				<Button class="m-1" size="icon" onclick={save} title="Save File">
					<SaveIcon class="h-[1.2rem] w-[1.2rem]" />
				</Button>
				<Button class="m-1" size="icon" onclick={renameButton} title="Rename File">
					<RenameIcon class="h-[1.2rem] w-[1.2rem]" />
				</Button>
				<Button class="m-1" size="icon" onclick={deleteButton} title="Delete File">
					<DeleteIcon class="h-[1.2rem] w-[1.2rem]" />
				</Button>
			{/if}
			<Button onclick={() => reloadButton(true)} size="icon" class="m-1" title="Reload File">
				<ReloadIcon class="h-[1.2rem] w-[1.2rem]" />
			</Button>
			{#if editor}
				<Button class="m-1" size="icon" onclick={editorShare} title="Share File">
					<ShareIcon class="h-[1.2rem] w-[1.2rem]" />
				</Button>
			{:else}
				<Button class="m-1" size="icon" onclick={viewerShare} title="Share File">
					<ShareIcon class="h-[1.2rem] w-[1.2rem]" />
				</Button>
			{/if}
			<Button onclick={() => goto('/')} size="icon" class="m-1" title="Reload File">
				<HomeIcon class="h-[1.2rem] w-[1.2rem]" />
			</Button>
		</div>
	</div>
	<hr class="w-[100%]" />
	<div class="prewrap m-5 w-fit">{@html text}</div>
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
