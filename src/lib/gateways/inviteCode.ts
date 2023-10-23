import { getCommitment, updateRooms } from '$lib/utils/';
import { postInviteCode } from '$lib/services/server';
import { selectedServer, configStore, alertQueue } from '$lib/stores';
import { get } from 'svelte/store';
import type { JoinResponseI } from '$lib/types';

export async function inviteCode(newCode: string) {
	let acceptedRoomNames: string[] = [];
	let err: string | undefined;
	const server = get(selectedServer);
	try {
		const idc = getCommitment();
		if (!idc) {
			alertQueue.enqueue('No identity commitment found', 'warning');
			throw new Error('No identity commitment found');
		}
		const result = (await postInviteCode(server, {
			code: newCode.toLowerCase(),
			idc
		})) as JoinResponseI;
		console.debug('INVITE CODE RESPONSE: ', result);
		if (result.status == 'valid' || result.status == 'already-added') {
			console.debug('Updating new rooms');
			acceptedRoomNames = await updateRooms(server, result.roomIds);
			console.log(`Added to rooms: ${acceptedRoomNames}`);
			configStore.update((store) => {
				store['signUpStatus']['completedSignup'] = true;
				store['signUpStatus']['inviteCode'] = '';
				return store;
			});
			return { acceptedRoomNames, undefined };
		} else {
			err = 'Invalid invite code.';
		}
	} catch (e) {
		err = String((e as Error).message);
	}
	return { acceptedRoomNames, err };
}
