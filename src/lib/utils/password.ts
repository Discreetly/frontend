import { deriveKey, hashPassword } from '$lib/crypto/crypto';
import { get } from 'svelte/store';
import {
	configStore,
	identityKeyStore,
	identityStore,
	keyStore,
	identityExists,
	alertQueue,
	roomKeyStore
} from '$lib/stores';
import { encryptIdentity } from './identity';
import type { IdentityStoreI } from '$lib/types';

export async function setPassword(password: string): Promise<'success' | string> {
	const hashedPassword = await hashPassword(password);
	let identity: IdentityStoreI | undefined;
	if (hashedPassword !== null) {
		const idStatus = get(identityExists);
		/******************************
		 * STAGE1: DECRYPT/STORE EVERYTHING INTO MEMORY
		 ******************************/
		try {
			if (idStatus === 'unsafe') {
				identity = get(identityStore);
			}
			if (idStatus === 'safe') {
				identity = get(identityKeyStore);
			}
		} catch (e) {
			console.error(`Error decrypting: ${e}`);
			return 'Error decrypting data while setting new password';
		}

		/******************************
		 * STAGE2: Derive and set new Key
		 * ******************************/
		keyStore.set(await deriveKey(password));

		/******************************
		 * STAGE3: ENCRYPT EVERYTHING
		 ******************************/
		try {
			if (identity) {
				encryptIdentity(identity);
			}
		} catch (e) {
			console.error(`Error encrypting: ${e}`);
			return 'Error encrypting data while setting new password';
		}
		/******************************
		 * STAGE4: SET PASSWORD HASH
		 ******************************/
		configStore.update((config) => {
			config.hashedPwd = hashedPassword;
			return config;
		});

		return 'success';
	}
	return 'error';
}

export async function unlockPadlock(password: string) {
	const hashedPassword = await hashPassword(password);
	if (get(configStore).hashedPwd == hashedPassword) {
		deriveKey(password).then((key) => {
			keyStore.set(key);
			// There is no reactive way to automatically decrypt
			// encrypted stores, so we have to trigger it manually
			// when the keys are derived
			identityKeyStore.read();
			roomKeyStore.read();
		});
	} else {
		alertQueue.enqueue('Incorrect Password', 'warning');
		keyStore.set(null);
	}
}
