<script lang=ts>
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


<label for="claimCodes">
  Claim Codes:
  <input name="claimCodes"class="text-black" type="number" bind:value={formData.claimCodes}/>
</label>
