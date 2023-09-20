import { getToastStore } from '@skeletonlabs/skeleton';

export function alert(alertMessage: string, timeout = 5000) {
	const toastStore = getToastStore();
	toastStore.trigger({ message: alertMessage, timeout: timeout });
	console.warn(alertMessage);
}
