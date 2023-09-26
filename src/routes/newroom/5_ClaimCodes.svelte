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

<Step>
  <svelte:fragment slot="header">
    <div class="h3 text-center">Number of Claim Codes for {formData.roomName}</div>
  </svelte:fragment>
  <div class="flex flex-col justify-center w-full">
    <i class="text-center">Number of claim codes to create for {formData.roomName}</i>
    <br>
    <input name="claimCodes"class="text-black" type="number" bind:value={formData.claimCodes}/>
  </div>
</Step>
