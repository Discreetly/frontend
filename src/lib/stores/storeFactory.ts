/* eslint-disable @typescript-eslint/no-explicit-any */
import { writable, get } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { keyStore, lockStateStore } from '.';
import { decrypt, encrypt } from '$lib/crypto/crypto';
import type { EncryptableT } from '$lib/types';
import { addConsoleMessage } from '$lib/utils';

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

export function encryptable<Type>(data: Type, localStorageKey: string): EncryptableT<Type> {
	const store = writable<Type>(data);
	const { subscribe, set } = store;
	const isBrowser = typeof window !== 'undefined';

	function read() {
		if (isBrowser && localStorage.getItem(localStorageKey) !== null) {
			const storedValue = localStorage.getItem(localStorageKey);

			if (storedValue) {
				try {
					const key = get(keyStore);
					if (!(get(lockStateStore) === 'unlocked') || !key) {
						throw new Error('Key store not initialized, cannot encrypt data');
					}
					decrypt(storedValue, key).then((decryptedData) => {
						if (decryptedData !== null) {
							set(JSON.parse(decryptedData)) as Type;
						} else {
							console.error('Error decrypting data');
						}
					});
				} catch (e) {
					console.warn(`Error reading local storage for key: ${localStorageKey}; ${e}`);
				}
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
		},
		read
	};
}

export type QueueStore = ReturnType<typeof queueService>;

declare function queueService(): {
	set: (value: any[]) => void;
	subscribe: (run: (value: any[]) => any, invalidate?: any) => () => void;
	update: (callBack: (value: any[]) => any[]) => void;
	enqueue: (
		value: any,
		type: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error'
	) => void;
	dequeue: () => any;
};

export function queueable(data: { data: string; type: string }[]): ReturnType<typeof queueService> {
	const store = writable<{ data: string; type: string }[]>(data);
	const { subscribe, set } = store;

	return {
		subscribe,
		set: (value: { data: string; type: string }[]) => {
			set(value);
		},
		update: (
			callBack: (value: { data: string; type: string }[]) => { data: string; type: string }[]
		) => {
			const updatedStore = callBack(get(store));
			set(updatedStore);
		},
		enqueue: (value: string, type = 'tertiary') => {
			const updatedStore = get(store);
			updatedStore.push({ data: value, type });
			set(updatedStore);
			addConsoleMessage(String(value), type);
		},
		dequeue: () => {
			const updatedStore = get(store);
			const val = updatedStore.shift();
			set(updatedStore);
			return val;
		}
	};
}
