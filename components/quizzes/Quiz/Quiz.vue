<script setup>
import { useQuizStore } from '@/stores/quiz';

const store = useQuizStore();
const props = defineProps({ quiz: Object, questions: Array, links: Array });
const quiz = ref(props.quiz);

const { $toast } = useNuxtApp();

const { currentTab, switchTab } = useTabs(['form', 'questions', 'links'], 'form', {
  matcher: tabName => {
    const parentAbsent = tabName !== 'form' && !isMongoId(quiz.value._id);
    return !parentAbsent;
  }
});

async function onCreate(createdQuiz) {
  quiz.value = createdQuiz;
  store.addItem(createdQuiz);
  $toast.success('Quiz successfully created');
  switchTab('questions');
}

function onUpdate(updatedQuiz) {
  quiz.value = updatedQuiz;
  store.updateItem(updatedQuiz);
  $toast.success('Quiz successfully updated');
}
</script>

<template>
  <div class="flex flex-col items-center w-full gap-2">
    <div class="tabs tabs-boxed">
      <button class="tab tab-lg" :class="{ 'tab-active': currentTab === 'form' }" @click="switchTab('form')">
        Quiz
      </button>
      <button
        class="tab tab-lg"
        :class="{ 'tab-active': currentTab === 'questions', 'tab-disabled': !quiz._id }"
        @click="switchTab('questions')"
      >
        Questions
      </button>
      <button
        class="tab tab-lg"
        :class="{ 'tab-active': currentTab === 'links', 'tab-disabled': !quiz._id }"
        @click="switchTab('links')"
      >
        Links
      </button>
    </div>

    <QuizForm :quiz="quiz" v-show="currentTab === 'form'" :on-create="onCreate" :on-update="onUpdate" />
    <QuizQuestions :quiz-id="quiz._id" :questions="questions" v-if="quiz._id" v-show="currentTab === 'questions'" />
    <QuizLinks :quiz-id="quiz._id" :links="links" v-if="quiz._id" v-show="currentTab === 'links'" />
  </div>
</template>
