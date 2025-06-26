const textToAdd: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K',
    'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'l', 'm', 'n', 'o', 'p',
    'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '3', '4', '5',
    '6', '7', '8', '9', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-',
    '+', '[', '{', ']', '}', '\\', '|', ';', ':', '\'', '"', ',', '<', '.', '>',
    '/', '?', ' '];

const textToAddCode: string[][] = [
    ['Tab', '   '],
    ['Enter', '<br>']
]

let text = "";

function textCodesIncludes(code: string) {
    for (let i = 0; i < textToAddCode.length; i++) {
        if (textToAddCode[i][0] === code) {
            return true;
        }
    }
    return false;
}

export function keydown(event: KeyboardEvent) {
    if (textToAdd.includes(event.key)) {
        text += event.key;
    } else if (textCodesIncludes(event.key)) {
        text += (textToAddCode.find(a => a[0] === event.key) || ['', ''])[1];
    } else if (event.key === 'Backspace') {
        text = text.slice(0, -1)
    }
    event.preventDefault();
}

export function onkeyup(event: KeyboardEvent) {

}

export function getText() {
    return text;
}