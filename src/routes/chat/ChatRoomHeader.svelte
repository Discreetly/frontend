<script lang="ts">
	import { currentSelectedRoom, rateLimitStore } from '$lib/stores';
	import { onMount } from 'svelte';
	export let connected: boolean;
	export let currentEpoch: number;
	export let timeLeftInEpoch: string;
	export let userMessageLimit: number;
	export let roomRateLimit: number;
	export let messagesLeft: () => number;
	export let messageId: number;
	$: roomId = $currentSelectedRoom?.roomId!.toString();
	$: roomName = $currentSelectedRoom?.name ?? 'Select Room';
	$: actions(messagesLeft(), userMessageLimit);

	function actions(msgsRemaining: number, totalMsgs: number) {
		const d = document.getElementById('ActionPoints');
		let canvas = d?.querySelector('canvas') as HTMLCanvasElement;

		const circleRadius = 8;
		const circleSpacing = 5;

		if (!canvas) {
			canvas = document.createElement('canvas');
			canvas.height = 20;
			d?.appendChild(canvas);
		}

		canvas.width = (circleRadius * 2 + circleSpacing) * totalMsgs - circleSpacing;
		const startX = canvas.width - circleRadius;

		const ctx = canvas.getContext('2d')!;
		ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawing

		let x = startX;
		const y = canvas.height / 2;

		for (let i = 0; i < msgsRemaining; i++) {
			ctx.fillStyle = msgsRemaining === 1 ? '#fa5f5f' : '#45a164';
			ctx.strokeStyle = msgsRemaining === 1 ? '#bc4747' : '#34794b'; // Outline color
			ctx.lineWidth = 1; // Outline width
			ctx.beginPath();
			ctx.arc(x, y, circleRadius, 0, Math.PI * 2, true);
			ctx.fill();
			ctx.stroke(); // Draw the outline
			x -= circleRadius * 2 + circleSpacing;
		}

		for (let i = msgsRemaining; i < totalMsgs; i++) {
			ctx.fillStyle = '#73888a';
			ctx.strokeStyle = '#1a1f1f'; // Outline color
			ctx.lineWidth = 1; // Outline width
			ctx.beginPath();
			ctx.arc(x, y, circleRadius, 0, Math.PI * 2, true);
			ctx.fill();
			ctx.stroke(); // Draw the outline
			x -= circleRadius * 2 + circleSpacing;
		}
	}

	onMount(() => {
		actions(messagesLeft(), userMessageLimit);
	});
</script>

<header
	class="hidden border-b border-surface-500/30 px-2 py-1 md:px-5 md:py-3 sm:flex flex-row justify-between place-items-center text-xs md:text-base"
>
	<h2 id="roomTitle" class="h5 text-primary-500" class:connected title={roomId}>
		{roomName}
	</h2>

	<div class="hidden lg:inline text-xs md:text-sm">
		<small title={roomId}
			>you can send {userMessageLimit} messages every {roomRateLimit / 1000} seconds / {messageId} of
			{messagesLeft()}
			used</small
		>
		<br class="hidden lg:inline" />
		<small class="code" title={String(currentEpoch)}
			>Epoch: {currentEpoch} / Time Left in Epoch: {timeLeftInEpoch}s</small
		>
	</div>
	<div id="ActionPoints" />
</header>

<style>
	#roomTitle::before {
		vertical-align: 0.125rem;
		margin-right: 0.5em;
		font-size: 0.75em;
		content: '⬤';
		color: rgb(var(--color-error-500));
	}
	#roomTitle.connected::before {
		color: rgb(var(--color-success-500));
	}
</style>
