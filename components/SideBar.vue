<script setup>
import { useQuizStore } from '@/stores/quiz';

// Nuxt is quite an interesting framework. Sometimes it will throw an error if we pass promise into composable, and it says it's not its fault 😂.
const { error, data } = await useAsync(await useFetch('/api/quizzes'));
const store = useQuizStore();

if (!error.value) {
  store.set(data.value);
}

const selectedQuiz = ref(null);

function selectQuiz(quiz) {
  if (selectedQuiz.value?._id === quiz._id) return;
  selectedQuiz.value = quiz;
}

const route = useRoute();
</script>

<template>
  <div class="drawer drawer-open w-auto">
    <input id="main-drawer" type="checkbox" class="drawer-toggle" />

    <div class="drawer-side h-full">
      <label for="main-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
      <ul class="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
        <NuxtLink class="btn btn-secondary mb-1" to="/quizzes/new">Create quiz</NuxtLink>
        <li class="my-2 w-full" @click="selectQuiz(quiz)" v-for="quiz in store.data">
          <NuxtLink :class="{ active: route.params.id === quiz._id }" :to="`/quizzes/${quiz._id}`">
            <div class="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke-width="1.5"
                stroke="currentColor"
                viewBox="0 0 24 24"
                class="w-6 h-6"
                aria-label="Dashboard icon"
                role="graphics-symbol"
              >
                <g>
                  <path
                    d="M17 2v2h3.007c.548 0 .993.445.993.993v16.014c0 .548-.445.993-.993.993H3.993C3.445 22 3 21.555 3 21.007V4.993C3 4.445 3.445 4 3.993 4H7V2h10zM7 6H5v14h14V6h-2v2H7V6zm2 10v2H7v-2h2zm0-3v2H7v-2h2zm0-3v2H7v-2h2zm6-6H9v2h6V4z"
                  />
                </g>
              </svg>

              <div class="badge badge-info absolute right-[-5px] top-[-5px]" v-if="quiz.unreadResponses">new</div>
              <span class="max-w-[15rem] truncate">
                {{ quiz.title }}
              </span>
            </div>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>
