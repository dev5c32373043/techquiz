<script setup>
definePageMeta({
  layout: 'quiz',
  validate: async route => route.params.accessToken.length === 12
});

const {
  params: { accessToken }
} = useRoute();

const resp = await useAsync(await useFetch(`/api/quiztime/${accessToken}`));
</script>

<template>
  <main class="flex flex-col mb-auto items-center p-5 gap-2">
    <QuizIntro :data="resp.data" />
  </main>
</template>
