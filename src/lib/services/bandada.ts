import type { MerkleProof } from 'rlnjs';
import { get } from './api';

// https://api.bandada.pse.dev/groups/{group}/members/{member}/proof
export function getMerkleProof(
	bandadaServerAddress: string,
	groupId: string,
	identityCommitment: string | bigint
): Promise<MerkleProof> {
	const endpoint = `groups/${groupId}/members/${identityCommitment}/proof`;
	return get([bandadaServerAddress, endpoint])
		.then((res) => {
			return res as MerkleProof;
		})
		.catch((err) => {
			return Promise.reject(new Error(err));
		});
}
