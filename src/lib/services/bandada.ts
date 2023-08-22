import type { MerkleProof } from 'rlnjs';
import type { BandadaGroupI } from 'discreetly-interfaces';
import { get } from './api';

// https://api.bandada.pse.dev/groups/{group}/members/{member}/proof
export function getMerkleProof(
	bandadaGroup: BandadaGroupI,
	identityCommitment: string | bigint
): Promise<MerkleProof> {
	const endpoint = `groups/${bandadaGroup.groupID}/members/${identityCommitment}/proof`;
	return get([bandadaGroup.url, endpoint])
		.then((res) => {
			return res as MerkleProof;
		})
		.catch((err) => {
			return Promise.reject(new Error(err));
		});
}
