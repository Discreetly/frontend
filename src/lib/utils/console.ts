import { consoleStore } from '../stores/index';

import type { consoleStoreI, consoleMessageI } from '$lib/types/';

export const addConsoleMessage = (
	message: string,
	type: 'info' | 'userinput' | 'error' | 'warning'
) => {
	let idx: number | undefined;
	consoleStore.update((state) => {
		const newState = {
			settings: state.settings,
			messages: [...state.messages, { message: message, type: type } as consoleMessageI]
		} as consoleStoreI;
		idx = newState.messages.length - 1;
		return newState;
	});
	if (typeof idx === 'undefined') {
		throw new Error('Failed to add console message');
	}
	return idx;
};

export const clearConsoleMessages = () => {
	consoleStore.update((state) => {
		const newState = {
			settings: state.settings,
			messages: [{ message: 'Welcome User', type: 'info' }]
		} as consoleStoreI;
		return newState;
	});
};
