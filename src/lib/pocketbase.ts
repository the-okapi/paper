import PocketBase from 'pocketbase';

export const pb = new PocketBase('https://repaper.pockethost.io/');

export type Result = {
	success: boolean;
	name: string;
	value: string;
	file: string;
};

export async function getFile(username: string, password: string) {
	try {
		await pb.collection('users').authWithPassword(username, password);
		const file = (await pb.collection('files').getFullList())[0];
		return { success: true, name: file.name, value: file.value, file: JSON.stringify(file) };
	} catch (error: any) {
		return { success: false, name: '', value: error.message, file: '' };
	}
}

export async function deleteFilePB(fileStr: string) {
	try {
		const file = JSON.parse(fileStr);
		console.log(file);
		await pb.collection('files').delete(file.id);
		await pb.collection('users').delete(file.viewUser);
		await pb.collection('users').delete(file.editUser);
		return { success: true, error: '' };
	} catch (error: any) {
		return { success: false, error: error.message };
	}
}

export async function saveFile(tokens: string, fileStr: string) {
	try {
		const file = JSON.parse(fileStr);
		await pb.collection('files').update(file.id, {
			value: tokens
		});
		return { success: true, error: '' };
	} catch (error: any) {
		return { success: false, error: error.message };
	}
}
