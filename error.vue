<script setup>
const props = defineProps({
  error: Object
});
</script>

<template>
  <main class="h-screen w-full flex flex-col justify-center items-center select-none bg-[#1A2238]">
    <h1 class="text-9xl font-extrabold text-white tracking-widest">{{ error.statusCode }}</h1>
    <div class="mt-5">
      <span class="relative block px-8 py-3 text-white">
        {{ error.statusMessage }}
      </span>
    </div>
  </main>
</template>
