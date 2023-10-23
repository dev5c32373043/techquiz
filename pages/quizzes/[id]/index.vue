<script setup>
definePageMeta({
  validate: async route => isMongoId(route.params.id)
});

const route = useRoute();
const baseUrl = `/api/quizzes/${route.params.id}/show`;
const resp = await useAsync(await useFetch(baseUrl));

const quiz = ref(resp.data);
</script>

<template>
  <QuizDetails :quiz="quiz" />
</template>
