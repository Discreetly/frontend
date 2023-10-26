import { postInviteCode } from '$lib/services/server';
import { configStore } from '$lib/stores';
import type { GatewayResultI } from '$lib/types';
import { handleGatewayRequest } from './gatewayProcessor';

export async function inviteCode(newCode: string): Promise<GatewayResultI> {
	const result = await handleGatewayRequest({ code: newCode.toLowerCase() }, postInviteCode);
	configStore.update((store) => {
		store['signUpStatus']['inviteCode'] = '';
		return store;
	});
	return result;
}
