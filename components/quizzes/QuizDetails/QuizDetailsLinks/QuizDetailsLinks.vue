<script setup>
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

defineProps({ data: { type: Array, required: true } });
</script>

<template>
  <ul v-if="data.length > 0">
    <li class="my-3 rounded shadow-md shadow-slate-200" v-for="link in data" :key="link._id">
      <div class="collapse" :class="{ 'collapse-arrow': link.response }">
        <input type="checkbox" class="peer" />
        <div class="collapse-title flex items-start gap-4">
          <div class="flex items-center self-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke="currentColor"
              viewBox="0 0 24 24"
              class="w-6 h-6"
              aria-label="Dashboard icon"
              role="graphics-symbol"
            >
              <path d="M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3"></path>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
          </div>

          <div class="flex flex-col justify-start self-center w-full">
            <h3 class="text-xl truncate text-slate-700">{{ link.name }}</h3>
            <p class="text-sm truncate text-slate-500" v-if="link.metadata?.length > 0">
              {{ link.metadata.map(e => `${e.key}: ${e.value}`).join(', ') }}
            </p>
          </div>

          <div class="flex justify-center gap-2" v-if="link.response">
            <div class="stats">
              <div class="stat">
                <div class="stat-title">Final Score</div>
                <div class="stat-value text-secondary">{{ link.response.stats.finalScore }}</div>
              </div>

              <div class="stat">
                <div class="stat-figure"></div>
                <div class="stat-title">Attempts</div>
                <div class="stat-value">{{ link.response.stats.attempts.length }}</div>
              </div>

              <div class="stat">
                <div class="stat-title">Time spent</div>
                <div class="stat-value">{{ dayjs.duration(link.response.stats.totalTimeMs).format('mm:ss') }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="collapse-content bg-base-200" v-if="link.response">
          <MemberAttempts :response="link.response" />
        </div>
      </div>
    </li>
  </ul>
  <EmptyState v-else />
</template>
