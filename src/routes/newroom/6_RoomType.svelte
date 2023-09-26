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
    <div class="h3 text-center">Public or Private</div>
  </svelte:fragment>
  <div class="flex flex-col justify-center w-full">
    <select name="roomType" class="text-black" bind:value={formData.roomType}>
      <option value="PUBLIC" selected class="text-black">Public</option>
      <option value="PRIVATE" class="text-black">Private</option>
    </select>
  </div>
</Step>
