<script setup>
function onSubmit() {}
</script>

<template>
  <form class="flex flex-col" @submit.prevent="onSubmit">
    <div class="form-control gap-2">
      <label class="label" for="user-name">
        <span class="label-text">Name</span>
      </label>

      <input id="user-name" type="text" placeholder="..." class="input input-bordered max-w-md" disabled />
    </div>

    <div class="form-control gap-2">
      <label class="label" for="user-avatar">
        <span class="label-text">Avatar</span>
      </label>

      <input id="user-avatar" type="file" placeholder="..." class="file-input file-input-bordered max-w-md" disabled />
    </div>

    <div class="form-control gap-2">
      <label class="label" for="user-passcode">
        <span class="label-text">Passcode</span>
      </label>

      <input id="user-passcode" type="password" placeholder="..." class="input input-bordered max-w-md" disabled />
    </div>
  </form>
</template>
