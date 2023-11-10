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
	commitment: bigint,
	admin = false
) {
	const roomFromStore = get(roomsStore)[roomId];
	let identities: bigint[];
	try {
		if (admin) {
			identities = roomFromStore.adminIdentities
				? roomFromStore.adminIdentities.map((i) => {
						// This removes any non-numeric characters from the string
						// In particular there was a bug where the `n` at the end of a bigint wasn't removed and it wasn't parsing correctly.
						return BigInt(String(i).replace(/\D/g, ''));
				  })
				: [];
		} else {
			identities = roomFromStore.identities
				? roomFromStore.identities.map((i) => {
						// This removes any non-numeric characters from the string
						// In particular there was a bug where the `n` at the end of a bigint wasn't removed and it wasn't parsing correctly.
						return BigInt(String(i).replace(/\D/g, ''));
				  })
				: [];
		}
	} catch (err) {
		console.debug(roomFromStore.identities);
		throw new Error('Could not parse identities from room');
	}
	const group = new Group(RLN_IDENIFIER, 20, identities);
	let mp: MerkleProof;
	try {
		mp = group.generateMerkleProof(group.indexOf(commitment));
	} catch (err1: unknown) {
		console.error((err1 as Error).message);
		throw new Error('Could not generate Merkle Proof with Rate Commitment');
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
	messageLimit: bigint | number,
	admin = false
): Promise<MessageI> {
	const roomId = typeof room.roomId === 'bigint' ? room.roomId.toString() : String(room.roomId);
	await updateRooms(get(selectedServer), [roomId]);
	room = get(roomsStore)[roomId];
	const RLN_IDENTIFIER = BigInt(roomId);
	const userMessageLimit = BigInt(messageLimit);
	const identitySecret = BigInt(identity._secret);
	const identityCommitment = BigInt(identity._commitment);
	const messageHash: bigint = calculateSignalHash(JSON.stringify(message));
	const rateCommitment: bigint = getRateCommitmentHash(identityCommitment, userMessageLimit);
	const commitment = admin ? identityCommitment : rateCommitment;

	let merkleProof: MerkleProof;
	switch (room.membershipType) {
		case 'IDENTITY_LIST':
			merkleProof = await merkleProofFromRoom(roomId, RLN_IDENTIFIER, commitment);
			break;
		case 'BANDADA_GROUP':
			// TODO! CHECK IF ADMIN, if so use MerkleProofFromRoom
			if (room.bandadaAddress === undefined) throw new Error('Bandada address not defined');
			try {
				merkleProof = await getMerkleProof(room.bandadaAddress, room.bandadaGroupId!, commitment);
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
		rlnIdentifier: RLN_IDENTIFIER,
		identitySecret: identitySecret,
		userMessageLimit: userMessageLimit,
		messageId: BigInt(messageId),
		merkleProof: merkleProof,
		x: messageHash,
		epoch: BigInt(epoch)
	};
	console.info(
		`Generating proof: epoch ${epoch}, message ID ${messageId}, message hash ${messageHash}`
	);
	return prover.generateProof(proofInputs).then((proof: RLNFullProof) => {
		console.log('Proof generated!');
		const msg: MessageI = {
			messageId: proof.snarkProof.publicSignals.nullifier.toString(),
			message: message,
			roomId: RLN_IDENTIFIER,
			proof,
			epoch
		};
		return msg;
	});
}

export { genProof };
