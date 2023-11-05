import { postJubmojis } from '$lib/services/server';
import { configStore } from '$lib/stores';
import type { GatewayResultI, JubmojiProofI } from '$lib/types';
import { handleGatewayRequest } from './gatewayProcessor';

export async function jubmojiRequest(proof: JubmojiProofI): Promise<GatewayResultI> {
	const result = await handleGatewayRequest({ proof }, postJubmojis);
	if (result) {
		configStore.update((store) => {
			store['signUpStatus']['jubmojiProof'] = undefined;
			return store;
		});
	}
	return result;
}
