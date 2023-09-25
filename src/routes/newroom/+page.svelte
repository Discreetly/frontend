<script lang="ts">
  import { createRoom } from '$lib/services/server';
  import { getIdentity } from '$lib/utils';
  import { selectedServer, configStore } from '$lib/stores'
  let formData = {
    roomName: '',
    membershipType: 'IDENTITY_LIST',
    rateLimit: 0,
    messageLimit: 0,
    claimCodes: 0,
    roomType: 'PUBLIC',
    bandadaAddress: undefined,
    bandadaGroupId: undefined,
    bandadaApiKey: undefined,
  };

  let bandadaFields = false;

  function toggleBandadaFields (e: any): void {
    if (e.target.value === 'BANDADA_GROUP') {
      bandadaFields = true;
    } else {
      bandadaFields = false;
    }
  }

  function handleSubmit (e: Event): void {
    e.preventDefault();
    // const {roomName, membershipType, rateLimit, messageLimit, claimCodes, roomType} = e.target as HTMLFormElement;
    console.log(formData);
    const identity = getIdentity();
    createRoom(
      $selectedServer,
      formData.roomName,
      $configStore.apiUsername as string,
      $configStore.apiPassword as string,
      formData.rateLimit,
      formData.messageLimit,
      formData.claimCodes,
      [identity._commitment],
      formData.membershipType,
      formData.roomType,
      formData.bandadaAddress,
      formData.bandadaGroupId,
      formData.bandadaApiKey,
      )
    console.log('submitting form');
  };
</script>
<div class="grid grid-flow-rows gap-7 my-5 max-w-md mx-auto">

  <h1 class="flex content-center font-bold">Create Room</h1>
  <form method="POST" on:submit|preventDefault={handleSubmit}
  class="grid gap-7">
    <label for="roomName">Room Name: <input class="text-black" bind:value={formData.roomName} name="roomName" type="text" /></label>
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
    <label for="rateLimit">
      Rate Limit:
      <input name="rateLimit" class="text-black" type="number" bind:value={formData.rateLimit}/>
    </label>
    <label for="messageLimit">
      User Message Limit:
      <input name="messageLimit" class="text-black" type="number" bind:value={formData.messageLimit}/>
    </label>
    <label for="claimCodes">
      Claim Codes:
      <input name="claimCodes"class="text-black" type="number" bind:value={formData.claimCodes}/>
    </label>
    <label for="room-type">
      Room Type:
      <select name="roomType" class="text-black" bind:value={formData.roomType}>
        <option value="PUBLIC" class="text-black">Public</option>
        <option value="PRIVATE" class="text-black">Private</option>
      </select>
      <br>
    <button>Create Room</button>
  </form>
</div>
