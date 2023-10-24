<script setup>
defineProps({ title: String, desc: String });
</script>

<template>
  <div class="flex flex-col items-center justify-center py-12">
    <img src="/empty-box.png" alt="greetings!" width="96" height="96" className="w-24 h-24 mb-4" />
    <h2 class="text-3xl font-semibold mb-2">{{ title || 'Nothing here, yet' }}</h2>
    <p class="text-gray-600 text-center text-lg leading-relaxed" v-if="desc">{{ desc }}</p>
  </div>
</template>
