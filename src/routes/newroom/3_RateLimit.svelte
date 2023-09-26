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


<label for="rateLimit">
  Rate Limit:
  <input name="rateLimit" class="text-black" type="number" bind:value={formData.rateLimit}/>
</label>
