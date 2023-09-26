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


<label for="messageLimit">
  User Message Limit:
  <input name="messageLimit" class="text-black" type="number" bind:value={formData.messageLimit}/>
</label>
