<script lang="ts">
    import { Input, Label, Button } from '$lib/components';

    let fileCode = $state('');

    function onsubmit(event: Event) {
        event.preventDefault()
    }
</script>

<h1 class="mt-[13%] text-center text-[4em] font-black">Repaper</h1>

<form {onsubmit} class="block m-auto mt-[7%] w-fit align-middle">
    <Label for="fileCode" class="ml-0.5 text-lg font-bold">File Code:</Label>
    <div class="mt-1 flex">
        <Input id="fileCode" bind:value={fileCode} type="text" />
        <Button type="submit" class="ml-2 h-12 text-md">Go</Button>
    </div>
</form>

<style>
    h1 {
		text-shadow:
			0 0 10px #00bfff,
			0 0 20px #00bfff,
			0 0 30px #00bfff;
	}
</style>