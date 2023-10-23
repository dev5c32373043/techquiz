<script setup>
const props = defineProps({
  currentPage: { type: Number, required: true },
  pagesCount: { type: Number, required: true }
});
</script>

<template>
  <div class="bg-slate-800 text-neutral-content p-2 bordered rounded">
    <span class="text-2xl">{{ currentPage }}/{{ pagesCount }}</span>
  </div>
</template>
