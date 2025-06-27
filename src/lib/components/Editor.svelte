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

<p>{text}<span style="color: red; width: 99vw;">|</span></p>