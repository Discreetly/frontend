<script lang=ts>
	import type { RoomFormData } from '$lib/types';
  import { Step } from '@skeletonlabs/skeleton'
  export let formData: RoomFormData;
</script>

<Step locked={formData.roomName === ''
|| formData.roomName.startsWith(' ')
|| formData.roomName.length < 2
}>
  <svelte:fragment slot="header">
    <div class="h3 text-center">Room Name</div>
    </svelte:fragment>
    <div class="flex flex-col justify-center w-full">
      <i class="text-center">Room Name must be between 3 and 32 characters</i>
      <br>
      <input name="roomName" maxlength="32" class="text-black w-full" type="text" bind:value={formData.roomName}/>
    </div>
</Step>
