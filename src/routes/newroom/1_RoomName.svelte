<script lang=ts>
  import { Step } from '@skeletonlabs/skeleton'
   export let formData: {
    roomName: string;
    membershipType: string;
    rateLimit: number;
    messageLimit: number;
    claimCodes: number;
    roomType: string;
    bandadaAddress: undefined;
    bandadaGroupId: undefined;
    bandadaApiKey: undefined;
  };

</script>

<Step locked={formData.roomName === ''
|| formData.roomName.startsWith(' ')
|| formData.roomName.length < 2
}>
  <svelte:fragment slot="header">
    <div class="h3 text-center">Room Name</div>
    </svelte:fragment>
    <div class="flex justify-center w-full">
      <input name="roomName" maxlength="32" class="text-black w-full" type="text" bind:value={formData.roomName}/>
    </div>
    <p class="text-center">Room Name must be between 3 and 32 characters</p>
</Step>
