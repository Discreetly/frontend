import { get } from 'svelte/store';
import { identityStore } from '../stores';
import { Identity } from '@semaphore-protocol/identity';
import type { IdentityStoreI } from '$lib/types';

export function createIdentity(regenerate = false) {
	if (!get(identityStore)._commitment || regenerate) {
		console.log('Creating identity');
		const id = new Identity() as unknown as IdentityStoreI;
		identityStore.set(id);
		return 'created';
	} else {
		console.warn('Identity already exists');
		return 'exists';
	}
}

export function getIdentity() {
	return get(identityStore) as unknown as Identity;
}

export function getCommitment() {
	return get(identityStore)._commitment;
}

export function getIdentityBackup() {
	return getIdentity().toString();
}

export function doesIdentityExist(): boolean {
	return !!get(identityStore)._commitment;
}
