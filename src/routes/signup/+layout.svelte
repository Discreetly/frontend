<script lang="ts">
	import Introduction from './1_Introduction.svelte';
	import IdentityGeneration from './2_IdentityGeneration.svelte';
	import Join from './3_Join.svelte';
	import Backup from './4_Backup.svelte';
	import { configStore } from '$lib/stores';
	import Loading from '$lib/components/loading.svelte';
	import { Stepper, Step } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';
	import { IdentityStoreE } from '$lib/types';
</script>

<div class="h-100 mt-2 mx-2 md:mx-4">
	<slot />
</div>
