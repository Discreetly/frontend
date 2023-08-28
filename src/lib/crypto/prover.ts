import { RLNProver } from 'rlnjs';
import { Group } from '@semaphore-protocol/group';
import type { MessageI, MessageInterfaces } from 'discreetly-interfaces';
import type { IdentityStoreI, RoomI } from '$lib/types';
import type { RLNFullProof, MerkleProof } from 'rlnjs';
import { getMerkleProof } from '$lib//services/bandada';
import { updateRooms } from '$lib/utils';
import { get } from 'svelte/store';
import { selectedServer, roomsStore } from '$lib/stores';
import { calculateSignalHash } from 'discreetly-interfaces';
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
	let identities: bigint[];
	try {
		identities = roomFromStore.identities
			? roomFromStore.identities.map((i) => {
					// This removes any non-numeric characters from the string
					// In particular there was a bug where the `n` at the end of a bigint wasn't removed and it wasn't parsing correctly.
					return BigInt(String(i).replace(/\D/g, ''));
			  })
			: [];
	} catch (err) {
		console.debug(roomFromStore.identities);
		throw new Error('Could not parse identities from room');
	}
	const group = new Group(RLN_IDENIFIER, 20, identities);
	let mp: MerkleProof;
	try {
		mp = group.generateMerkleProof(group.indexOf(rateCommitment));
	} catch (err1: unknown) {
		console.warn((err1 as Error).message);
		console.warn('Could not generate Merkle Proof with Rate Commitment');
		try {
			mp = group.generateMerkleProof(group.indexOf(identityCommitment));
		} catch (err: unknown) {
			console.error((err as Error).message);
			console.table(identities);
			console.debug('Rate Commitment:', rateCommitment);
			console.debug('Identity Commitment:', identityCommitment);
			throw new Error('Could not generate Merkle Proof with Identity Commitment');
		}
	}
	return mp;
}

/**
 *
 * @param {RoomI} room
 * @param {MessageInterfaces} message
 * @param {IdentityStoreI} identity
 * @param {bigint | number} epoch
 * @param {number} messageId
 * @param {number} messageLimit
 * @returns Message with proof attached
 */
async function genProof(
	room: RoomI,
	message: MessageInterfaces,
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
	const messageHash: bigint = calculateSignalHash(JSON.stringify(message));
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
			try {
				merkleProof = await getMerkleProof(
					room.bandadaAddress,
					room.bandadaGroupId!,
					rateCommitment
				);
				break;
			} catch (err) {
				throw new Error('GetMerkleProof failed' + err);
			}
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
	console.info(
		`Generating proof: epoch ${epoch}, message ID ${messageId}, message hash {messageHash}`
	);
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
