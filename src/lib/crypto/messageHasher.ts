import { poseidon1 } from 'poseidon-lite/poseidon1';
import { str2BigInt } from 'discreetly-interfaces';

function getMessageHash(message: string) {
	return poseidon1([str2BigInt(message)]);
}

export default getMessageHash;
