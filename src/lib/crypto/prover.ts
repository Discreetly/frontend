import { RLNProver } from 'rlnjs';
import { Group } from '@semaphore-protocol/group';
import getMessageHash from './messageHasher';
import getRateCommitmentHash from './rateCommitmentHasher';
import type { Identity } from '@semaphore-protocol/identity';
import type { MessageI } from 'discreetly-interfaces';
import type { IdentityStoreI, RoomI } from '$lib/types';
import type { RLNFullProof, MerkleProof } from 'rlnjs';
import { getMerkleProof } from '$lib//services/bandada';
import { updateRooms } from '$lib/utils';
import { get } from 'svelte/store';
import { selectedServer, roomsStore } from '$lib/stores';

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

async function merkleProofFromRoom(roomId: string, RLN_IDENIFIER: bigint, rateCommitment: bigint) {
	await updateRooms(get(selectedServer), [String(roomId)]);
	const roomFromStore = get(roomsStore)[roomId];
	const identities = roomFromStore.identities ? roomFromStore.identities.map((i) => BigInt(i)) : [];
	const group = new Group(RLN_IDENIFIER, 20, identities);
	return group.generateMerkleProof(group.indexOf(rateCommitment));
}

async function genProof(
	room: RoomI,
	message: string,
	identity: IdentityStoreI,
	messageId: bigint | number = 0,
	messageLimit: bigint | number = 1
): Promise<MessageI> {
	console.log(room, message, identity);
	const RLN_IDENIFIER = BigInt(room.roomId);
	const userMessageLimit = BigInt(messageLimit);
	const messageHash: bigint = getMessageHash(message);
	console.log(identity);
	const rateCommitment: bigint = getRateCommitmentHash(
		BigInt(identity._commitment),
		userMessageLimit
	);
	const roomId = typeof room.roomId === 'bigint' ? room.roomId.toString() : String(room.roomId);
	let merkleProof: MerkleProof;
	switch (room.membershipType) {
		case 'identities':
			merkleProof = await merkleProofFromRoom(roomId, RLN_IDENIFIER, rateCommitment);
			break;
		case 'bandada':
			if (room.bandadaAddress === undefined) throw new Error('Bandada address not defined');
			merkleProof = await getMerkleProof(room.bandadaAddress, rateCommitment);
			throw new Error('Bandada not implemented yet');
		case 'rln-contract':
			//TODO
			throw new Error('RLN contracts not implemented yet');
		default:
			throw new Error('Invalid room membership type');
	}

	const proofInputs: proofInputsI = {
		rlnIdentifier: RLN_IDENIFIER,
		identitySecret: BigInt(identity._secret),
		userMessageLimit: userMessageLimit,
		messageId: BigInt(messageId),
		merkleProof: merkleProof,
		x: messageHash,
		epoch: BigInt(Date.now().toString())
	};
	//console.debug('PROOFINPUTS:', proofInputs);
	return prover.generateProof(proofInputs).then((proof: RLNFullProof) => {
		console.log('Proof generated!');
		const msg: MessageI = {
			id: proof.snarkProof.publicSignals.nullifier.toString(),
			message: message,
			roomId: RLN_IDENIFIER,
			proof
		};
		return msg;
	});
}

export { genProof };
