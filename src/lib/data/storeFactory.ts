/* eslint-disable @typescript-eslint/no-explicit-any */
import { writable, get } from 'svelte/store';
import type { Writable } from 'svelte/store';

export function storable<T>(data: T, localStorageKey: string): Writable<T> {
	const store = writable<T>(data);
	const { subscribe, set } = store;
	const isBrowser = typeof window !== 'undefined';

	if (isBrowser && localStorage[localStorageKey]) {
		set(JSON.parse(localStorage[localStorageKey]) as T);
	}

	return {
		subscribe,
		set: (n: T) => {
			if (isBrowser) {
				localStorage[localStorageKey] = JSON.stringify(n);
			}
			set(n);
		},
		update: (callBack: (value: T) => T) => {
			const updatedStore = callBack(get(store));

			if (isBrowser) {
				localStorage[localStorageKey] = JSON.stringify(updatedStore);
			}
			set(updatedStore);
		}
	};
}

export function sessionable<T>(data: T, sessionStorageKey: string): Writable<T> {
	const store = writable<T>(data);
	const { subscribe, set } = store;
	const isBrowser = typeof window !== 'undefined';

	if (isBrowser && sessionStorage[sessionStorageKey]) {
		set(JSON.parse(sessionStorage[sessionStorageKey]) as T);
	}

	return {
		subscribe,
		set: (n: T) => {
			if (isBrowser) {
				sessionStorage[sessionStorageKey] = JSON.stringify(n);
			}
			set(n);
		},
		update: (callBack: (value: T) => T) => {
			const updatedStore = callBack(get(store));

			if (isBrowser) {
				sessionStorage[sessionStorageKey] = JSON.stringify(updatedStore);
			}
			set(updatedStore);
		}
	};
}
