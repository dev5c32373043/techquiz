<script setup>
const emit = defineEmits(['update:modelValue']);
const props = defineProps({
  id: String,
  modelValue: Number,
  required: Boolean
});

const value = computed(() => {
  const totalSeconds = Math.floor(props.modelValue / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (!Number.isInteger(minutes) || !Number.isInteger(seconds)) return '00:00';
  const formatInt = val => String(val).padStart(2, '0');

  return `${formatInt(minutes)}:${formatInt(seconds)}`;
});
const invalidInput = ref(false);

function onBlur(ev) {
  const { value } = ev.target;
  const [minutesStr, secondsStr] = value.split(':');
  const minutes = parseInt(minutesStr, 10);
  const seconds = parseInt(secondsStr, 10);
  let ms = 0;

  if (Number.isInteger(minutes) && Number.isInteger(seconds)) {
    ms = (minutes * 60 + seconds) * 1000;
  }

  invalidInput.value = ms === 0;
  if (invalidInput.value) return;
  emit('update:modelValue', ms);
}
</script>

<template>
  <input
    type="text"
    :class="{ 'input-error': invalidInput }"
    :id="id"
    :value="value"
    :required="required"
    @blur="onBlur"
  />
</template>
