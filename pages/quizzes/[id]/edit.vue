<script setup>
definePageMeta({
  validate: async route => isMongoId(route.params.id)
});

const route = useRoute();
const baseUrl = `/api/quizzes/${route.params.id}`;
const resp = await useAsync(await useFetch(baseUrl));

const quiz = ref(resp.data);

const questionsResp = await useAsync(await useFetch(`${baseUrl}/questions`));

const questions = ref(questionsResp.data.value);

const linksResp = await useAsync(await useFetch(`${baseUrl}/links`));

const links = ref(linksResp.data);
</script>

<template>
  <Quiz :quiz="quiz" :questions="questions" :links="links" v-if="quiz?._id" />
</template>
