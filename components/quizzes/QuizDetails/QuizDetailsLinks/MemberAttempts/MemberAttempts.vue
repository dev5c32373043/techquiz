<script setup>
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

defineProps({ response: { type: Object, required: true } });
</script>

<template>
  <ul>
    <li
      class="my-3 rounded shadow-md shadow-slate-200 bg-white"
      v-for="attempt in response.stats.attempts"
      :key="attempt.id"
    >
      <div class="collapse collapse-arrow">
        <input type="checkbox" class="peer" />
        <div class="collapse-title flex items-center justify-between gap-4 px-5 py-0">
          <div
            class="radial-progress bg-slate-800 text-primary-content border-4 border-primary"
            :style="{ '--value': quizResultInPercent(attempt.score, attempt.questions.length), '--size': '4rem' }"
          >
            {{ quizResultInPercent(attempt.score, attempt.questions.length) }}%
          </div>

          <div class="flex justify-center gap-2">
            <div class="stats">
              <div class="stat">
                <div class="stat-figure"></div>
                <div class="stat-title">Answered</div>
                <div class="stat-value text-secondary">{{ attempt.score }}</div>
              </div>

              <div class="stat">
                <div class="stat-figure"></div>
                <div class="stat-title">Questions</div>
                <div class="stat-value">{{ attempt.questions.length }}</div>
              </div>

              <div class="stat">
                <div class="stat-title">Time spent</div>
                <div class="stat-value">{{ dayjs.duration(attempt.timeSpentMs).format('mm:ss') }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="collapse-content">
          <MemberAttemptDetails :attempt="attempt" />
        </div>
      </div>
    </li>
  </ul>
</template>
