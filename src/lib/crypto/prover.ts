import { RLNProver } from 'rlnjs';
import { Group } from '@semaphore-protocol/group';
import getMessageHash from './messageHasher';
import getRateCommitmentHash from './rateCommitmentHasher';
import type { Identity } from '@semaphore-protocol/identity';
import type { MessageI } from 'discreetly-interfaces';
import type { RoomI } from '$lib/types';
import type { RLNFullProof, MerkleProof } from 'rlnjs';
import { getMerkleProof } from '$lib//services/bandada';

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

async function genProof(
	room: RoomI,
	message: string,
	identity: Identity,
	messageId: bigint | number = 0,
	messageLimit: bigint | number = 1
): Promise<MessageI> {
	console.log(room, message, identity);
	const RLN_IDENIFIER = BigInt(room.roomId);
	const userMessageLimit = BigInt(messageLimit);
	const messageHash: bigint = getMessageHash(message);
	const rateCommitment: bigint = getRateCommitmentHash(identity.getCommitment(), userMessageLimit);
	let group: Group;
	let merkleProof: MerkleProof;
	switch (room.membershipType) {
		case 'identities':
			const identities = await getRoomIdentities(room.roomId);
			group = new Group(RLN_IDENIFIER, 20, identities);
			merkleProof = group.generateMerkleProof(group.indexOf(rateCommitment));
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
		identitySecret: identity.getSecret(),
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
