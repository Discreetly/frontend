/* eslint-disable @typescript-eslint/no-explicit-any */
import { writable, get } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { keyStore } from '.';
import { decrypt, encrypt } from '$lib/crypto/crypto';

export function storable<Type>(data: Type, localStorageKey: string): Writable<Type> {
	const store = writable<Type>(data);
	const { subscribe, set } = store;
	const isBrowser = typeof window !== 'undefined';

	if (isBrowser && localStorage[localStorageKey] !== undefined) {
		const storedValue = localStorage.getItem(localStorageKey);
		if (storedValue) {
			try {
				set(JSON.parse(storedValue) as Type);
			} catch (e) {
				console.warn(`Error reading local storage for key: ${localStorageKey}; ${e}`);
			}
		}
	}

	return {
		subscribe,
		set: (value: Type) => {
			if (isBrowser) {
				localStorage[localStorageKey] = JSON.stringify(value);
			}
			set(value);
		},
		update: (callBack: (value: Type) => Type) => {
			const updatedStore = callBack(get(store));
			if (isBrowser) {
				localStorage[localStorageKey] = JSON.stringify(updatedStore);
			}
			set(updatedStore);
		}
	};
}

export function sessionable<Type>(data: Type, sessionStorageKey: string): Writable<Type> {
	const store = writable<Type>(data);
	const { subscribe, set } = store;
	const isBrowser = typeof window !== 'undefined';

	if (isBrowser && sessionStorage[sessionStorageKey] !== undefined) {
		const storedValue = sessionStorage.getItem(sessionStorageKey);
		if (storedValue) {
			try {
				set(JSON.parse(storedValue) as Type);
			} catch (e) {
				console.warn(`Error reading local storage for key: ${sessionStorageKey}; ${e}`);
			}
		}
	}

	return {
		subscribe,
		set: (newvalue: Type) => {
			if (isBrowser) {
				sessionStorage[sessionStorageKey] = JSON.stringify(newvalue);
			}
			set(newvalue);
		},
		update: (callBack: (value: Type) => Type) => {
			const updatedStore = callBack(get(store));

			if (isBrowser) {
				sessionStorage[sessionStorageKey] = JSON.stringify(updatedStore);
			}
			set(updatedStore);
		}
	};
}

export function encryptable<Type>(data: Type, localStorageKey: string): Writable<Type> {
	const store = writable<Type>(data);
	const { subscribe, set } = store;
	const isBrowser = typeof window !== 'undefined';

	if (isBrowser && localStorage.getItem(localStorageKey) !== null) {
		const storedValue = localStorage.getItem(localStorageKey);
		if (storedValue) {
			try {
				const key = get(keyStore);
				if (!key) {
					throw new Error('Key store not initialized, cannot encrypt data');
				}
				console.debug('Encryptable State: ', storedValue, key);
				decrypt(storedValue, key).then((decryptedData) => {
					if (decryptedData !== null) {
						set(JSON.parse(decryptedData) as Type);
					} else {
						console.error('Error decrypting data');
					}
				});
			} catch (e) {
				console.warn(`Error reading local storage for key: ${localStorageKey}; ${e}`);
			}
		}
	}

	return {
		subscribe,
		set: async (value: Type) => {
			const key = get(keyStore);
			if (!key) {
				throw new Error('Key store not initialized, cannot encrypt data');
			}
			encrypt(JSON.stringify(value), key).then((encryptedData) => {
				if (encryptedData !== null) {
					if (isBrowser) {
						localStorage.setItem(localStorageKey, encryptedData);
					}
					set(value);
				} else {
					console.error('Error encrypting data');
				}
			});
		},
		update: async (callback: (value: Type) => Type) => {
			const updatedStore = callback(get(store));
			const key = get(keyStore);
			if (!key) {
				throw new Error('Key store not initialized, cannot encrypt data');
			}
			encrypt(JSON.stringify(updatedStore), key).then((encryptedData) => {
				if (encryptedData !== null) {
					if (isBrowser) {
						localStorage.setItem(localStorageKey, encryptedData);
					}
					set(updatedStore);
				} else {
					console.error('Error encrypting data');
				}
			});
		}
	};
}
