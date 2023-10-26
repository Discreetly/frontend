import type { Toast, ToastSettings } from '@skeletonlabs/skeleton';
import type { Subscriber, Invalidator, Unsubscriber } from 'svelte/motion';

export type toastStoreT = {
	subscribe: (
		this: void,
		run: Subscriber<Toast[]>,
		invalidate?: Invalidator<Toast[]> | undefined
	) => Unsubscriber;
	close: (id: string) => void;
	trigger: (toast: ToastSettings) => string;
	freeze: (index: number) => void;
	unfreeze: (index: number) => void;
	clear: () => void;
};
