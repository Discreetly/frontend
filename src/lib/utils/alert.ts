import { toastStore } from '@skeletonlabs/skeleton';

export function alert(alertMessage: string, timeout = 5000) {
	toastStore.trigger({ message: alertMessage, timeout: timeout });
	console.warn(alertMessage);
}
