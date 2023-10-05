import { get } from 'svelte/store';
import { identityKeyStore, identityKeyStoreDecrypted, identityStore, keyStore } from '../stores';
import { Identity } from '@semaphore-protocol/identity';
import type { IdentityStoreI } from '$lib/types';
import { encrypt } from '$lib/crypto/crypto';

export function createIdentity(regenerate = false) {
	if (!get(identityKeyStoreDecrypted)?._commitment || regenerate) {
		console.debug('Creating identity');
		try {
			identityKeyStore.set(JSON.stringify(new Identity()));
			if (identityKeyStoreDecrypted !== null) {
				console.log('Identity Created! Congrats on your new journey');
				return 'created';
			} else {
				console.error('Error creating identity');
				return 'error';
			}
		} catch (e) {
			console.error(`Error creating identity: ${e}`);
			return 'error';
		}
	} else {
		console.warn('Identity already exists');
		return 'exists';
	}
}

export function getIdentity(): IdentityStoreI {
	const decryptedIdentity = get(identityKeyStoreDecrypted) as unknown as IdentityStoreI;
	if (decryptedIdentity !== null) {
		return decryptedIdentity;
	} else {
		const identity = get(identityStore);
		if (identity !== null) {
			console.warn('Identity not encrypted, set a password!');
			return identity;
		} else {
			console.warn('Identity not created, create an identity!');
		}
	}
	throw new Error('Identity not created');
}

export function getCommitment() {
	const id = get(identityKeyStoreDecrypted);
	const id_old = get(identityStore);
	if (id !== null && id !== undefined) {
		return id._commitment;
	}
	if (id_old !== null && id_old !== undefined) {
		console.warn('PLEASE ADD A PASSWORD!');
		return id_old._commitment;
	}
}

export function getIdentityBackup() {
	const id = get(identityKeyStoreDecrypted);
	const id_old = get(identityStore);
	if (id !== null && id !== undefined) {
		return JSON.stringify(id);
	}
	if (id_old !== null && id_old !== undefined) {
		console.warn('PLEASE ADD A PASSWORD!');
		return JSON.stringify(id_old);
	}
}

export function doesIdentityExist(): boolean {
	const id = get(identityKeyStoreDecrypted);
	const id_old = get(identityStore);
	if (id !== null && id !== undefined) {
		return true;
	}
	if (id_old !== null && id_old !== undefined) {
		console.warn('PLEASE ADD A PASSWORD');
		return true;
	}
	return false;
}

export function encryptIdentity(identity: Identity) {
	const key = get(keyStore);
	if (key !== undefined && key !== null) {
		encrypt(
			JSON.stringify({
				_commitment: identity['_commitment'],
				_nullifier: identity['_nullifier'],
				_trapdoor: identity['_trapdoor'],
				_secret: identity['_secret']
			}),
			key
		).then((data) => {
			if (data !== null) {
				identityKeyStore.set(data);
			}
		});
		identityStore.set({
			_commitment: '',
			_trapdoor: '',
			_nullifier: '',
			_secret: ''
		});
	}
}
