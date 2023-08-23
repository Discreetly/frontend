<script lang="ts">
	import { currentSelectedRoom } from '$lib/stores';
	export let currentEpoch: number;
	export let timeLeftInEpoch: string;
	$: roomId = $currentSelectedRoom?.roomId!.toString();
	$: roomName = $currentSelectedRoom?.name!;
	$: userMessageLimit = $currentSelectedRoom.userMessageLimit ?? 1;
	$: currentRateLimit = $currentSelectedRoom.rateLimit ?? 0;
</script>

<header
	class="border-b border-surface-500/30 px-5 py-3 flex flex-row justify-between place-items-center"
>
	<h2 class="h5 text-primary-500" title={roomId}>
		{roomName}
	</h2>
	<small title={roomId}
		>you can send {userMessageLimit} messages every {currentRateLimit / 1000} seconds</small
	>
	<small class="code" title={String(currentEpoch)}
		>Epoch: {currentEpoch} / Time Left in Epoch: {timeLeftInEpoch}s</small
	>
</header>
