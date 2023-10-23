<script setup>
const { profile } = await useAsync(await useProfile());
const quizSettings = profile.value?.settings?.quiz ?? { timeLimitMs: 60000, attemptsCount: 1, randomize: true };
const quiz = ref({ title: '', desc: '', ...quizSettings });
const questions = ref([]);
const links = ref([]);
</script>

<template>
  <Quiz :quiz="quiz" :questions="questions" :links="links" />
</template>
