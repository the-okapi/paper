<script lang="ts">
	import { goto } from '$app/navigation';
	import { Input, Label, Button } from '$lib/components';
	import { ALPHABET } from '$lib/utils';

	let fileCode = $state('');
	let filePassword = $state('');
	let errorText = $state('');

	let loading = $state(false);
	let disabled = $state(false);

	function onsubmit(event: Event) {
		event.preventDefault();
		let lowerCase = fileCode.toLowerCase();
		for (let i = 0; i < lowerCase.length; i++) {
			if (!ALPHABET.includes(lowerCase[i])) {
				errorText = 'File code can only include letters and numbers.';
				return;
			}
		}
		errorText = '';
		loading = true;
		disabled = true;
		//goto(`/${fileCode.toLowerCase()}`);
	}
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
		class="mt-0 w-[24rem] disabled:cursor-default"
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
	<p class="text-center text-red-500">{errorText}</p>
	{#if loading}<p class="text-center font-bold text-[#00bfff]">Loading...</p>{/if}
</form>

<style>
	h1 {
		text-shadow:
			0 0 10px #00bfff,
			0 0 20px #00bfff,
			0 0 30px #00bfff;
	}
</style>
