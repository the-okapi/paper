<script lang="ts">
    import { goto } from '$app/navigation';
	import { Input, Label, Button } from '$lib/components';
	import { getFile, pb } from '$lib/pocketbase';
	import type { Result } from '$lib/pocketbase';
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	let fileCode = $state('');
	let filePassword = $state('');

	let errorText = $state('');

	let loading = $state(false);
	let disabled = $state(false);

	async function signIn(lcfc: string, auth: boolean) {
		disabled = true;
		errorText = '';
		loading = true;
		if (auth) localStorage.clear();
		let result: Result = await getFile(lcfc, filePassword, auth);
		if (result.success) {
			localStorage.setItem(lcfc, result.value);
			localStorage.setItem(`${lcfc}Name`, result.name);
			localStorage.setItem(`${lcfc}File`, result.file);
			goto(`/file/${lcfc}`);
		} else {
			loading = false;
			if (result.value === 'Failed to authenticate.') {
				errorText = 'Invalid file code or password.';
			} else {
				errorText = 'Error: ' + result.value;
			}
			disabled = false;
		}
	}

	async function onsubmit(event: Event) {
		event.preventDefault();
		// lower case file name
		const lcfc = fileCode.toLowerCase();
		signIn(lcfc, true);
	}

	function createFile() {
		goto('/create');
	}

	onMount(() => {
		if (page.url.searchParams.getAll('invalid').length === 1) {
			errorText = 'File not found.';
			window.history.replaceState({}, document.title, '/');
		} else if (page.url.searchParams.getAll('deleted').length === 1) {
			errorText = 'File deleted successfully.';
			window.history.replaceState({}, document.title, '/');
		} else if (page.url.searchParams.getAll('reload').length === 1 && pb.authStore.isValid) {
			signIn(pb.authStore.record?.username, false);
			window.history.replaceState({}, document.title, '/');
		} else {
			const error = page.url.searchParams.getAll('error');
			if (error.length > 0) {
				errorText = 'Error: ' + error[0];
			}
			window.history.replaceState({}, document.title, '/');
		}
	});
</script>

<svelte:head>
	<title>Repaper</title>
</svelte:head>

<h1 class="mt-[18vh] h-[14vh] text-center text-[4em] font-black select-none">Repaper</h1>
<p class="text-center font-bold text-red-500">
	<span class="text-transparent">m</span>{errorText}<span class="text-transparent">m</span>
</p>
{#if loading}
	<p class="text-center font-bold text-[#00bfff]">Loading...</p>
{:else}
	<div class="text-center">
		{#if !loading}
			<div class="mt-[11vh]">
				<form {onsubmit} class="m-auto block w-fit align-middle">
					<Label
						for="fileCode"
						class="ml-0.5 text-lg font-bold {disabled ? 'text-neutral-600' : ''}"
						>Existing File Code & Password:</Label
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
			</div>
            <hr class="my-[5vh] w-[50vw] m-auto">
		    <Button onclick={createFile} class="text-md h-12">Create File</Button>
		{/if}
	</div>
{/if}

<style>
	h1 {
		text-shadow:
			0 0 10px #00bfff,
			0 0 20px #00bfff,
			0 0 30px #00bfff;
	}
</style>
