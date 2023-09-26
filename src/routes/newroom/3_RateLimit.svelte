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

<Step locked={formData.rateLimit <= 0}>
  <svelte:fragment slot="header">
    <div class="h3 text-center">Rate Limit</div>
  </svelte:fragment>
  <div class="flex flex-col justify-center w-full">
    <i>How long the epochs of the room are in seconds</i>
    <br>
    <input name="rateLimit" class="text-black" type="number" bind:value={formData.rateLimit}/>
  </div>
</Step>
