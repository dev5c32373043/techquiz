<script setup>
import { useQuizStore } from '@/stores/quiz';

const { $toast } = useNuxtApp();

const { quiz } = defineProps({ quiz: { type: Object, required: true } });
const store = useQuizStore();

async function removeQuiz() {
  const [err, respData] = await to($fetch(`/api/quizzes/${quiz._id}`, { method: 'DELETE' }));
  if (err || !respData?.ok) {
    $toast.error('Failed to remove quiz. Try again');
    return;
  }

  store.removeItem(quiz);
  navigateTo('/quizzes');
}
</script>

<template>
  <div class="flex flex-col w-full p-5">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl">{{ quiz.title }}</h1>

      <div class="flex justify-center gap-2">
        <button class="btn btn-outline btn-error" @click="removeQuiz">Remove</button>
        <NuxtLink class="btn btn-neutral" v-bind:to="`/quizzes/${quiz._id}/edit`">Edit</NuxtLink>
      </div>
    </div>

    <QuizDetailsLinks :data="quiz.links" />
  </div>
</template>
