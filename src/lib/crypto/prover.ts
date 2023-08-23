import { RLNProver } from 'rlnjs';
import { Group } from '@semaphore-protocol/group';
import type { MessageI } from 'discreetly-interfaces';
import type { IdentityStoreI, RoomI } from '$lib/types';
import type { RLNFullProof, MerkleProof } from 'rlnjs';
import { getMerkleProof } from '$lib//services/bandada';
import { updateRooms } from '$lib/utils';
import { get } from 'svelte/store';
import { selectedServer, roomsStore } from '$lib/stores';
import { calculateSignalHash } from './signalHash';
import getRateCommitmentHash from './rateCommitmentHasher';

const wasmPath = '/rln/circuit.wasm';
const zkeyPath = '/rln/final.zkey';
const prover: RLNProver = new RLNProver(wasmPath, zkeyPath);
export default prover;

interface proofInputsI {
	rlnIdentifier: bigint;
	identitySecret: bigint;
	userMessageLimit: bigint;
	messageId: bigint;
	merkleProof: MerkleProof;
	x: bigint;
	epoch: bigint;
}

async function merkleProofFromRoom(
	roomId: string,
	RLN_IDENIFIER: bigint,
	rateCommitment: bigint,
	identityCommitment: bigint
) {
	const roomFromStore = get(roomsStore)[roomId];
	const identities = roomFromStore.identities ? roomFromStore.identities.map((i) => BigInt(i)) : [];
	const group = new Group(RLN_IDENIFIER, 20, identities);
	let mp: MerkleProof;
	try {
		mp = group.generateMerkleProof(group.indexOf(rateCommitment));
	} catch {
		try {
			mp = group.generateMerkleProof(group.indexOf(identityCommitment));
		} catch {
			throw new Error('Could not generate merkle proof');
		}
	}
	return mp;
}

/**
 *
 * @param room
 * @param message
 * @param identity
 * @param epoch
 * @param messageId
 * @param messageLimit
 * @returns Message with proof attached
 */
async function genProof(
	room: RoomI,
	message: string,
	identity: IdentityStoreI,
	epoch: bigint | number,
	messageId: bigint | number,
	messageLimit: bigint | number
): Promise<MessageI> {
	const roomId = typeof room.roomId === 'bigint' ? room.roomId.toString() : String(room.roomId);
	await updateRooms(get(selectedServer), [roomId]);
	room = get(roomsStore)[roomId];
	const RLN_IDENIFIER = BigInt(roomId);
	const userMessageLimit = BigInt(messageLimit);
	const identitySecret = BigInt(identity._secret);
	const identityCommitment = BigInt(identity._commitment);
	const messageHash: bigint = calculateSignalHash(message);
	const rateCommitment: bigint = getRateCommitmentHash(identityCommitment, userMessageLimit);

	let merkleProof: MerkleProof;
	switch (room.membershipType) {
		case 'IDENTITY_LIST':
			merkleProof = await merkleProofFromRoom(
				roomId,
				RLN_IDENIFIER,
				rateCommitment,
				identityCommitment
			);
			break;
		case 'BANDADA_GROUP':
			if (room.bandadaAddress === undefined) throw new Error('Bandada address not defined');
			merkleProof = await getMerkleProof(room.bandadaAddress, rateCommitment);
			throw new Error('Bandada not implemented yet');
		case 'CONTRACT':
			//TODO
			throw new Error('RLN contracts not implemented yet');
		default:
			throw new Error('Invalid room membership type');
	}

	const proofInputs: proofInputsI = {
		rlnIdentifier: RLN_IDENIFIER,
		identitySecret: identitySecret,
		userMessageLimit: userMessageLimit,
		messageId: BigInt(messageId),
		merkleProof: merkleProof,
		x: messageHash,
		epoch: BigInt(epoch)
	};
	//console.debug('PROOFINPUTS:', proofInputs);
	return prover.generateProof(proofInputs).then((proof: RLNFullProof) => {
		console.log('Proof generated!');
		console.debug('PROOF:', proof);
		const msg: MessageI = {
			messageId: proof.snarkProof.publicSignals.nullifier.toString(),
			message: message,
			roomId: RLN_IDENIFIER,
			proof,
			epoch
		};
		return msg;
	});
}

export { genProof };
