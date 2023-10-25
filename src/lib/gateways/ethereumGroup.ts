import { postEthereumSignature } from '$lib/services/server';
import type { GatewayResultI } from '$lib/types';
import { handleGatewayRequest } from './gatewayProcessor';

export async function ethereumGroupRequest(
	message: string,
	signature: string
): Promise<GatewayResultI> {
	return await handleGatewayRequest({ message, signature }, postEthereumSignature);
}
