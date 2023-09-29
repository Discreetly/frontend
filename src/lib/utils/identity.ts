import { get } from 'svelte/store';
import { identityKeyStore, identityKeyStoreDecrypted, identityStore, keyStore } from '../stores';
import { Identity } from '@semaphore-protocol/identity';
import type { IdentityStoreI } from '$lib/types';
import { encryptData } from '$lib/crypto/crypto';

export function createIdentity(regenerate = false) {
	if (!get(identityStore)._commitment || regenerate) {
		console.debug('Creating identity');
		const id = new Identity() as unknown as IdentityStoreI;

		identityStore.set(id);
		console.log('Identity Created! Congrats on your new journey');
		return 'created';
	} else {
		console.warn('Identity already exists');
		return 'exists';
	}
}

export function getIdentity(): IdentityStoreI | null {
	const decryptedIdentity = get(identityKeyStoreDecrypted) as unknown as IdentityStoreI;
	if (decryptedIdentity !== null) {
		return decryptedIdentity;
	} else {
		const identity = get(identityStore);
		if (identity !== null) {
			console.warn('Identity not decrypted, please set a password!');
			return identity;
		} else {
			console.warn('Identity not created, please create an identity!');
		}
	}
	return null;
}

export function getCommitment() {
	return get(identityStore)._commitment;
}

export function getIdentityBackup() {
	return JSON.stringify(get(identityStore));
}

export function doesIdentityExist(): boolean {
	return !!get(identityStore)._commitment;
}

export function encryptIdentity(identity: Identity) {
	const key = get(keyStore);
	if (key !== undefined && key !== null) {
		encryptData(
			JSON.stringify({
				_commitment: identity['_commitment'],
				_nullifier: identity['_nullifier'],
				_trapdoor: identity['_trapdoor'],
				_secret: identity['_secret']
			}),
			key
		).then((data) => {
			identityKeyStore.set(data);
		});
		identityStore.set({
			_commitment: '',
			_trapdoor: '',
			_nullifier: '',
			_secret: ''
		});
	}
}
