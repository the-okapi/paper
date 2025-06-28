// characters that if pressed on keyboard will be added to the text
const textToAdd: string[] = [
	'A',
	'B',
	'C',
	'D',
	'E',
	'F',
	'G',
	'H',
	'I',
	'J',
	'K',
	'L',
	'M',
	'N',
	'O',
	'P',
	'Q',
	'R',
	'S',
	'T',
	'U',
	'V',
	'W',
	'X',
	'Y',
	'Z',
	'a',
	'b',
	'c',
	'd',
	'e',
	'f',
	'g',
	'h',
	'i',
	'j',
	'k',
	'l',
	'm',
	'n',
	'o',
	'p',
	'q',
	'r',
	's',
	't',
	'u',
	'v',
	'w',
	'x',
	'y',
	'z',
	'1',
	'2',
	'3',
	'4',
	'5',
	'6',
	'7',
	'8',
	'9',
	'!',
	'@',
	'#',
	'$',
	'%',
	'^',
	'&',
	'*',
	'(',
	')',
	'-',
	'+',
	'[',
	'{',
	']',
	'}',
	'\\',
	'|',
	';',
	':',
	"'",
	'"',
	',',
	'<',
	'.',
	'>',
	'/',
	'?',
	' '
];

// character with keycodes that are different than their values to can be added to the text
const textToAddCode: string[][] = [
	['Tab', '    '],
	['Enter', '<br>']
];

// the text is made up of tokens which contain the value of each character and its formatting
// token type
type Token = {
	value: string;
	formatting: string[];
};

// list of tokens
let tokens: Token[] = [];

// check if character has different value than keycode
function textCodesIncludes(code: string) {
	// iterate through each item that has a different keycode than value
	for (let i = 0; i < textToAddCode.length; i++) {
		// check if key pressed has a different keycode than value
		if (textToAddCode[i][0] === code) {
			return true;
		}
	}
	return false;
}

// simplify creating token process
function nt(value: string, formatting: string[]) {
	return { value, formatting };
}

function ftw(formatting: boolean[]) {
	let toReturn = [];
	if (formatting[0]) {
		toReturn.push('bold');
	}
	if (formatting[1]) {
		toReturn.push('italic');
	}
	if (formatting[2]) {
		toReturn.push('underline');
	}
	return toReturn;
}

// function ran when key is pressed down
export function keydown(event: KeyboardEvent, formatting: boolean[]) {
	// check if key pressed should be added to the text
	if (textToAdd.includes(event.key)) {
		tokens.push(nt(event.key, ftw(formatting)));
		// check if key pressed has different keycode than value and should be added to the text
	} else if (textCodesIncludes(event.key)) {
		// get value to be added to the text
		const code = textToAddCode.find((symbol) => symbol[0] === event.key) ?? ['', ''];
		tokens.push(nt(code[1], ftw(formatting)));
		// check if key pressed is backspace
	} else if (event.key === 'Backspace') {
		tokens.pop();
	}
}

// return value of text
export function getText() {
	let toReturn = '';
	// iterate through each token
	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		// check if token has no formatting
		if (token.formatting.length === 0) {
			toReturn += token.value;
		} else {
			let before = '';
			let after = '';
			if (token.formatting.includes('bold')) {
				before = '<strong>' + before;
				after += '</strong>';
			}
			if (token.formatting.includes('italic')) {
				before = '<em>' + before;
				after += '</em>';
			}
			if (token.formatting.includes('underline')) {
				before = '<u>' + before;
				after += '</u>';
			}
			toReturn += before + token.value + after;
		}
	}
	return toReturn;
}
