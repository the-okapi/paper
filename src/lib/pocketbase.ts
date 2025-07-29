import PocketBase from 'pocketbase';

export const pb = new PocketBase('https://repaper.pockethost.io/');

export type Result = {
	success: boolean;
	name: string;
	value: string;
};

export async function getFile(username: string, password: string): Promise<Result> {
	try {
		const authData = await pb.collection('users').authWithPassword(username, password);
		const file = (await pb.collection('files').getFullList())[0];
		return { success: true, name: file.name, value: file.value };
	} catch (error: any) {
		return { success: false, name: '', value: error.message };
	}
}
