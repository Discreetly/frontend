import { postTheWord } from '$lib/services/server';
import type { GatewayResultI, SNARKProof } from '$lib/types';
import { handleGatewayRequest } from './gatewayProcessor';

export async function theWordRequest(proof: SNARKProof): Promise<GatewayResultI> {
	return await handleGatewayRequest({ proof }, postTheWord);
}
