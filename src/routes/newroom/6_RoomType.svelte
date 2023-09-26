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


<label for="room-type">
  Room Type:
  <select name="roomType" class="text-black" bind:value={formData.roomType}>
    <option value="PUBLIC" class="text-black">Public</option>
    <option value="PRIVATE" class="text-black">Private</option>
  </select>
</label>
