<script setup>
const props = defineProps({ data: { type: Object, required: true }, currentPage: { type: Number, required: true } });
const formData = reactive({});
const { question, deadline, pagesCount, nextPage } = props.data.value;
const nextPagePresent = computed(() => Number.isInteger(nextPage));

const selectedQuestion = ref(question);
const chosenOption = computed(() =>
  selectedQuestion.value.options.reduce((acc, opt) => {
    if (opt.isSelected) {
      acc.push(opt.id);
    }

    return acc;
  }, [])
);

const {
  params: { accessToken }
} = useRoute();

const baseUrl = `/q/${accessToken}`;

const { $toast } = useNuxtApp();

async function submitAnswer() {
  let body;

  const q = toValue(selectedQuestion);

  if (['single', 'multi'].includes(q.variant)) {
    body = { options: q.options };
  }

  if (q.variant === 'code') {
    body = { code: q.code };
  }

  const [err, respData] = await to(
    $fetch(`/api/quiztime/${accessToken}/${props.currentPage}`, { method: 'PUT', body })
  );
  if (err) {
    $toast.error('Failed to submit the answer. Please try again');
    return;
  }

  const nextDestination = Number.isInteger(respData.nextPage) ? `${baseUrl}/${respData.nextPage}` : `${baseUrl}/result`;
  navigateTo(nextDestination);
}

async function finishQuiz() {
  await navigateTo(`${baseUrl}/result`);
}

provide('selectedQuestion', selectedQuestion);
</script>

<template>
  <main class="flex flex-col w-full lg:w-3/4 mb-auto self-center border rounded p-5 gap-2">
    <div class="flex w-full justify-between">
      <h1 class="text-3xl font-bold text-start whitespace-pre-wrap">{{ question.title }}</h1>

      <div class="flex self-start items-center gap-2">
        <PagesCount :current-page="currentPage" :pages-count="pagesCount" />
        <Countdown :target-date="deadline" @on-time-up="finishQuiz" />

        <div class="flex gap-2">
          <NuxtLink class="btn btn-neutral" :to="`${baseUrl}/${currentPage - 1}`" v-if="currentPage > 1">Prev</NuxtLink>
          <button class="btn btn-secondary" @click="submitAnswer">{{ nextPagePresent ? 'Next' : 'Finish' }}</button>
        </div>
      </div>
    </div>

    <form>
      <div class="flex items-center gap-5">
        <QuestionCodeOption mode="view" v-if="question.variant !== 'code' && question.code.sample" />
        <QuestionSingleOptions mode="form" v-if="question.variant === 'single'" />
        <QuestionMultiOptions mode="form" v-if="question.variant === 'multi'" />
      </div>

      <QuestionCodeOption mode="form" v-if="question.variant === 'code'" />
    </form>
  </main>
</template>
