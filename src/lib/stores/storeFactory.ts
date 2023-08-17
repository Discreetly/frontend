/* eslint-disable @typescript-eslint/no-explicit-any */
import { writable, get } from 'svelte/store';
import type { Writable } from 'svelte/store';

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
		set: (newValue: Type) => {
			console.debug(localStorageKey, ':', newValue);
			if (isBrowser) {
				localStorage[localStorageKey] = JSON.stringify(newValue);
			}
			set(newValue);
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
