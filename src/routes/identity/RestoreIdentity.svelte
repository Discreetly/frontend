<script lang="ts">
	import { identityStore } from '$lib/stores';
	import { FileDropzone } from '@skeletonlabs/skeleton';
	let files: FileList;
	function onChangeHandler(e: Event): void {
		files
			.item(0)
			?.text()
			.then((text) => {
				console.log(text);
				$identityStore = JSON.parse(text);
			});
	}
</script>

<h4 class="h4">Restore Your Identity</h4>
<FileDropzone name="identity.json" bind:files on:change={onChangeHandler} />
