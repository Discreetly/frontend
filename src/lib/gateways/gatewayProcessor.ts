import { alertQueue, configStore, selectedServer, identityExists } from '$lib/stores';
import type { JoinResponseI, GatewayResultI } from '$lib/types';
import { getCommitment, updateRooms } from '$lib/utils';
import { get } from 'svelte/store';

export async function handleGatewayRequest<T>(
	data: T,
	apiFunction: (server: string, data: T & { idc: string }) => Promise<JoinResponseI>
): Promise<GatewayResultI> {
	const server = get(selectedServer);
	const idcExists = get(identityExists);

	if (idcExists === 'encrypted') {
		return {
			acceptedRoomNames: undefined,
			err: { status: 'unlock', message: 'Please unlock your identity' }
		};
	}

	const idc = getCommitment();
	if (!idc) {
		return {
			acceptedRoomNames: undefined,
			err: { status: 'no-idc', message: 'No identity commitment found' }
		};
	}

	try {
		const result = (await apiFunction(server, { ...data, idc })) as JoinResponseI;
		console.debug('GATEWAY RESPONSE: ', result);

		let acceptedRoomNames: string[] = [];
		let err: GatewayResultI['err'] = undefined;

		switch (result.status) {
			case 'valid':
				acceptedRoomNames = await updateRooms(server, result.roomIds);
				configStore.update((store) => {
					store['signUpStatus']['completedSignup'] = true;
					return store;
				});
				break;
			case 'already-added':
				err = { status: 'already-added', message: 'You are already a member of this room.' };
				break;
			default:
				err = { status: 'err', message: 'Invalid gateway input.' };
				break;
		}

		return { acceptedRoomNames, err };
	} catch (e) {
		alertQueue.enqueue(`Error joining room: ${e}`, 'error');
		return {
			acceptedRoomNames: undefined,
			err: { status: 'err', message: String((e as Error).message) }
		};
	}
}
