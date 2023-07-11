import { RLNProver } from 'rlnjs';
import { Group } from '@semaphore-protocol/group';
import getMessageHash from './messageHasher';
import getRateCommitmentHash from './rateCommitmentHasher';
import type { Identity } from '@semaphore-protocol/identity';
import type { MessageI, RoomI } from 'discreetly-interfaces';
import type { RLNFullProof, MerkleProof } from 'rlnjs';

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

async function genProof(room: RoomI, message: string, identity: Identity): Promise<MessageI> {
	console.log(room, message, identity);
	const userMessageLimit = BigInt(1);
	const messageHash: bigint = getMessageHash(message);
	const group = new Group(room.id, 20, room.membership?.identityCommitments);
	const rateCommitment: bigint = getRateCommitmentHash(identity.getCommitment(), userMessageLimit);
	group.addMember(rateCommitment); // FIXME: This is just a hack to add the user to the group for testing
	const proofInputs: proofInputsI = {
		rlnIdentifier: BigInt(room.id),
		identitySecret: identity.getSecret(),
		userMessageLimit: userMessageLimit,
		messageId: BigInt(0),
		merkleProof: group.generateMerkleProof(group.indexOf(rateCommitment)),
		x: messageHash,
		epoch: BigInt(Date.now().toString())
	};
	//console.debug('PROOFINPUTS:', proofInputs);
	return prover.generateProof(proofInputs).then((proof: RLNFullProof) => {
		console.log('Proof generated!');
		const msg: MessageI = {
			id: proof.snarkProof.publicSignals.nullifier.toString(),
			message: message,
			room: room.id,
			proof
		};
		return msg;
	});
}

export { genProof };
