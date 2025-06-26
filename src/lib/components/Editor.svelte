<script lang="ts">
    import { keydown, onkeyup, getText } from '$lib/keybindManager';
    let text = $state(getText());

    function onkeydown(event: KeyboardEvent) {
        text = getText();
        keydown(event)
    }
</script>

<svelte:window
    {onkeydown}
    {onkeyup}
/>

<p>{text}</p>