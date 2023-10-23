<script setup>
const emit = defineEmits(['onUpdate']);
const question = inject('selectedQuestion');
const { variant } = question.value;

const { currentTab, switchTab } = useTabs(['single', 'multi', 'code'], question.value.variant, {
  onSelect(newVal) {
    if (question.value.variant === 'code') {
      question.value.code.content = '';
    }

    if (newVal === 'code') {
      question.value.code = { lang: 'JS', content: '' };
    }

    question.value.variant = newVal;

    emit('onUpdate', question);
  }
});

function toggleCodeBlock() {
  const { sample } = question.value.code;
  question.value.code.sample = !sample;
  question.value.code.content = !sample ? '// edit me' : '';
}

function onChange(updates) {
  Object.assign(question.value, updates);
  emit('onUpdate', question);
}

watch(question, (newVal, oldVal) => {
  if (newVal.variant === oldVal.variant) return;
  switchTab(newVal.variant);
});
</script>

<template>
  <form>
    <div class="py-4">
      <label class="label" for="quiz-title">
        <span class="label-text">Title</span>
      </label>
      <textarea
        id="question-title"
        name="title"
        type="text"
        placeholder="question please"
        class="textarea textarea-bordered w-full"
        class:input-error="{formErrors.name}"
        v-model="question.title"
        @blur="onChange"
        rows="4"
        required
      />
    </div>

    <VariantSelector :variant="currentTab" :on-select="switchTab" />
    <button type="button" class="btn btn-sm ml-3" @click="toggleCodeBlock" v-show="currentTab !== 'code'">
      {{ question.code.sample ? 'Remove' : 'Add' }} code block
    </button>

    <div class="flex flex-col">
      <QuestionCodeOption mode="edit" @on-update="onChange" v-if="currentTab !== 'code' && question.code.sample" />
      <QuestionSingleOptions mode="edit" @on-update="onChange" v-show="currentTab === 'single'" />
      <QuestionMultiOptions mode="edit" @on-update="onChange" v-show="currentTab === 'multi'" />
    </div>

    <QuestionCodeOption mode="edit" @on-update="onChange" v-show="currentTab === 'code'" />
  </form>
</template>
