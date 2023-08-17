import { get } from 'svelte/store';
import { identityStore } from '../stores';
import { Identity } from '@semaphore-protocol/identity';

export function createIdentity(regenerate = false) {
	console.log('Creating identity');
	if (!get(identityStore) || regenerate) {
		identityStore.set(JSON.parse(new Identity().toString()));
		return 'created';
	} else {
		console.warn('Identity already exists');
		return 'exists';
	}
}
