<script setup>
const props = defineProps({ quizId: String, questions: Array });
const questions = ref(props.questions);

const selectedQuestion = ref(null);
const changesToApply = ref({ added: new Map(), updated: new Map(), removed: new Set() });
const hasChanges = computed(() => {
  const { added, updated, removed } = changesToApply.value;
  return added.size > 0 || updated.size > 0 || removed.size > 0;
});

const baseUrl = computed(() => `/api/quizzes/${props.quizId}/questions`);

const { $toast } = useNuxtApp();

function onQuestionSelect(question) {
  selectedQuestion.value = question;
}

async function fetchQuestions() {
  const [fetchErr, data] = await to($fetch(baseUrl.value));
  if (fetchErr) {
    $toast.error('Failed to load questions!');
    return;
  }

  const selectedId = selectedQuestion.value?._id;
  const isSelectedNew = !isMongoId(selectedId);
  const selectedIdx = questions.value.findIndex(q => q._id === selectedId);

  questions.value = data;
  if (!isSelectedNew) return;
  onQuestionSelect(questions.value.at(selectedIdx));
}

function addQuestion() {
  const tmpId = questions.value.length + 1;
  const question = {
    _id: tmpId,
    title: `question #${tmpId}`,
    variant: 'single',
    code: { lang: 'JS', content: '' },
    options: [{ id: 1, value: '', isSelected: true }]
  };

  questions.value.push(question);
  onQuestionSelect(question);
  onUpdate(question, 'added');
}

function removeSelected() {
  const qId = selectedQuestion.value?._id;
  if (!qId) return;

  questions.value = questions.value.filter(q => q._id !== qId);
  onUpdate({ _id: qId }, 'removed');

  const questionToSelect = questions.value.at(0);
  onQuestionSelect(questionToSelect);
}

async function applyChanges() {
  const payload = {};
  const { added, updated, removed } = changesToApply.value;
  if (added.size > 0) {
    payload.added = Array.from(added.values());
  }

  if (updated.size > 0) {
    payload.updated = Array.from(updated.values());
  }

  if (removed.size > 0) {
    payload.removed = Array.from(removed.values());
  }

  const [err, resp] = await to($fetch(baseUrl.value, { method: 'PATCH', body: payload }));
  if (err) {
    $toast.error('Failed to save changes...');
    return;
  }

  $toast.success('Changes successfully applied!');
  changesToApply.value = { added: new Map(), updated: new Map(), removed: new Set() };
  fetchQuestions();
}

function onUpdate(question, action) {
  if (['added', 'updated'].includes(action)) {
    const map = changesToApply.value[action];
    map.set(question._id, question);
  }

  if (action === 'removed') {
    if (isMongoId(question._id)) {
      changesToApply.value.removed.add(question._id);
    }

    changesToApply.value.added.delete(question._id);
    changesToApply.value.updated.delete(question._id);
  }
}

onMounted(() => {
  if (questions.value.length === 0) return;
  onQuestionSelect(questions.value.at(0));
});

function onFormUpdate(question) {
  const { _id } = question.value;

  if (changesToApply.value.added.has(_id)) return;
  if (changesToApply.value.updated.has(_id)) return;

  onUpdate(question.value, 'updated');
}

provide('selectedQuestion', selectedQuestion);
</script>

<template>
  <div class="flex flex-col md:w-full lg:w-3/4 p-5 border rounded">
    <div class="flex gap-2 mb-2">
      <button class="btn btn-neutral self-start" @click="addQuestion">Add question</button>
      <button class="btn btn-secondary self-start" :disabled="!hasChanges" @click="applyChanges">Save changes</button>
      <button class="btn btn-outline btn-error self-start" v-show="selectedQuestion" @click="removeSelected()">
        Remove selected
      </button>
    </div>

    <QuestionBar :questions="questions" @on-select="onQuestionSelect" />
    <QuestionForm @on-update="onFormUpdate" v-if="selectedQuestion" />
    <EmptyState v-else />
  </div>
</template>
