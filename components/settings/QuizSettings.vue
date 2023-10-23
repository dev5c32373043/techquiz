<script setup>
const { $toast } = useNuxtApp();
const { profile } = defineProps({ profile: { type: Object, required: true } });
const quizSettings = ref(profile?.settings?.quiz ?? { timeLimitMs: 60000, attemptsCount: 1, randomize: true });

async function onSubmit() {
  const body = { quiz: toValue(quizSettings) };
  const [err] = await to($fetch('/api/user/profile', { method: 'PUT', body }));
  if (err) {
    $toast.error('Error while updating settings');
    return;
  }

  $toast.success('Settings updated!');
}
</script>

<template>
  <form class="flex flex-col" @submit.prevent="onSubmit">
    <div class="form-control gap-2">
      <label class="label" for="quiz-time-limit">
        <span class="label-text">Time limit (mm:ss)</span>
      </label>
      <DurationInput id="quiz-time-limit" class="input input-bordered max-w-md" v-model="quizSettings.timeLimitMs" />
    </div>

    <div class="form-control gap-2">
      <label class="label" for="quiz-retries">
        <span class="label-text">Attempts count</span>
      </label>
      <input
        id="quiz-retries"
        class="input input-bordered max-w-md"
        type="number"
        min="1"
        max="100"
        placeholder="How many times user can access quiz until submit"
        v-model="quizSettings.attemptsCount"
      />
    </div>

    <div class="form-control my-4 gap-2">
      <label class="label cursor-pointer max-w-md">
        <span class="label-text">Randomize questions/options</span>
        <input type="checkbox" v-model="quizSettings.randomize" class="checkbox" />
      </label>
    </div>

    <div class="my-4">
      <button type="submit" class="btn btn-primary">Save</button>
    </div>
  </form>
</template>
