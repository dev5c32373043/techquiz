<script setup>
const props = defineProps({ quiz: Object, onCreate: Function, onUpdate: Function });
const quizTmp = ref(props.quiz);
const action = computed(() => (isMongoId(quizTmp.value._id) ? 'update' : 'create'));

const { $toast } = useNuxtApp();

let reqState = reactive({ status: 'idle' });

async function onSubmit() {
  if (reqState.status !== 'idle') return;

  const quiz = toValue(quizTmp.value);
  const currentAction = toValue(action);
  reqState.status = 'pending';

  if (currentAction === 'create') {
    const [err, data] = await to($fetch('/api/quizzes', { method: 'POST', body: quiz }));
    if (err) {
      $toast.error('Failed to create quiz');
      reqState.status = 'idle';
      return;
    }

    quizTmp.value = data;
    props.onCreate(data);
  }

  if (currentAction === 'update') {
    const [err, data] = await to($fetch(`/api/quizzes/${quiz._id}`, { method: 'PUT', body: quiz }));
    if (err) {
      $toast.error('Failed to update quiz');
      reqState.status = 'idle';
      return;
    }

    quizTmp.value = data;
    props.onUpdate(data);
  }

  reqState.status = 'idle';
}
</script>

<template>
  <form method="POST" class="flex flex-wrap md:w-full lg:w-3/4 p-5 mb-5 border rounded" @submit.prevent="onSubmit">
    <div class="form-control my-6 w-1/2 gap-2">
      <div class="px-4">
        <label class="label" for="quiz-title">
          <span class="label-text">*Intro Title</span>
        </label>
        <input
          id="quiz-title"
          name="name"
          type="text"
          placeholder="Would be nice to have some name"
          class="input input-bordered w-full"
          v-model="quizTmp.title"
          required
        />
      </div>

      <div class="px-4">
        <label class="label" for="quiz-time-limit">
          <span class="label-text">Time limit (mm:ss)</span>
        </label>
        <DurationInput
          id="quiz-time-limit"
          class="input input-bordered w-full"
          v-model="quizTmp.timeLimitMs"
          :required="true"
        />
      </div>

      <div class="px-4">
        <label class="label" for="quiz-retries">
          <span class="label-text">Attempts count</span>
        </label>
        <input
          id="quiz-retries"
          name="attemptsCount"
          type="number"
          min="1"
          max="100"
          placeholder="How many times user can access quiz until submit"
          class="input input-bordered w-full"
          v-model="quizTmp.attemptsCount"
          required
        />
      </div>

      <div class="px-4">
        <label class="label cursor-pointer">
          <span class="label-text">Randomize questions/options</span>
          <input type="checkbox" v-model="quizTmp.randomize" class="checkbox" />
        </label>
      </div>
    </div>

    <div class="form-control my-6 w-1/2">
      <div class="px-4">
        <label class="label" for="quiz-intro">
          <span class="label-text">*Intro Message</span>
        </label>

        <textarea
          id="quiz-intro"
          name="intro"
          class="textarea textarea-bordered w-full"
          placeholder="Enter intro message"
          v-model="quizTmp.introMessage"
          rows="4"
          required
        />
      </div>

      <div class="px-4">
        <label class="label" for="quiz-outro">
          <span class="label-text">*Outro message</span>
        </label>

        <textarea
          id="quiz-outro"
          name="outro"
          class="textarea textarea-bordered w-full"
          placeholder="Enter outro message (on completion)"
          v-model="quizTmp.outroMessage"
          rows="4"
          required
        />
      </div>
    </div>

    <div class="modal-action mt-0 w-full">
      <button type="submit" class="btn btn-secondary">
        <span class="loading loading-spinner" v-if="reqState.status === 'pending'"></span>
        {{ quiz._id ? 'Update' : 'Save' }}
      </button>
    </div>
  </form>
</template>
