import { get } from 'svelte/store';
import { identityStore } from '../stores';
import { Identity } from '@semaphore-protocol/identity';
import type { IdentityStoreI } from '$lib/types';

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

export function getIdentity(): IdentityStoreI {
	return get(identityStore) as unknown as IdentityStoreI;
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
