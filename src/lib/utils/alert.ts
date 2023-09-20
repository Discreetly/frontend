import { getToastStore } from '@skeletonlabs/skeleton';

const toastStore = getToastStore();

export function alert(alertMessage: string, timeout = 5000) {
	toastStore.trigger({ message: alertMessage, timeout: timeout });
	console.warn(alertMessage);
}
