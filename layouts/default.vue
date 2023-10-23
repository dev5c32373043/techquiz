<script setup>
useSeoMeta({
  title: 'TechQuiz: Providing Services Since Today'
});
</script>

<template>
  <main class="flex flex-col items-center h-screen overflow-hidden">
    <Header />
    <div class="flex w-full h-full">
      <SideBar />
      <div class="w-full overflow-auto pb-20">
        <slot />
      </div>
    </div>
  </main>
</template>
