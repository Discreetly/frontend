import { get } from 'svelte/store';
import {
	alertQueue,
	configStore,
	identityKeyStore,
	identityStore,
	identityExists,
	keyStore,
	lockStateStore
} from '../stores';
import { Identity } from '@semaphore-protocol/identity';
import type { IdentityStoreI } from '$lib/types';

export function createIdentity(regenerate = false): 'created' | 'exists' | 'unsafe' | 'error' {
	const identityStatus = get(identityExists);
	console.log(identityStatus);
	if (!get(identityExists) || regenerate) {
		console.debug('Creating identity');
		const identity = new Identity() as unknown as IdentityStoreI;
		const config = get(configStore);
		const lockState = get(lockStateStore);
		if (config.hashedPwd && config.hashedPwd.length > 0) {
			if (lockState === 'unlocked') {
				try {
					identityKeyStore.set(identity);
					if (get(identityExists) === 'safe') {
						alertQueue.enqueue('Identity Created! Congrats on your new journey');
						return 'created';
					} else {
						alertQueue.enqueue('Error creating identity');
						return 'error';
					}
				} catch (e) {
					alertQueue.enqueue(`Error creating identity: ${e}`);
					return 'error';
				}
			} else {
				alertQueue.enqueue('Unlock your account by clicking on the lock');
				return 'error';
			}
		} else {
			alertQueue.enqueue(
				'For your security please set a password with /password or click on the lock in the corner'
			);
			identityStore.set(identity);
			return 'unsafe';
		}
	} else {
		alertQueue.enqueue('Identity already exists');
		return 'exists';
	}
}

export function getIdentity(): IdentityStoreI | null {
	const decryptedIdentity = get(identityKeyStore) as unknown as IdentityStoreI;

	if (decryptedIdentity._commitment) {
		console.log(decryptedIdentity);
		return decryptedIdentity;
	} else {
		const identity = get(identityStore);
		if (identity._commitment?.length > 0) {
			alertQueue.enqueue('Identity not encrypted, set a password!');
			return identity;
		} else {
			alertQueue.enqueue('Identity not created, create an identity!');
		}
	}
	return null;
}

export function getCommitment(): string | null {
	const id = getIdentity();
	if (id) {
		return id._commitment;
	} else {
		return null;
	}
}

export function getIdentityBackup(): string | null {
	const id = getIdentity();
	if (id) {
		return JSON.stringify(id);
	} else {
		return null;
	}
}

export function encryptIdentity(identity: IdentityStoreI) {
	const key = get(keyStore);
	if (key !== undefined && key !== null) {
		identityKeyStore.set(identity as unknown as IdentityStoreI);
		identityStore.set({} as unknown as IdentityStoreI);
	}
}
