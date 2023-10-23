<script setup>
definePageMeta({
  layout: 'quiz',
  async validate(route) {
    return route.params.accessToken.length === 12;
  }
});

const {
  params: { accessToken }
} = useRoute();

const resp = await useAsync(await useFetch(`/api/quiztime/${accessToken}/result`));
</script>

<template>
  <QuizOutro :result="resp.data" />
</template>
