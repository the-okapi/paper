<script lang="ts">
	import { goto } from '$app/navigation';
	import { Input, Label, Button } from '$lib/components';
	import { getFile } from '$lib/pocketbase';
	import type { Result } from '$lib/pocketbase';
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	let fileCode = $state('');
	let filePassword = $state('');

	let errorText = $state('');

	let loading = $state(false);
	let disabled = $state(false);

	async function onsubmit(event: Event) {
		event.preventDefault();
		// lower case file name
		const lcfc = fileCode.toLowerCase();
		disabled = true;
		errorText = '';
		loading = true;
		localStorage.clear();
		let result: Result = await getFile(lcfc, filePassword);
		if (result.success) {
			localStorage.setItem(lcfc, result.value);
			localStorage.setItem(`${lcfc}Name`, result.name);
			localStorage.setItem(`${lcfc}File`, result.file);
			goto(`/${lcfc}`);
		} else {
			loading = false;
			if (result.value === 'Failed to authenticate.') {
				errorText = 'Invalid username or password.';
			} else {
				errorText = 'Error: ' + result.value;
			}
			disabled = false;
		}
	}
	onMount(() => {
		if (page.url.searchParams.getAll('invalid').length === 1) {
			errorText = 'File not found.';
		} else if (page.url.searchParams.getAll('deleted').length === 1) {
			errorText = 'File deleted successfully.';
		} else {
			const error = page.url.searchParams.getAll('error');
			if (error.length > 0) {
				errorText = 'Error: ' + error[0];
			}
		}
	});
</script>

<h1 class="mt-[11.5%] text-center text-[4em] font-black select-none">Repaper</h1>

<form {onsubmit} class="m-auto mt-[7%] block w-fit align-middle">
	<Label for="fileCode" class="ml-0.5 text-lg font-bold {disabled ? 'text-neutral-600' : ''}"
		>File Code & Password:</Label
	>
	<Input
		required
		id="fileCode"
		bind:value={fileCode}
		type="text"
		class="mt-1 mb-2 w-[24rem] disabled:cursor-default"
		placeholder="File Code"
		{disabled}
	/>
	<div class="mt-1.5 flex">
		<Input
			required
			class="disabled:cursor-default"
			bind:value={filePassword}
			{disabled}
			type="password"
			placeholder="File Password"
		/>
		<Button class="text-md ml-2 h-12 w-14" type="submit" {disabled}>Go</Button>
	</div>
</form>
<p class="text-center text-red-500 font-bold">{errorText}</p>
{#if loading}<p class="text-center font-bold text-[#00bfff]">Loading...</p>{/if}

<style>
	h1 {
		text-shadow:
			0 0 10px #00bfff,
			0 0 20px #00bfff,
			0 0 30px #00bfff;
	}
</style>
