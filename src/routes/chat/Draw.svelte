<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;

	const aspectRatio = 1;

	// Resize function
	function resizeCanvas() {
		const parent = canvas.parentElement;
		console.log(parent);
		const parentWidth = parent!.clientWidth;
		const parentHeight = parent!.clientHeight;
		console.log(parentWidth, parentHeight);
		let height, width;

		if (parentHeight < parentWidth / aspectRatio) {
			height = parentHeight;
			width = height * aspectRatio;
		} else {
			width = parentWidth;
			height = width / aspectRatio;
		}

		canvas.width = width;
		canvas.height = height;
	}

	onMount(() => {
		canvas = document.getElementById('drawing-canvas') as HTMLCanvasElement;
		ctx = canvas.getContext('2d')!;
		resizeCanvas();
		window.addEventListener('resize', resizeCanvas);
	});
</script>

<canvas
	id="drawing-canvas"
	width="250"
	height="250"
	class="border border-surface-300-600-token m-1 sm:m-3"
/>
