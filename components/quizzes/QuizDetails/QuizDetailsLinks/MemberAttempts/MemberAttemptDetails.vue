<script setup>
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const props = defineProps({ attempt: { type: Object, required: true } });
</script>

<template>
  <div class="flex flex-col" v-for="question in attempt.questions">
    <div class="flex w-full justify-between">
      <h3 class="text-xl font-bold text-start whitespace-pre-wrap">{{ question.title }}</h3>
      <div class="flex self-start items-center">
        <div class="badge bg-base-200" title="Time spent on coding challenge" v-if="question.variant === 'code'">
          {{ dayjs.duration(question.code.timeSpentMs).format('mm:ss') }}
        </div>

        <div class="badge bg-slate-800 text-neutral-content" title="Time spent on question">
          {{ dayjs.duration(question.timeSpentMs).format('mm:ss') }}
        </div>
      </div>
    </div>

    <QuestionSingleOptions mode="view" :question="question" v-if="question.variant === 'single'" />
    <QuestionMultiOptions mode="view" :question="question" v-if="question.variant === 'multi'" />
    <QuestionCodeOption mode="view" :question="question" v-if="question.variant === 'code'" />
  </div>
</template>
