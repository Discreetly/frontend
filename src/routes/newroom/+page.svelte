<script lang="ts">
  import { createRoom } from '$lib/services/server';
  import { getIdentity } from '$lib/utils';

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

  async function handleSubmit (e: Event) {
    e.preventDefault();
    // const {roomName, membershipType, rateLimit, messageLimit, claimCodes, roomType} = e.target as HTMLFormElement;
    console.log(formData);
    const identity = getIdentity();
    createRoom(
      'http://localhost:3001',
      formData.roomName,
      'admin',
      'password',
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
    <label for="roomName">Room Name: <input bind:value={formData.roomName} name="roomName" type="text" /></label>
    <label for="membershipType">
      Room Type:
       <select name="membershipType" bind:value={formData.membershipType} on:change={toggleBandadaFields}>
      <option value="IDENTITY_LIST">
        Identity List
      </option>
      <option value="BANDADA_GROUP">
        Bandada Group
      </option>
    </select>
    {#if bandadaFields === true}
    <div class="grid grid-flow-rows gap-5 my-5 max-w-md mx-auto">
      <label for="bandadaAddress">
            Bandada Address:
            <input name="bandadaAddress" type="text" bind:value={formData.bandadaAddress}/>
      </label>
          <label for="bandadaGroup">
            Bandada Group Id:
            <input name="bandadaGroup" type="text" bind:value={formData.bandadaGroupId}/>
          </label>
          <label for='bandadaApiKey'>
            Bandada Api Key:
            <input name="bandadaApiKey" type="text" bind:value={formData.bandadaApiKey}/>
          </label>
    </div>
      {/if}
    </label>
    <label for="rateLimit">
      Rate Limit:
      <input name="rateLimit" type="number" bind:value={formData.rateLimit}/>
    </label>
    <label for="messageLimit">
      User Message Limit:
      <input name="messageLimit" type="number" bind:value={formData.messageLimit}/>
    </label>
    <label for="claimCodes">
      Claim Codes:
      <input name="claimCodes" type="number" bind:value={formData.claimCodes}/>
    </label>
    <label for="room-type">
      Room Type:
      <select name="roomType" bind:value={formData.roomType}>
        <option value="PUBLIC">Public</option>
        <option value="PRIVATE">Private</option>
      </select>
      <br>
    <button>Create Room</button>
  </form>
</div>
