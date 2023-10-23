<script setup>
const props = defineProps({
  result: { type: Object, required: true }
});

const { message, score, questionsCount, hasNewAttempt } = props.result.value;
const precentage = computed(() => quizResultInPercent(score, questionsCount));

const {
  params: { accessToken }
} = useRoute();

const { $toast } = useNuxtApp();

const visitorId = inject('visitorId');
const reqState = reactive({ status: 'idle' });

async function memberStillFighting() {
  if (reqState.status !== 'idle') return;

  reqState.status = 'pending';
  const headers = { 'x-device-id': visitorId.value };
  const [err, respData] = await to($fetch(`/api/quiztime/${accessToken}`, { method: 'POST', headers }));
  if (err) {
    $toast.error('Unable to start quiz... Please try again');
    reqState.status = 'idle';
    return;
  }

  await navigateTo(`/q/${accessToken}/${respData.nextPage}`);
  reqState.status = 'idle';
}
</script>

<template>
  <main class="flex flex-col w-full lg:w-2/4 mb-auto self-center border rounded p-5 gap-2">
    <div class="flex justify-between">
      <div class="flex flex-col flex-1">
        <h1 class="text-3xl font-bold text-center">Thank you!</h1>
        <p class="text-md whitespace-pre-wrap">{{ message }}</p>
      </div>

      <div
        class="radial-progress bg-slate-800 text-primary-content border-4 border-primary"
        :style="{ '--value': precentage }"
      >
        {{ precentage }}%
      </div>
    </div>

    <button class="btn mt-5 btn-secondary" @click="memberStillFighting" v-if="hasNewAttempt">One more time?</button>
  </main>
</template>
