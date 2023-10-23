<script setup>
const emit = defineEmits(['onUpdate']);
const props = defineProps({ mode: String, question: Object });
const question = inject('selectedQuestion', ref(props.question));

const chosenId = question.value.options.find(option => option.isSelected)?.id || null;
const chosenOption = ref(chosenId);

function onOptionsChange(options) {
  emit('onUpdate', { options });
}

watch(chosenOption, (newVal, oldVal) => {
  if (newVal === oldVal) return;

  question.value.options.forEach(option => {
    option.isSelected = option.id === newVal;
  });

  onOptionsChange(question.value.options);
});

const { handleKeyDown, focusOnNextInput } = useOptionEditor(question, onOptionsChange);
</script>

<template>
  <div>
    <div
      class="flex items-center gap-3"
      :class="{ 'py-3': mode !== 'edit' }"
      v-for="option in question.options"
      :key="option.id"
    >
      <input
        type="radio"
        class="radio disabled:opacity-100"
        :id="`radio-option-${option.id}`"
        :value="option.id"
        :disabled="mode === 'view'"
        v-model="chosenOption"
      />

      <input
        type="text"
        placeholder="option..."
        class="input input-ghost focus:outline-none"
        v-model="option.value"
        @keydown="handleKeyDown($event, option.id)"
        :ref="el => focusOnNextInput(el, option.id)"
        v-if="mode === 'edit'"
      />

      <label :for="`option-${option.id}`" class="select-none" v-if="mode !== 'edit'">{{ option.value }}</label>
    </div>
  </div>
</template>
