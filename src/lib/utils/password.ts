import { deriveKey, hashPassword } from '$lib/crypto/crypto';
import { get, writable } from 'svelte/store';
import { configStore, identityKeyStore, identityStore, keyStore } from '$lib/stores';
import { doesIdentityExist, encryptIdentity } from './identity';
import type { IdentityStoreI } from '$lib/types';

export async function setPassword(password: string): Promise<'success' | string> {
	const hashedPassword = await hashPassword(password);
	let identity: IdentityStoreI | undefined;
	if (hashedPassword !== null) {
		const idStatus = doesIdentityExist();
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
		 * STAGE2: ENCRYPT EVERYTHING
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
		 * STAGE3: SET PASSWORD HASH
		 ******************************/
		configStore.update((config) => {
			config.hashedPwd = hashedPassword;
			return config;
		});
		/******************************
		 * STAGE4: Derive Key
		 * ******************************/
		keyStore.set(await deriveKey(password));
		return 'success';
	}
	return 'error';
}
