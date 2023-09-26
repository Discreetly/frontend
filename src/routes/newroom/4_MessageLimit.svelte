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


<Step locked={formData.messageLimit <= 0}>
  <svelte:fragment slot="header">
    <div class="h3 text-center">User Message Limit</div>
  </svelte:fragment>
  <div class="flex flex-col justify-center w-full">
    <i class="text-center">Number of messages a user can send in an epoch before being rate limited</i>
    <br>
    <input name="messageLimit" class="text-black" type="number" bind:value={formData.messageLimit}/>
  </div>
</Step>
