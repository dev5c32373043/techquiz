<script setup>
const { variant, onSelect } = defineProps({
  variant: { type: String, required: true },
  onSelect: { type: Function, required: true }
});
</script>

<template>
  <ul class="menu menu-xs menu-vertical lg:menu-horizontal bg-base-200 rounded-box">
    <li>
      <button type="button" :class="{ active: variant === 'single' }" @click="onSelect('single')">Single Option</button>
    </li>

    <li>
      <button type="button" :class="{ active: variant === 'multi' }" @click="onSelect('multi')">Multi Option</button>
    </li>

    <li>
      <button type="button" :class="{ active: variant === 'code' }" @click="onSelect('code')">Code Option</button>
    </li>
  </ul>
</template>
