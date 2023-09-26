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
  
  let bandadaFields = false;

  function toggleBandadaFields (e: any): void {
    if (e.target.value === 'BANDADA_GROUP') {
      bandadaFields = true;
    } else {
      bandadaFields = false;
    }
  }
</script>

<label for="membershipType">
  Room Type:
   <select name="membershipType" class="text-black" bind:value={formData.membershipType} on:change={toggleBandadaFields}>
  <option value="IDENTITY_LIST" class="text-black">
    Identity List
  </option>
  <option value="BANDADA_GROUP" class="text-black">
    Bandada Group
  </option>
</select>
{#if bandadaFields === true}
<div class="grid grid-flow-rows gap-5 my-5 max-w-md mx-auto">
  <label for="bandadaAddress">
        Bandada Address:
        <input name="bandadaAddress" type="text" class="text-black" bind:value={formData.bandadaAddress}/>
  </label>
      <label for="bandadaGroup">
        Bandada Group Id:
        <input name="bandadaGroup" type="text" class="text-black"bind:value={formData.bandadaGroupId}/>
      </label>
      <label for='bandadaApiKey'>
        Bandada Api Key:
        <input name="bandadaApiKey" type="text" class="text-black" bind:value={formData.bandadaApiKey}/>
      </label>
</div>
  {/if}
</label>
