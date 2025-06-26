const textToAdd: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K',
    'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'l', 'm', 'n', 'o', 'p',
    'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5',
    '6', '7', '8', '9', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-',
    '+', '[', '{', ']', '}', '\\', '|', ';', ':', '\'', '"', ',', '<', '.', '>',
    '/', '?'];

let text = "";

export function keydown(event: KeyboardEvent) {
    if (textToAdd.includes(event.key)) {
        text += event.key;
    }
    event.preventDefault();
}

export function onkeyup(event: KeyboardEvent) {

}

export function getText() {
    return text;
}