<script lang="ts">
	export let link: string;
	export let cls: string | undefined = 'btn-primary';
	export let text: string | undefined = '';
</script>

<a href={link} class="btn btn-lg px-4 d-inline-flex align-items-center {cls}" type="button">
	<slot>{text}</slot>
</a>
