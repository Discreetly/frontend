<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;

	const aspectRatio = 1;

	// Resize function
	function resizeCanvas() {
		const parent = canvas.parentElement;
		const parentWidth = parent!.clientWidth;
		const parentHeight = parent!.clientHeight - 150;
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
		console.log(canvas.height, canvas.width);
	}

	onMount(() => {
		canvas = document.getElementById('drawing-canvas') as HTMLCanvasElement;
		ctx = canvas.getContext('2d')!;
		resizeCanvas();
		window.addEventListener('resize', resizeCanvas);
		canvas.addEventListener('click', function (event) {
			const rect = canvas.getBoundingClientRect();
			const x = event.clientX - rect.left;
			const y = event.clientY - rect.top;
		});

		ctx.font = '30px Arial'; // Set font size and type
		ctx.textAlign = 'center'; // Horizontal alignment
		ctx.textBaseline = 'middle'; // Vertical alignment

		const centerX = canvas.width / 2;
		const centerY = canvas.height / 2;
		ctx.fillStyle = '#fa5f5f'; // Text color
		ctx.fillText('Drawing Coming soon', centerX, centerY); // Draw text
	});
</script>

<canvas
	id="drawing-canvas"
	width="250"
	height="250"
	class="border border-surface-300-600-token m-1 sm:m-3"
/>
