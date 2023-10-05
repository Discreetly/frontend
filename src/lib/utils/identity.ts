import { get } from 'svelte/store';
import { configStore, identityKeyStore, identityStore, keyStore } from '../stores';
import { Identity } from '@semaphore-protocol/identity';
import type { IdentityStoreI } from '$lib/types';
import { addConsoleMessage } from './console';

export function createIdentity(regenerate = false): 'created' | 'exists' | 'unsafe' | 'error' {
	const old_id = get(identityKeyStore) as unknown as IdentityStoreI;
	if (!old_id._commitment || regenerate) {
		console.debug('Creating identity');
		const identity = new Identity() as unknown as IdentityStoreI;
		const config = get(configStore);
		const key = get(keyStore);
		if (config.hashedPwd && config.hashedPwd.length > 0) {
			if (key) {
				try {
					identityKeyStore.set(identity);
					if (get(identityKeyStore)._commitment !== null) {
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
				addConsoleMessage(
					'Unlock your identity with /unlock or click on the lock in the corner',
					'error'
				);
				return 'error';
			}
		} else {
			addConsoleMessage(
				'For your security please set a password with /password or click on the lock in the corner',
				'warning'
			);
			identityStore.set(identity);
			return 'unsafe';
		}
	} else {
		console.warn('Identity already exists');
		return 'exists';
	}
}

export function getIdentity(): IdentityStoreI {
	const decryptedIdentity = get(identityKeyStore) as unknown as IdentityStoreI;
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
	const id = get(identityKeyStore) as IdentityStoreI;
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
	const id = get(identityKeyStore);
	const id_old = get(identityStore);
	if (id !== null && id !== undefined) {
		return JSON.stringify(id);
	}
	if (id_old !== null && id_old !== undefined) {
		console.warn('PLEASE ADD A PASSWORD!');
		return JSON.stringify(id_old);
	}
}

export function doesIdentityExist(): 'safe' | 'unsafe' | 'none' {
	const id = get(identityKeyStore);
	const id_old = get(identityStore);
	console.log(id, id_old);
	if (id._commitment !== null && id._commitment !== undefined) {
		return 'safe';
	}
	if (id_old._commitment !== null && id_old._commitment !== undefined) {
		console.warn('PLEASE ADD A PASSWORD');
		return 'unsafe';
	}
	return 'none';
}

export function encryptIdentity(identity: IdentityStoreI) {
	const key = get(keyStore);
	if (key !== undefined && key !== null) {
		identityKeyStore.set(identity as unknown as IdentityStoreI);
		identityStore.set({
			_commitment: '',
			_trapdoor: '',
			_nullifier: '',
			_secret: ''
		});
	}
}
