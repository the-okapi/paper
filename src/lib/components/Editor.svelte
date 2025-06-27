<script lang="ts">
    import { keydown, onkeyup, getText } from '$lib/keybindManager';
    let text = $state(getText());

    function onkeydown(event: KeyboardEvent) {
        keydown(event);
        text = getText();
    }

    function oncontextmenu(event: Event) {
        event.preventDefault();
    }
    
    function ondblclick(event: Event) {
        event.preventDefault();
    }
</script>

<svelte:window
    {onkeydown}
    {onkeyup}
    {oncontextmenu}
    {ondblclick}
/>

<pre>{@html text}<span class="cursor">|</span></pre>

<style>
    pre {
        font-family: sans-serif;
    }
    .cursor {
        color: red;
    }
</style>