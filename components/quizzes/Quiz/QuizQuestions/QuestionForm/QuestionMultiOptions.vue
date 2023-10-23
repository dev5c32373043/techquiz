<script setup>
const emit = defineEmits(['onUpdate']);
const props = defineProps({ mode: String, question: Object });
const question = inject('selectedQuestion', ref(props.question));

function onOptionsChange(options) {
  emit('onUpdate', { options });
}

function onOptionSelect(ev, option) {
  option.isSelected = ev.target.checked;
  onOptionsChange(question.value.options);
}

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
        type="checkbox"
        class="checkbox disabled:opacity-100"
        :disabled="mode === 'view'"
        :checked="option.isSelected"
        @input="onOptionSelect($event, option)"
      />

      <input
        type="text"
        name="option value"
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
