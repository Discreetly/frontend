import { alertQueue, configStore, selectedServer } from '$lib/stores';
import type { JoinResponseI, GatewayResultI } from '$lib/types';
import { getCommitment, updateRooms } from '$lib/utils';
import { get } from 'svelte/store';

export async function handleGatewayRequest<T>(
	data: T,
	apiFunction: (server: string, data: T & { idc: string }) => Promise<JoinResponseI>
): Promise<GatewayResultI> {
	const server = get(selectedServer);
	const idc = getCommitment();
	if (!idc) {
		alertQueue.enqueue('No identity commitment found', 'warning');
		throw new Error('No identity commitment found');
	}

	try {
		const result = (await apiFunction(server, { ...data, idc })) as JoinResponseI;
		console.debug('GATEWAY RESPONSE: ', result);

		let acceptedRoomNames: string[] = [];
		let err: string | undefined;

		switch (result.status) {
			case 'valid':
				console.debug('Updating new rooms');
				acceptedRoomNames = await updateRooms(server, result.roomIds);
				configStore.update((store) => {
					store['signUpStatus']['completedSignup'] = true;
					return store;
				});
				break;
			case 'already-added':
				err = 'You are already a member of this room.';
				break;
			default:
				err = 'Invalid gateway input.';
				break;
		}

		return { acceptedRoomNames, err };
	} catch (e) {
		alertQueue.enqueue(`Error joining room: ${e}`, 'error');
		return { acceptedRoomNames: undefined, err: String((e as Error).message) };
	}
}
