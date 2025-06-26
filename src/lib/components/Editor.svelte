<script lang="ts">
    import { keydown, onkeyup, getText } from '$lib/keybindManager';
    let text = $state(getText());

    function onkeydown(event: KeyboardEvent) {
        keydown(event);
        text = getText();
    }
</script>

<svelte:window
    {onkeydown}
    {onkeyup}
/>

<p>{@html text}<span style="color: red">|</span></p>