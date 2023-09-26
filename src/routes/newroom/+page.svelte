<script lang="ts">
  import { createRoom } from '$lib/services/server';
  import { getIdentity } from '$lib/utils';
  import { selectedServer, configStore } from '$lib/stores'
  import { Stepper, Step } from '@skeletonlabs/skeleton'
  import { goto } from '$app/navigation';
  import RoomName from './1_RoomName.svelte'
  import MembershipType from './2_MembershipType.svelte'
  import RateLimit from './3_RateLimit.svelte';
  import MessageLimit from './4_MessageLimit.svelte';
  import ClaimCodes from './5_ClaimCodes.svelte';
  import RoomType from './6_RoomType.svelte';

  let formData: any = {
    roomName: "",
    membershipType: 'IDENTITY_LIST',
    rateLimit: 10,
    messageLimit: 3,
    claimCodes: 0,
    roomType: 'PUBLIC',
    bandadaAddress: undefined,
    bandadaGroupId: undefined,
    bandadaApiKey: undefined,
  };

  function handleSubmit (): void {
    const identity = getIdentity();
    formData.rateLimit = formData.rateLimit * 1000
    // createRoom(
    //   $selectedServer,
    //   formData.roomName,
    //   $configStore.apiUsername as string,
    //   $configStore.apiPassword as string,
    //   formData.rateLimit,
    //   formData.messageLimit,
    //   formData.claimCodes,
    //   [identity._commitment],
    //   formData.membershipType,
    //   formData.roomType,
    //   formData.bandadaAddress,
    //   formData.bandadaGroupId,
    //   formData.bandadaApiKey,
    //   )
  };

</script>

<div class="grid grid-flow-rows gap-7 my-5 max-w-md mx-auto">
  <h1 class="text-3xl text-center">Create a Room</h1>
  <Stepper class="max-w-sm sm:max-w-md md:max-w-3xl mx-auto mt-16"
  on:complete={() => {
    handleSubmit();
    // goto('/chat')
  }}
  buttonNext="variant-filled-surface-50-900-token"
  buttonComplete="variant-filled-success">
  <RoomName {formData} />
  <MembershipType {formData} />
  <RateLimit {formData} />
  <MessageLimit {formData} />
  <ClaimCodes {formData} />
  <RoomType {formData} />
</Stepper>
</div>
