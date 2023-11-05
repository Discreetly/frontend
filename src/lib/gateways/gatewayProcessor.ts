import { alertQueue, configStore, selectedServer, identityExists } from '$lib/stores';
import type { GatewayResultI, JoinResponseI } from '$lib/types';
import { getCommitment, updateRooms } from '$lib/utils';
import { get } from 'svelte/store';

export async function handleGatewayRequest<T>(
	data: T,
	apiFunction: (server: string, data: T & { idc: string }) => Promise<JoinResponseI>
): Promise<GatewayResultI> {
	const server = get(selectedServer);
	const idcExists = get(identityExists);

	if (idcExists === 'encrypted') {
		alertQueue.enqueue(`Please Unlock your identity`, 'error');
		return null;
	}

	const idc = getCommitment();
	if (!idc) {
		alertQueue.enqueue(`Please Create an Identity`, 'error');
		return null;
	}
	let result;
	try {
		result = (await apiFunction(server, { ...data, idc })) as JoinResponseI;
		console.debug('GATEWAY RESPONSE: ', result);
		let acceptedRoomNames: string[];
		if (!result.status) {
			alertQueue.enqueue('Error joining room, no status given', 'error');
			console.warn(result);
			return null;
		}
		switch (result.status) {
			case 'valid':
				acceptedRoomNames = await updateRooms(server, result.roomIds);
				configStore.update((store) => {
					store['signUpStatus']['completedSignup'] = true;
					return store;
				});
				alertQueue.enqueue(`Accepted into ${acceptedRoomNames}`, 'success');
				return acceptedRoomNames;
			case 'already-added':
				alertQueue.enqueue('Already added to room', 'error');
				break;
			default:
				alertQueue.enqueue(result.message, 'error');
				break;
		}
		return null;
	} catch (e) {
		alertQueue.enqueue(`Error joining room: ${e}`, 'error');
		return null;
	}
}
