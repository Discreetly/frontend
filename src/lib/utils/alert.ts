import { getToastStore } from '@skeletonlabs/skeleton';
import { addConsoleMessage } from './console';

export function alertToast(alertMessage: string, timeout = 5000) {
	const toastStore = getToastStore();
	toastStore.trigger({ message: alertMessage, timeout: timeout });
	console.warn(alertMessage);
}

export function alertAll(
	alertMessage: string,
	level: 'warning' | 'info' | 'userinput' | 'error' | 'space' | undefined = 'warning',
	timeout = 5000
) {
	alertToast(alertMessage, timeout);
	console.warn(alertMessage);
	addConsoleMessage(alertMessage, level);
}
