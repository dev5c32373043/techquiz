<script setup>
const props = defineProps({ data: Object });
const { title, introMessage } = props.data.value;

const {
  params: { accessToken }
} = useRoute();

const { $toast } = useNuxtApp();

const visitorId = inject('visitorId');

const reqState = reactive({ status: 'idle' });

async function startQuiz() {
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
  <div class="flex flex-col md:w-full lg:w-2/4 gap-4">
    <h1 class="text-3xl font-bold text-center">{{ title }}</h1>
    <p class="text-md whitespace-pre-wrap">{{ introMessage }}</p>
    <button class="btn btn-wide btn-secondary self-center" @click="startQuiz">
      <span class="loading loading-spinner" v-if="reqState.status !== 'idle'" />
      Start
    </button>
  </div>
</template>
