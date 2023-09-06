<script lang="ts">
	import Group from 'svelte-material-icons/AccountGroup.svelte';
	import MemberSecret from 'svelte-material-icons/AccountKey.svelte';
	import FingerPrint from 'svelte-material-icons/Fingerprint.svelte';
</script>

<div class="flex flex-row gap-3 place-items-center text-xl">
	<FingerPrint />(<MemberSecret />)
	<div>∈</div>
	<Group />
</div>
