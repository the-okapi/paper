<script lang="ts">
    import { keydown, onkeyup, getText } from '$lib/keybindManager';
    import * as ToggleGroup from '$lib/components/ui/toggle-group/index';
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

<main>
    <ToggleGroup.Root>
        <ToggleGroup.Item value="bold" aria-label="Toggle bold">
            <p><strong>B</strong></p>
        </ToggleGroup.Item>
        <ToggleGroup.Item value="italic" aria-label="Toggle italic">
            <p><em>I</em></p>
        </ToggleGroup.Item>
        <ToggleGroup.Item value="underline" aria-label="Toggle undderline">
            <p><u>U</u></p>
        </ToggleGroup.Item>
    </ToggleGroup.Root>
    <pre>{@html text}<span class="cursor">|</span></pre>
</main>

<style>
    pre {
        font-family: sans-serif;
    }
    .cursor {
        color: oklch(0.623 0.214 259.815);
        font-weight: bold;
    }
</style>