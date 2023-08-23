<script lang="ts">
	import { currentSelectedRoom } from '$lib/stores';
	export let currentEpoch: number;
	export let timeLeftInEpoch: string;
	$: roomId = $currentSelectedRoom?.roomId!.toString();
	$: roomName = $currentSelectedRoom?.name ?? 'Select Room';
	$: userMessageLimit = $currentSelectedRoom.userMessageLimit ?? 1;
	$: currentRateLimit = $currentSelectedRoom.rateLimit ?? 0;
</script>

<header
	class="hidden border-b border-surface-500/30 px-2 py-1 md:px-5 md:py-3 sm:flex flex-row justify-between place-items-center text-xs md:text-base"
>
	<h2 class="h5 text-primary-500" title={roomId}>
		{roomName}
	</h2>
	<div class="hidden md:block text-xs md:text-sm">
		<small title={roomId}
			>you can send {userMessageLimit} messages every {currentRateLimit / 1000} seconds</small
		>
		<br class="hidden md:inline" />
		<small class="code" title={String(currentEpoch)}
			>Epoch: {currentEpoch} / Time Left in Epoch: {timeLeftInEpoch}s</small
		>
	</div>
</header>
