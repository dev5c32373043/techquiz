<script setup>
definePageMeta({
  layout: 'quiz',
  async validate(route) {
    const { accessToken, page } = route.params;
    const pageNum = parseInt(page, 10);
    return accessToken.length === 12 && Number.isFinite(pageNum);
  }
});

const {
  params: { accessToken, page }
} = useRoute();
const pageNum = parseInt(page, 10);
const resp = await useAsync(await useFetch(`/api/quiztime/${accessToken}/${page}`));

onMounted(() => {
  console.info('%cGood luck 🍀', 'color: #00f901; font-family: monospace; font-size: 18px');
});
</script>

<template>
  <QuestionPage :data="resp.data" :current-page="pageNum" />
</template>
